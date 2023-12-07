import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../services/userservice'

export default function Header({status, count}) {

  return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <Link to="/" className=" navbar-brand">
                    <img alt='' src={require('../assets/logo.png')} width="50" height="50"/><span style={{"color":"#4e1f30"}}>RENTFURLAX</span>
                </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {
                  !status && (<>
                    <li className="nav-item">
                      <Link to="/login" className=" navbar-brand">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/register" className=" navbar-brand">Register</Link>
                    </li>
                    </>
                  )
                  }
                  {status && <>
                    <li className="nav-item">
                    <Link to="/" className=" navbar-brand">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orders" className=" navbar-brand">Orders</Link>
                  </li>
                  <li className="nav-item">
                    <a href="/" className=" navbar-brand" onClick={logout}>Logout</a>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className=" navbar-brand me-auto">
                      <i className="fa fa-shopping-cart" style={{"fontSize":"24px"}}>
                        {count !==0 && count}
                        </i></Link>
                  </li>
                  </>}
                 
                  
                </ul>
                
              </div>
            </div>
          </nav>
  )
}
