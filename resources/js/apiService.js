import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { loadStripe } from "@stripe/stripe-js";


toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: false, 
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "0",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

export function placeOrder(formObject) {
    axios
    .post("/orders", formObject)
    .then((res) => {
      // Check if the response contains the message and display it using Toastr

      console.log(res.data);
      if (res.data.message) {
        toastr.success(res.data.message); // Display success message
        //console.log(result.error) 
      } else {
        toastr.error("Something went wrong!"); // Fallback error message
      }
      setTimeout(() => {
        window.location.href = "customer/orders";
        //console.log(res.data);
      }, 2000);
    })
    .catch((err) => {
      console.error(err);
      toastr.error("Order could not be placed. Please try again."); // Display error message on failure
    });
}