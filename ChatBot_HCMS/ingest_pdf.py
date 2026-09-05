"""
File Path: python-chatbot-service/ingest_pdf.py

Description:
Reads a PDF document, extracts its text, and stores the content
in a persistent ChromaDB collection for Retrieval-Augmented
Generation (RAG).
"""

import os

import chromadb
from pypdf import PdfReader

DB_DIR_PATH = os.path.join(os.path.dirname(__file__), "my_chroma_db")
COLLECTION_NAME = "hcms-info-knowledge-base"
PDF_PATH = os.path.join(os.path.dirname(__file__), "data", "HCMS_INFO.pdf")


def ingest_pdf_to_chroma():
    """
    Read the PDF, split its content into smaller passages,
    and store them in ChromaDB with page metadata.
    """

    os.makedirs(DB_DIR_PATH, exist_ok=True)

    db = chromadb.PersistentClient(path=DB_DIR_PATH)
    collection = db.get_or_create_collection(name=COLLECTION_NAME)

    if not os.path.exists(PDF_PATH):
        print(f"PDF not found: {PDF_PATH}")
        return collection

    reader = PdfReader(PDF_PATH)

    documents = []
    metadatas = []
    ids = []

    print(f"Reading PDF ({len(reader.pages)} pages)...")

    for page_index, page in enumerate(reader.pages):

        page_text = page.extract_text()

        if not page_text or not page_text.strip():
            continue

        page_number = page_index + 1

        # Split each page into smaller paragraphs
        paragraphs = [
            paragraph.strip()
            for paragraph in page_text.split("\n\n")
            if paragraph.strip()
        ]

        for paragraph_index, paragraph in enumerate(paragraphs):

            documents.append(paragraph)

            metadatas.append(
                {
                    "page": page_number,
                    "paragraph": paragraph_index + 1
                }
            )

            ids.append(
                f"page_{page_number}_paragraph_{paragraph_index + 1}"
            )

    if documents:

        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

        print(
            f"Successfully stored "
            f"{len(documents)} passages in ChromaDB."
        )

    return collection


if __name__ == "__main__":
    ingest_pdf_to_chroma()