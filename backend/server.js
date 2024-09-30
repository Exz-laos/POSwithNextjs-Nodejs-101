const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const UserController = require("./controller/UserController");
const FoodTypeController = require("./controller/FoodTypeController");
const FoodSizeController = require("./controller/FoodSizeController");


//admin
app.post("/api/user/signIn", (req, res) => UserController.signIn(req, res));
//admin-foodtype
app.post("/api/foodtype/create", (req, res) => FoodTypeController.create(req, res));
app.get("/api/foodtype/list", (req, res) => FoodTypeController.list(req, res));
app.delete("/api/foodtype/remove/:id",(req, res)=>FoodTypeController.remove(req, res));
app.put("/api/foodtype/update", (req, res)=>FoodTypeController.update(req, res));
//admin-foodsize
app.post("/api/foodsize/create", (req, res) => FoodSizeController.create(req, res));
app.get("/api/foodsize/list", (req, res) => FoodSizeController.list(req, res));
app.delete("/api/foodsize/remove/:id",(req, res)=>FoodSizeController.remove(req, res));
app.put("/api/foodsize/update", (req, res)=>FoodSizeController.update(req, res));

app.listen(3001,()=>{
    console.log("API Server running on port 3001");
});

