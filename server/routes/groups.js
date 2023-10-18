const path = require('path');

const express = require('express');
const groupController=require('../controllers/groups');
const userAuthentication=require('../middleware/auth');
const router=express();

router.post('/add-group',groupController.addGroup);
router.post('/add-group-users',groupController.addGroupUsers);
router.get('/get-groups',userAuthentication.authenticate,groupController.getGroups);
router.get('/get-group/:groupId',groupController.getGroup);
router.post('/add-group-user',groupController.addGroupUser);
router.post('/first-admin',userAuthentication.authenticate,groupController.firstAdmin);
router.get('/get-group-user',groupController.getGroupUser);
router.post('/remove-group-user',groupController.removeGroupUser);
router.post('/make-admin',groupController.makeUserAdmin);


module.exports=router;
