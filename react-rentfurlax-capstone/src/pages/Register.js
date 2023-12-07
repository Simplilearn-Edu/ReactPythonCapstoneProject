import React, { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../services/userservice";

const initialuser = {username:'', password1:'', fname:'', lname:'',address:'', phone:'', email:'' }
export default function Register() {

  const [user, setUser] = useState(initialuser);
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const handleChange = (event) => {
    setError('')
    let name = event.target.name;
    let value = event.target.value;
    setUser({...user,[name]:value})
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if(user.username === '' || 
    user.password1 === ''|| 
    user.fname==='' || 
    user.lname==='' || 
    user.phone===''||user.email==='' || user.address===''){
      setError('All fields need to be filled...')
    }
    else{
      setError('')
    const data ={
      phone:user.phone, address:user.address, 
      user:{
        username:user.username,
        first_name:user.fname,
        last_name:user.lname,
        email:user.email,
        password:user.password1
      }
    }
  
      console.log(data)
      registerUser(data)
        .then((message) => {
          console.log(message);
          navigate('/login')
        })
        .catch(err=>{
          console.log('error', err);
          setError('Please contact admin!!');
        })
        ;
      }
    
  };


  return (
    <div className="container login">
    <h1>Please Register</h1>
    <span className="error">{error}</span>
    <form method="post" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">User Name</label>
         <input type="text" className="form-control" name="username" onChange={handleChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">First Name</label>
         <input type="text" className="form-control" name="fname"  onChange={handleChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">Last Name</label>
         <input type="text" className="form-control" name="lname"  onChange={handleChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">Address</label>
         <textarea className="form-control" name="address" row="4"  onChange={handleChange}></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">Email</label>
         <input type="email" className="form-control" name="email"  onChange={handleChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">Password</label>
        <input type="password" className="form-control" name="password1"  onChange={handleChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputid1" className="form-label">Phone</label>
         <input type="text" className="form-control" name="phone" onChange={handleChange} />
      </div>
      <button className="btn bgpurple cpink" type="submit">REGISTER</button>
    </form> 
  </div>
  )
}
