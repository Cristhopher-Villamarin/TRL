from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, Optional
from loguru import logger

class BaseExtractor(ABC):
    def __init__(self, file_path: Path):
        self.file_path = Path(file_path)
        self.validate_file()
    
    def validate_file(self):
        if not self.file_path.exists():
            raise FileNotFoundError(f"El archivo no existe: {self.file_path}")
        if not self.file_path.is_file():
            raise ValueError(f"La ruta no es un archivo: {self.file_path}")
    
    @abstractmethod
    def extract_text(self) -> str:
        pass
    
    @abstractmethod
    def extract_metadata(self) -> Dict[str, Any]:
        pass
    
    def extract_images(self, output_dir: Path) -> list:
        logger.warning(f"Extracción de imágenes no implementada para {self.__class__.__name__}")
        return []
    
    def extract_tables(self) -> list:
        logger.warning(f"Extracción de tablas no implementada para {self.__class__.__name__}")
        return []
    
    def extract_all(self, output_dir: Optional[Path] = None) -> Dict[str, Any]:
        result = {
            'text': self.extract_text(),
            'metadata': self.extract_metadata(),
            'images': [],
            'tables': []
        }
        if output_dir:
            result['images'] = self.extract_images(output_dir)
        result['tables'] = self.extract_tables()
        return result
