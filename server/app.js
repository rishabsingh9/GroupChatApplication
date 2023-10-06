const path = require('path');
const fs=require('fs');
var cors=require('cors');
const express = require('express');
const bodyParser = require('body-parser');


const sequelize=require('./util/database')

const User=require('./models/user');


const app = express();

app.use(express.json());

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes=require('./routes/user');

app.use('/chatapp',userRoutes);



sequelize
//.sync({force:true})
.sync()
.then(result=>{
   
   app.listen(3000);
})
.catch(err=>console.log(err));
