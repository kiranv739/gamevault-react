import numpy as np
from threading import Lock


EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSIONS = 384
_model = None
_model_lock = Lock()


def get_embedding(text: str) -> list[float]:
    global _model
    if _model is None:
        # FastEmbed uses the ONNX export of this same 384-dimensional model.
        # It avoids pulling PyTorch and its CUDA libraries into the CPU-only
        # Render service. Lock initialization so concurrent first searches do
        # not each try to download and load their own copy.
        with _model_lock:
            if _model is None:
                from fastembed import TextEmbedding

                _model = TextEmbedding(model_name=EMBEDDING_MODEL)

    vector = next(_model.embed([text]))
    result = np.asarray(vector, dtype=np.float32).reshape(-1).tolist()
    if len(result) != EMBEDDING_DIMENSIONS:
        raise ValueError(
            f"Expected {EMBEDDING_DIMENSIONS} embedding values, got {len(result)}"
        )
    return result
