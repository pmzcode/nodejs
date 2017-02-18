module.exports = (Sequelize, sequelize) => {
    return sequelize.define('userDomains', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
};