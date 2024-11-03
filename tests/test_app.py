import sys
import os

# Dodaj ścieżkę do katalogu głównego projektu
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


import pytest
from backend.database import Base, engine, get_db
from backend.models import Employee, WorkSession
from backend.services import add_employee, add_work_session
from backend.main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask import Flask
from datetime import datetime

# Konfiguracja bazy testowej (in-memory)
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def test_app():
    # Konfiguracja aplikacji testowej
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = TEST_DATABASE_URL
    # Tworzymy silnik bazy danych i sesję dla testów
    engine = create_engine(TEST_DATABASE_URL)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Tworzymy tabele w bazie danych
    Base.metadata.create_all(bind=engine)
    
    # Uruchamiamy kontekst aplikacji testowej
    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client, TestingSessionLocal
    # Usuwamy tabele po zakończeniu testów
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(test_app):
    testing_client, TestingSessionLocal = test_app
    # Tworzymy instancję sesji z fabryki TestingSessionLocal
    db = TestingSessionLocal()
    yield db
    db.close()

def test_add_employee(test_app, db_session):
    testing_client, _ = test_app
    response = testing_client.post('/add_employee', json={
        "name": "John Doe",
        "role": "Developer"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "John Doe"
    assert data["role"] == "Developer"


def test_add_work_session(test_app, db_session):
    testing_client, db = test_app
    
    # Najpierw dodajemy pracownika
    new_employee = add_employee(db_session, "John Doe", "Developer")
    
    # Dodajemy sesję pracy dla pracownika z obiektami datetime
    response = testing_client.post('/add_work_session', json={
        "employee_id": new_employee.id,
        "task_description": "Test Task",
        "start_time": datetime(2024, 1, 1, 9, 0).isoformat(),
        "end_time": datetime(2024, 1, 1, 17, 0).isoformat()
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data


def test_download_report(test_app, db_session):
    testing_client, db = test_app
    
    # Dodajemy pracownika i sesję pracy
    new_employee = add_employee(db_session, "John Doe", "Developer")
    add_work_session(db_session, new_employee.id, "Test Task", datetime(2024, 1, 1, 9, 0), datetime(2024, 1, 1, 17, 0))
    
    # Pobieramy raport
    response = testing_client.get(f'/download_report/{new_employee.id}')
    assert response.status_code == 200
    assert 'text/csv' in response.headers['Content-Type']  # Sprawdzenie zawierające 'text/csv'
    assert "Session ID,Start Time,End Time,Task" in response.get_data(as_text=True)
