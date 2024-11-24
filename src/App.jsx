import { useEffect, useState } from 'react';
import './App.css';

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([]);
  const [sid, setSid] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [errors, setErrors] = useState({ nombre: false, apellidos: false });

  // Validar campos
  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim(),
      apellidos: !apellidos.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  // Método para guardar cliente
  const saveCustomer = async () => {
    if (!validateFields()) return;
    try {
      await axios.post(`http://172.18.11.210:3100/api/clientes`, {
        nombre,
        apellidos,
      });
      alert("¡Cliente agregado exitosamente!");
      getCustomers();
      clearFields();
    } catch (err) {
      console.error("Error al guardar el cliente:", err.message);
      alert("Ocurrió un error al guardar el cliente. Inténtalo nuevamente.");
    }
  };

  // Método para actualizar cliente
  const updateCustomer = async (id) => {
    if (!validateFields()) return;
    if (!id.trim()) {
      alert("Debe proporcionar un ID válido.");
      return;
    }
    try {
      await axios.put(`http://172.18.11.210:3100/api/clientes/${id}`, {
        nombre,
        apellidos,
      });
      alert("Cliente actualizado correctamente");
      getCustomers();
    } catch (error) {
      console.error("Error al actualizar el cliente:", error.message);
      alert("No se pudo actualizar el cliente. Revisa el ID o intenta más tarde.");
    }
  };

  // Método para buscar cliente por ID
  const getCustomerById = async (id) => {
    if (!id.trim()) {
      alert("Debe proporcionar un ID válido.");
      return;
    }
    try {
      const response = await axios.get(`http://172.18.11.210:3100/api/clientes/${id}`);
      if (response.data.nombre) {
        setNombre(response.data.nombre);
        setApellidos(response.data.apellidos);
        alert("Cliente encontrado.");
      } else {
        alert("No se encontró un cliente con el ID proporcionado.");
      }
    } catch (error) {
      console.error("Error al buscar el cliente:", error.message);
      alert("Ocurrió un error al buscar el cliente. Intenta nuevamente.");
    }
  };

  // Método para eliminar cliente
  const deleteCliente = async (id) => {
    if (!id.trim()) {
      alert("Debe proporcionar un ID válido.");
      return;
    }
    if (!window.confirm(`¿Está seguro de eliminar este cliente?`)) return;
    try {
      await axios.delete(`http://172.18.11.210:3100/api/clientes/${id}`);
      alert("Cliente eliminado correctamente.");
      setData(data.filter(cliente => cliente._id !== id));
      clearFields();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error.message);
      alert("No se pudo eliminar el cliente. Revisa el ID o intenta más tarde.");
    }
  };

  // Método para obtener todos los clientes
  const getCustomers = async () => {
    try {
      const response = await axios.get(`http://172.18.11.210:3100/api/clientes`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error.message);
      alert("No se pudieron obtener los clientes. Intenta nuevamente más tarde.");
    }
  };

  const clearFields = () => {
    setSid('');
    setNombre('');
    setApellidos('');
    setErrors({ nombre: false, apellidos: false });
  };

  // Cargar la lista de clientes al montar el componente
  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="container">
      <form>
        {/* Formulario */}
        <div className="row">
          <div className="col">
            <label htmlFor="sid">Identificación a Buscar</label>
            <input
              type="text"
              id="sid"
              name="sid"
              placeholder="Identificación a buscar"
              className="form-control"
              value={sid}
              onChange={e => setSid(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombres"
              value={nombre}
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              onChange={e => setNombre(e.target.value)}
            />
            {errors.nombre && <div className="invalid-feedback">El nombre es obligatorio.</div>}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              placeholder="Apellidos"
              value={apellidos}
              className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
              onChange={e => setApellidos(e.target.value)}
            />
            {errors.apellidos && <div className="invalid-feedback">Los apellidos son obligatorios.</div>}
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" type="button" onClick={saveCustomer}>Guardar</button>
          <button className="btn btn-success mx-2" type="button" onClick={() => getCustomerById(sid)}>Buscar</button>
          <button className="btn btn-warning mx-2" type="button" onClick={() => updateCustomer(sid)}>Actualizar</button>
          <button className="btn btn-danger mx-2" type="button" onClick={() => deleteCliente(sid)}>Eliminar</button>
          <button className="btn btn-dark mx-2" type="button" onClick={getCustomers}>Listar Clientes</button>
          <button className="btn btn-info mx-2" type="button" onClick={clearFields}>Limpiar Datos</button>
        </div>
      </form>
      <hr />

      {/* Tabla de clientes */}
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellidos</th>
            </tr>
          </thead>
          <tbody>
            {data.map(cliente => (
              <tr key={cliente._id}>
                <td>{cliente._id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellidos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
