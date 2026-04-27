# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **n8n community node package** (`n8n-nodes-docuvita`) that integrates the Docuvita document management system API into n8n workflows. It is written in TypeScript and compiled to `dist/` before use.

## Common Commands

```bash
npm run build         # Compile TypeScript to dist/
npm run build:watch   # Watch mode compilation
npm run dev           # Start n8n locally with this node loaded (hot reload)
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix linting issues
npm run release       # Create a new release
```

There is no test suite — the primary way to verify behavior is `npm run dev`.

## Architecture

### Resource/Operation Pattern

The main node class `DocuvitaApi` in [nodes/Docuvita/DocuvitaApi.node.ts](nodes/Docuvita/DocuvitaApi.node.ts) implements `INodeType` from `n8n-workflow`. The `execute()` method dispatches on a two-level `resource → operation` hierarchy:

| Resource | File | Operations |
|----------|------|------------|
| `general` | [General.ts](nodes/Docuvita/General.ts) | Generic API endpoint passthrough |
| `info` | *(inline)* | System info endpoint |
| `query` | [Query.ts](nodes/Docuvita/Query.ts) | `getqueryresultset`, `getsavedqueries` |
| `object` | [Object.ts](nodes/Docuvita/Object.ts) | `createobject`, `getobject`, `getobjectproperties`, `setobjectproperties`, `setdeleteflag`, `uploadnewversion` |
| `workflow` | [Workflow.ts](nodes/Docuvita/Workflow.ts) | `completetask` |

Each `*.ts` file (except the main node) exports n8n `INodeProperties[]` arrays that define the declarative UI fields for that resource. These are spread into `description.properties` in the main node.

### Key Files

- [nodes/Docuvita/DocuvitaApi.node.ts](nodes/Docuvita/DocuvitaApi.node.ts) — Main node with all `execute()` logic (~950 lines)
- [nodes/Docuvita/DataInterfaces.ts](nodes/Docuvita/DataInterfaces.ts) — `BaseProperty` interface; property `FieldType` values are `S` (string), `N` (numeric), `C` (currency), `B` (boolean), `D` (datetime)
- [nodes/Docuvita/GenericFunctions.ts](nodes/Docuvita/GenericFunctions.ts) — `mergeObjectProperties()` utility for type-aware Docuvita property assignment
- [credentials/DocuvitaApi.credentials.ts](credentials/DocuvitaApi.credentials.ts) — Credential type with `Service-URL` and `SessionGuid` fields; test calls POST `/info`

### Authentication

Credentials supply a base `Service-URL` and a `SessionGuid` (session token). The node appends the session GUID to request headers. A per-execution session override is available via node options.

### File Uploads

File upload operations (e.g., `createobject`, `uploadnewversion`) use multipart form-data and read binary data from n8n's binary data system via `helpers.getBinaryDataBuffer()`.

### Build Output

TypeScript compiles to `dist/`. The `package.json` `n8n` section registers:
- `dist/nodes/Docuvita/DocuvitaApi.node.js`
- `dist/credentials/DocuvitaApi.credentials.js`

Never edit files under `dist/` directly.

## Adding a New Operation

1. Add UI property definitions to the relevant resource file (e.g., [Object.ts](nodes/Docuvita/Object.ts)) with appropriate `displayOptions` to scope them to the correct resource/operation.
2. Add the operation value to the `operation` field options in that resource file.
3. Implement the execution logic inside the `resource === 'object'` (or relevant) block in [DocuvitaApi.node.ts](nodes/Docuvita/DocuvitaApi.node.ts).
4. Run `npm run build` and test with `npm run dev`.
