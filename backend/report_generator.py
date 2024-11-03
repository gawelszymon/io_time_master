import csv
from io import StringIO
from sqlalchemy.orm import Session
from .models import WorkSession

def generate_report(db: Session, employee_id: int):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['Session ID', 'Start Time', 'End Time', 'Task'])

    work_sessions = db.query(WorkSession).filter_by(employee_id=employee_id).all()
    for ws in work_sessions:
        writer.writerow([ws.id, ws.start_time, ws.end_time, ws.task_description])

    output.seek(0)
    return output.getvalue()
