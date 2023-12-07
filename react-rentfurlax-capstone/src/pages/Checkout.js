import React from 'react'

export default function Checkout({order}) {
  return (
    <div class="container mt-5">
        <h1> Order Confirmed for {order.customer}</h1>
        <p>Please take a printout of this bill</p>
        <h4>Order Id: {order.id}</h4>
        <h4>Delivery Address: {order.deliveryaddress}</h4>
        <h4>Order Status: {order.status}</h4>
        <h4>Dated: {order.orderdate}</h4>
    </div>
  )
}
