import React from "react";
import { Link } from "react-router-dom";
import { checkout } from "../services/itemsservice";

export default function CartPage({ cartItems , checkout}) {

    const handleCheckOut = (event)=>{
        event.preventDefault();
        checkout()
    }

  return (
    <div className="container mt-5 mb-5">
      {/* {JSON.stringify(cartItems)} */}
      <h3 className="text-center title mb-5">
       CART ITEMS
      </h3>
      {cartItems && cartItems.length === 0 && <h4>No items in cart yet</h4>}

      {cartItems && cartItems.length !== 0 &&(
        <div className="container">
            <p class="text-right"><button  id="cart" onClick={handleCheckOut} className="btn bgpurple cpink">Checkout</button></p>
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Product</th>
                <th scope="col">Delivery Date</th>
                <th scope="col">Tenure</th>
                <th scope="col">Price</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <th scope="row"><img className="img-fluid" width={200} height={200} src={item.imageurl}/></th>
                    <td>{item.name}</td>
                    <td>{item.deldate}</td>
                    <td>{item.tenure} months</td>
                    <td>{item.price}/- month</td>
                    <td>{item.price * item.tenure}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
