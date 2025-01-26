// Importar JWT y el Modelo
import jwt from 'jsonwebtoken'
import Administrador from '../models/administrador.js'
import Cliente from '../models/cliente.js'

//Método para verificar token 
const verificarAutenticacion = async (req,res,next)=>{
    //Verifica que xiste el token 

    if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
        const {authorization} = req.headers
        try {
            const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
            //console.log(id,rol) al realizar se puede ver si se confirma o no si no sale
            if (rol==="Administrador"){
                req.AdministradorBDD = await Administrador.findById(id).lean().select("-password")
                //console.log(req.AdministradorBDD) // con esto se compruba que funcione
                next()
            }
            else{
                console.log(id,rol);
                req.cliente = await Cliente.findById(id).lean().select("-password")
                console.log(req.cliente)
                next()
            }
        } catch (error) {
            const e = new Error("Formato del token no válido")
            return res.status(404).json({msg:e.message})
        }
    }


export default verificarAutenticacion