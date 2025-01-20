import jwt from 'jsonwebtoken'



const generarJWT = (id,rol)=>{
    return jwt.sign({id,rol},process.env.JWT_SECRET,{expiresIn:"1d"})
    //ingresar y va a encriptar la información  y le dice que se expire en un día 
}


export {generarJWT}
    
