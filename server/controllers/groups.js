const Group=require('../models/groups');
const GroupUsers=require('../models/groupUsers');

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
      console.log(selectedUserIds);
  
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
  