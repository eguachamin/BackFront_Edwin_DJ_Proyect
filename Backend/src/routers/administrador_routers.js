import {Router} from 'express'
import { actualizarPerfil, cambiarPassword, comprobarTokenPassword, confirmEmail, login, nuevoPassword, perfilUsuario, recuperarPassword, registro } from '../controllers/administrador_controller.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'

const router = Router()
        //Rutas Públicas
//Ruta para Registro
router.post('/registro',registro)
//Ruta para token
router.get('/confirmar/:token',confirmEmail)
//Ruta para Login
router.post('/login',login)
//Ruta para recuperar contraseña
router.post('/recuperar-password',recuperarPassword)
//Ruta para la confirmacion de contraseña
router.get('/recuperar-password/:token',comprobarTokenPassword)
//Ruta par ael nuevo password
router.post('/nuevo-password/:token',nuevoPassword)

        //Rutas Prvadas
router.get('/perfil-admin',verificarAutenticacion,perfilUsuario)
router.put('/actualizar-perfil/:id',verificarAutenticacion ,actualizarPerfil)
router.put('/cambiar-password',verificarAutenticacion ,cambiarPassword)

export default router