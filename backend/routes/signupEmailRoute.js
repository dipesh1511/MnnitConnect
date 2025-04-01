import express from 'express';
import { signupEmail } from '../Controllers/signupEmailController.js'; 

const signupEmailRoute = express.Router();

signupEmailRoute.post('/verification-code', signupEmail);

export default signupEmailRoute;
