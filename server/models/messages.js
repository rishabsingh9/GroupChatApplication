const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    message:Sequelize.TEXT
})

module.exports=Message;