const Group=require('../models/groups');
const GroupUsers=require('../models/groupUsers');
const User = require('../models/user');

exports.addGroup=async(req,res,next)=>{
    try {
        const {groupname}=req.body;
        console.log("here",groupname);
       const data= await Group.create({groupname:groupname});
       res.status(200).json({group:data});
    } catch (err) {
        res.status(500).json({
            error: err,
          });
    }
}

// exports.addGroupUsers=async(req,res,next)=>{
//     try {
//        const{id,selectedUserIds}=req.body;
//        console.log('groupid',id);
//        console.log(selectedUserIds);
       
//        await GroupUsers.create({groupId:id,userId:selectedUserIds});
       
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err,
//           });
//     }
// }
exports.addGroupUsers = async (req, res, next) => {
    try {
      const { id, selectedUserIds } = req.body;
      console.log('groupid', id);
  
      // Create an array of objects to represent the records to be inserted
      const recordsToInsert = selectedUserIds.map((userId) => ({
        groupId: id,
        userId: userId,
      }));
  
      // Use the bulkCreate method to insert multiple records at once
     const data= await GroupUsers.bulkCreate(recordsToInsert);
  
      res.status(200).json({ groupuser:data });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  exports.getGroups=async(req,res,next)=>{
    try {
      const id=req.user.id;
      const groupusers=await GroupUsers.findAll({where:{userId:id}});
      // Extract group IDs from the results
    const groupIds = groupusers.map((groupuser) => groupuser.groupId);

    // Find all groups using the extracted group IDs
    const groups = await Group.findAll({ where: { id: groupIds } });
     
    res.status(200).json({ groups: groups });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }

  exports.getGroup=async(req,res,next)=>{
    const groupId=req.params.groupId;
    console.log(groupId);
    try {
      const data=await Group.findOne({where:{id:groupId}});
      res.status(200).json({name:data});
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }
  exports.addGroupUser=async(req,res,next)=>{
    const{userId,groupId}=req.body
    console.log("userId",userId,"groupId",groupId)
    try {
      const data=await GroupUsers.create({userId,groupId});
      res.status(200).json({user:data});
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }

  exports.firstAdmin=async(req,res,next)=>{
    const id=req.user.id;
    const {groupId}=req.body;
    try {
      const data=await GroupUsers.create({userId:id,groupId:groupId,isadmin:true});
      res.status(200).json({user:data});
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }

  exports.getGroupUser=async(req,res,next)=>{
    const userId=req.query.userId;
    const groupId=req.query.groupId;
    console.log('userid',userId,'groupid',groupId);
    try {
      const data=await GroupUsers.findOne({where:{userId:userId,groupId:groupId}});
      
      if(!data){
        res.status(200).json({groupuser:data,message:'false'});
      }
      else{
        res.status(200).json({groupuser:data,message:'true'});
      }
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }

  // exports.removeGroupUser=async(req,res,next)=>{
  //   const {userId,groupId}=req.body;
  //   try {
  //     await GroupUsers.destroy({where:{userId,groupId}});
  //     res.status(200).json({message:"user removed from group"});
  //   } catch (err) {
  //     res.status(500).json({error:err})
  //   }
  // }
  exports.removeGroupUser = async (req, res, next) => {
    const { userId, groupId } = req.body;

    try {
        // Check if the user and group exist
        const userExists = await User.findOne({ where: { id: userId } });
        const groupExists = await Group.findOne({ where: { id: groupId } });

        if (!userExists || !groupExists) {
            return res.status(404).json({ message: "User or group not found." });
        }

        // Attempt to remove the user from the group
        await GroupUsers.destroy({ where: { userId, groupId } });

        res.status(200).json({ message: "User removed from the group." });
    } catch (err) {
      console.log(err);
        res.status(500).json({ error: err });
    }
}

// Import your models and necessary dependencies

// Define a controller function to make a user an admin in a group
exports.makeUserAdmin = async (req, res, next) => {
  const { userId, groupId } = req.body;

  try {
      // Check if the user is a member of the group
      const groupUser = await GroupUsers.findOne({ where: { userId, groupId } });

      if (!groupUser) {
          return res.status(404).json({ message: "User is not a member of the group." });
      }

      // Update the is_admin flag to true
      await GroupUsers.update({ isadmin: true }, { where: { userId, groupId } });

      res.status(200).json({ message: "User is now an admin of the group." });
  } catch (err) {
    console.log(err);
      res.status(500).json({ error: err });
  }
};

// exports.isAdmin=async (req,res,next)=>{
//   const userId=req.query.userId;
//   const groupId=req.query.groupId;
//   try {
//     const data=await GroupUsers.findOne({where:{userId:userId,groupId:groupId}})
//       res.status(200).json({groupuser:data});
//   } catch (err) {
//     console.log(err);
//       res.status(500).json({ error: err });
//   }
// }
