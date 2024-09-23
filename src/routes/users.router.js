import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import authMiddlewares from '../middlewares/auth.middlewares.js';

const router = express.Router();

// 회원가입 
router.post('/sign-up', async (req, res, next) => {
    const { id, password, passwordCheck, name } = req.body;

    const accountRegex = /^[a-z0-9]+$/;

    if (!accountRegex.test(id)) {
      return res.status(400).json({ message: 'ID는 영어 소문자 또는 숫자의 조합이어야 합니다.' });
    } else if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 6자리 이상이어야 합니다.' });
    } else if (password !== passwordCheck) {
      return res.status(400).json({ message: '재입력된 비밀번호와 일치하지 않습니다.' });
    }

    const isExistUserAccountId = await prisma.account.findUnique({
      where: {
        accountId: id,
      },
    });
    if (isExistUserAccountId) {
      return res.status(400).json({ message: '중복된 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await prisma.account.create({
      data: {
        accountId: id,
        password: hashedPassword,
        name: name,
      },
    });

    return res.status(201).json({ message: `${name}님의 회원가입을 환영합니다.` });  
});

// 로그인
router.post('/sign-in', async (req, res, next) => {
  const { id, password } = req.body;

  const user = await prisma.account.findFirst({
    where: {
      accountId: id,
    },
  });

  if (id !== user.accountId) {
    return res.status(404).json({ message: '존재하지 않는 ID입니다.' });
  }

  const isMatchPassword = bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    return res.status(400).json({ message: 'password가 틀렸습니다.' });
  }

  const token = jwt.sign({ 
    id: user.id }, 
    process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '10m',
  });  
  res.header('authorization', `Bearer ${token}`);

  return res.status(200).json({ message: `${id} 로그인에 성공했습니다.` });
});

// 캐릭터 생성
router.post('/character/create', authMiddlewares, async (req, res, next) => {
  const { name } = req.body;
  const id = req.user.id;

  const isExistCharacterName = await prisma.character.findUnique({
    where: {
        name: name
    },
  });
  if (isExistCharacterName) {
    return res.status(400).json({ message: '이미 존재하는 캐릭터명입니다.' });
  }

  const newCharacter = await prisma.character.create({
    data: {
        name: name,
        accountId: +id,
    },
  });

  return res.status(200).json({ message: `${newCharacter.id}번 캐릭터가 ${newCharacter.name}(으)로 생성되었습니다.`});
});

// 캐릭터 지정삭제
router.delete('/character/delete/:id',authMiddlewares, async (req, res, next) => {
    const characterId = parseInt(req.params.id, 10);
    const accountId = req.user.id; // 인증미들웨어를 거친 토큰으로 저장된 user데이터

    const character = await prisma.character.findUnique({
        where: {
            id: characterId,
        },
    });
    if(!character){
        return res.status(404).json({ message: '존재하지 않는 캐릭터입니다.'});
    }
    if(character.accountId !== accountId){
        return res.status(403).json({ message: '올바른 ID로 접속 후 삭제해주십시오.'});
    }

    await prisma.character.delete({
        where: {
            id: characterId,
        },
    });

    return res.status(200).json({ message: '캐릭터가 성공적으로 삭제되었습니다.'});
})

// 캐릭터 상세 조회 (name, health, power, money)
router.get('/character/find/:id', authMiddlewares, async(req, res, next) => {
    const characterId = parseInt(req.params.id, 10);
    const accountId = req.user.id; 

    const character = await prisma.character.findUnique({
        where: {
            id: characterId,
        },
    });
    if(!character){
        return res.status(404).json({message: '캐릭터를 찾을 수 없습니다.'});
    }

    const isYourCharacter = accountId === character.accountId ? true : false;
    const characterStatus = {
        name: character.name,
        health: character.health,
        power: character.power,
    };
    if(isYourCharacter){
        characterStatus.money = character.money;
    }
    
    return res.status(200).json(characterStatus);
});

export default router;
