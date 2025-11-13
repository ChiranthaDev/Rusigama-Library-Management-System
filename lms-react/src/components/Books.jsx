import React, { useState, useEffect } from 'react';
import '../styles/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    availableCopies: 1
  });

  // Sample book data
  const sampleBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', availableCopies: 3 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', availableCopies: 0 },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Dystopian', availableCopies: 2 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', category: 'Romance', availableCopies: 1 },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', category: 'Fiction', availableCopies: 4 },
    { id: 6, title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', category: 'Dystopian', availableCopies: 0 },
    { id: 7, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0-544-00341-5', category: 'Fantasy', availableCopies: 2 }
  ];

  // Get unique categories for filter dropdown
  const categories = [...new Set(sampleBooks.map(book => book.category))];

  useEffect(() => {
    // In a real app, this data would come from an API
    setBooks(sampleBooks);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBook = () => {
    setCurrentBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      availableCopies: 1
    });
    setShowAddForm(true);
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      availableCopies: book.availableCopies
    });
    setShowEditForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentBook) {
      // Edit existing book
      setBooks(prev => prev.map(book => 
        book.id === currentBook.id 
          ? { ...book, ...formData, availableCopies: parseInt(formData.availableCopies) }
          : book
      ));
    } else {
      // Add new book
      const newBook = {
        id: books.length + 1,
        ...formData,
        availableCopies: parseInt(formData.availableCopies)
      };
      setBooks(prev => [...prev, newBook]);
    }
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      availableCopies: 1
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = categoryFilter ? book.category === categoryFilter : true;
    
    const matchesAvailability = availabilityFilter 
      ? availabilityFilter === 'available' 
        ? book.availableCopies > 0 
        : book.availableCopies === 0
      : true;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Books Management</h2>
        <button 
          onClick={handleAddBook}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Book
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Availability</label>
            <select
              className="form-control"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Book Form Modal */}
      {(showAddForm || showEditForm) && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h3 className="form-title">{showEditForm ? 'Edit Book' : 'Add New Book'}</h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                }}
                className="form-close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Copies</label>
                  <input
                    type="number"
                    name="availableCopies"
                    min="0"
                    value={formData.availableCopies}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {showEditForm ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>
                  <span className="status-badge borrowed">
                    {book.category}
                  </span>
                </td>
                <td>
                  {book.availableCopies > 0 ? (
                    <span className="status-badge available">
                      <span className="status-dot"></span>
                      {book.availableCopies} copies
                    </span>
                  ) : (
                    <span className="status-badge unavailable">
                      <span className="status-dot"></span>
                      Not Available
                    </span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button 
                      onClick={() => handleEditBook(book)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBooks.length === 0 && (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>No books found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;