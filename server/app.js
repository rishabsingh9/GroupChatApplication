const path = require('path');
const fs=require('fs');
var cors=require('cors');
const express = require('express');
const bodyParser = require('body-parser');


const sequelize=require('./util/database')

const User=require('./models/user');
const Message=require('./models/messages');


const app = express();

app.use(express.json());

app.use(cors({
   origin:"http://127.0.0.1:5500",
   credentials:true
  
}));


app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes=require('./routes/user');
const messageRoutes=require('./routes/messages');

app.use('/chatapp',userRoutes);
app.use('/chatapp',messageRoutes);

User.hasMany(Message);
Message.belongsTo(User);

sequelize
//.sync({force:true})
.sync()
.then(result=>{
   
   app.listen(3000);
})
.catch(err=>console.log(err));
