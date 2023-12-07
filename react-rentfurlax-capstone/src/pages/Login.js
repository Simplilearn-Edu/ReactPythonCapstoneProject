import React, {  useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './Login.css'
import { success, validateUser } from "../services/userservice";

export default function Login({status}) {
  const [username, setUsername] = useState("shalini");
  const [password, setPassword] = useState("sha12345");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // useEffect(()=>
  // setCookie())

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
        default:
          break;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
   
      validateUser(username,password)
      .then((message) => {
        console.log(message);
        if(message === success){
          sessionStorage.setItem('user',username);
          setErrorMsg('')
          status(true)
          navigate('/')

        }
      })
        .catch(err=>{
          setErrorMsg('Invalid Credentials');
          status(false);
        });
  };
  return (
    <div className="container">
      <h2 className="sign">Please Log In</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        
        <span className="error">{errorMsg}</span>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="username"
            value={username}
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div className="mb-5">
        <Link to="/register" className="underlineHover">
          Create Account
        </Link>
      </div>
    </div>
  );
}
