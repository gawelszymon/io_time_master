from flask import Flask, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask import request, jsonify

app = Flask(__name__, template_folder="../frontend/templates", static_folder='../frontend/static')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/employee'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(80), nullable=False)
    position = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(80), nullable=False)

    
with app.app_context():
    db.create_all()
    

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/user')
def user():
    return render_template('user.html')

@app.route('/users')
def users():
    return render_template('users.html')

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        admin_id = data.get('admin_id')
        password = data.get('password')
        
        if not admin_id or not password:
            return jsonify({'error': 'Brak danych'}), 400
                
        new_user = Users(
            id = admin_id,
            password = password,
            position = 'unidentified',
            action = 'unidentified'
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'użytkownik został dodany'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5005, debug=True)