import type { ChatMessageInput } from "./messages";
import { getPanelEntry } from "./panelCatalog";

const panelAliasPatterns = [
  { panel: 1, patterns: [/\btop left panel\b/i, /\bupper left panel\b/i] },
  { panel: 2, patterns: [/\btop right panel\b/i, /\bupper right panel\b/i] },
  {
    panel: 3,
    patterns: [
      /\bsecond row left panel\b/i,
      /\bmiddle left panel\b/i,
      /\bupper middle left panel\b/i,
    ],
  },
  {
    panel: 4,
    patterns: [
      /\bsecond row right panel\b/i,
      /\bmiddle right panel\b/i,
      /\bupper middle right panel\b/i,
    ],
  },
  {
    panel: 5,
    patterns: [
      /\bthird row left panel\b/i,
      /\blower middle left panel\b/i,
    ],
  },
  {
    panel: 6,
    patterns: [
      /\bthird row right panel\b/i,
      /\blower middle right panel\b/i,
    ],
  },
  { panel: 7, patterns: [/\bbottom left panel\b/i, /\blower left panel\b/i] },
  { panel: 8, patterns: [/\bbottom right panel\b/i, /\blower right panel\b/i] },
];

const findPanelAlias = (content: string) => {
  for (const alias of panelAliasPatterns) {
    if (alias.patterns.some((pattern) => pattern.test(content))) {
      return alias.panel;
    }
  }

  return null;
};

export const resolvePanelReference = (content: string) => {
  const panel = findPanelAlias(content);

  if (!panel) {
    return null;
  }

  return {
    panel,
    entry: getPanelEntry(panel),
  };
};

export const normalizePanelReference = (content: string) => {
  const resolved = resolvePanelReference(content);

  if (!resolved) {
    return content;
  }

  const titleSuffix = resolved.entry ? ` (${resolved.entry.title})` : "";

  return `${content}\n\nReference note: In this app's two-column, four-row panel layout, this spatial reference maps to panel ${resolved.panel}${titleSuffix}. Answer the question using panel ${resolved.panel} as the primary panel reference.`;
};

export const normalizeMessagesWithPanelReferences = (
  messages: ChatMessageInput[],
) => {
  let normalizedLatestUser = false;

  return [...messages].reverse().map((message) => {
    if (message.role !== "user" || normalizedLatestUser) {
      return message;
    }

    normalizedLatestUser = true;

    return {
      ...message,
      content: normalizePanelReference(message.content),
    };
  }).reverse();
};
