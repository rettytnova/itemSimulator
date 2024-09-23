import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(404).json({ message: 'authorization을 찾을 수 없습니다.' });
    }

    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(400).json({ message: 'Bearer 토큰타입이 아닙니다.' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    if (!decodedToken) {
      return res.status(404).json({ message: '토큰이 존재하지 않습니다.' });
    }

    const user = await prisma.account.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    req.user = user;

    next();
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
      case 'JsonWebTokenError':
        return res.status(401).json({ message: '토큰이 조작되었습니다.' });
      default:
        return res.status(401).json({ message: error.message ?? '비정상적인 요청입니다.' });
    }
  }
}
