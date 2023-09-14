const express = require("express");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")("sk_test_51NposySFLJXN2nA69inD9BhuFVzba3SURrVFlZ4VdO1rDclQaH2LrK1NfMC0c6TCMuO0YpsQSzzw4ulRBCkrQnnI00SGhAiSEP");


const app = express ();
// app.use(express.json());
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//Middlewares
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/api/create-checkout-session", async (req, res) => {
  const products  = req.body;
  console.log(products);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: 'inr', // Change to your desired currency
        product_data: {
          name: products.hotel_name,
          images: [products.main_photo_url],
        },
        unit_amount: products.price_breakdown * 100, 
      },
      quantity:1,
    }],
    mode: "payment",
    success_url: "http://localhost:3000/myBookings",
    cancel_url :"https://localhost:3000/cancel",
  })
  res.json({ id: session.id })
})
//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);



app.listen(PORT, () => {
    console.log("Server Listening on PORT:",
    {PORT} );
  });

