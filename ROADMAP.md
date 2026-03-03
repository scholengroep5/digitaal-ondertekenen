# Roadmap

## Phase 0 — Mock flow (done)
- [x] Express server + API routes
- [x] Mock SigningHub with timed signing simulation
- [x] Outlook XML manifest (MessageReadCommandSurface)
- [x] Taskpane UI: attachment picker, sign button, status polling
- [x] Local file save for signed documents
- [x] Multi-user support (signer identity from Office.js profile)
- [x] Tailscale Funnel exposure
- [x] Sideloaded and tested in Outlook Web

## Phase 1 — Real SigningHub integration
- [ ] Receive API credentials from Vlaanderen (Digitaal Ondertekenen)
- [ ] Implement OAuth2 client_credentials flow in `signinghub.js`
- [ ] Map mock interface to real REST endpoints
- [ ] Test with actual ITSME signing on a test document
- [ ] Handle SigningHub webhooks (callback on sign completion) instead of polling

## Phase 2 — OneDrive integration
- [ ] Azure AD app registration for Microsoft Graph
- [ ] Implement Graph client in `graph.js`
- [ ] Upload signed PDFs to signer's OneDrive `/Ondertekend/`
- [ ] Return OneDrive link in taskpane after signing

## Phase 3 — Production hardening
- [ ] Error handling: retry logic, timeout handling, user-friendly error messages
- [ ] Audit log: who signed what, when (persist to SQLite or similar)
- [ ] Rate limiting on API endpoints
- [ ] Deploy manifest org-wide via M365 Admin Center
- [ ] Document admin deployment steps for SGR5 IT

## Phase 4 — UX polish
- [ ] Progress bar instead of spinner
- [ ] Show signer name and timestamp after signing
- [ ] Support signing multiple attachments in sequence
- [ ] Download signed PDF directly from taskpane
- [ ] Dutch/French language toggle (if needed for Brussels schools)
