const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('meet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' // 'mariadb'
});
const User = require('./User')(sequelize,Sequelize);
const Function = require('./function')(sequelize,Sequelize);
class FunctionOrganisation extends Model {}
FunctionOrganisation.init({
    user_id:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
    function_id:{
        type:DataTypes.INTEGER,
        references:{
            model:Function,
            key:"id"
        }
    },
    organisation_id:{
        type:DataTypes.INTEGER,
        references:{
            model:"organizations",
            key:"id"
        }
    },
    end_at:{
        type:DataTypes.DATE
    }

},
    {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'FunctionOrganisation', // We need to choose the model name
    tableName: 'o_function',
});

module.exports = FunctionOrganisation;


