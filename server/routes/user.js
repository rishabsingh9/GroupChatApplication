const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const userAuthentication=require('../middleware/auth');

const router=express();


router.post('/user/sign-up',userController.signUp);
router.post('/user/login',userController.login);
router.get('/get-users',userAuthentication.authenticate,userController.getUsers);
router.get('/get-user',userController.getUser);

module.exports=router;