import axios from 'axios';
import toastr from 'toastr';  // Import Toastr for notification msg
import 'toastr/build/toastr.min.css';  // Import Toastr CSS
import initAdmin from './admin';
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


