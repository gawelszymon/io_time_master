from flask import Flask
from .database import engine, Base
from .routes import bp as routes_bp

app = Flask(__name__)

# Tworzenie tabel w bazie danych
Base.metadata.create_all(bind=engine)

# Rejestracja blueprinta z endpointami
app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run(debug=True)
