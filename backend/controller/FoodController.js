const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    upload: async (req,res)=>{
        try{
            

            if (req.files != undefined){
                const myFile = req.files.myFile;
                const fileName = myFile.name;

                //rename file
                const fileExtension = fileName.split(".").pop();
                const newFileName = new Date().getTime() + "." + fileExtension;
                const path = 'uploads/' + newFileName;

                myFile.mv(path, async(err)=>{
                    if(err){
                        return res.status(500).send({ error: err.message });
                    }
                    return res.send({ message: "success", fileName: newFileName });
                });

            }else {
                return res.status(400).send({ error: "File is required" });
            }
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },

    create: async (req,res)=>{
        try{
            await prisma.food.create({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    price: req.body.price,
                    img: req.body.img,
                    foodType: req.body.foodType
                },
            })

            return res.send({ message: "Saved success" });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },


    list: async (req,res)=>{
        try{
            const foods = await prisma.food.findMany({
                include:{
                    FoodType: true,
                },
                where:{
                    status: "use",
                },
                orderBy: {
                    id: "desc"
                }
            })
            return res.send({ results: foods });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },

    // update: async (req, res) => {
    //     try{
    //         //remove old file in food
    //         const oldFood = await prisma.food.findUnique({
    //             where: {
    //                 id: req.body.id,
    //             }
    //         })

    //         if(oldFood.img != ''){
    //             if(req.body.img != ''){
    //                 const fs = require('fs');
    //                 fs.unlinkSync('uploads/' + oldFood.img);
    //             }
    //         }
            
            
    //         await prisma.food.update({
    //             where: {
    //                 id: req.body.id,
    //             },
    //             data: {
    //                 foodTypeId: req.body.foodTypeId,
    //                 name: req.body.name,
    //                 remark: req.body.remark,
    //                 image: req.body.image,
    //                 price: req.body.price,
    //                 img: req.body.img,
    //                 foodType: req.body.foodType
    //             },
              
    //         })
    //         return res.send({ message: "updated success" });
    //     }catch(e){
    //         return res.status(500).send({ error: e.message });
    //     }
    // },
    update: async (req, res) => {
        try {
            // Find the existing food entry
            const oldFood = await prisma.food.findUnique({
                where: {
                    id: req.body.id,
                }
            });
    
            // If a new image is provided and the old image exists, delete the old image
            if (oldFood.img && req.body.img && req.body.img !== '') {
                const fs = require('fs');
                fs.unlinkSync('uploads/' + oldFood.img);
            }
    
            // If no new image is provided, keep the old image
            const newImg = req.body.img !== '' ? req.body.img : oldFood.img;
    
            // Update the food item with the new data (or keep old image if no new one is provided)
            await prisma.food.update({
                where: {
                    id: req.body.id,
                },
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    price: req.body.price,
                    img: newImg,  // Use the old image if a new one is not provided
                    foodType: req.body.foodType
                },
            });
    
            return res.send({ message: "updated success" });
        } catch (e) {
            return res.status(500).send({ error: e.message });
        }
    },
    

    remove: async (req, res) => {
        try{
            await prisma.food.update({
                data: {
                    status: "delete",
                },
                where: {
                    id: parseInt(req.params.id),
                },
            })
            return res.send({ message: "deleted success" });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    }
  
}