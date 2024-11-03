from flask import Blueprint, request, Response, jsonify
from .database import get_db
from .services import add_employee, add_work_session
from .report_generator import generate_report
from sqlalchemy.orm import Session

bp = Blueprint('routes', __name__)

@bp.route('/add_employee', methods=['POST'])
def add_employee_route():
    data = request.json
    name = data.get("name")
    role = data.get("role")
    db = next(get_db())
    new_employee = add_employee(db, name, role)
    return jsonify({"id": new_employee.id, "name": new_employee.name, "role": new_employee.role})

@bp.route('/add_work_session', methods=['POST'])
def add_work_session_route():
    data = request.json
    employee_id = data.get("employee_id")
    task_description = data.get("task_description")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    db = next(get_db())
    work_session = add_work_session(db, employee_id, task_description, start_time, end_time)
    return jsonify({"id": work_session.id})

@bp.route('/download_report/<int:employee_id>', methods=['GET'])
def download_report(employee_id):
    db = next(get_db())
    report_data = generate_report(db, employee_id)
    response = Response(
        report_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=report.csv"}
    )
    return response
