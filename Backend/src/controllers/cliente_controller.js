import { sendMailToCliente } from "../config/nodemailer.js"
import { generarJWT } from "../helpers/crearJWT.js"
import Cliente from "../models/cliente.js"
import mongoose from "mongoose"


const loginCliente = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const clienteBDD = await Cliente.findOne({email})
    if(!clienteBDD) return res.status(404).json({msg:"Lo sentimos, el cliente no se encuentra registrado"})
    const verificarPassword = await clienteBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(clienteBDD._id,"Cliente")
	const {nombre,email:emailP,celular,convencional,_id} = clienteBDD
    res.status(200).json({
        token,
        nombre,
        emailP,
        celular,
        convencional,
        _id
    })
}
const perfilCliente = async (req,res)=>{
    const {id} = req.params
    const cliente = await Cliente.findById(id).select('-createdAt -updatedAt -__v');
    if( !cliente ) return res.status(404).json({msg:`Lo sentimos, no existe el cliente ${id}`});
    res.status(200).json({cliente})
}

const listarClientes = async(req,res)=>{
    const clientes = await Cliente.find({estado:true}).select(" -createdAt -updatedAt -__v")
    res.status(200).json(clientes)
    //Debemos integrar para que lea o que el admin pueda colocar rol o una seguridad arreglarlo 
}

const detalleCliente = async (req,res)=>{

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el veterinario ${id}` });
    const cliente = await Cliente.findById(id).select("-createdAt -updatedAt -__v")
    
    res.status(200).json({
        cliente
        
    })
}

const registrarCliente = async(req,res)=>{
    const {email,nombre}=req.body
    //Paso 2: Validación de Datos
        //Llenar todos los campos
    if (Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        //email no repetido
    const verificarEmailBDD = await Cliente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //Paso 3: Interacción de BDD
    const nuevoCliente = new Cliente (req.body)
        //generar numro random variable password
    const password = Math.random().toString(36).slice(2)
        //cliente en el campo password encrtar password vet al inicio con el anterior
    nuevoCliente.password= await nuevoCliente.encrypPassword("nw"+password)
        //envia el email y la contraseña de acceso
    await sendMailToCliente(email,"nw"+password,nombre)
    await nuevoCliente.save()
    res.status(200).json({msg:"Su registro fue exitoso, registro enviado al mail"})
}

const actualizarCliente = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el cliente ${id}` });

    await Cliente.findByIdAndUpdate(req.params.id, req.body)
    
    res.status(200).json({ msg: "Actualización exitosa del cliente" })
}

const eliminarCliente =async (req,res)=>{
    const { id } = req.params

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el cliente ${id}` })
    
    try {
        // Solo actualizar el estado a 'false' (marcar como eliminado)
        await Cliente.findByIdAndUpdate(id, { estado: false });
    
        res.status(200).json({ msg: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al intentar eliminar al cliente" });
        }
    }

export {
	loginCliente,
	perfilCliente,
    listarClientes,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente
}