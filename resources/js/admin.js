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
                    <td class="border px-1 py-1 md:px-2 md:py-2 lg:px-4 lg:py-2 lg:w-32 text-green-900 md:w-full">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>

                    </td>
                    <td class="border px-1 py-1  md:px-2 md:py-2 lg:px-2 lg:py-2 lg:w-32 text-green-900 md:w-full">
                        ${order.customerId.name}
                    </td>
                    <td class="border px-1 py-1 md:px-2 md:py-2 lg:px-2 lg:py-2 lg:w-32 text-green-900 md:w-full">
                        ${order.address}
                    </td>
                    <td class="border md:px-2 md:py-2 lg:px-2 lg:py-2 h-10 w-4 w-full md:w-full lg:w-40 md:px-3">
                        <div class="inline-block relative w-full lg:w-32 md:w-full">
                            <form action="/admin/order/status" method="post" class="h-5 w-full">
                            
                            <input type="hidden" name="orderId" value="${order._id}">

                                <select name="status" onchange="this.form.submit()" class="block w-full md:w-24 lg:w-28 xl:w-40  bg-white border border-gray-400" >
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
                    <td class="border px-1 py-1 lg:px-2 lg:py-2 lg:w-32 md:px-2 md:py-2 md:w-32">
                        ${moment(order.createdAt).format('hh:mm A')}
                    </td>
                </tr>
            `}).join('')
         }

        socket.on('orderPlaced',(order)=>{
            toastr.success("New order updated");
            orders.unshift(order);
            //orderTableBody.innerHTML='';
            orderTableBody.innerHTML=generateMarkup(orders);
        })
   

}
export default initAdmin;