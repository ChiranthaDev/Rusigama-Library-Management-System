import React, { useState, useEffect, useRef } from 'react';
import '../styles/Transactions.css';

const BorrowBook = ({ books, members, onBorrowSubmit, onClose }) => {
  const [borrowFormData, setBorrowFormData] = useState({
    memberId: '',
    bookId: '',
    borrowDate: '',
    dueDate: ''
  });
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const memberDropdownRef = useRef(null);
  const bookDropdownRef = useRef(null);

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target)) {
        setIsMemberDropdownOpen(false);
      }
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target)) {
        setIsBookDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBorrowInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBorrowSubmit = (e) => {
    e.preventDefault();
    onBorrowSubmit(borrowFormData);
    setBorrowFormData({
      memberId: '',
      bookId: '',
      borrowDate: '',
      dueDate: ''
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h3 className="form-title">Borrow Book</h3>
          <button 
            onClick={onClose}
            className="form-close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleBorrowSubmit}>
          <div className="form-body">
            <div className="form-group">
              <label className="form-label">Member</label>
              <div className="search-dropdown-container" ref={memberDropdownRef}>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="form-control search-input"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    onFocus={() => setIsMemberDropdownOpen(true)}
                  />
                  {memberSearch && (
                    <button 
                      type="button" 
                      className="search-clear-btn"
                      onClick={() => setMemberSearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {isMemberDropdownOpen && (
                  <div className="search-dropdown">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => (
                        <div 
                          key={member.id} 
                          className={`search-dropdown-item ${borrowFormData.memberId === member.id ? 'selected' : ''}`}
                          onClick={() => {
                            setBorrowFormData(prev => ({ ...prev, memberId: member.id }));
                            setIsMemberDropdownOpen(false);
                            setMemberSearch('');
                          }}
                        >
                          {member.name}
                        </div>
                      ))
                    ) : (
                      <div className="search-dropdown-item disabled">
                        {memberSearch ? 'No members found' : 'No members available'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="search-info">
                {memberSearch && `${filteredMembers.length} of ${members.length} members shown`}
              </div>
              {borrowFormData.memberId && (
                <div className="selected-item">
                  Selected: {members.find(m => m.id === parseInt(borrowFormData.memberId))?.name}
                  <button 
                    type="button" 
                    className="clear-selection-btn"
                    onClick={() => setBorrowFormData(prev => ({ ...prev, memberId: '' }))}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Book</label>
              <div className="search-dropdown-container" ref={bookDropdownRef}>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="form-control search-input"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    onFocus={() => setIsBookDropdownOpen(true)}
                  />
                  {bookSearch && (
                    <button 
                      type="button" 
                      className="search-clear-btn"
                      onClick={() => setBookSearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {isBookDropdownOpen && (
                  <div className="search-dropdown">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map(book => (
                        <div 
                          key={book.id} 
                          className={`search-dropdown-item ${borrowFormData.bookId === book.id ? 'selected' : ''}`}
                          onClick={() => {
                            setBorrowFormData(prev => ({ ...prev, bookId: book.id }));
                            setIsBookDropdownOpen(false);
                            setBookSearch('');
                          }}
                        >
                          {book.title} by {book.author}
                        </div>
                      ))
                    ) : (
                      <div className="search-dropdown-item disabled">
                        {bookSearch ? 'No books found' : 'No books available'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="search-info">
                {bookSearch && `${filteredBooks.length} of ${books.length} books shown`}
              </div>
              {borrowFormData.bookId && (
                <div className="selected-item">
                  Selected: {books.find(b => b.id === parseInt(borrowFormData.bookId))?.title} by {books.find(b => b.id === parseInt(borrowFormData.bookId))?.author}
                  <button 
                    type="button" 
                    className="clear-selection-btn"
                    onClick={() => setBorrowFormData(prev => ({ ...prev, bookId: '' }))}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Borrow Date</label>
              <input
                type="date"
                name="borrowDate"
                value={borrowFormData.borrowDate}
                onChange={handleBorrowInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={borrowFormData.dueDate}
                onChange={handleBorrowInputChange}
                className="form-control"
                required
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
              className="btn btn-primary"
            >
              Borrow Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowBook;