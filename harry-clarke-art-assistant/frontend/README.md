# Harry Clarke Art Assistant

This frontend is a Next.js app that now uses LangChain JS for chat orchestration with a local Ollama model. Pinecone support is scaffolded behind environment flags so we can turn RAG on once the index is ready.

## Local setup

1. Install dependencies:

```powershell
npm.cmd install
```

2. Install Ollama on your machine and start the Ollama server.

3. Pull the chat model:

```powershell
ollama pull llama3.2
```

4. Create `.env.local` from `.env.example`.

5. Start the app:

```powershell
npm.cmd run dev
```

## Current AI flow

- `app/api/route.ts` calls the server-side LangChain chat service.
- `lib/ai/ollama.ts` creates the local `ChatOllama` client.
- `lib/ai/retrieval.ts` is the Pinecone hook. It stays dormant until `ENABLE_RAG=true` and Pinecone credentials are set, and it uses Pinecone integrated embeddings for search.
- `lib/ai/chat.ts` adds retrieved context to the system prompt when RAG is enabled.

## RAG enablement

When you are ready to connect Pinecone:

1. Create a Pinecone index.
2. Fill in `PINECONE_API_KEY` and `PINECONE_INDEX` in `.env.local`.
3. If Pinecone gave you a direct index host URL, you can also set `PINECONE_HOST`. The app will try to derive the index name from that host when `PINECONE_INDEX` is blank.
4. Set `ENABLE_RAG=true`.

This repo does not ingest documents into Pinecone yet. It now has the retrieval runtime pieces needed for querying an existing index.
