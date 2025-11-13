# Library Management System - Backend

This is the backend API for the Library Management System, built with Python Flask.

**Note:** This version uses environment variables for authentication. For MongoDB integration, see `app_mongodb.py`.

## Features

- Admin login authentication
- JWT token-based authentication
- CORS support for frontend integration
- Environment variable configuration

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables:**
   Create a `.env` file with the following variables:
   ```
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=hashed_password_here
   ```

3. **Generate Password Hash (Optional):**
   Use the provided script to generate a bcrypt hash for your admin password:
   ```bash
   python generate_hash.py your_password_here
   ```

4. **Run the Application:**
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

5. **Deployment (Heroku/Procfile-based platforms):**
   The included `Procfile` allows for easy deployment to platforms like Heroku.
   Simply push to your Heroku repository and it will automatically start the application.

## API Endpoints

- `POST /api/login` - Admin login
- `GET /api/protected` - Protected route example (requires valid JWT token)
- `GET /api/health` - Health check endpoint

## Default Credentials

- Username: `admin`
- Password: `admin123`

**Note:** Please change these credentials in production by updating the `.env` file with your own username and password hash.

## Security

- Passwords are stored as bcrypt hashes
- JWT tokens are used for authentication
- CORS is enabled for frontend communication