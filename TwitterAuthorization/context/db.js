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
    const Role = require('../models/role')(Sequelize, sequelize);
    const UserRole = require('../models/userRole')(Sequelize, sequelize);
    const Author = require('../models/author')(Sequelize, sequelize);
    const Book = require('../models/book')(Sequelize, sequelize);
    const Library = require('../models/library')(Sequelize, sequelize);

    Author.hasMany(Book);
    Book.belongsTo(Author);

    Library.hasMany(Book);
    Book.belongsTo(Library);

    User.belongsToMany(Role,
        { through: UserRole });
     Role.belongsToMany(User,
        { through: UserRole });

      return {
        user: User,
        role: Role,
        author: Author,
        book:Book,
        library:Library,
        sequelize: sequelize,
          userRole: UserRole
    };
};