const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  // console.log(req.body);
  const { products } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr", // Change to your desired currency
          product_data: {
            name: products[0].hotel_name,
            images: [products[0].main_photo_url],
          },
          // currencyPrice * (noOfDays + 1) * rooms
          unit_amount: parseInt(
            products[0].currencyPrice *
              (products[0].noOfDays + 1) *
              products[0].rooms *
              100
          ),
          // unit_amount: products[0].currencyPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: "https://www.youtube.com/",
    success_url: "http://localhost:3000/mybookings",
    cancel_url: "http://localhost:3000/error",
  });
  res.json({ id: session.id });
  console.log(products);
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", { PORT });
});
