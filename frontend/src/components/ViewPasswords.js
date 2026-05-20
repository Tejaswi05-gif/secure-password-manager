import React from 'react';

function ViewPasswords({ passwords }) {
  return (
    <div className='box'>
      <h2>Saved Passwords</h2>

      <table border='1'>
        <thead>
          <tr>
            <th>Website</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>

        <tbody>
          {passwords.length === 0 ? (
            <tr>
              <td colSpan='3'>No passwords saved yet</td>
            </tr>
          ) : (
            passwords.map((item) => (
              <tr key={item._id}>
                <td>{item.website}</td>
                <td>{item.username}</td>
                <td>{item.password}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewPasswords;
