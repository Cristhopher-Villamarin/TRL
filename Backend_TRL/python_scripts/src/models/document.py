from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class DocumentType(enum.Enum):
    PDF = "pdf"
    WORD = "word"
    POWERPOINT = "powerpoint"
    EXCEL = "excel"
    HTML = "html"
    TEXT = "text"

class ProcessingStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_path = Column(String(500), nullable=False)
    file_type = Column(Enum(DocumentType), nullable=False)
    file_size = Column(Integer)
    title = Column(String(500))
    author = Column(String(255))
    created_date = Column(DateTime)
    modified_date = Column(DateTime)
    text_content = Column(Text)
    metadata_json = Column(JSON)
    status = Column(Enum(ProcessingStatus), default=ProcessingStatus.PENDING)
    processing_started_at = Column(DateTime)
    processing_completed_at = Column(DateTime)
    error_message = Column(Text)
    page_count = Column(Integer)
    word_count = Column(Integer)
    character_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ExtractedImage(Base):
    __tablename__ = 'extracted_images'
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(Integer, nullable=False)
    image_path = Column(String(500), nullable=False)
    page_number = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String(50))
    ocr_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ExtractedTable(Base):
    __tablename__ = 'extracted_tables'
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(Integer, nullable=False)
    page_number = Column(Integer)
    table_data = Column(JSON)
    row_count = Column(Integer)
    column_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
