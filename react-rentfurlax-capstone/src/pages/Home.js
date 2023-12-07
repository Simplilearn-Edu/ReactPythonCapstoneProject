import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
        <div className="container h-25 category">
    <h3 className="text-center title">Browse By Category</h3>
    <div className="row">
      <div className="col-md-4 mb-0 mt-4">
      <Link to="/item/bedroom"> <img alt="" src={require("../assets/bed.jpeg")} className="w-100 h-75 mx-auto d-block"/></Link>
            <p>Bedroom</p>
        </div>
        <div className="col-md-4 mb-0 mt-4">
        <Link to="item/living"><img alt="" src={require("../assets/dining.webp")} className="w-100 h-75 mx-auto d-block"/></Link>
            <p>Living Room</p>
        </div>
        <div className="col-md-4 mb-0 mt-4">
        <Link to="item/study"> <img alt="" src={require("../assets/table.jpeg")} className="w-100 h-75 mx-auto d-block"/></Link>
            <p>Study</p>
        </div>
    </div>
</div>
    </div>
  )
}
