const Message=require('../models/messages');

exports.postMessage=async(req,res,next)=>{
    try {
        const userId=req.user.id;
        console.log(req.body);
        let message=req.body.message;
        console.log(message);
       const data= await Message.create({message:message,userId:userId})
       res.status(200).json({message:data});
    } catch (err) {
        console.log(err);
        res.status(500).json({
          error: err,
        });
    }
}

exports.getMessages=async(req,res,next)=>{
    let lmi=req.params.lastMessageId
    try {
        const data = await Message.findAll({
            where: {
                id: {
                    [Sequelize.Op.gt]: lastMessageId // Use the Sequelize operator for greater than (gt)
                }
            }
        });
        res.status(200).json({messages:data});
    } catch (err) {
        res.status(500).json({
            error: err,
          });
    }
}