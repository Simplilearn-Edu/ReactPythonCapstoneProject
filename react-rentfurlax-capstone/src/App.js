import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ItemsPage from './pages/ItemsPage'
import ItemDetailsPage from "./pages/ItemDetailsPage";
import { isUserLoggedIn } from "./services/userservice";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import { checkout, createInvoice } from "./services/itemsservice";
import OrderPage from "./pages/OrderPage";
function App() {
  
  const [status, setStatus] = useState(false)
  const [existItem, setExistItem] = useState(false)
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState()
  let navigate = useNavigate()
  const onAdd = (product) => {
    console.log(product)
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setExistItem(true)
    } else {
      setExistItem(false)
      let newCartItem = [...cartItems, { ...product, qty: 1 }]
      localStorage.setItem('cart',JSON.stringify(newCartItem));
      setCartItems(newCartItem);
     
    } 
  };
  useEffect(()=>{
    console.log('status', status)
    
    if(isUserLoggedIn()){
     setStatus(true)
     let cartdata = localStorage.getItem('cart');
     if(cartdata){
      setCartItems(JSON.parse(cartdata))
     } 
    }
   
  },[status])
  //[{"id":4,"name":"Dining Table 4 seater","tenure":9,"imageurl":"https://cdn.rentickle.com/media/catalog/product/cache/3/thumbnail/1024x576/b58515f018eb873dafa430b6f9ae0c1e/4/_/4_seater_product.png",
  //"qty":1,"price":1080,"deldate":"11 Dec 2023","rentalid":15}]
  const checkout = ()=>{
    let invoice = {customer:{username:sessionStorage.getItem('user')}, lineitem:[]}
    
    cartItems.forEach(item=>{
      
      invoice['lineitem'].push({quantity:item.qty, rentalOptions:item.rentalid})
      
    })
    console.log(invoice)
    createInvoice(invoice)
    .then(data => {
      console.log(data)
      setOrder(data)
      localStorage.removeItem('cart')
      setCartItems([])
      navigate('/checkout')
    })
  }
  return (
    <div>
      <Header status={status} count={cartItems.length}/>
       <Routes>
       <Route path='/' element={<Home/>}></Route>
       <Route path='/login' element={<Login status={setStatus}/>}></Route>
       <Route path='/register' element={<Register/>}></Route> 
       <Route path='/checkout' element={<Checkout order={order}/>}></Route> 
       <Route path='/orders' element={<OrderPage/>}></Route> 
       <Route path='/cart' element={<CartPage cartItems={cartItems} checkout={checkout}/>}></Route> 
       <Route path="/item/:category" element={<ItemsPage/>}></Route>
       <Route path="/item/:category/:id" element={<ItemDetailsPage onAdd={onAdd} existItem={existItem} onloadPage={setExistItem}/>}></Route>
       {/* <Route path='/' element={<Dashboard/>}>
         <Route index element={<Navigate to='/home'/>}></Route>
         <Route path='/home' element={<Home/>}></Route>
         <Route path='/profile' element={<Profile/>}></Route>
         <Route path='/settings' element={<Settings/>}></Route>
       </Route>
       */}
     </Routes>
     <Footer/>
    </div>
  );
}

export default App;
