const UserService = require('../services/users');
const jwt = require("jsonwebtoken");
const AuthService = require("../services/auth");
const MailService = require("../services/mail");

class UserController{
    async getUsers(req,res){
        try{
            const users = await UserService.getUsers();
            return res.status(200).json(users);
        } catch(err){
            console.error(err);
            return res.status(500).json({
                method: "getUsers",
                message: err,
            });
        }
    };
    
    async getUserById(req,res){
    try{
        const{id} = req.params.id;
        let user = await UserService.getUserById(id);
        if(!user){
            return res.status(404).json({
                method: "getUserById",
                message: "User not found",
        });
    }
    return res.status(200).json(user);
    }catch(err){
            return res.status(500).json({
                method: "getUserById",
                message: err,
            });
    };
    };

    async createUser(req,res){
        try{
            const newuser = await UserService.createUser(req.body);
            return res.status(200).json({
                message: "Created",
                user: newuser,
            });
        } catch(err){
            res.status(500).json({
                method: "createUser",
                message: err.message,
            });
        }
    };
    
    async login(req,res){
        try{
            const{
                email,
                contrasenia
            } = req.body;
            //Vlidar user
            let isUserRegistered = await AuthService.hasValidateCredentials(email,contrasenia);
            if(isUserRegistered){
    
                const user = await UserService.getUserByEmail(email);
    
                //Genero el token de sesion
                const token = jwt.sign(user.toJSON(), process.env.PRIVATE_KEY,{
                    expiresIn: "1d",
                });
    
                return res.status(200).json({
                    status: 200,
                    token,
                    message: "Token created Succesfully"
                });
            }else{
                return res.status(401).json({
                    message: "Unauthorized.",
                });
            }       
        } catch(err){
            console.error(err);
            return res.status(500).json({
                method: "login",
                message: err.message,
            });
        }
    }

    async updateUser(req,res){
        try{
            let user = await UserService.getUserById(req.params.id);
            if(!user){
                return res.status(404).json(
                    {
                        method: "updateUser",
                        message: "User not found"
                    }
                )
            }
            const modifiedUser = await UserService.updateUser(
                req.params.id,
                req.body,
                user
            );
            return res.status(200).json(modifiedUser);
        } catch(err){
            console.error(err);
            return res.status(500).json({
                method:"updateUser",
                message: err
            });
        }
    }

    async deleteUser(req,res){
        try{
            let isUser = await UserService.deleteUser(req.params.id);
            if(isUser){
                await UserService.deleteUser(req.params.id);
                return res.status(204).json({
                    message: "User deleted"
                });
            }
            return res.status(404).json({
                message: "User not found"
            });
            }catch(err){
                console.error(err);
                return res.status(500).json({
                    method: "deleteUser",
                    message: err
                })
            }
    }
}

module.exports = new UserController();
