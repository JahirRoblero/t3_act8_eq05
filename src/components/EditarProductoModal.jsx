import {useState,useEffect} from 'react'
import "./EditarProductoModal.css"


function EditarProductoModal ({producto, clickGuardar, clickCancelar}){

    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("")
    const [marca, setMarca] = useState("")
    const [descripcion, setDescripcion] = useState("")

    //Este para precargar si exite ya ese producto
    useEffect(()=>{
        if(producto){
            setNombre(producto.nombre || "")
            setNombre(producto.categoria || "")
            setNombre(producto.precio || "")
            setNombre(producto.stock || "")
            setNombre(producto.marca || "")
            setNombre(producto.descripcion || "")
            
        }
        },[producto])



        function manejarGuardar(e){
            e.preventDefault();
            clickGuardar({
                nombre,
                categoria,
                precio,
                stock,
                marca,
                descripcion
            })
        }


        return(
            <div className='modalFondo'>
                <div className="modalCard">
                    <div className='modalHeader'>
                        <div>
                            <h2>Editar Producto</h2>
                            <p>Modifica la información del producto</p>
                        </div>
                        <button
                        type='button'
                        className='modalCerrar'
                        onClick={clickCancelar}
                        aria-label='Cerrar'
                        >
                            x
                        </button>
                    </div>
                    
                    <div className='modalDivider'/>

                    <form onSubmit={manejarGuardar}>
                        <div className='modalCampo'>
                            <label htmlFor="nombreProducto">Nombre del producto</label>
                            <input 
                            type="text"
                            id='nombreProducto'
                            value={nombre}
                            onChange={(e)=> setNombre(e.target.value)} 
                            placeholder="Essence Mascara Lash Princess"
                            />
                        </div>
                        <div className="modalCampo">
                            <label htmlFor="categoria">Categoría</label>
                            <input 
                            type="text" 
                            id='categoria'
                            value={categoria}
                            onChange={(e)=>setCategoria(e.target.value)}
                            placeholder="Belleza"
                            />
                        </div>
                        <div className="modalFila">
                            <div className="modalCampo modalCampoMitad">
                            <label htmlFor="precio">Precio</label>
                            <input 
                            type="number" 
                            id='precio'
                            value={precio}
                            onChange={(e)=>setPrecio(e,target.value)}
                            placeholder='9.99'
                            />
                            </div>

                            <div className="modalCampo modalCampoMitad">
                            <label htmlFor="stock">Stock</label>
                            <input 
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e)=> setStock(e.target.value)}
                            placeholder='99' 
                            />
                            </div>
                        </div>

                        <div className='modalCampo'>
                            <label htmlFor="marca">Marca</label>
                            <input
                            type="text"
                            id="marca"
                            value={marca}
                            onChange={(e)=> setMarca(e.target.value)}
                            placeholder='Essence' 
                            />
                        </div>

                        <div className='modalCampo'>
                            <label htmlFor="descripcion">Descripción</label>
                            <input
                            type="text" 
                            id="descripcion"
                            value={descripcion}
                            onChange={(e)=> setDescripcion(e.target.value)}
                            placeholder='Máscara para pestañas con efecto de volumen y alargamiento.' 
                            rows={3}
                            />
                        </div>
                        
                        <div className='modalBotones'>
                            <button type='button' className='modalBotonCancelar' onClick={clickCancelar}>
                                Cancelar
                            </button>
                            <button type='submit' className='modalBotonGuardar'>
                                Guardar
                            </button>
                        </div>
                
                    </form>
                </div>
            </div>
        )
}

export default EditarProductoModal;
