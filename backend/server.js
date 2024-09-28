const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const UserController = require("./controller/UserController");
const FoodTypeController = require("./controller/FoodTypeController");


//admin
app.post("/api/user/signIn", (req, res) => UserController.signIn(req, res));
app.post("/api/foodType/create", (req, res) => FoodTypeController.create(req, res));
app.get("/api/foodType/list", (req, res) => FoodTypeController.list(req, res));


app.listen(3001,()=>{
    console.log("API Server running on port 3001");
});

