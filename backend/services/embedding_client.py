import os
from typing import Iterable

from services.gemini_client import GEMINI_API_KEY, client

# Configure via environment variables
EMBEDDING_MODEL = os.getenv("GEMINI_EMBED_MODEL", "models/text-embedding-004")


class EmbeddingError(RuntimeError):
    """Raised when embedding generation fails."""


def build_product_text(product: dict) -> str:
    """Concatenate product fields into a single prompt string."""
    parts: list[str] = []

    name = product.get("name")
    if name:
        parts.append(f"Name: {name}")

    category = product.get("category")
    if category:
        parts.append(f"Category: {category}")

    description = product.get("description")
    if description:
        parts.append(f"Description: {description}")

    tags = product.get("tags")
    if isinstance(tags, Iterable):
        tag_list = [str(tag) for tag in tags if tag]
        if tag_list:
            parts.append("Tags: " + ", ".join(tag_list))

    external_id = product.get("external_id")
    if external_id:
        parts.append(f"External ID: {external_id}")

    return "\n".join(parts).strip()


def create_embedding(text: str) -> list[float]:
    """Generate an embedding vector from text using Gemini's embedding endpoint."""
    if not GEMINI_API_KEY:
        raise EmbeddingError("GEMINI_API_KEY is not set; cannot generate embeddings.")
    if not text:
        raise EmbeddingError("Cannot embed empty text.")

    try:
        response = client.models.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
        )
        return response.embedding.values
    except Exception as exc:  # noqa: BLE001
        raise EmbeddingError(f"Failed to create embedding: {exc}") from exc


def embed_product(product: dict) -> list[float]:
    """
    Generate an embedding for a product dict.

    Expected keys: name, description, category, tags, external_id.
    """
    prompt = build_product_text(product)
    return create_embedding(prompt)
