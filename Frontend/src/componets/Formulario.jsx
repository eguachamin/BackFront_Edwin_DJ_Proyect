import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';



export const Formulario = ({cliente}) => {
    

    // PASO 1
    const navigate = useNavigate()

    
    const [form, setform] = useState({
        nombre: cliente?.nombre ??"",
        ciudad: cliente?.ciudad ??"",
        email: cliente?.email ??"",
        celular: cliente?.celular ??"",
        convencional: cliente?.convencional ??"",
        fecha_nacimiento: new Date(cliente?.fecha_nacimiento).toLocaleDateString('en-CA', { timeZone: 'UTC' }) ?? ""
    })

    // PASO 2
    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // PASO 3
    const handleSubmit = async (e) => {

        e.preventDefault()  

        if (cliente?._id) {
            //Actualizar
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/cliente/actualizar/${cliente._id}`
                const options = {
                    headers: {
                        method:'PUT',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                await axios.put(url, form, options)
                navigate('/dashboard/listar')
                
            } catch (error) {
                console.log(error)
            }
        } else {
            // Crear
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_BACKEND_URL}/cliente/registro`
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                await axios.post(url, form, options)
              
                navigate('/dashboard/listar')
            } catch (error) {
                console.log(error)
            }
        }
    }

    

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label
                    htmlFor='nombre:'
                    className='text-gray-700 uppercase font-bold text-sm'>Nombre: </label>
                <input
                    id='nombre'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Nombre del cliente'
                    name='nombre'
                    value={form.nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='ciudad:'
                    className='text-gray-700 uppercase font-bold text-sm'>Ciudad: </label>
                <input
                    id='ciudad'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Ciudad del cliente'
                    name='ciudad'
                    value={form.ciudad}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='email:'
                    className='text-gray-700 uppercase font-bold text-sm'>Email: </label>
                <input
                    id='email'
                    type="email"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Email del cliente'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='celular:'
                    className='text-gray-700 uppercase font-bold text-sm'>Celular: </label>
                <input
                    id='celular'
                    type="number"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Celular del cliente'
                    name='celular'
                    value={form.celular}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='convencional:'
                    className='text-gray-700 uppercase font-bold text-sm'>Convencional: </label>
                <input
                    id='convencional'
                    type="number"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Convencional del cliente'
                    name='convencional'
                    value={form.convencional}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label
                    htmlFor='fecha_nacimiento:'
                    className='text-gray-700 uppercase font-bold text-sm'>Fecha de nacimiento: </label>
                <input
                    id='fecha_nacimiento'
                    type="date"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Ingrese la fecha de nacimiento del cliente'
                    name='fecha_nacimiento'
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                />
            </div>
    

            <input
                type="submit"
                className='bg-gray-600 w-full p-3 
                    text-slate-300 uppercase font-bold rounded-lg 
                    hover:bg-gray-900 cursor-pointer transition-all'
                value={cliente?._id ? 'Actualizar cliente' : 'Registrar cliente'} />

        </form>
    )
}