import React, { useState, useEffect } from 'react';
import '../styles/Transactions.css';
import BorrowBook from './BorrowBook';
import ReturnBook from './ReturnBook';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data
  const sampleBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { id: 6, title: 'Animal Farm', author: 'George Orwell' }
  ];

  const sampleMembers = [
    { id: 1, name: 'Chirantha J Ellepola' },
    { id: 2, name: 'Lakshitha Dinesh' },
    { id: 3, name: 'Nadeesha Akalanka' },
    { id: 4, name: 'Kavishka Fonseka' },
    { id: 5, name: 'Nimesh Harsha' }
  ];

  const sampleTransactions = [
    { id: 1, memberId: 1, memberName: 'Chirantha J Ellepola', bookId: 1, bookTitle: 'The Great Gatsby', borrowDate: '2023-05-01', dueDate: '2023-05-15', returnDate: null },
    { id: 2, memberId: 2, memberName: 'Lakshitha Dinesh', bookId: 2, bookTitle: 'To Kill a Mockingbird', borrowDate: '2023-05-03', dueDate: '2023-05-17', returnDate: '2023-05-10' },
    { id: 3, memberId: 3, memberName: 'Nadeesha Akalanka', bookId: 3, bookTitle: '1984', borrowDate: '2023-05-05', dueDate: '2023-05-19', returnDate: null },
    { id: 4, memberId: 4, memberName: 'Kavishka Fonseka', bookId: 4, bookTitle: 'Pride and Prejudice', borrowDate: '2023-05-10', dueDate: '2023-05-24', returnDate: null },
    { id: 5, memberId: 5, memberName: 'Nimesh Harsha', bookId: 5, bookTitle: 'The Catcher in the Rye', borrowDate: '2023-05-12', dueDate: '2023-05-26', returnDate: '2023-05-20' }
  ];

  const [books] = useState(sampleBooks);
  const [members] = useState(sampleMembers);

  useEffect(() => {
    // In a real app, this data would come from an API
    setTransactions(sampleTransactions);
  }, []);

  const handleBorrowSubmit = (borrowFormData) => {
    const selectedBook = books.find(book => book.id === parseInt(borrowFormData.bookId));
    const selectedMember = members.find(member => member.id === parseInt(borrowFormData.memberId));
    
    if (selectedBook && selectedMember) {
      const newTransaction = {
        id: transactions.length + 1,
        memberId: parseInt(borrowFormData.memberId),
        memberName: selectedMember.name,
        bookId: parseInt(borrowFormData.bookId),
        bookTitle: selectedBook.title,
        borrowDate: borrowFormData.borrowDate,
        dueDate: borrowFormData.dueDate,
        returnDate: null
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    
    setShowBorrowForm(false);
  };

  const handleReturnSubmit = (returnFormData) => {
    const transactionId = parseInt(returnFormData.transactionId);
    const returnDate = returnFormData.returnDate || new Date().toISOString().split('T')[0];
    
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, returnDate } 
          : transaction
      )
    );
    setShowReturnForm(false);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Calculate fine for overdue books (LKR 100 per day)
  const calculateFine = (dueDate, returnDate) => {
    if (!returnDate) {
      const today = new Date();
      const due = new Date(dueDate);
      if (due < today) {
        const diffTime = Math.abs(today - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return (diffDays * 100).toFixed(2);
      }
      return '0.00';
    } else {
      const returnDt = new Date(returnDate);
      const due = new Date(dueDate);
      if (due < returnDt) {
        const diffTime = Math.abs(returnDt - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return (diffDays * 100).toFixed(2);
      }
      return '0.00';
    }
  };

  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter 
      ? statusFilter === 'overdue' 
        ? isOverdue(transaction.dueDate, transaction.returnDate) && !transaction.returnDate
        : statusFilter === 'returned'
          ? transaction.returnDate !== null
          : statusFilter === 'borrowed'
            ? transaction.returnDate === null && !isOverdue(transaction.dueDate, transaction.returnDate)
            : true
      : true;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate total fines
  const totalFines = transactions.reduce((total, transaction) => {
    return total + parseFloat(calculateFine(transaction.dueDate, transaction.returnDate));
  }, 0);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
        <div className="btn-group">
          <button 
            onClick={() => setShowReturnForm(true)}
            className="btn btn-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Return Book
          </button>
          <button 
            onClick={() => setShowBorrowForm(true)}
            className="btn btn-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Borrow Book
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="dashboard-grid">
        <div className="stat-card blue">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Transactions</p>
              <p className="stat-card-value">{transactions.length}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Active Borrowings</p>
              <p className="stat-card-value">{transactions.filter(t => !t.returnDate).length}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Fines</p>
              <p className="stat-card-value">LKR {totalFines.toFixed(2)}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by member name or book title..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Borrow Book Form Modal */}
      {showBorrowForm && (
        <BorrowBook 
          books={books}
          members={members}
          onBorrowSubmit={handleBorrowSubmit}
          onClose={() => setShowBorrowForm(false)}
        />
      )}

      {/* Return Book Form Modal */}
      {showReturnForm && (
        <ReturnBook 
          transactions={transactions}
          onReturnSubmit={handleReturnSubmit}
          onClose={() => setShowReturnForm(false)}
        />
      )}

      {/* Transactions Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Fine</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.memberName}</td>
                <td>{transaction.bookTitle}</td>
                <td>{transaction.borrowDate}</td>
                <td>{transaction.dueDate}</td>
                <td>
                  {transaction.returnDate || '-'}
                </td>
                <td>
                  <span className={parseFloat(calculateFine(transaction.dueDate, transaction.returnDate)) > 0 ? 'status-badge overdue' : ''}>
                    LKR {calculateFine(transaction.dueDate, transaction.returnDate)}
                  </span>
                </td>
                <td>
                  {transaction.returnDate ? (
                    <span className="status-badge returned">
                      <span className="status-dot"></span>
                      Returned
                    </span>
                  ) : isOverdue(transaction.dueDate, transaction.returnDate) ? (
                    <span className="status-badge overdue">
                      <span className="status-dot"></span>
                      Overdue
                    </span>
                  ) : (
                    <span className="status-badge borrowed">
                      <span className="status-dot"></span>
                      Borrowed
                    </span>
                  )}
                </td>
                <td>
                  {!transaction.returnDate && (
                    <button 
                      onClick={() => setShowReturnForm(true)}
                      className="btn btn-sm btn-success"
                    >
                      Return
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(transaction.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No transactions found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;