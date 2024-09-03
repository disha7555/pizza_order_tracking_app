import axios from 'axios';
import toastr from 'toastr';  // Import Toastr for notification msg
import 'toastr/build/toastr.min.css';  // Import Toastr CSS

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
