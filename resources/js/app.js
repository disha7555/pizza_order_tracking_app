import axios from 'axios';
import toastr from 'toastr';  // Import Toastr for notification msg
import 'toastr/build/toastr.min.css';  // Import Toastr CSS
import initAdmin from './admin';
import moment from 'moment';
// Configure Toastr to hide messages after 1 second
toastr.options = {
    "closeButton": true,    
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",  // Time after which the message will disappear (1 second)
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

let cartCounter=document.querySelector('#cartCounter');

function updateCart(pizza){
axios.post('/update-cart',pizza)
.then(res=>{
    console.log(res);
    cartCounter.innerText=res.data.totalQty;
    toastr.success('Item added to the cart');

})
.catch(error => {
    console.error(error);
    // Show error notification
    toastr.error('Something went wrong');
});

};
// document.querySelectorAll('.add-to-cart').forEach(btn => {
//     btn.addEventListener('click', function(e) {
//         const pizza = JSON.parse(btn.dataset.pizza);
//         console.log(pizza); // Now `pizzaData` is a JavaScript object
//         updateCart(pizza);
//     });
// });
// //this.getAttribute('data-pizza')

//document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const pizza = JSON.parse(btn.dataset.pizza);
           // console.log(pizza); // Now `pizzaData` is a JavaScript object
            updateCart(pizza);
        });
    });
//});






// document.addEventListener('DOMContentLoaded', () => {
//     // Extract flash messages
//     const successMessage = '<%= flash.success %>';
//     const errorMessage = '<%= flash.error %>';

//       // Show success message if present
//       if (successMessage) {
//         toastr.success(successMessage);
//     }

//     // Show error message if present
//     if (errorMessage) {
//         toastr.error(errorMessage);
//     }
// });

// Handle Toastr messages from flash
document.addEventListener('DOMContentLoaded', () => {
    // Extract flash messages from a hidden element in the layout
    const flashMessages = document.getElementById('flash-messages');
    if (flashMessages) {
        const messages = JSON.parse(flashMessages.dataset.messages);

        // Show success message if present
        if (messages.success) {
            toastr.success(messages.success);
        }

        // Show error message if present
        if (messages.error) {
            toastr.error(messages.error);
        }
    }
});

initAdmin();


//change order status
let statuses=document.querySelectorAll('.status_line');
let hiddenInput=document.querySelector('#hiddenInput');
let order=hiddenInput?hiddenInput.value:null;
order=JSON.parse(order);

let time=document.createElement('small');
//console.log(order);
function updateStatus(order) {
    let stepcompleted=true;
   // console.log(statuses);
    statuses.forEach((status)=>{
        let dataProp=status.dataset.status;
       // console.log(status);
        if(stepcompleted){
            status.classList.add('step-completed');
        }
        if(dataProp===order.status){
            stepcompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if( status.nextElementSibling){
            status.nextElementSibling.classList.add('current');
        }}
    })
}
updateStatus(order);

//Socket (client side)
let socket=io();
//join
//client sends msg named join to server with data i.e. order id which is unique
//server of socket is in server.js
if(order){
    socket.emit('join',`order_${order._id}`)
}
//listening to the event 
socket.on('orderUpdated',(data)=>{
    const updatedOrder={...order};
    updatedOrder.updatedAt=moment().format();
    updatedOrder.status=data.status;
    updateStatus(updatedOrder);
    toastr.success(messages.success);
    console.log(data)
})