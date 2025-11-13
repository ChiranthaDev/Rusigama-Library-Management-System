import bcrypt
import sys

def generate_password_hash(password):
    """Generate a bcrypt hash for a given password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_hash.py <password>")
        sys.exit(1)
    
    password = sys.argv[1]
    hashed_password = generate_password_hash(password)
    print(f"Password: {password}")
    print(f"Hashed: {hashed_password}")