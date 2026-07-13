import {useState} from "react"
import {loginUser} from "../services/api.js"
import "./Login.css"

function Login ({onLoginExitoso}){
    const [nombre, setNombre] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState("")


    function validacionCampos(){
        if(nombre.trim() === "" || contraseña.trim() === ""){
            setError("Completa el usuario y contraseña.")
            return false;
        }
        return true
    }

    async function enviar(e) {
        e.preventDefault();
        setError("")
    
        if(!validacionCampos()) return 
            
            setCargando(true)
            try {
                const usuario = await loginUser(nombre,contraseña);
                onLoginExitoso(usuario) 
            }catch(err){
                setError(err.message)
            } finally {
                setCargando(false)
            }
    }



    return(
        <div className="loginFondo">
            <div className="loginCard">
                <h2 className="LoginTitle">INICIA SESIÓN</h2>


                <form onSubmit= {enviar}>
                    <div className="loginCampo">
                        <label htmlFor="nombre">Correo Electrónico</label>
                        <input 
                        type="text" 
                        id="nombre" 
                        value = {nombre}
                        placeholder="nombre@correo.com"
                        onChange={(e) => setNombre(e.target.value)}
                        />
                        </div>
                        <div className="loginCampo">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input 
                             type="password" 
                             id="contraseña" 
                             placeholder="••••••••"
                             value={contraseña}
                             onChange={(e)=> setContraseña(e.target.value)}
                             />
                        </div>
                            {error && <p className="loginError">{error}</p>}
                            <button type="submit" className="loginBoton" disabled={cargando}>
                                {cargando ? "Entrando..." : "Entrar"}    
                            </button>                     
                </form>
            </div>
        </div>
    )
}

export default Login;