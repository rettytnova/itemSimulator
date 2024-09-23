import express from 'express';
import usersRouter from './src/routes/users.router.js';
import itemRouter from './src/routes/items.router.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", [
    usersRouter,
    itemRouter,
]);

app.listen(PORT, () => {
    console.log(PORT, "포트로 서버가 열렸습니다.");
})