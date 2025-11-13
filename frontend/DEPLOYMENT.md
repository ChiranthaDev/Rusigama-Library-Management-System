# Deployment Instructions

## GitHub Repository Setup

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name your repository (e.g., "Rusigama-Library-Management-System")
   - Choose Public or Private
   - Do NOT initialize with a README
   - Do NOT add .gitignore or license

2. After creating the repository, copy the repository URL

3. Run these commands in your project directory:

```bash
# If you need to change the remote URL:
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Or if you need to add the remote (if origin doesn't exist):
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub:
git branch -M main
git push -u origin main
```

## PlanetScale Database Deployment

1. Sign up at https://planetscale.com/
2. Create a new database
3. Use the schema from `db.md` file to create your tables
4. Get your connection details from PlanetScale dashboard

## Environment Variables

Create a `.env` file in your project root with:

```
# Database connection
DATABASE_URL="mysql://username:password@host/database_name"

# Other environment variables as needed
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```