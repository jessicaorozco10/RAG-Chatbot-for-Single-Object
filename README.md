# Henry Clarke RAG Bot

This repository contains a Next.js frontend app for the Harry Clarke Art Assistant.

There is no Python backend in this project. The app runs with Node.js, npm, and a local Ollama server.

## Project location

The main app lives in:

```text
harry-clarke-art-assistant/frontend
```

## Requirements

Install these on a new computer before running the project:

1. Node.js
2. npm
3. Ollama

## First-time setup

From the project root:

```powershell
cd .\harry-clarke-art-assistant\frontend
npm.cmd install
```

Make sure Ollama is installed and running, then pull the default chat model:

```powershell
ollama pull llama3.2
```

Create a local environment file:

1. Copy `harry-clarke-art-assistant/frontend/.env.example`
2. Save it as `harry-clarke-art-assistant/frontend/.env.local`

Default environment values:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=mxbai-embed-large
OLLAMA_TEMPERATURE=0.2
ENABLE_RAG=false
RAG_TOP_K=4
PINECONE_API_KEY=
PINECONE_INDEX=
PINECONE_NAMESPACE=
```

## Run the app

```powershell
cd .\harry-clarke-art-assistant\frontend
npm.cmd run dev
```

Then open:

```text
http://localhost:3000
```

## Available scripts

Run these inside `harry-clarke-art-assistant/frontend`:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run start
npm.cmd run lint
```

## AI stack

- Next.js frontend
- LangChain JS
- Local Ollama model for chat
- Optional Pinecone retrieval for RAG

## Optional RAG setup

RAG is off by default.

To enable it:

1. Create a Pinecone index
2. Set `PINECONE_API_KEY` in `.env.local`
3. Set `PINECONE_INDEX` in `.env.local`
4. Set `ENABLE_RAG=true`
5. Pull the embedding model:

```powershell
ollama pull mxbai-embed-large
```

## Notes

- `requirements.txt` is only a note file in this repo because there are no Python dependencies to install.
- If `npm` is blocked by PowerShell execution policy on Windows, use `npm.cmd` as shown above.
