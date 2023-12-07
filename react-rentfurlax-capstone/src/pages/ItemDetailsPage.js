import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getItemDetailsById } from "../services/itemsservice";
import { isUserLoggedIn } from "../services/userservice";

export default function ItemDetailsPage({ onAdd , existItem, onloadPage}) {
 
  const [item, setItem] = useState([]);
  const [tenure, setTenure] = useState({months:3})
  const [price, setPrice] = useState(0)
  const [rentalid, setRentalid] = useState(0)

  let params = useParams();
  let id = params["id"];
  let navigate = useNavigate();

  useEffect(() => {
    getItemDetailsById(id).then((data) => {
      console.log(data);
      setItem(data);
      setPrice(data.rentaloptions[0].ratepermonth)
      onloadPage(false)
      setRentalid(data.rentaloptions[0].id)
    });
  }, [id, onloadPage]);

  const addToCart = (event, item) => {
    event.preventDefault();
    if (!isUserLoggedIn()) {
      alert("Please login");
      navigate("/login");
    } else {
      const cartitem = {
        id:item.id,name:item.name, tenure:tenure.months, 
        imageurl:item.imageurl,qty:item.qty, price:price,
        deldate:getDate(item.noofdays), rentalid:rentalid
      }
      console.log("item details ", id);
      onAdd(cartitem);
    }
  };

  const getDate = (noofdays) => {
    let last = new Date(Date.now() + noofdays * 24 * 60 * 60 * 1000)
    return last.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
   
    // var day = last.getDate();
    // var month = last.getMonth() + 1;
    // var year = last.getFullYear();
    // return month+" "+day+", "+year;
  };
  const handleChange =(event, p, id)=>{
    setTenure(prev=> ({...prev,months:parseInt(event.target.value)}));
    setPrice(p)
    setRentalid(id)
  }
  return (
    <div className="container mb-3">
      {item && (
        <form action="/addTocart/{{furniture.category.type}}/{{furniture.id}}">
          {/* {JSON.stringify(item)} */}
          {/* <p>{tenure.months}: {price}</p> */}
          <div className="row mt-5">
            <div className="col-md-6">
            {existItem && <p style={{'color':'red'}}>Item already in the cart</p>}
              <p>
                <img alt="" src={item.imageurl} className="img-fluid" />
              </p>
              <p>
                <button
                  id="cart"
                  onClick={(event) => addToCart(event, item)}
                  className="btn bgpurple cpink"
                >
                  Add To Cart
                </button>
              </p>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-4 mt-5">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Size : {item.size}</p>
              <p>Color: {item.color}</p>
              {item.rentaloptions &&
                item.rentaloptions.map((rental, index) => (
                  <React.Fragment key={index}>
                    <p>
                      <input
                        type="radio"
                        name="rental"
                        checked={rental.tenure === parseInt(tenure.months)}
                        value={rental.tenure}
                        onChange={(event)=>handleChange(event, rental.ratepermonth, rental.id)}
                      />{" "}
                      {rental.tenure} months : {rental.ratepermonth} per month{" "}
                    </p>
                  </React.Fragment>
                ))}
              <p>Condition: {item.condition}</p>
              <p>Delivered By: {getDate(item.noofdays)}</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
