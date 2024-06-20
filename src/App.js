import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    email: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({});
  const [submittedForms, setSubmittedForms] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://user-form-project-1.onrender.com');
      setSubmittedForms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear();
    if (age < 18) newErrors.date_of_birth = 'You must be at least 18 years old';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await axios.post('https://user-form-project-1.onrender.com', formData);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="App">
      <h1>User Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
          {errors.date_of_birth && <span>{errors.date_of_birth}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <h2>Submitted Forms</h2>
      <ul>
        {submittedForms.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
