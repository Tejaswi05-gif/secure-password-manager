import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function UserRegistration({ apiUrl }) {
  const initialFormData = {
    name: '',
    regno: '',
    marks: '',
    address: '',
    email: '',
    password: ''
  };

  const [formData, setFormData] = useState({
    ...initialFormData
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [analytics, setAnalytics] = useState({
    rangeCounts: [],
    sortedStudents: []
  });

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/students/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      setMessage('Unable to load student analytics');
    }
  }, [apiUrl]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    const name = formData.name.trim();
    const regno = formData.regno.trim();
    const marks = formData.marks.trim();
    const address = formData.address.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!regno) {
      newErrors.regno = 'Registration number is required';
    }

    if (!marks) {
      newErrors.marks = 'Marks are required';
    } else if (Number.isNaN(Number(marks))) {
      newErrors.marks = 'Marks must be numeric';
    }

    if (!address) {
      newErrors.address = 'Address is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }
    else {
      const studentData = {
        ...formData,
        name: formData.name.trim(),
        regno: formData.regno.trim(),
        marks: Number(formData.marks.trim()),
        address: formData.address.trim(),
        email: formData.email.trim()
      };

      console.log(studentData);

      try {
        await axios.post(`${apiUrl}/students`, {
          name: studentData.name,
          regno: studentData.regno,
          marks: studentData.marks,
          address: studentData.address,
          email: studentData.email
        });

        setMessage('Student registered successfully');
        await loadAnalytics();
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to save student details');
        return;
      }

      setFormData(initialFormData);
      setErrors({});
    }
  };

  return (
    <div className='box'>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className='error'>{errors.name}</p>}

        <input
          type='text'
          name='regno'
          placeholder='Registration Number'
          value={formData.regno}
          onChange={handleChange}
        />
        {errors.regno && <p className='error'>{errors.regno}</p>}

        <input
          type='text'
          name='marks'
          placeholder='Marks'
          value={formData.marks}
          onChange={handleChange}
        />
        {errors.marks && <p className='error'>{errors.marks}</p>}

        <input
          type='text'
          name='address'
          placeholder='Address'
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <p className='error'>{errors.address}</p>}

        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className='error'>{errors.email}</p>}

        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className='error'>{errors.password}</p>}

        <button>Submit</button>
      </form>

      {message && <p className='status'>{message}</p>}

      <div className='analytics'>
        <h3>Marks Range Analysis</h3>
        <table border='1'>
          <thead>
            <tr>
              <th>Marks Range</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {analytics.rangeCounts.length === 0 ? (
              <tr>
                <td colSpan='2'>No student data yet</td>
              </tr>
            ) : (
              analytics.rangeCounts.map((item) => (
                <tr key={item.range}>
                  <td>{item.range}</td>
                  <td>{item.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3>Students by Marks</h3>
        <table border='1'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {analytics.sortedStudents.length === 0 ? (
              <tr>
                <td colSpan='2'>No students registered yet</td>
              </tr>
            ) : (
              analytics.sortedStudents.map((student, index) => (
                <tr key={`${student.name}-${student.marks}-${index}`}>
                  <td>{student.name}</td>
                  <td>{student.marks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserRegistration;
