const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    create: async (req,res)=>{
        try{
            await prisma.foodSize.create({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    moneyAdded: req.body.moneyAdded,
                    status: "use",
                },
            });

            return res.send({ message: "Saved success" });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },


    // list: async (req,res)=>{
    //     try{
    //         const rows = await prisma.foodSize.findMany({
    //             where:{
    //                 status: "use",
    //             },
    //             orderBy: {
    //                 id: "desc"
    //             }
    //         })
    //         return res.send({ results: rows });
    //     }catch(e){
    //         return res.status(500).send({ error: e.message });
    //     }
    // },
    list: async (req, res) => {
        try {
          const rows = await prisma.foodSize.findMany({
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
      






}