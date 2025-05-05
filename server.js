require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const routes = require("./routes/route");
app.set('view engine', 'ejs')
app.use("/photos",express.static('photos'));
app.use(express.static('./public/js'));
app.use(express.static('./public/css'));
app.use("/", routes);
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})