const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

const UserController = require("./controller/UserController");
const FoodTypeController = require("./controller/FoodTypeController");
const FoodSizeController = require("./controller/FoodSizeController");
const TasteController = require("./controller/TasteController");
const FoodController = require("./controller/FoodController");
const SaleTempController = require("./controller/SaleTempController");
const OrganizationController = require("./controller/OrganizationController");
const BillSaleController = require("./controller/BillSaleController");


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
//admin-taste
app.post("/api/taste/create", (req, res) => TasteController.create(req, res));
app.get("/api/taste/list", (req, res) => TasteController.list(req, res));
app.delete("/api/taste/remove/:id",(req, res)=>TasteController.remove(req, res));
app.put("/api/taste/update", (req, res)=>TasteController.update(req, res));
//admin-food
app.post("/api/food/upload", (req, res) => FoodController.upload(req, res));
app.post("/api/food/create", (req, res) => FoodController.create(req, res));
app.get("/api/food/list", (req, res) => FoodController.list(req, res));
app.put("/api/food/update", (req, res)=>FoodController.update(req, res));
app.delete("/api/food/remove/:id",(req, res)=>FoodController.remove(req, res));
app.get("/api/food/filter/:foodType", (req, res) => FoodController.filter(req, res));

//saleTemp
app.post("/api/saletemp/create", (req, res) => SaleTempController.create(req, res));
app.get("/api/saletemp/list", (req, res) => SaleTempController.list(req, res));
app.delete("/api/saletemp/remove/:id",(req, res)=>SaleTempController.remove(req, res));
app.delete("/api/saletemp/removeAll",(req, res)=>SaleTempController.removeAll(req, res));
app.put("/api/saletemp/updateQty", (req, res)=>SaleTempController.updateQty(req, res));
app.post("/api/saletemp/generateSaleTempDetail", (req, res)=>SaleTempController.generateSaleTempDetail(req, res));
app.get("/api/saletemp/info/:id", (req, res) => SaleTempController.info(req, res));
app.put("/api/saletemp/selectTaste", (req, res) => SaleTempController.selectTaste(req, res));
app.put("/api/saletemp/unselectTaste", (req, res) => SaleTempController.unselectTaste(req, res));
app.put("/api/saletemp/selectSize", (req, res) => SaleTempController.selectSize(req, res));
app.put("/api/saletemp/unselectSize", (req, res) => SaleTempController.unselectSize(req, res));
app.post("/api/saletemp/createSaleTempDetail", (req, res) => SaleTempController.createSaleTempDetail(req, res));
app.delete("/api/saletemp/removeSaleTempDetail",(req, res)=>SaleTempController.removeSaleTempDetail(req, res));
app.post("/api/saletemp/printBillBeforePay", (req, res) => SaleTempController.printBillBeforePay(req, res));
app.post("/api/saletemp/endSale", (req, res) => SaleTempController.endSale(req, res));
app.post("/api/saletemp/printBillAfterPay", (req, res) => SaleTempController.printBillAfterPay(req, res));

//organization
app.post("/api/organization/create", (req, res) => OrganizationController.create(req, res));
app.get("/api/organization/info", (req, res) => OrganizationController.info(req, res));
app.post("/api/organization/upload", (req, res) => OrganizationController.upload(req, res));

//billsale
app.post("/api/billsale/list", (req, res) => BillSaleController.list(req, res));
app.delete("/api/billsale/remove/:id",(req, res)=>BillSaleController.remove(req, res));

app.listen(3001,()=>{
    console.log("API Server running on port 3001");
});

