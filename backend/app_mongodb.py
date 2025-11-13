from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import bcrypt
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')
jwt = JWTManager(app)

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/library_management')
client = MongoClient(MONGODB_URI)
db = client.library_management
users_collection = db.users

# Create admin user if it doesn't exist
def create_admin_user():
    admin_username = os.getenv('ADMIN_USERNAME', 'admin')
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    existing_user = users_collection.find_one({'username': admin_username})
    if not existing_user:
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        users_collection.insert_one({
            'username': admin_username,
            'password': hashed_password,
            'role': 'admin',
            'created_at': datetime.utcnow()
        })
        print(f"Admin user '{admin_username}' created successfully")
    else:
        print(f"Admin user '{admin_username}' already exists")

# Create admin user on startup
create_admin_user()

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Username and password are required'}), 400
        
        username = data['username']
        password = data['password']
        
        # Find user in MongoDB
        user = users_collection.find_one({'username': username})
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check if password matches (using bcrypt)
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Create access token
            access_token = create_access_token(identity=username)
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'username': username
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'message': 'An error occurred during login'}), 500

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200

@app.route('/api/health', methods=['GET'])
def health():
    try:
        # Check MongoDB connection
        client.admin.command('ping')
        return jsonify({
            'status': 'OK', 
            'message': 'Backend is running',
            'database': 'MongoDB connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'ERROR',
            'message': 'Database connection failed',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)