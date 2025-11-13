# Library Management System - Backend (MongoDB Version)

This is the MongoDB version of the backend API for the Library Management System, built with Python Flask.

## Features

- Admin login authentication with MongoDB storage
- JWT token-based authentication
- CORS support for frontend integration
- Environment variable configuration
- MongoDB database integration

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **MongoDB Setup:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in the `.env` file with your MongoDB connection string

3. **Environment Variables:**
   Create a `.env` file with the following variables:
   ```
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   MONGODB_URI=mongodb://localhost:27017/library_management
   ```

4. **Run the Application:**
   ```bash
   python app_mongodb.py
   ```

   The backend will start on `http://localhost:5000`

5. **Deployment (Heroku/Procfile-based platforms):**
   The included `Procfile` allows for easy deployment to platforms like Heroku.
   Simply push to your Heroku repository and it will automatically start the application.

## API Endpoints

- `POST /api/login` - Admin login
- `GET /api/protected` - Protected route example (requires valid JWT token)
- `GET /api/health` - Health check endpoint with MongoDB connection status

## Default Credentials

- Username: `admin`
- Password: `admin123`

**Note:** On first run, the application will automatically create an admin user with these credentials in the MongoDB database. You can change these credentials by updating the `.env` file.

## Security

- Passwords are stored as bcrypt hashes in MongoDB
- JWT tokens are used for authentication
- CORS is enabled for frontend communication
- MongoDB connection is secured with proper URI configuration