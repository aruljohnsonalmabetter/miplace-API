const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express ();
// app.use(express.json());

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
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });


app.listen(PORT, () => {
    console.log("Server Listening on PORT:",
    {PORT} );
  });

