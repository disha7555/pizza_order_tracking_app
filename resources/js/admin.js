import moment from "moment";
import axios from "axios";
import toastr from 'toastr';
import { Socket } from "socket.io";
function initAdmin(socket) {

    const orderTableBody=document.querySelector('#orderTableBody');
    let orders=[];
    let markup;
    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data;

        // Check if this is an array or something else
    // Ensure res.data is an array
    //orders = Array.isArray(res.data) ? res.data : [];
    //orders = Array.isArray(res.data) ? res.data : Object.values(res.data);


        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup;
    }).catch(err => { console.log(err) });
    


function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems.map((menuItem) => {
        return `<p>${menuItem.item.name} - ${menuItem.qty} pcs</p>`;
    }).join('');
    
}


        function generateMarkup(orders){

            return orders.map(order=>{
                return `
                <tr>
                    <td class="border px-4 py-2 text-green-900">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>

                    </td>
                    <td class="border px-4 py-2 text-green-900">
                        ${order.customerId.name}
                    </td>
                    <td class="border px-4 py-2 text-green-900">
                        ${order.address}
                    </td>
                    <td class="border px-4 py-2">
                        <div class="inline-block relative w-64">
                            <form action="/admin/order/status" method="post">
                            
                            <input type="hidden" name="orderId" value="${order._id}">

                                <select name="status" onchange="this.form.submit()" class="block w-full bg-white border border-gray-400" >
                              <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                                
                                </select>
                                
                            </input>
                            </form>
                           

                        </div>
                      
                    </td>
                    <td class="border px-4 py-2">
                        ${moment(order.createdAt).format('hh:mm A')}
                    </td>
                </tr>
            `}).join('')
        }
        //socket
       // let socket=io();

        socket.on('orderPlaced',(order)=>{
            toastr.success("New order updated");
            orders.unshift(order);
            //orderTableBody.innerHTML='';
            orderTableBody.innerHTML=generateMarkup(orders);
        })
   

}
export default initAdmin;