import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.api.routes import router

app = FastAPI(
    title="STP Sentinel Platform",
    description="Unified Single Host Link for STP Sentinel Enterprise Dashboard UI & REST APIs",
    version="1.0.0"
)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API endpoints (/api/upload, /api/topology, /api/simulate, /loop-risk, /ai-recommendation, /reports)
app.include_router(router)

# Path to dist production build directory
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

# Mount /assets static directory
if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Serve static files & SPA client-side routes on single host link
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Allow API endpoints to take precedence
    if full_path.startswith("api/") or full_path in ["loop-risk", "ai-recommendation", "reports", "docs", "openapi.json"]:
        pass

    # Serve static root assets if requested (favicon, icons, etc.)
    file_path = os.path.join(DIST_DIR, full_path)
    if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    # Fallback to SPA index.html
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)

    return {
        "system": "STP SENTINEL",
        "status": "ONLINE",
        "docs_url": "/docs"
    }
