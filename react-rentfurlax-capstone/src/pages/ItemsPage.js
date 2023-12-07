import React, { useEffect, useState } from "react";
import {  useParams } from "react-router";
import { Link } from "react-router-dom";
import { getAllItemsByCategory } from "../services/itemsservice";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  let params = useParams();
  let category = params["category"];

  useEffect(() => {
    
    getAllItemsByCategory(category)
      .then((data) => {
        //console.log(data);
        setItems(data);
      });
  }, [category]);
  return (
    <div className="container m-5">
      <h3 className="text-center title mb-5">
        {category.toUpperCase()} Items On Rent
      </h3>
      {items.length === 0 && <p>No items added yet</p>}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {items &&
          items.map((item) => (
            <div className="col" key={item.id}>
              <div className="card" style={{ width: "18rem" }}>
                <img src={item.imageurl} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">
                    {item.name} - {item.size} size
                  </h5>
                  <p>{item.rentaloptions[0].tenure} months</p>
                  <p>{item.rentaloptions[0].ratepermonth} per month</p>
                  <Link to={`/item/${category}/${item.id}`} className="btn bgpurple cpink">Details</Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
