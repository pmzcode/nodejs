module.exports = (Sequelize,sequelize)=>{
    return sequelize.define('authors',{
        id:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        name: Sequelize.STRING,
        country:Sequelize.STRING,
        pseudonym:Sequelize.STRING
    });
};