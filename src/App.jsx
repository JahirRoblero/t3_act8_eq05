import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import BarraDeFiltros from "./components/BarraDeFiltros.jsx";
import TablaProductos from "./components/TablaProductos.jsx";
import { obtenerProductos } from "./services/api.js";

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [persona, setPersona] = useState(null);

  const [productos, setProductos] = useState([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] =
    useState("");

  const [rangoPrecio, setRangoPrecio] = useState({
    minimo: null,
    maximo: null,
  });

  useEffect(() => {
    async function cargarProductos() {
      try {
        const datos = await obtenerProductos();
        setProductos(datos.products ?? datos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    }

    cargarProductos();
  }, []);

  function abrirSidebar() {
    setSidebarAbierto(true);
  }

  function cerrarSidebar() {
    setSidebarAbierto(false);
  }

  function alIniciarSesion(datosUsuario) {
    console.log("Usuario recibido:", datosUsuario);
    setPersona(datosUsuario);
  }

  function cerrarSesion() {
    setPersona(null);
    setSidebarAbierto(false);
  }

  const productosFiltrados = productos.filter((producto) => {
    const cumpleCategoria =
      categoriaSeleccionada === "" ||
      producto.category === categoriaSeleccionada;

    const estaDisponible = producto.stock > 0;

    const cumpleDisponibilidad =
      disponibilidadSeleccionada === "" ||
      (disponibilidadSeleccionada === "disponible" && estaDisponible) ||
      (disponibilidadSeleccionada === "No disponible" && !estaDisponible);

    const cumplePrecioMinimo =
      rangoPrecio.minimo === null ||
      producto.price >= rangoPrecio.minimo;

    const cumplePrecioMaximo =
      rangoPrecio.maximo === null ||
      producto.price <= rangoPrecio.maximo;

    return (
      cumpleCategoria &&
      cumpleDisponibilidad &&
      cumplePrecioMinimo &&
      cumplePrecioMaximo
    );
  });

  if (!persona) {
    return <Login onLoginExitoso={alIniciarSesion} />;
  }

  const nombreCompleto =
    `${persona.firstName || ""} ${persona.lastName || ""}`.trim() ||
    persona.username ||
    "Usuario";

  return (
    <div className="layoutSistema">
      <Sidebar abierto={sidebarAbierto} onCerrar={cerrarSidebar} />

      {sidebarAbierto && (
        <button
          className="fondoOscuro"
          type="button"
          onClick={cerrarSidebar}
          aria-label="Cerrar menú"
        />
      )}

      <div className="areaPrincipal">
        <Navbar
          nombreUsuario={nombreCompleto}
          imagenPerfil={persona.image}
          onAbrirSidebar={abrirSidebar}
          onCerrarSesion={cerrarSesion}
        />

        <main className="contenidoPagina">
          <h1>Lista de productos</h1>

          <BarraDeFiltros
            onCambiarCategoria={setCategoriaSeleccionada}
            onCambiarDisponibilidad={setDisponibilidadSeleccionada}
            onCambiarRangoPrecio={setRangoPrecio}
          />

          <section className="listaProductos">
            <TablaProductos></TablaProductos>
            {productosFiltrados.map((producto) => (
              <article className="producto" key={producto.id}>
                <img src={producto.thumbnail} alt={producto.title} />

                <h2>{producto.title}</h2>

                <p>Categoría: {producto.category}</p>

                <p>Precio: ${producto.price}</p>

                <p>
                  Disponibilidad:{" "}
                  {producto.stock > 0 ? "Disponible" : "No disponible"}
                </p>
              </article>
            ))}

            {productosFiltrados.length === 0 && (
              <p>No se encontraron productos con esos filtros.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;