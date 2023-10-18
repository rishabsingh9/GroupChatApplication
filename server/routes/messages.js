const path = require('path');

const express = require('express');
const messageController=require('../controllers/messages');
const userAuthentication=require('../middleware/auth');
const router=express();

router.post('/messages',userAuthentication.authenticate,messageController.postMessage);
router.get('/get-messages/:groupId',messageController.getMessages);

module.exports=router;
