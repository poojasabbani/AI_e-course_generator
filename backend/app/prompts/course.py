COURSE_SKELETON_PROMPT = """From the CONTEXT below (extracted from a PDF), produce a course skeleton in strict JSON matching the schema.

Requirements:
- Title, description, difficulty (beginner|intermediate|advanced), estimated_minutes, prerequisites[], objectives[], key_takeaways[].
- Table of contents: chapters -> topics -> lesson stubs (title + summary + source_chunk_ids[]).
- Every source_chunk_id MUST come from the CONTEXT. Do NOT invent ids.
- Do not add commentary outside the JSON.

CONTEXT:
{context}
"""
