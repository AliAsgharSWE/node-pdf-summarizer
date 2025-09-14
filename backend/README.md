# Node PDF Summarizer

Simple Node.js backend (Express) and a minimal frontend to upload a PDF, extract text, and return a summary.

## Project structure

```
node-pdf-summarizer/
├─ uploads/                 # temp storage (created at runtime)
├─ server.js                # entry point
├─ package.json
├─ README.md
├─ routes/
│  └─ upload.js
├─ services/
│  ├─ pdfService.js
│  └─ summarizer.js
├─ models/
│  └─ Document.js           # optional (MongoDB) - bonus
└─ frontend/
   └─ index.html            # simple Frontend UI to test API
```

## Requirements

- Node 18+ / npm
- (Optional) MongoDB to enable the bonus endpoints

## Install

```bash
npm install
```

## Configure (optional)
- To enable MongoDB, set `MONGO_URI` environment variable, or update `server.js` with your connection string.

## Run

```bash
npm run dev   # requires nodemon, for development
# or
npm start
```

- Server runs on `http://localhost:8000`
- The frontend test page is `frontend/index.html` (open in browser).

## APIs
- `POST /api/upload` — form-data key `file` (PDF). Response:

```json
{
  "parsedText": "...",
  "summary": "...",
  "id": "<optional MongoDB id>"
}
```

- `GET /api/documents/:id` — fetch saved document (requires MongoDB enabled)

## Notes & Error handling
- Validates mimetype is `application/pdf`.
- Returns 400 when no file uploaded or when no extractable text found.
- Files are stored in `uploads/`. Uncomment removal logic in `routes/upload.js` if you want to auto-delete files after extraction.
