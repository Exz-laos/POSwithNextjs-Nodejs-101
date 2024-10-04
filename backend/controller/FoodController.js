const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    upload: async (req,res)=>{
        try{
            const myFile = req.files.myFile;

            if (myFile != undefined){
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
                    image: req.body.image,
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

    update: async (req, res) => {
        try{
            await prisma.food.update({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    image: req.body.image,
                    price: req.body.price,
                    img: req.body.img,
                    foodType: req.body.foodType
                },
                where: {
                    id: req.body.id,
                },
            })
            return res.send({ message: "updated success" });
        }catch(e){
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