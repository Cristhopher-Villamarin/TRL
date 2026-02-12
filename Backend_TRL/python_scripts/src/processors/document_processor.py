from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
from loguru import logger
from src.extractors import PDFExtractor
from src.models.document import Document, DocumentType, ProcessingStatus, ExtractedImage, ExtractedTable
from src.storage.database import db_manager
from config.settings import TEMP_DIR

class DocumentProcessor:
    def __init__(self):
        self.extractors = {
            '.pdf': PDFExtractor,
        }
    
    def get_document_type(self, file_path: Path) -> DocumentType:
        ext = file_path.suffix.lower()
        if ext == '.pdf':
            return DocumentType.PDF
        raise ValueError(f"Tipo de archivo no soportado: {ext}")
    
    def process_document(self, file_path: Path, extract_images: bool = True) -> int:
        file_path = Path(file_path)
        ext = file_path.suffix.lower()
        if ext not in self.extractors:
            raise ValueError(f"Tipo de archivo no soportado: {ext}")
        
        document_type = self.get_document_type(file_path)
        
        with db_manager.get_session() as session:
            doc = Document(
                filename=file_path.name,
                original_path=str(file_path.absolute()),
                file_type=document_type,
                file_size=file_path.stat().st_size,
                status=ProcessingStatus.PROCESSING,
                processing_started_at=datetime.utcnow()
            )
            session.add(doc)
            session.flush()
            document_id = doc.id
            
            try:
                extractor_class = self.extractors[ext]
                extractor = extractor_class(file_path)
                
                text_content = extractor.extract_text()
                metadata = extractor.extract_metadata()
                
                doc.text_content = text_content
                doc.metadata_json = metadata
                doc.title = metadata.get('title', '')
                doc.author = metadata.get('author', '')
                doc.word_count = len(text_content.split())
                doc.character_count = len(text_content)
                doc.page_count = metadata.get('page_count')
                
                if extract_images:
                    image_dir = TEMP_DIR / f"doc_{document_id}_images"
                    image_paths = extractor.extract_images(image_dir)
                    for img_path in image_paths:
                        img = ExtractedImage(document_id=document_id, image_path=img_path)
                        session.add(img)
                
                doc.status = ProcessingStatus.COMPLETED
                doc.processing_completed_at = datetime.utcnow()
            except Exception as e:
                doc.status = ProcessingStatus.FAILED
                doc.error_message = str(e)
                doc.processing_completed_at = datetime.utcnow()
                raise
            
            return document_id
