module.exports = (Sequelize,sequelize)=>{
    return sequelize.define('books',{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:Sequelize.STRING,
        releaseDate:Sequelize.DATE,
        genre:Sequelize.STRING
    });
};