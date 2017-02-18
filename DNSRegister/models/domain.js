module.exports = (Sequelize, sequelize) => {
    return sequelize.define('domains', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        price: Sequelize.INTEGER

    });
};