const Message=require('../models/messages');
const AWS = require("aws-sdk");
const multer = require('multer');

const storage = multer.memoryStorage(); // Use in-memory storage to work with file buffers
const upload = multer({ storage });
const archievedMessage=require('../models/archievedMessages');
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



  
function uploadToS3(uploadedFile, filename) {
  
  const BUCKET_NAME = "groupchatapp333";
  const IAM_USER_KEY = process.env.USER_KEY;
  const IAM_USER_SECRET = process.env.USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: uploadedFile,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong ", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}

exports.upload= async (req, res, next) => {
  try {
    const uploadedFile = req.files.file.data;
    const buffer = Buffer.from(uploadedFile);
    const fileType = req.body.type;
    const fileExtension = fileType.split('/')[1];
    console.log("uploaded",req.files.file.name);
    console.log("file abc",uploadedFile);
    console.log("type" ,fileExtension);
    const groupId=req.body.groupId;
    
    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const userid = req.user.id;

    
    const filename = `chatapp_${userid}_${Date.now()}_${req.files.file.name}.${fileExtension}`;
    const fileUrl = await uploadToS3(buffer, filename); // Use file.buffer to get the file content
    const data= await Message.create({message:fileUrl,userId:userid,groupId:groupId})
    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ fileUrl: "", success: false, error: error });
  }
};


async function moveAndDeleteOldMessages() {
  try {
    // Define a date for one day ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find and move one-day-old messages to ArchivedChat
    const oldMessages = await Message.findAll({
        where: {
            createdAt: {
                [Op.lte]: oneDayAgo, // Find messages older than one day
            },
        },
    });

    // Move old messages to ArchivedChat
    for (const message of oldMessages) {
        await ArchivedChat.create({
            // Copy relevant message data to ArchivedChat
            text: message.text,
            // Add other fields as needed
        });

        // Delete the message from Chat
        await message.destroy();
    }
    console.log('Messages moved and deleted successfully');
} catch (error) {
    console.error('Error moving and deleting messages:', error);
}
}

module.exports = {
  moveAndDeleteOldMessages,
};
