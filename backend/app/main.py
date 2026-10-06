from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api import api_router
from app.services.data_sources.service import (
    DataSourceNotConfiguredError,
    get_active_mode,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.middleware("http")
async def require_customer_data_source(request: Request, call_next):
    path = request.url.path
    api_prefix = settings.API_V1_STR.rstrip("/")
    if path.startswith(f"{api_prefix}/"):
        allowed_without_source = {
            f"{api_prefix}/data-sources/status",
            f"{api_prefix}/data-sources/run",
            f"{api_prefix}/ingestion",
            f"{api_prefix}/ingestion/",
            f"{api_prefix}/ingestion/upload",
            f"{api_prefix}/openapi.json",
        }
        if path not in allowed_without_source:
            active_mode = get_active_mode()
            if active_mode not in {"uploaded", "supabase-primary", "supabase-secondary"}:
                return JSONResponse(
                    status_code=409,
                    content={
                        "detail": "No customer data source is active. Upload a dataset or connect a customer source in Data Sources.",
                        "code": "data_source_not_configured",
                    },
                )
    return await call_next(request)


@app.exception_handler(DataSourceNotConfiguredError)
async def data_source_not_configured_handler(_, error: DataSourceNotConfiguredError):
    return JSONResponse(
        status_code=409,
        content={"detail": str(error), "code": "data_source_not_configured"},
    )


@app.get("/")
def root():
    return {
        "message": "RiskNexus Cyber Risk Quantification & Investment Optimization API",
        "version": settings.VERSION,
        "docs": "/docs",
    }
