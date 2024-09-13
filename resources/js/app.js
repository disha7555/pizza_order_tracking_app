import axios from 'axios';
import toastr from 'toastr';  
import 'toastr/build/toastr.min.css';
import initAdmin from './admin';
import moment from 'moment';
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
    "timeOut": "2000",  
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
    toastr.error('Something went wrong');
});

};
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const pizza = JSON.parse(btn.dataset.pizza);
            updateCart(pizza);
        });
    });
document.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.getElementById('flash-messages');
    if (flashMessages) {
        const messages = JSON.parse(flashMessages.dataset.messages);
        if (messages.success) {
            toastr.success(messages.success);
        }
        if (messages.error) {
            toastr.error(messages.error);
        }
    }
});

let statuses=document.querySelectorAll('.status_line');
let hiddenInput=document.querySelector('#hiddenInput');
let order=hiddenInput?hiddenInput.value:null;
order=JSON.parse(order);

let time=document.createElement('small');
function updateStatus(order) {
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    });

    let stepcompleted=true;
    statuses.forEach((status) => {
        let dataProp1 = status.dataset.status;
        if (dataProp1 === 'order_placed') {
            status.classList.add('current');
        }
        })
   let defaultclass=document.getElementById('order_placed');
    statuses.forEach((status)=>{
        let dataProp=status.dataset.status;
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
             }
    });
    setTimeout(() => {
        statuses.forEach((status) => status.offsetHeight); 
    }, 100);
}
updateStatus(order);
let socket;
document.addEventListener('DOMContentLoaded', () => {
    socket=io();
   if(order){
        socket.emit('join',`order_${order._id}`)
    }
    
    let adminAreaPath=window.location.pathname;
       if(adminAreaPath.includes('admin')){
        initAdmin(socket);
        socket.emit('join','adminRoom')
    }
    });
document.addEventListener('DOMContentLoaded', () => {
    socket.on('orderUpdated', (data) => {
        const updatedOrder = {...order};
        updatedOrder.updatedAt = moment().format();
        updatedOrder.status = data.status;
        updateStatus(updatedOrder);
        toastr.success("Order status updated");
    });
});
