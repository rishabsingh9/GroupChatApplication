const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    groupname:Sequelize.STRING
})

module.exports=Group;