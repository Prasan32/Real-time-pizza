const axios=require('axios')
import Noty from 'noty'
import {initAdmin} from './admin'

let addToCart=document.querySelectorAll('.add-to-cart')
let cartCounter=document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res=>{
        cartCounter.innerText=res.data.totalQty;
        new Noty({
            type:'success',
            timeout:1000,
            text:'Item added to the cart',
            progressBar:false,
            // layout:"centerRight"
        }).show();
    })
    .catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text:'Something went wrong!',
            progressBar:false,
            // layout:"centerRight"
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
       let pizza=JSON.parse(btn.dataset.pizza)
       updateCart(pizza)
    })
})

const alertMsg=document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}


initAdmin();