"""Ingestion pipeline: PDF → text → chunks → embeddings → DB.

Suggested implementation order:
1. Save uploaded file to Supabase Storage.
2. Extract text page-by-page using PyMuPDF (fitz), keeping page_from/page_to.
3. Detect chapter boundaries (font-size heuristic + regex on TOC).
4. Sentence-aware chunking: 400-800 tokens, 15% overlap.
5. Batch embed with BAAI/bge-small-en-v1.5 (sentence-transformers).
6. Insert into pdf_chunks (with tsvector via trigger and vector column).
7. Update uploaded_pdfs.status at each stage; publish over Supabase Realtime.
8. Trigger course_gen.build_course(pdf_id).
"""
