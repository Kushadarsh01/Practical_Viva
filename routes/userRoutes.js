import express from 'express';
import { userRegister, userLogin, refreshToken } from '../controllers/userCont.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/refresh-token', refreshToken);

export default router;
