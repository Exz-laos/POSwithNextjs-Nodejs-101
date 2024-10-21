const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    create: async (req,res)=>{
        try{
          // find organization
          const oldOrganization = await prisma.organization.findMany();
          const payload ={
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            website: req.body.website,
            promptpay: req.body.promptpay,
            logo: req.body.logo,
            taxCode: req.body.taxCode
          }
          if(oldOrganization.length==0){
            await prisma.organization.create({
                data: payload
            })
          }else{
            await prisma.organization.update({
                where: {
                    id: oldOrganization[0].id
                },
                data: payload
            })
          }
            return res.send({ message: "Saved success" });
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },
    info: async(req, res) => {
        try{
            const organization = await prisma.organization.findFirst();
            res.send({result: organization});
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    },
    upload: async(req, res) => {
        try{
            //move file to uploads/
            const file = req.files.file;
            //get extentiomn
            const extension = file.name.split(".").pop();
            //rename to microtime
            const fileName = `logo_${Date.now()}.${extension}`;
            //move file to uploads/

            file.mv(`./uploads/${fileName}`);
            //find organization
            const organization = await prisma.organization.findFirst();

            if(organization){
                //delete old file
                const fs = require('fs');
                fs.unlinkSync(`./uploads/${organization.logo}`);
                //update organization
                await prisma.organization.update({
                    where: {
                        id: organization.id
                    },
                    data: {
                        logo: fileName
                    }
                })
            }

            res.send({fileName: fileName});
        }catch(e){
            return res.status(500).send({ error: e.message });
        }
    }


  




     
    

}