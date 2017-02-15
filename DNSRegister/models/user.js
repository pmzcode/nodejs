module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            notNull: true,
            unique: true
        },
        password: Sequelize.STRING,

        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING
    });
};