import {useState} from "react"
import {loginUser} from "../services/api.js"
import iconPersona from "../assets/icons/icon-pers.svg";
import iconEmail from "../assets/icons/icon-email.svg";
import iconPassword from "../assets/icons/icon-password.svg";
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
                <div className="loginIconoTop">
                <img src={iconPersona} alt="" className="loginIconoTopImg" />
                </div>
                <h2 className="LoginTitle">INICIA SESIÓN</h2>


                <form onSubmit= {enviar}>
                    <div className="loginCampo">
                        <label htmlFor="nombre">Correo Electrónico</label>
                        <div className="loginInputConIcono">
                        <img src={iconEmail} alt="" className="loginIcono" />
                        <input 
                        type="text" 
                        id="nombre" 
                        value = {nombre}
                        placeholder="nombre@correo.com"
                        onChange={(e) => { setNombre(e.target.value) 
                              if (error) setError("");
                        }}
                        />
                        </div>
                    </div>

                        <div className="loginCampo">
                            <label htmlFor="contraseña">Contraseña</label>
                            <div className="loginInputConIcono">
                            <img src={iconPassword} alt="" className="loginIcono" />
                            <input 
                             type="password" 
                             id="contraseña" 
                             placeholder="••••••••"
                             value={contraseña}
                             onChange={(e)=>{setContraseña(e.target.value)
                                if (error) setError(""); 
                             }}
                             />
                            </div>
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