const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('meet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
const Role = require('./role')(sequelize,Sequelize);
class User extends Model {}

User.init({
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      }
    },{
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'users',
    indexes: [{ unique: true, fields: ['slug','email',] }]
});
User.belongsTo(Role,
    {
        foreignKey: 'user_id',
        //onDelete: 'CASCADE',
        //onUpdate: 'CASCADE'
    });

module.exports  = User;

  