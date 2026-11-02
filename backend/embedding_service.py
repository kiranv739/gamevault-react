import numpy as np


EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSIONS = 384
_model = None


def get_embedding(text: str) -> list[float]:
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        # Load the public model locally. This downloads model files on first use
        # but does not call paid Hugging Face Inference Providers.
        _model = SentenceTransformer(EMBEDDING_MODEL, device="cpu")

    vector = _model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=False,
        show_progress_bar=False,
    )
    result = np.asarray(vector, dtype=np.float32).reshape(-1).tolist()
    if len(result) != EMBEDDING_DIMENSIONS:
        raise ValueError(
            f"Expected {EMBEDDING_DIMENSIONS} embedding values, got {len(result)}"
        )
    return result
