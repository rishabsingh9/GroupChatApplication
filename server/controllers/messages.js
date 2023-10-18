const Message=require('../models/messages');

exports.postMessage=async(req,res,next)=>{
    try {
        const userId=req.user.id;
        const groupId=req.body.groupId;
        console.log(req.body);
        let message=req.body.message;
        console.log(message);
       const data= await Message.create({message:message,userId:userId,groupId:groupId})
       res.status(200).json({message:data});
    } catch (err) {
        console.log(err);
        res.status(500).json({
          error: err,
        });
    }
}

exports.getMessages=async(req,res,next)=>{
    
    let groupId=req.params.groupId;
    console.log("GroupIddd",groupId);
    try {
        const data=await Message.findAll({where:{groupId:groupId}})
        res.status(200).json({messages:data});
    }
   catch (err) {
        res.status(500).json({
            error: err,
          });
    }
}
