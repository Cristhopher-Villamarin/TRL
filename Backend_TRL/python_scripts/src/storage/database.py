from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from loguru import logger
from typing import Generator
from config.settings import DATABASE_URL
from src.models.document import Base

class DatabaseManager:
    def __init__(self, database_url: str = DATABASE_URL):
        self.database_url = database_url
        self.engine = None
        self.SessionLocal = None
        
    def initialize(self):
        try:
            self.engine = create_engine(
                self.database_url,
                pool_pre_ping=True
            )
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.engine
            )
            # Crear tablas si no existen
            Base.metadata.create_all(bind=self.engine)
            logger.info("Tablas de base de datos verificadas/creadas correctamente")
        except Exception as e:
            logger.error(f"Error al inicializar la base de datos: {e}")
            raise
    
    @contextmanager
    def get_session(self) -> Generator[Session, None, None]:
        if self.SessionLocal is None:
            self.initialize()
        
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Error en transacción: {e}")
            raise
        finally:
            session.close()

db_manager = DatabaseManager()
