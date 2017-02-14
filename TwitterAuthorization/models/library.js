module.exports=(Sequelize,sequelize)=>{



    return sequelize.define('library',{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:Sequelize.STRING,
        capacity:Sequelize.INTEGER
    });
};