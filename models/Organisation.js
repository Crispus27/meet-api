const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('meet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
const User = require('./User');
const FunctionOrganisation = require('./FunctionOrganisation');

class Organisation extends Model {}

Organisation.init({
    // Model attributes are defined here
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
    logo_url: {
        type: DataTypes.JSON
    },
    cover_url: {
        type: DataTypes.JSON
    },
    fb_url: {
        type: DataTypes.STRING
    },
    insta_url: {
        type: DataTypes.STRING
    },
    twitter_url: {
        type: DataTypes.STRING
    },
    linkedin_url: {
        type: DataTypes.STRING
    },
    tel: {
        type: DataTypes.STRING
    },
    tel_secondary: {
        type: DataTypes.STRING
    },
    website :{
        type:DataTypes.STRING,

    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    email:{
        type:DataTypes.STRING
    },
    email_secondary:{
        type:DataTypes.STRING
    },
    description:{
        type:DataTypes.STRING
    },
    location:{
        type:DataTypes.STRING
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Organisation', // We need to choose the model name
    tableName: 'organizations',
    indexes: [{ unique: true, fields: ['slug','email',] }]
});
Organisation.belongsTo(User,
    {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

module.exports = Organisation;


