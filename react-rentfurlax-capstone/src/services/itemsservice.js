export async function getAllItemsByCategory(category)
{
    let resp = await fetch(`http://localhost:8000/furniture/${category}`)
     let items = await resp.json();
    return items;
}

export async function getItemDetailsById(id){
    let resp = await fetch(`http://localhost:8000/item/${id}`)
    let item = await resp.json();
    return item;
}
export async function createInvoice(invoice){

    let response = await fetch("http://localhost:8000/invoice/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
    let resp = await response.json()
    console.log(resp);
    return resp;
}

export async function getAllOrdersPlaceByUser(){
    let resp = await fetch(`http://localhost:8000/invoice/${sessionStorage.getItem('user')}`)
    let item = await resp.json();
    console.log(item)
    return item;
}