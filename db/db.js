const {
    Sequelize
} = require('sequelize');
const UserModel = require("../db/models/users");
const ProjectModel = require("../db/models/projects");
const TicketModel = require("../db/models/tickets");
const dotenv = require("dotenv");
dotenv.config();

//Conexion del ORM a la DB -usando .env
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    host: 'localhost',
    dialect:'mysql',
});

//Inicializacion modelos
const User = UserModel(sequelize,Sequelize);
const Project = ProjectModel(sequelize,Sequelize);
const Ticket = TicketModel(sequelize,Sequelize);

//Quedan Relaciones -Definirlas
User.hasMany(Project,{
    foreignKey: 'usuarioId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Project.belongsTo(User,{
    foreignKey: 'usuarioId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    as: 'usuario'
});

Project.hasMany(Ticket,{
    foreignKey: 'projectId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Ticket.belongsTo(Project,{
    foreignKey:'projectId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    as: 'project'
});

//Metodo para sincronizar
sequelize.sync()
    .then(() =>{
        console.log("Database & Tables created");
    })
    .catch(err =>{
        console.log('Error ', err);
    });

module.exports = {
    sequelize,
    User,
    Project,
    Ticket
};