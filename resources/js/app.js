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

//perfect with refresh//
//console.log(order);
function updateStatus(order) {
    let stepcompleted=true;
    statuses.forEach((status) => {
        let dataProp1 = status.dataset.status;
        if (dataProp1 === 'order_placed') {
            status.classList.add('current');
        }

        })
    // const defaultStatusElement = document.querySelector('.status_line[data-status="order_placed"]');
    // if (order.status === 'order_placed') {
    //     defaultStatusElement.classList.add('current');
    // }
   // console.log(statuses);
   let defaultclass=document.getElementById('order_placed');
    statuses.forEach((status)=>{
        let dataProp=status.dataset.status;
       // console.log(status);
        if(stepcompleted){
            status.classList.add('step-completed');
        }
        if(dataProp===order.status){
            stepcompleted=false;
            defaultclass.classList.remove('current');
            time.innerText=moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            status.classList.add('current');
          
            if (status.previousElementSibling) {
                status.previousElementSibling.classList.add('step-completed');
                status.previousElementSibling.classList.remove('current');
            }
            if( status.nextElementSibling){
            status.nextElementSibling.classList.add('');
        }
       

        }
    });
    setTimeout(() => {
        statuses.forEach((status) => status.offsetHeight);  // Trigger reflow
    }, 100);
}






// // Initialize the statuses
// let statuses = document.querySelectorAll('.status_line');
// let hiddenInput = document.querySelector('#hiddenInput');
// let order = hiddenInput ? hiddenInput.value : null;
// order = JSON.parse(order);

// let time = document.createElement('small');

// // Update status function
// function updateStatus(order) {
//     let stepcompleted = true;
   
//     // const defaultStatusElement = document.querySelector('.status_line[data-status="order_placed"]');
//     // console.log(defaultStatusElement);
//     statuses.forEach((status) => {
//         let dataProp = status.dataset.status;

//         // Apply step-completed class to all previous steps
//         if (stepcompleted) {
//             status.classList.add('step-completed');
//         }

//         // Check if the current step matches the order status
//         if (dataProp === order.status) {
//             stepcompleted = false;

//             // Remove 'current' from order_placed if it's not the current status
//             if (order.status !== 'order_placed') {
//                 defaultStatusElement.classList.remove('current');
//             }

//             // Set 'current' class on the current status
//             status.classList.add('current');
//             time.innerText = moment(order.updatedAt).format('hh:mm A');
//             status.appendChild(time);

//             // Mark the previous status as step-completed and remove 'current'
//             if (status.previousElementSibling) {
//                 status.previousElementSibling.classList.add('step-completed');
//                 status.previousElementSibling.classList.remove('current');
//             }

//         } else {
//             // Remove 'current' class for all other statuses
//             status.classList.remove('current');
//         }
//     });

//     // Default behavior: If order status is 'order_placed', mark it as 'current'
//     if (order.status === 'order_placed') {
//         defaultStatusElement.classList.add('current');
//     }

//     // Trigger reflow to ensure styles are applied
//     setTimeout(() => {
//         statuses.forEach((status) => status.offsetHeight); // Trigger reflow
//     }, 100);
// }



















































































// function updateStatus(order) {
//     let stepcompleted = true;
//     statuses.forEach((status) => {
//         let dataProp = status.dataset.status;
//         if (stepcompleted) {
//             status.classList.add('step-completed');
//         }
//         if (dataProp === order.status) {
//             stepcompleted = false;
//             time.innerText = moment(order.updatedAt).format('hh:mm A');
//             status.appendChild(time);
//             status.classList.add('current');
//         }
//     });
//     // Force a re-render after the status update
//     setTimeout(() => {
//         statuses.forEach((status) => status.offsetHeight);  // Trigger reflow
//     }, 100);
// }



























// function updateStatus(order) {
//     let stepcompleted = true;
//     statuses.forEach((status) => {
//         let dataProp = status.dataset.status;

//         if (stepcompleted) {
//             status.classList.add('step-completed');
//         }

//         if (dataProp === order.status) {
//             stepcompleted = false; // Stop adding step-completed class
//             time.innerText = moment(order.updatedAt).format('hh:mm A');
//             status.appendChild(time);
//             status.classList.add('current'); // Ensure only the current status gets this class

//             // Ensure only the current and previous statuses are marked
//             if (status.nextElementSibling) {
//                 status.nextElementSibling.classList.remove('current');
//             }
//         } else {
//             status.classList.remove('current');
//         }
//     });
// }

// function updateStatus(order) {
//     let stepCompleted = false; // Track if previous steps should be completed

//     statuses.forEach((status) => {
//         let dataProp = status.dataset.status;

//         // Apply the step-completed class to previous steps
//         if (stepCompleted) {
//             status.classList.add('step-completed');
//         }

//         // If this status matches the current order status
//         if (dataProp === order.status) {
//             stepCompleted = true; // Previous statuses should be completed

//             // Update the time
//             time.innerText = moment(order.updatedAt).format('hh:mm A');
//             status.appendChild(time);

//             // Apply the current class to the current status
//             status.classList.add('current');
//         }
//     });

//     // Apply step-completed class to all statuses before the current one
//     statuses.forEach((status) => {
//         if (status.classList.contains('current')) {
//             // Continue applying step-completed to statuses before the current one
//             status.previousElementSibling?.classList.add('step-completed');
//         }
//     });
// }








// function updateStatus(order) {
//     let stepcompleted = true;

//     statuses.forEach((status) => {
//         let dataProp = status.dataset.status;

//         // Check if this status is the current status
//         if (dataProp === order.status) {
//             stepcompleted = false;  // This status is now current
//             status.classList.add('current');
//             time.innerText = moment(order.updatedAt).format('hh:mm A');
//             status.appendChild(time);
//         } else if (stepcompleted) {
//             // If stepcompleted is true, all previous statuses should have step-completed class
//             status.classList.add('step-completed');
//         } else {
//             // Once we find the current status, all subsequent statuses should not be step-completed
//             status.classList.remove('step-completed');
//         }
//     });
// }

// Apply default current class to order_placed if no status is set yet
// document.addEventListener('DOMContentLoaded', () => {
//     if (!order.status || order.status === 'order_placed') {
//         statuses.forEach((status) => {
//             if (status.dataset.status === 'order_placed') {
//                 status.classList.add('current');
//             } else {
//                 status.classList.remove('current', 'step-completed');
//             }
//         });
//     }
// });












// function updateStatus(order) {
//     const statusLines = document.querySelectorAll('.status_line');
//     const currentStatus = order.status; // Assuming the order object has a 'status' property

//     statusLines.forEach((statusLine) => {
//         const status = statusLine.getAttribute('data-status');

//         if (status === currentStatus) {
//             statusLine.classList.add('current');
//             statusLine.classList.remove('step-completed');
//         } else if (statusLines[Array.from(statusLines).indexOf(statusLine) - 1] &&
//                    statusLines[Array.from(statusLines).indexOf(statusLine) - 1].getAttribute('data-status') === currentStatus) {
//             // Apply 'step-completed' class to previous statuses
//             statusLine.classList.add('step-completed');
//             statusLine.classList.remove('current');
//         } else {
//             statusLine.classList.remove('current');
//             statusLine.classList.remove('step-completed');
//         }
//     });
// }

// Initial load
updateStatus(order);



//updateStatus(order);

//Socket (client side)
let socket=io();
//join
//client sends msg named join to server with data i.e. order id which is unique
//server of socket is in server.js
if(order){
    socket.emit('join',`order_${order._id}`)
}
//listening to the event 

// document.addEventListener('DOMContentLoaded', () => {
//     socket.on('orderUpdated',(data)=>{
//         const updatedOrder={...order};
//         updatedOrder.updatedAt=moment().format();
//         updatedOrder.status=data.status;
//         updateStatus(updatedOrder);
//         toastr.success("Order status updated");
//         console.log(data)
//     })
// });

document.addEventListener('DOMContentLoaded', () => {
    socket.on('orderUpdated', (data) => {
        const updatedOrder = {...order};
        updatedOrder.updatedAt = moment().format();
        updatedOrder.status = data.status;
        updateStatus(updatedOrder);
        toastr.success("Order status updated");
    });
});
