from .models import Employee, WorkSession
from sqlalchemy.orm import Session
from datetime import datetime
def add_employee(db: Session, name: str, role: str):
    new_employee = Employee(name=name, role=role)
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

def add_work_session(db, employee_id, task_description, start_time, end_time):
    # Sprawdź, czy start_time i end_time są ciągami znaków, a następnie przekonwertuj je na datetime
    if isinstance(start_time, str):
        start_time = datetime.fromisoformat(start_time)
    if isinstance(end_time, str):
        end_time = datetime.fromisoformat(end_time)
    
    # Dodaj sesję pracy do bazy danych
    work_session = WorkSession(
        employee_id=employee_id,
        task_description=task_description,
        start_time=start_time,
        end_time=end_time
    )
    db.add(work_session)
    db.commit()
    db.refresh(work_session)
    return work_session