const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const router=express();


router.post('/user/sign-up',userController.signUp);
router.post('/user/login',userController.login);
router.get('/get-users',userController.getUsers);

module.exports=router;