module.exports = (Sequelize, config) => {
    const options = {
        host: config.db.host,
        dialect: config.db.dialect,
        logging: false,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: { $eq: null }
                }
            }
        }
    };

    const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);
    const User = require('../models/user')(Sequelize, sequelize);
    const Domain = require('../models/domain')(Sequelize, sequelize);
    const UserDomains = require('../models/userDomains')(Sequelize, sequelize);


    User.belongsToMany(Domain,
        { through: UserDomains });
    Domain.belongsToMany(User,
        { through: UserDomains });

    return {
        user: User,
        domain: Domain,
        userDomains: UserDomains,
        sequelize: sequelize
    };
};