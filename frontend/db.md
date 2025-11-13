# Library Management System Database Schema

## Database Setup for PlanetScale

This document outlines the MySQL database schema for the Library Management System to be deployed on PlanetScale.

## Tables

### 1. Members Table
```sql
CREATE TABLE members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  membership_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Books Table
```sql
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  category VARCHAR(100),
  total_copies INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Transactions Table
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  fine_amount DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

## Indexes

```sql
-- Indexes for better query performance
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_book_id ON transactions(book_id);
CREATE INDEX idx_transactions_borrow_date ON transactions(borrow_date);
CREATE INDEX idx_transactions_due_date ON transactions(due_date);
CREATE INDEX idx_transactions_return_date ON transactions(return_date);
```

## Sample Data

### Members
```sql
INSERT INTO members (name, email, phone, membership_date) VALUES
('Chirantha J Ellepola', 'chirantha@example.com', '+94771234567', '2023-01-15'),
('Lakshitha Dinesh', 'lakshitha@example.com', '+94772345678', '2023-02-20'),
('Nadeesha Akalanka', 'nadeesha@example.com', '+94773456789', '2023-03-10');
```

### Books
```sql
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Fiction', 3, 2),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Fiction', 2, 1),
('1984', 'George Orwell', '978-0-452-28423-4', 'Dystopian', 4, 3);
```

### Transactions
```sql
INSERT INTO transactions (member_id, book_id, borrow_date, due_date, return_date) VALUES
(1, 1, '2023-05-01', '2023-05-15', NULL),
(2, 2, '2023-05-03', '2023-05-17', '2023-05-10');
```

## PlanetScale Deployment Notes

1. PlanetScale uses MySQL-compatible syntax
2. Foreign key constraints are supported in PlanetScale
3. Use VARCHAR(255) for most string fields
4. Use DECIMAL(10, 2) for monetary values
5. TIMESTAMP fields automatically handle time zone conversions
6. Indexes should be created for frequently queried columns

## Connection Details

To connect to your PlanetScale database, you'll need:
- Host: Your PlanetScale database host
- Username: Your PlanetScale username
- Password: Your PlanetScale password
- Database name: Your database name

Example connection string:
```
mysql://<username>:<password>@<host>/<database_name>
```

## Recommended Schema Migrations

When making changes to your schema in PlanetScale:
1. Use branching feature to create isolated environments
2. Test schema changes in development branch
3. Deploy to production after testing
4. Use non-blocking schema changes when possible