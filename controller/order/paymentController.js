const stripe = require("../../config/stripe");
const userModel = require("../../models/usermodel");
const paymentController = async (request, response) => {
  try {
    const cartItems = request.body;
    console.log("cartItems", cartItems);
    const user = await userModel.findOne({
      _id: request.userId,
    });
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_type: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "",
        },
      ],
      customer_email: user.email,
      line_items: cartItems.map((item, index) => {
        return {
          price_data: {
            currency: "inr",
            price_data: {
              name: item.productId.productName,
              images: item.productId.productImage,
              metadata: {
                productId: item.productId._id,
              },
            },
            unit_amount: item.productId.sellingPrice * 100,
          },
          adjustable_quanity: {
            enable: true,
            minmum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };
    const session = await stripe.checkout.session.create({});
    response.status(303).json(session);
  } catch (err) {
    response.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};
module.exports = paymentController;
