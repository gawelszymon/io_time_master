from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder="../frontend/templates", static_folder='../frontend/static')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/adminpanel')
def adminpanel():
    return render_template('adminpanel.html')