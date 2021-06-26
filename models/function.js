module.exports = (sequelize, Sequelize) => {
    const Function = sequelize.define("functions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Function;
  };