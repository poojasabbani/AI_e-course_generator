LESSON_PROMPT = """Generate a lesson grounded strictly in the CONTEXT chunks below.

Return strict JSON:
{{
  "title": str,
  "summary": str,
  "content_md": str,          # markdown body, ~500-900 words
  "learning_objectives": [str],
  "key_takeaways": [str],
  "examples": [{{"title": str, "body": str}}],
  "notes": [str],
  "source_chunk_ids": [str]   # every id MUST appear in CONTEXT
}}

CONTEXT:
{context}
"""
