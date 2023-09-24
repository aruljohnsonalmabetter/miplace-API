const express = require("express");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express ();
// app.use(express.json());


//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//Middlewares
app.use(express.json());

app.use(bodyParser.json());
app.use(cookieParser());
//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);



app.listen(PORT, () => {
    console.log("Server Listening on PORT:",
    {PORT} );
  });

