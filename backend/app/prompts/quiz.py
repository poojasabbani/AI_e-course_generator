QUIZ_PROMPT = """Generate a quiz from the CONTEXT below. Difficulty: {difficulty}. Question mix: 3 MCQ, 1 True/False, 1 short answer.

Each question must include:
- type ("mcq" | "tf" | "short")
- prompt
- choices[] (MCQ only)
- answer (index for MCQ, "true"/"false" for TF, canonical text for short)
- explanation
- citation (which chapter/lesson the answer comes from)

Do not invent facts. Every answer must be directly supported by the CONTEXT.

CONTEXT:
{context}
"""
