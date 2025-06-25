const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AXgXHT5v-I609_1GjfTAZiZKOQQnB4q0kl6lhc_PRtNORN9wY-mcfIf6NG_9grkbWWUhn_sXard0DtDo",
  client_secret: "ELLwpzLEL1JCg7yjEj4nNXG0Zw131ZurhLV7m2iTDTKUS5ANWFK8N0tOqxEJeVit126FzSWweETvgUCP",
});

module.exports = paypal;