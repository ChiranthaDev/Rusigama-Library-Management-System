const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'library_management_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Chira@20004@db.gjatogqsggbuotevfhbr.supabase.co:5432/postgres"
});

// Create tables if they don't exist
async function initDB() {
  try {
    // Admins table already exists in Supabase, so we don't need to create it
    
    // Books table already exists in Supabase, so we don't need to create it
    
    // Members table already exists in Supabase, so we don't need to create it

    // Check if admin user exists, if not create it
    const adminResult = await pool.query("SELECT * FROM admins WHERE username = $1", ['admin']);
    if (adminResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Rusigama2025', 10);
      await pool.query(
        "INSERT INTO admins (username, password) VALUES ($1, $2)",
        ['admin', hashedPassword]
      );
      console.log('Default admin user created');
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      // Create access token
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        access_token: token,
        username: user.username
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Token validation endpoint
app.post('/api/validate-token', authenticateToken, (req, res) => {
  // If middleware passes, token is valid
  res.json({ valid: true, username: req.user.username });
});

// Books endpoints
app.get('/api/books', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id DESC");
    res.json({ books: result.rows });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'An error occurred while fetching books' });
  }
});

app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, author, isbn, category, available_copies, total_copies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    // Ensure default values for copies
    const availableCopies = available_copies !== undefined ? available_copies : 1;
    const totalCopies = total_copies !== undefined ? total_copies : 1;

    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, category, available_copies, total_copies)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, author, isbn, category, availableCopies, totalCopies]
    );

    res.status(201).json({ message: 'Book created successfully', book_id: result.rows[0].id });
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'An error occurred while creating book' });
  }
});

app.put('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, available_copies, total_copies } = req.body;

    // Check if book exists
    const bookResult = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update book
    await pool.query(
      `UPDATE books SET 
       title = COALESCE($1, title),
       author = COALESCE($2, author),
       isbn = COALESCE($3, isbn),
       category = COALESCE($4, category),
       available_copies = COALESCE($5, available_copies),
       total_copies = COALESCE($6, total_copies),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [title, author, isbn, category, available_copies, total_copies, id]
    );

    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'An error occurred while updating book' });
  }
});

app.delete('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists
    const bookResult = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete book
    await pool.query("DELETE FROM books WHERE id = $1", [id]);

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'An error occurred while deleting book' });
  }
});

// Members endpoints
app.get('/api/members', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY id DESC");
    res.json({ members: result.rows });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'An error occurred while fetching members' });
  }
});

app.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const { name, address, phone, membership_date } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Use current date if membership_date is not provided
    const currentDate = membership_date || new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `INSERT INTO members (name, address, phone, membership_date)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, address, phone, currentDate]
    );

    res.status(201).json({ message: 'Member created successfully', member_id: result.rows[0].id });
  } catch (err) {
    console.error('Error creating member:', err);
    res.status(500).json({ message: 'An error occurred while creating member' });
  }
});

app.put('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, membership_date } = req.body;

    // Check if member exists
    const memberResult = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Update member
    await pool.query(
      `UPDATE members SET 
       name = COALESCE($1, name),
       address = COALESCE($2, address),
       phone = COALESCE($3, phone),
       membership_date = COALESCE($4, membership_date),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [name, address, phone, membership_date, id]
    );

    res.json({ message: 'Member updated successfully' });
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ message: 'An error occurred while updating member' });
  }
});

app.delete('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if member exists
    const memberResult = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Delete member
    await pool.query("DELETE FROM members WHERE id = $1", [id]);

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ message: 'An error occurred while deleting member' });
  }
});

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Transactions endpoints
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    // Get all transactions with book and member details
    const result = await pool.query(`
      SELECT 
        t.id,
        t.member_id,
        t.book_id,
        t.borrow_date,
        t.due_date,
        t.return_date,
        t.fine_amount,
        t.created_at,
        t.updated_at,
        b.title as book_title,
        b.author as book_author,
        b.isbn as book_isbn,
        m.name as member_name,
        m.address as member_address
      FROM transactions t
      LEFT JOIN books b ON t.book_id = b.id
      LEFT JOIN members m ON t.member_id = m.id
      ORDER BY t.created_at DESC
    `);
    
    res.json({ transactions: result.rows });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'An error occurred while fetching transactions' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { member_id, book_id, borrow_date, due_date } = req.body;

    // Validate required fields
    if (!member_id || !book_id || !borrow_date || !due_date) {
      return res.status(400).json({ 
        message: 'Member ID, Book ID, Borrow Date, and Due Date are required' 
      });
    }

    // Check if member exists
    const memberResult = await pool.query("SELECT * FROM members WHERE id = $1", [member_id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if book exists and is available
    const bookResult = await pool.query("SELECT * FROM books WHERE id = $1", [book_id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = bookResult.rows[0];
    if (book.available_copies <= 0) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Create transaction
    const result = await pool.query(
      `INSERT INTO transactions (member_id, book_id, borrow_date, due_date)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [member_id, book_id, borrow_date, due_date]
    );

    // Update book availability (decrease available copies by 1)
    await pool.query(
      `UPDATE books SET available_copies = available_copies - 1 WHERE id = $1`,
      [book_id]
    );

    res.status(201).json({ 
      message: 'Transaction created successfully', 
      transaction_id: result.rows[0].id 
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'An error occurred while creating transaction' });
  }
});

app.put('/api/transactions/:id/return', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { return_date, fine_amount } = req.body;

    // Validate required fields
    if (!return_date) {
      return res.status(400).json({ message: 'Return date is required' });
    }

    // Check if transaction exists
    const transactionResult = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactionResult.rows[0];
    
    // Check if already returned
    if (transaction.return_date) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Update transaction with return date and fine amount
    await pool.query(
      `UPDATE transactions SET 
       return_date = $1,
       fine_amount = COALESCE($2, 0),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [return_date, fine_amount || 0, id]
    );

    // Update book availability (increase available copies by 1)
    await pool.query(
      `UPDATE books SET available_copies = available_copies + 1 WHERE id = $1`,
      [transaction.book_id]
    );

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).json({ message: 'An error occurred while returning book' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transaction exists
    const transactionResult = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transactionResult.rows[0];
    
    // If book hasn't been returned yet, update book availability
    if (!transaction.return_date) {
      await pool.query(
        `UPDATE books SET available_copies = available_copies + 1 WHERE id = $1`,
        [transaction.book_id]
      );
    }

    // Delete transaction
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'An error occurred while deleting transaction' });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get total books
    const booksResult = await pool.query("SELECT COUNT(*) as count FROM books");
    const totalBooks = parseInt(booksResult.rows[0].count);

    // Get total members
    const membersResult = await pool.query("SELECT COUNT(*) as count FROM members");
    const totalMembers = parseInt(membersResult.rows[0].count);

    // Get total transactions
    const transactionsResult = await pool.query("SELECT COUNT(*) as count FROM transactions");
    const totalTransactions = parseInt(transactionsResult.rows[0].count);

    // Get borrowed books (transactions without return date)
    const borrowedResult = await pool.query("SELECT COUNT(*) as count FROM transactions WHERE return_date IS NULL");
    const borrowedBooks = parseInt(borrowedResult.rows[0].count);

    // Get overdue books (borrowed books where due_date < today)
    const overdueResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM transactions 
      WHERE return_date IS NULL AND due_date < CURRENT_DATE
    `);
    const overdueBooks = parseInt(overdueResult.rows[0].count);

    // Get total fines collected
    const finesResult = await pool.query("SELECT COALESCE(SUM(fine_amount), 0) as total FROM transactions");
    const totalFines = parseFloat(finesResult.rows[0].total);

    res.json({
      totalBooks,
      totalMembers,
      borrowedBooks,
      overdueBooks,
      totalTransactions,
      totalFines
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'An error occurred while fetching dashboard stats' });
  }
});

app.get('/api/dashboard/recent-transactions', authenticateToken, async (req, res) => {
  try {
    // Get recent transactions with book and member details
    const result = await pool.query(`
      SELECT 
        t.id,
        t.borrow_date,
        t.return_date,
        t.created_at,
        b.title as book_title,
        m.name as member_name
      FROM transactions t
      LEFT JOIN books b ON t.book_id = b.id
      LEFT JOIN members m ON t.member_id = m.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);

    // Format transactions for frontend
    const recentTransactions = result.rows.map(transaction => {
      const action = transaction.return_date ? 'returned' : 'borrowed';
      const createdDate = new Date(transaction.created_at);
      const now = new Date();
      const diffMs = now - createdDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      let date;
      if (diffDays > 0) {
        date = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        date = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        date = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      }

      return {
        id: transaction.id,
        member: transaction.member_name,
        book: transaction.book_title,
        action: action,
        date: date
      };
    });

    res.json({ recentTransactions });
  } catch (err) {
    console.error('Error fetching recent transactions:', err);
    res.status(500).json({ message: 'An error occurred while fetching recent transactions' });
  }
});

app.get('/api/dashboard/overdue-books', authenticateToken, async (req, res) => {
  try {
    // Get overdue books with member and book details
    const result = await pool.query(`
      SELECT 
        t.id,
        t.due_date,
        t.fine_amount,
        b.title as book_title,
        m.name as member_name
      FROM transactions t
      LEFT JOIN books b ON t.book_id = b.id
      LEFT JOIN members m ON t.member_id = m.id
      WHERE t.return_date IS NULL AND t.due_date < CURRENT_DATE
      ORDER BY t.due_date ASC
      LIMIT 10
    `);

    // Format overdue books for frontend
    const overdueBooks = result.rows.map(transaction => {
      // Use the actual fine amount from the database, or calculate if not set
      let fineAmount = 0;
      if (transaction.fine_amount !== null) {
        fineAmount = parseFloat(transaction.fine_amount);
      } else {
        const dueDate = new Date(transaction.due_date);
        const now = new Date();
        const diffTime = Math.abs(now - dueDate);
        const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = daysOverdue * 10; // LKR 10 per day
      }
      
      return {
        id: transaction.id,
        member: transaction.member_name,
        book: transaction.book_title,
        dueDate: transaction.due_date,
        fine: `LKR ${fineAmount.toFixed(2)}`
      };
    });

    res.json({ overdueBooks });
  } catch (err) {
    console.error('Error fetching overdue books:', err);
    res.status(500).json({ message: 'An error occurred while fetching overdue books' });
  }
});
