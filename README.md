# Sign-Flow

Outlook Add-in for digitally signing PDF attachments via ITSME and Vlaanderen's "Digitaal Ondertekenen" (SigningHub).

## What it does

A ribbon button ("Onderteken") appears in Outlook Web when viewing emails with attachments. Click it, pick a PDF, and it gets routed through SigningHub for an ITSME-based qualified electronic signature. The signed document is saved automatically.

## Architecture

```
Outlook Web (Add-in taskpane)
  → Express API (server/)
    → SigningHub API (mock or real)
    → Microsoft Graph / local save
```

- **Add-in** (`addin/`): Office.js taskpane — reads attachments, sends to API, polls for status
- **Server** (`server/`): Express app serving static files + REST API
- **Mock** (`server/services/signinghub-mock.js`): In-memory signing simulation (15s timer)
- **Real client** (`server/services/signinghub.js`): Stubbed — activate when Vlaanderen credentials arrive
- **Graph stub** (`server/services/graph.js`): Saves signed PDFs locally; will upload to OneDrive when configured

## Quick start

```bash
cd ~/projects/sign-flow
npm start                        # Express on port 3000
tailscale funnel --bg --https 443 http://localhost:3000  # public URL
```

Sideload `manifest.xml` in Outlook Web → More apps → Add apps → My add-ins → Custom add-in → Upload file.

## Configuration

Copy `.env.example` or create `.env`:

```
PORT=3000
BASE_URL=https://puppy.tail9886a6.ts.net
SIGNING_MODE=mock          # "mock" or "real"
SIGNINGHUB_API_URL=
SIGNINGHUB_CLIENT_ID=
SIGNINGHUB_CLIENT_SECRET=
GRAPH_TENANT_ID=
GRAPH_CLIENT_ID=
GRAPH_CLIENT_SECRET=
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sign` | Start signing flow `{ filename, content_base64, signer_email, signer_name }` |
| GET | `/api/status/:id` | Poll signing status |
| GET | `/api/result/:id` | Get signed document |

## Deployment scope

Deployed via M365 Admin Center (Integrated Apps → Add-ins) or sideloaded per-user. Can be scoped to individual users, groups, or the entire org.
