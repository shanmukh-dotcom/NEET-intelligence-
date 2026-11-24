"""
AI Research Assistant API Endpoint: 'Ask NEET Intelligence'.
"""

from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.ai_service import ask_research_assistant

router = APIRouter()

class AIQueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

@router.post("/ask")
def query_assistant(request: AIQueryRequest):
    """
    Evaluates natural language questions against verifiable statistical evidence.
    Returns findings, tabular support data, source citations, method disclosures,
    and explicit boundaries without speculative hallucinations.
    """
    return ask_research_assistant(request.query, request.context)
