import React, { useState } from 'react';
import fire from '../../fire.js';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();   

    const handleSubmit = (e) => {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            console.error('Incorrect username or password');
        });
    }
    return (
        <div>
        <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    autoFocus
                    required
                    onChange={({ target }) => setEmail(target.value)}
                    placeholder="Email"
                />
                <br />
                <input
                    type="password"
                    onChange={({ target}) => setPassword(target.value)}
                    placeholder="Password"
                />

                 <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <br />
                 <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="/forgot-password-TODO">password?</a>
                </p>
            </form>
        </div>
        
    )
};

export default Login