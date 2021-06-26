const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('meet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' // 'mariadb'
});
try {
     sequelize.authenticate().then((result)=>{console.log('db connected successfully')}).catch((error)=>{console.log('db failed to ceonnect')});
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
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
        default:true
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

module.exports = Organisation;


