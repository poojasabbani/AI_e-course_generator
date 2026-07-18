"""Course/lesson generation with Groq (Llama 3.1 70B).

Guardrails:
- Feed only top-K chunks for each topic.
- Force structured JSON output with a Pydantic schema.
- Verify every returned source_chunk_id exists; reject + retry if not.
- Never allow the model to invent chapter titles that don't appear in the PDF.
"""
