import React, { useState, Fragment } from 'react';
import fire from '../../fire.js';
import 'firebase/auth'
//import './Signup.css';

const Signup = () => {
  // User State
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    error: '',   
  });

  // OnChange function
  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };

  
  // Function to create a new user account in database 
  const handleSubmit = e => {
    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        // Add username to account
        result.user.updateProfile({
          displayName: user.username,
        });       
      })}     
 
//PREVIOUS WORKING CODE
{/* <input type="text" placeholder="Username" name="username" onChange={handleChange}/><br />
        <input type="text" placeholder="Email" name="email" onChange={handleChange}/><br />
        <input type="password" placeholder="Password" name="password" onChange={handleChange}/><br />
        <button type="submit">Sign Up</button> */}



  return (
    <Fragment>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}> 
        <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleChange}/>                </div>
               
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={handleChange}/>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="/Login">sign in?</a>
                </p>
      </form>
      {user.error && <h4>{user.error}</h4>}
    </Fragment>
  )
};

export default Signup;
