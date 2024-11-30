const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

module.exports = {
    list: async (req, res) => {
        try {
            const startDate = dayjs(req.body.startDate).set('hour', 0).set('minute', 0).set('second', 0).toDate();
            const endDate = dayjs(req.body.endDate).set('hour', 23).set('minute', 59).set('second', 59).toDate();

            const billSale = await prisma.billSale.findMany({
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: 'use'
                },
                include: {
                    BillSaleDetails: {
                        include: {
                            Food: true,
                            FoodSize: true,
                            Taste: true
                        }
                    },
                    User: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            res.json({ results: billSale });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    remove: async (req, res) => {
        try {
            await prisma.billSale.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: 'delete'
                }
            });

            res.json({ message: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
   
}