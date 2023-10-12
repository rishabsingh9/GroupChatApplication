const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const GroupUsers=sequelize.define('groupuser',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
})

module.exports=GroupUsers;