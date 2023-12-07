import React, { useEffect, useState } from 'react'
import { getAllOrdersPlaceByUser } from '../services/itemsservice'

export default function OrderPage() {
    const [orders, setOrders] = useState([])

    useEffect(()=>{
        getAllOrdersPlaceByUser()
        .then(data=>setOrders(data))
    },[])
  return (
    <div className="container mt-5 mb-5">
    {/* {JSON.stringify(cartItems)} */}
    <h3 className="text-center title mb-5">
     ORDERS PLACED
    </h3>
    { orders.length===0  && <h4>No orders placed yet</h4>}

    {orders && orders.length !== 0 &&(
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Invoice Id</th>
              <th scope="col">Order Date</th>
              <th scope="col">Amount </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.id}</td>
                  <td>{item.orderdate}</td>
                  <td>{item.invoiceamount}</td>
                  <td>{item.status}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  )
}
