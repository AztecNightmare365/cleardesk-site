const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  try {
    const { amount, productId, email } = JSON.parse(event.body);
    if (!amount || !productId || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount, currency: "usd", receipt_email: email,
      metadata: { productId, email }
    });
    return { statusCode: 200, body: JSON.stringify({ clientSecret: paymentIntent.client_secret }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
