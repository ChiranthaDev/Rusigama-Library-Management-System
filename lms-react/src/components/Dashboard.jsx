import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalTransactions: 0,
    totalFines: 0
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  useEffect(() => {
    // In a real app, this data would come from an API
    // For now, we'll simulate with dummy data
    setStats({
      totalBooks: 124,
      totalMembers: 89,
      borrowedBooks: 32,
      overdueBooks: 5,
      totalTransactions: 42,
      totalFines: 27.50
    });

    // Sample recent transactions with updated names
    setRecentTransactions([
      { id: 1, member: 'Chirantha J Ellepola', book: 'The Great Gatsby', action: 'borrowed', date: '2 hours ago' },
      { id: 2, member: 'Lakshitha Dinesh', book: 'To Kill a Mockingbird', action: 'returned', date: '5 hours ago' },
      { id: 3, member: 'Nadeesha Akalanka', book: '1984', action: 'borrowed', date: '1 day ago' },
      { id: 4, member: 'Kavishka Fonseka', book: 'Pride and Prejudice', action: 'renewed', date: '2 days ago' },
      { id: 5, member: 'Nimesh Harsha', book: 'The Catcher in the Rye', action: 'borrowed', date: '3 days ago' }
    ]);

    // Sample overdue books with updated names
    setOverdueBooks([
      { id: 1, member: 'Harshana Prabhath', book: 'Animal Farm', dueDate: '2023-05-10', daysOverdue: 5, fine: 'LKR 500.00' },
      { id: 2, member: 'Dinura Weerasingha', book: 'Brave New World', dueDate: '2023-05-08', daysOverdue: 7, fine: 'LKR 700.00' },
      { id: 3, member: 'Chirantha J Ellepola', book: 'Lord of the Flies', dueDate: '2023-05-12', daysOverdue: 3, fine: 'LKR 300.00' }
    ]);
  }, []);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="stat-card blue">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Books</p>
              <p className="stat-card-value">{stats.totalBooks}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="stat-card green">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Members</p>
              <p className="stat-card-value">{stats.totalMembers}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="stat-card yellow">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Borrowed Books</p>
              <p className="stat-card-value">{stats.borrowedBooks}</p>
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
              <p className="stat-card-title">Overdue Books</p>
              <p className="stat-card-value">{stats.overdueBooks}</p>
            </div>
            <div className="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="additional-stats">
        <div className="additional-stat-card">
          <h3 className="additional-stat-title">Total Transactions</h3>
          <p className="additional-stat-value">{stats.totalTransactions}</p>
        </div>
        
        <div className="additional-stat-card">
          <h3 className="additional-stat-title">Total Fines Collected</h3>
          <p className="additional-stat-value purple-value">LKR {stats.totalFines.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Activity and Overdue Books */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="activity-item">
                <div className="activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    {transaction.member} <span>{transaction.action}</span> "{transaction.book}"
                  </p>
                  <p className="activity-date">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Books */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Overdue Books</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Due Date</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.member}</td>
                    <td>{book.book}</td>
                    <td>{book.dueDate}</td>
                    <td className="status-badge overdue">
                      <span className="status-dot"></span>
                      {book.fine}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;