const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    create: async (req,res)=>{
        try{
            const { foodTypeId, name, remark } = req.body;
            
            if (!foodTypeId) {
                return res.status(400).send({ error: "FoodType ID is required" });
            }
            await prisma.taste.create({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                },
            });

            return res.send({ message: "Saved success" });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },

    list: async (req, res) => {
        try {
          const rows = await prisma.taste.findMany({
            where: {
              status: "use",
            },
            orderBy: {
              id: "desc",
            },
            include: {
                FoodType: true,  // Include related FoodType data
              },
          });
          return res.send({ results: rows });
        } catch (e) {
          return res.status(500).send({ error: e.message });
        }
      },

      remove: async (req, res) => {
        try{
          await prisma.taste.update({
            data: {
              status: "delete",
            },
            where: {
              id: parseInt(req.params.id),
            },
          });
          return res.send({ message: "deleted success" });
        }catch(e){
          return res.status(500).send({ error: e.message });
        }
      },
  
      update: async (req, res) => {
        try{
          await prisma.taste.update({
            data:{
              name: req.body.name,
              remark: req.body.remark,
              foodTypeId: req.body.foodTypeId,
            },
            where:{
              id: req.body.id,
            }
          });
          return res.send({ message: "updated success" });
  
        }catch(e){
          return res.status(500).send({ error: e.message });
        }
      }
  




     
    

}