const path = require('path');

const express = require('express');
const groupController=require('../controllers/groups');
const userAuthentication=require('../middleware/auth');
const router=express();

router.post('/add-group',groupController.addGroup);
router.post('/add-group-users',groupController.addGroupUsers);
router.get('/get-groups',userAuthentication.authenticate,groupController.getGroups);

module.exports=router;
