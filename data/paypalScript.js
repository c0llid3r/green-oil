export default function initPayPalButton() {
  paypal.Buttons({
    style: {
      // shape: 'rect',
      // color: 'gold',
      // layout: 'vertical',
      // label: 'paypal'
    },

    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{"amount":{"currency_code":"GBP","value":sendThisMuch}}]
      });
    },

    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name + '!');
      });
    },

    onError: function(err) {
      console.log(err);
    }
  }).render('#paypal-button-container');
}
initPayPalButton();