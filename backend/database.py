from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"  # Możesz tu zmienić URL na inny typ bazy

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Funkcja do uzyskania sesji
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
