"""Hybrid retrieval + streaming RAG chat.

- Retrieve: BM25 (ts_rank_cd) + cosine (1 - embedding <=> query), fused via RRF.
- Top-K = 8 by default.
- Prompt wraps chunks in <context> and instructs the model to cite [Ch.X · L.Y].
- Refuse answers not supported by context.
- Stream via SSE back to the browser.
"""
