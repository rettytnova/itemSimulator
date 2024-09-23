import express from "express";
import { prisma } from "../utils/prisma/index.js"

const router = express.Router();

// 아이템 생성
router.post('/item/create', async(req, res, next) => {
    const { name, health, power, price } = req.body;
    
    const isExistItem = await prisma.item.findUnique({
        where: {
            name: name,
        },
    });
    if(isExistItem){
        return res.status(400).json({ message: '이미 존재하는 동명의 아이템이 있습니다.'});
    }

    const item = await prisma.item.create({
        data: {
            name: name,
            health: +health,
            power: +power,
            price: +price,
        },
    });

    return res.status(200).json({ item });
});

// 아이템 정보 수정 (name, health, power)
router.patch('/item/modify/:id', async(req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const {name, health, power } = req.body;

    const item = await prisma.item.findUnique({
        where: {
            id: id,
        },
    });
    if(!item){
        return res.status(404).json({ message: `${id}번 아이템을 찾을 수 없습니다.`});
    }    
    
    const modifiedItem = await prisma.item.update({
        where: {
            id: id,
        },
        data: {
            name,
            health,
            power,
        },
    });
    
    return res.status(200).json({ modifiedItem });
});

// 아이템 상세 조회 (id)
router.get('/item/find/:id', async(req, res, next) => {
    const id = parseInt(req.params.id, 10);
    console.log(id);

    const item = await prisma.item.findUnique({
        where: {
            id: id,
        },
    });
    if(!item){
        return res.status(404).json({ message: `${id}번 아이템을 찾을 수 없습니다.`});
    }
    
    return res.status(200).json({ item });
});

// 아이템 전체 조회
router.get('/item/findAll', async(req, res, next) => {
    const itemList = await prisma.item.findMany();
    if(!itemList){
        return res.status(404).json({ message: '아이템이 존재하지 않습니다.'});
    }

    return res.status(200).json({ itemList });
});


export default router;