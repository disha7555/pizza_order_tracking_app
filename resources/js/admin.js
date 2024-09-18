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
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/5">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>

                    </td>
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/12">
                        ${order.customerId.name}
                    </td>
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/5">
                        ${order.address}
                    </td>
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/6">
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
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/12">
                        ${moment(order.createdAt).format('hh:mm A')}
                    </td>
                    <td class="border items-center border-gray-400 px-4 py-2 text-2xl sm:text-2xl md:text-3xl lg:text-xl justify-centerborder text-green-900 md:w-1/12">
                    ${order.paymentStatus?'paid':'not paid'}
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