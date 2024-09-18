import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
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

async function initStripe() {
  const stripe = await loadStripe(
   // "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
  
  "pk_test_51PzeGZRpYSF1JbLCFFiqsoNslDsJeq5X2cilYJNf9TKU8UKaAyYP873lsOOFrrkxz5H3JzFIktYxkKjXFC3p2wch00XgJ17EkV");
  //cart widget for display input for card no

  //document.addEventListener('DOMContentLoaded', () => {
  let cardElement = null;
  function mountWidget() {
    if (!cardElement) {
      const elements = stripe.elements();
      const cardElementStyle = {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          fontSmoothing: "antialiased",
          "::placeholder": {
            color: "#aab7c4",
          },
          ":focus": {
            color: "#303f9f",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      };

      cardElement = elements.create("card", {
        style: { cardElementStyle },
        hidePostalCode: true,
      });
      cardElement.mount("#card-element");
    }
  }
  function unmountWidget() {
    if (cardElement) {
      cardElement.unmount(); // Properly unmount the card element
      cardElement = null; // Reset the card element variable
    }
  }
  const paymentType = document.querySelector("#paymentType");
  if(!paymentType){
    return;
  }
  paymentType.addEventListener("change", (e) => {
    const cardDiv = document.getElementById("main_card");

    if (e.target.value === "card") {
      // If "Pay with Card" is selected, show the card element
      if (!cardElement) {
        // Ensure the widget is not already mounted
        mountWidget();
      }
      cardDiv.style.display = "block"; // Show card widget

      // Add the class to style main_card when card is selected
      cardDiv.classList.add("w-1/2", "ml-auto", "bg-white", "border-gray-400");
    } else {
      // If "Cash on Delivery" is selected, hide the card element
      if (cardElement) {
        unmountWidget();
        cardDiv.style.display = "none"; // Hide card widget
        // Remove the class when card is not selected
        cardDiv.classList.remove(
          "w-1/2",
          "ml-auto",
          "bg-white",
          "border-gray-400"
        );
      }
    }
  });

  // Ensure card element is hidden initially if paymentType is not "card"
  document.addEventListener("DOMContentLoaded", () => {
    if (paymentType.value !== "card") {
      document.getElementById("main_card").style.display = "none";
    }
  });

  //ajax call for order now on cart
//   document.addEventListener("DOMContentLoaded", () => {
//     const paymentForm = document.querySelector("#payment-form");
//     if (paymentForm) {
//       paymentForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let formData = new FormData(paymentForm);
//         //console.log(formData.entries());
//         let formObject = {};
//         for (let [key, value] of formData.entries()) {
//           formObject[key] = value;
//         }
//          stripe
//           .createToken(cardElement)
//           .then((result) => {
//             console.log(result);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       });
//     } else {
//       console.error("Payment form not found");
//     }
//   });
const paymentForm = document.querySelector("#payment-form");
paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
  
    if (paymentType.value === "cod") {
      placeOrder(formObject);
     // console.log(formObject);
      
    } else {
      if (cardElement) {
        //data of card no,address and phone no is taken now let's get card no verified by stripe and if verifies true , stripe will give us a token
        //after taking token only axios post req will be done (if pay eith card is selected)

        stripe.createToken(cardElement)
          .then((result) => {
            //console.log(result);
            if (result.error) {
              toastr.error(result.error.message);
              console.log(result.error) 
            } else {
              formObject.stripeToken = result.token.id;
              //console.log(result.token.id);
              console.log(formObject);
              placeOrder(formObject);
            }
          })
          .catch((err) => {
            toastr.error("Error creating Stripe token.");
          });
      } else {
        toastr.error("Card element is not properly mounted.");
      }
    }
  });
  
}

// document.addEventListener("DOMContentLoaded", () => {
//   // Ensure initStripe is called after the page is loaded
// });
export default initStripe;