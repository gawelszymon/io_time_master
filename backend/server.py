from flask import Flask, abort, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask import request, jsonify
from sqlalchemy.exc import IntegrityError
import psycopg2

app = Flask(__name__, template_folder="../frontend/templates", static_folder='../frontend/static')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:WBCfFxmRdkdUSCKkGJlxcxlZarlNxnbO@autorack.proxy.rlwy.net:38741/railway'
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

@app.route('/user/<int:id>')
def user(id):
    user = Users.query.get(id)
    if not user:
        abort(404, description='user not found')
    
    return render_template('user.html', user=user)

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
    
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'użytkonika o podanym ID jest już zarestrowany'}), 409
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@app.route('/remove', methods=['DELETE'])
def remove_user():
    try:
        data = request.get_json()
        admin_id = data.get('admin_id')
        password = data.get('password')
        
        if not admin_id or not password:
            return jsonify({'error': 'Brak danych'}), 400
                
        user = Users.query.filter_by(id=admin_id, password=password).first()
        
        if not user:
            return jsonify({'error': 'Podany użytkownik nie istnieje'}), 404
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'użytkownik został usunięty'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')
    position = data.get('position')
    
    if not data or 'id' not in data or 'password' not in data or 'position' not in data:
        return jsonify({'error': 'brak danych'}), 400
    
    user = Users.query.filter_by(id=id, password=password).first()
        
    if not user:
        return jsonify({'error': 'Nieprawidłowe dane logowania'}), 401
    
    user.position = position
    db.session.commit()
    
    return jsonify({'message': 'zalogowano pomyślnie', 
                    'redirect_url': f'/user/{id}'}), 200
    
@app.route('/users_table', methods=['GET'])
def get_users():
    try:
        users = Users.query.all()
        users_table = [{
            'id': user.id,
            'position': user.position,
            'action': user.action,
        }for user in users]
        return jsonify({'users': users_table})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/user/<int:id>/action_start', methods=['PUT'])
def update_user_action_start(id):
    user = Users.query.get(id)
    
    if not user:
        return jsonify({'error': 'brak takiego uzytkownika'}), 404
    
    user.action = "w trakcie pracy"
    db.session.commit()
    
    return jsonify({'message': 'status action zaktualizowany'}), 200

@app.route('/user/<int:id>/action_end', methods=['PUT'])
def update_user_action_end(id):
    user = Users.query.get(id)
    
    data = request.get_json()
    action_value = data.get('action')
    
    if not action_value:
        return jsonify({'error': 'brak wartosci action'}), 400
    
    user.action = action_value
    db.session.commit()
    
    return jsonify({'message': 'status action zaktualizowany'}), 200
    

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5005, debug=True)