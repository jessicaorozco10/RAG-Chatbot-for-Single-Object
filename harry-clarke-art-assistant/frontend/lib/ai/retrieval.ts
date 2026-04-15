import { Pinecone } from "@pinecone-database/pinecone";
import { aiConfig, hasPineconeConfig } from "./config";

type PineconeFieldMap = Record<string, unknown>;
type SearchHit = {
  _id: string;
  _score: number;
  fields?: object;
};

let pineconeIndexPromise: Promise<ReturnType<Pinecone["Index"]>> | null = null;
let pineconeClientPromise: Promise<Pinecone> | null = null;

const getPineconeClient = async () => {
  if (!aiConfig.pineconeApiKey) {
    throw new Error(
      "Pinecone is not configured. Set PINECONE_API_KEY first.",
    );
  }

  if (!pineconeClientPromise) {
    pineconeClientPromise = Promise.resolve(
      new Pinecone({ apiKey: aiConfig.pineconeApiKey }),
    );
  }

  return pineconeClientPromise;
};

const resolvePineconeIndexTarget = async () => {
  if (hasPineconeConfig()) {
    return {
      indexName: aiConfig.pineconeIndex!,
      host: aiConfig.pineconeHost,
    };
  }

  const client = await getPineconeClient();
  const indexList = await client.listIndexes();
  const indexes = indexList.indexes ?? [];

  if (indexes.length === 0) {
    throw new Error(
      "No Pinecone indexes were found for this API key.",
    );
  }

  if (indexes.length > 1) {
    const indexNames = indexes.map((index) => index.name).join(", ");
    throw new Error(
      `Multiple Pinecone indexes were found for this API key. Set PINECONE_INDEX or PINECONE_HOST. Available indexes: ${indexNames}`,
    );
  }

  return {
    indexName: indexes[0].name,
    host: indexes[0].host,
  };
};

const getPineconeIndex = async () => {
  if (!pineconeIndexPromise) {
    const target = await resolvePineconeIndexTarget();
    pineconeIndexPromise = Promise.resolve(
      new Pinecone({ apiKey: aiConfig.pineconeApiKey! }).Index(
        target.indexName,
        target.host,
      ),
    );
  }

  return pineconeIndexPromise;
};

const stringifyFieldValue = (value: unknown) => {
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return String(value);
  }

  return JSON.stringify(value);
};

const getHitContent = (fields: PineconeFieldMap) => {
  const preferredFieldNames = ["text", "chunk_text", "content", "pageContent"];

  for (const fieldName of preferredFieldNames) {
    const fieldValue = fields[fieldName];

    if (typeof fieldValue === "string" && fieldValue.trim()) {
      return fieldValue;
    }
  }

  const firstNonEmptyStringField = Object.values(fields).find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  if (firstNonEmptyStringField) {
    return firstNonEmptyStringField;
  }

  return JSON.stringify(fields);
};

const normalizeForDeduping = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLowerCase();

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "me",
  "of",
  "on",
  "or",
  "our",
  "tell",
  "that",
  "the",
  "their",
  "them",
  "this",
  "to",
  "us",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

const DOMAIN_KEYWORDS = [
  "harry",
  "clarke",
  "geneva",
  "window",
  "wolfsonian",
  "panel",
  "panels",
  "stained glass",
  "labour",
  "labor",
  "ilo",
  "museum",
];

const tokenizeMeaningfulWords = (value: string) =>
  value
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((token) => token.length >= 4 && !STOP_WORDS.has(token)) ?? [];

const hasDomainIntent = (query: string) => {
  const normalized = query.toLowerCase();
  return DOMAIN_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const hasMeaningfulOverlap = (query: string, candidates: string[]) => {
  const queryTokens = new Set(tokenizeMeaningfulWords(query));

  if (queryTokens.size === 0) {
    return false;
  }

  return candidates.some((candidate) => {
    const candidateTokens = new Set(tokenizeMeaningfulWords(candidate));
    let overlapCount = 0;

    for (const token of queryTokens) {
      if (candidateTokens.has(token)) {
        overlapCount += 1;
      }
    }

    return overlapCount >= 1;
  });
};

export const getRelevantContext = async (query: string) => {
  if (!aiConfig.ragEnabled || !aiConfig.pineconeApiKey) {
    return "";
  }

  const pineconeIndex = await getPineconeIndex();
  const namespace = pineconeIndex.namespace(aiConfig.pineconeNamespace ?? "");
  const response = await namespace.searchRecords({
    query: {
      topK: Math.max(aiConfig.retrievalTopK, aiConfig.retrievalFetchK),
      inputs: { text: query },
    },
  });

  const hits = (response.result.hits ?? []) as SearchHit[];

  if (hits.length === 0) {
    return "";
  }

  const uniqueHits: SearchHit[] = [];
  const seenKeys = new Set<string>();

  for (const hit of hits) {
    const fields = (hit.fields ?? {}) as PineconeFieldMap;
    const content = getHitContent(fields);
    const source =
      typeof fields.source === "string" ? fields.source : String(hit._id);
    const dedupeKey = `${source}::${normalizeForDeduping(content)}`;

    if (seenKeys.has(dedupeKey)) {
      continue;
    }

    seenKeys.add(dedupeKey);
    uniqueHits.push(hit);

    if (uniqueHits.length >= aiConfig.retrievalTopK) {
      break;
    }
  }

  if (uniqueHits.length === 0) {
    return "";
  }

  const candidateTexts = uniqueHits.flatMap((hit) => {
    const fields = (hit.fields ?? {}) as PineconeFieldMap;
    const content = getHitContent(fields);
    const source =
      typeof fields.source === "string" ? fields.source : String(hit._id);

    return [content, source];
  });

  if (!hasDomainIntent(query) && !hasMeaningfulOverlap(query, candidateTexts)) {
    return "";
  }

  return uniqueHits
    .map((hit, index) => {
      const fields = (hit.fields ?? {}) as PineconeFieldMap;
      const content = getHitContent(fields);
      const metadata = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, stringifyFieldValue(value)]),
      );

      return [
        `Source ${index + 1} (score: ${hit._score.toFixed(4)}):`,
        content,
        `Metadata: ${JSON.stringify({ id: hit._id, ...metadata })}`,
      ].join("\n");
    })
    .join("\n\n");
};
