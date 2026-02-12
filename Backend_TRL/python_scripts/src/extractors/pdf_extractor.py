import fitz  # PyMuPDF
from pathlib import Path
from typing import Dict, Any, List
from PIL import Image
import io
from loguru import logger
from src.extractors.base_extractor import BaseExtractor

class PDFExtractor(BaseExtractor):
    def __init__(self, file_path: Path):
        super().__init__(file_path)
        self.document = None
    
    def __enter__(self):
        self.document = fitz.open(self.file_path)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.document:
            self.document.close()
    
    def extract_text(self) -> str:
        text_content = []
        with fitz.open(self.file_path) as doc:
            for page_num, page in enumerate(doc, start=1):
                text = page.get_text()
                if text.strip():
                    text_content.append(f"--- Página {page_num} ---\n{text}")
        return "\n\n".join(text_content)
    
    def extract_metadata(self) -> Dict[str, Any]:
        with fitz.open(self.file_path) as doc:
            metadata = doc.metadata
            return {
                'title': metadata.get('title', ''),
                'author': metadata.get('author', ''),
                'subject': metadata.get('subject', ''),
                'keywords': metadata.get('keywords', ''),
                'page_count': doc.page_count,
                'format': 'PDF'
            }
    
    def extract_images(self, output_dir: Path) -> List[str]:
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        extracted_images = []
        with fitz.open(self.file_path) as doc:
            for page_num, page in enumerate(doc, start=1):
                image_list = page.get_images()
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    image_filename = f"{self.file_path.stem}_page{page_num}_img{img_index + 1}.{image_ext}"
                    image_path = output_dir / image_filename
                    with open(image_path, "wb") as img_file:
                        img_file.write(image_bytes)
                    extracted_images.append(str(image_path))
        return extracted_images

    def extract_tables(self) -> List[Dict[str, Any]]:
        return []
