from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(String)

    # Relacja z sesjami pracy
    sessions = relationship("WorkSession", back_populates="employee")

class WorkSession(Base):
    __tablename__ = 'work_sessions'
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    task_description = Column(String)

    employee = relationship("Employee", back_populates="sessions")
