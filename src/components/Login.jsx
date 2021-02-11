import React, {useState} from 'react';
import { Link } from '@reach/router';
import {auth} from '../firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Sign in user with firebase sign in method
   const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
      // TEST
      console.error("Error signing in with password and email", error);
    });
  };

      const onChangeHandler = (event) => {
          const {name, value} = event.currentTarget;
        // If email input set email state
          if(name === 'email') {
              setEmail(value);
          }
          // If password input, set password state
          else if(name === 'password'){
            setPassword(value);
          }
      };

  return (
    <div className="mt-8">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        {error !== null && <div className = "py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}
        <form className="">
          <label htmlFor="email" className="block">
            Email:
          </label>
          <input
            type="email"
            className="my-1 p-1 w-full"
            name="email"
            value = {email}
            placeholder="Email"
            id="email"
            onChange = {(e) => onChangeHandler(e)}
          />
          <label htmlFor="password" className="block">
            Password:
          </label>
          <input
            type="password"
            className="mt-1 mb-3 p-1 w-full"
            name="password"
            value = {password}
            placeholder="Password"
            id="password"
            onChange = {(e) => onChangeHandler(e)}
          />
          <button className="bg-green-400 hover:bg-green-500 w-full py-2 text-white" onClick = {(e) => {signInWithEmailAndPasswordHandler(e, email, password)}}>
            Sign in
          </button>
        </form>
        <p className="text-center my-3">
          Don't have an account?
          <Link to="register" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>     
        </p>
      </div>
    </div>
  );
};
export default Login;