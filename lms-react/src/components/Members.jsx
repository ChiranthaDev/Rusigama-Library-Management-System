import React, { useState, useEffect } from 'react';
import '../styles/Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipDate: ''
  });

  // Sample member data with updated names and emails
  const sampleMembers = [
    { id: 1, name: 'Chirantha J Ellepola', email: 'chirantha.ellepola@example.com', phone: '123-456-7890', membershipDate: '2023-01-15' },
    { id: 2, name: 'Lakshitha Dinesh', email: 'lakshitha.dinesh@example.com', phone: '098-765-4321', membershipDate: '2023-02-20' },
    { id: 3, name: 'Nadeesha Akalanka', email: 'nadeesha.akalanka@example.com', phone: '555-123-4567', membershipDate: '2023-03-10' },
    { id: 4, name: 'Kavishka Fonseka', email: 'kavishka.fonseka@example.com', phone: '444-987-6543', membershipDate: '2023-04-05' },
    { id: 5, name: 'Nimesh Harsha', email: 'nimesh.harsha@example.com', phone: '333-555-7777', membershipDate: '2023-05-12' },
    { id: 6, name: 'Harshana Prabhath', email: 'harshana.prabhath@example.com', phone: '222-444-6666', membershipDate: '2023-06-18' },
    { id: 7, name: 'Dinura Weerasingha', email: 'dinura.weerasingha@example.com', phone: '111-333-5555', membershipDate: '2023-07-22' }
  ];

  useEffect(() => {
    // In a real app, this data would come from an API
    setMembers(sampleMembers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMember = () => {
    setCurrentMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipDate: ''
    });
    setShowAddForm(true);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipDate: member.membershipDate
    });
    setShowEditForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMember) {
      // Edit existing member
      setMembers(prev => prev.map(member => 
        member.id === currentMember.id 
          ? { ...member, ...formData }
          : member
      ));
    } else {
      // Add new member
      const newMember = {
        id: members.length + 1,
        ...formData
      };
      setMembers(prev => [...prev, newMember]);
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipDate: ''
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = (id) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    
    const matchesDate = dateFilter ? member.membershipDate.includes(dateFilter) : true;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Members Management</h2>
        <button 
          onClick={handleAddMember}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Membership Date</label>
            <input
              type="text"
              placeholder="Filter by date (YYYY-MM-DD)"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Member Form Modal */}
      {(showAddForm || showEditForm) && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h3 className="form-title">{showEditForm ? 'Edit Member' : 'Add New Member'}</h3>
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
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Membership Date</label>
                  <input
                    type="date"
                    name="membershipDate"
                    value={formData.membershipDate}
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
                  {showEditForm ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.membershipDate}</td>
                <td>
                  <div className="btn-group">
                    <button 
                      onClick={() => handleEditMember(member)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
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
        {filteredMembers.length === 0 && (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No members found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;