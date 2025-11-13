import React, { useState, useEffect, useRef } from 'react';
import '../styles/Transactions.css';

const ReturnBook = ({ transactions, onReturnSubmit, onClose }) => {
  const [returnFormData, setReturnFormData] = useState({
    transactionId: '',
    returnDate: ''
  });
  const [transactionSearch, setTransactionSearch] = useState('');
  const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false);
  const transactionDropdownRef = useRef(null);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(t => 
    !t.returnDate && (
      t.memberName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.bookTitle.toLowerCase().includes(transactionSearch.toLowerCase())
    )
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (transactionDropdownRef.current && !transactionDropdownRef.current.contains(event.target)) {
        setIsTransactionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReturnInputChange = (e) => {
    const { name, value } = e.target;
    setReturnFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    onReturnSubmit(returnFormData);
    setReturnFormData({ transactionId: '', returnDate: '' });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h3 className="form-title">Return Book</h3>
          <button 
            onClick={onClose}
            className="form-close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleReturnSubmit}>
          <div className="form-body">
            <div className="form-group">
              <label className="form-label">Transaction</label>
              <div className="search-dropdown-container" ref={transactionDropdownRef}>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="form-control search-input"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    onFocus={() => setIsTransactionDropdownOpen(true)}
                  />
                  {transactionSearch && (
                    <button 
                      type="button" 
                      className="search-clear-btn"
                      onClick={() => setTransactionSearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {isTransactionDropdownOpen && (
                  <div className="search-dropdown">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(transaction => (
                        <div 
                          key={transaction.id} 
                          className={`search-dropdown-item ${returnFormData.transactionId === transaction.id ? 'selected' : ''}`}
                          onClick={() => {
                            setReturnFormData(prev => ({ ...prev, transactionId: transaction.id }));
                            setIsTransactionDropdownOpen(false);
                            setTransactionSearch('');
                          }}
                        >
                          {transaction.memberName} - {transaction.bookTitle}
                        </div>
                      ))
                    ) : (
                      <div className="search-dropdown-item disabled">
                        {transactionSearch ? 'No transactions found' : 'No transactions available'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="search-info">
                {transactionSearch && `${filteredTransactions.length} of ${transactions.filter(t => !t.returnDate).length} transactions shown`}
              </div>
              {returnFormData.transactionId && (
                <div className="selected-item">
                  Selected: {transactions.find(t => t.id === parseInt(returnFormData.transactionId))?.memberName} - {transactions.find(t => t.id === parseInt(returnFormData.transactionId))?.bookTitle}
                  <button 
                    type="button" 
                    className="clear-selection-btn"
                    onClick={() => setReturnFormData(prev => ({ ...prev, transactionId: '' }))}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={returnFormData.returnDate}
                onChange={handleReturnInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-secondary"
            >
              Return Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBook;