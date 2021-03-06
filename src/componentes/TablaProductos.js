import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './TablaProductos.css'
//import UserProfile from './UserProfile';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

const url = `http://localhost:3001/productos`

export default function TablaProductos() {

    const [offset, setOffset] = useState(0);
    const [data, setData] = useState([]);
    const [perPage] = useState(1);
    const [pageCount, setPageCount] = useState(0)

    const [productosLista, setProductoLista] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState({
        id: '',
        codigo_producto: "",
        descripcion: '',
        valor_unitario: '',
        estado: ''
    });

    const seleccionarProducto = (productos) => {
        setProductoSeleccionado(productos);
        console.log(productos)
    }

    const deleteProductos = (id) => {
        axios
            .delete(`http://localhost:3001/api/delete/${id}`)
            .then((response) => {
                setProductoLista(productosLista.filter(productos => productos.id !== id));
                alert("eliminacion correcta");

            });

    };


    const handleChange = e => {
        const { name, value } = e.target;
        setProductoSeleccionado(prevState => ({
            ...prevState,
            [name]: value
        }))
        //console.log(productoSeleccionado);
    }

    const changeHandle = e => {
        setBusqueda(e.target.value);
    }


    const updateProductos = (id) => {
        axios.put("http://localhost:3001/api/update/", {
            id: id,
            codigo_producto: productoSeleccionado.codigo_producto,
            descripcion: productoSeleccionado.descripcion,
            valor_unitario: productoSeleccionado.valor_unitario,
            estado: productoSeleccionado.estado,
        }).then((response) => {
            alert("actualizacion exitosa")
            setProductoLista(productosLista.map((productos) => {
                return productos.id == id ? 
                { id: productos.id, 
                    codigo_producto: productoSeleccionado.codigo_producto, 
                    descripcion: productoSeleccionado.descripcion, 
                    valor_unitario: productoSeleccionado.valor_unitario, 
                    estado: productoSeleccionado.estado 
                } : productos;

            }))

        })

    }
    const PeticionGet = () => {
        axios.get(url)

            .then(res => {
                setProductoLista(res.data);
            }).catch(err => {
                console.log(err);
            })
    };

    const getData = async () => {
        const res = await axios.get(url)
        const data = res.data;
        setProductoLista(res.data);
        const slice = data.slice(offset, offset + perPage)
        const postData = slice.map(productos =>
            <tr key={productos.id}>
                <td>{productos.codigo_producto}</td>
                <td>{productos.descripcion}</td>
                <td>{new Intl.NumberFormat("es-ES").format(productos.valor_unitario)}</td>
                <td>{productos.estado}</td>
                <td>
                    <button className="btn btn-danger btn-form " data-bs-toggle="modal" data-bs-target="#editarProducto" onClick={() => { seleccionarProducto(productos) }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { deleteProductos(productos.id) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                </td>
            </tr>
        )
        setData(postData)
        setPageCount(Math.ceil(data.length / perPage))
    }

    useEffect(() => {
        if (busqueda == "") {
            getData()
        } else {
            PeticionGet();
        }

    }, [offset])


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage + 1)
    }


    return (

        <div>
            <div class="container  container-register">
                <div class="row justify-content-md-center">

                    <div class="col col-lg-2">

                    </div>
                    <div class="col-md-auto">
                        <h1>Maestro de Productos</h1>
                        <form class="d-flex">
                            <Link exact class="btn btn-outline-success btn-register" type="submit" to="/registrar_producto" >Registrar Producto</Link>
                        </form>
                        <div class="row">
                            <div class="form-floating">
                                <input class="form-control  w-50" type="text" id="floatingInput" placeholder="Buscar Producto" value={busqueda} aria-label="Search" onChange={changeHandle} />
                                <label for="floatingInput" class="label-buscar">Buscar Producto</label>
                            </div>
                        </div>

                        <h3 class="mt-5">Detalle Productos</h3>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Valor Unitario</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosLista && productosLista.filter((productos) => {
                                    if (busqueda == "") {
                                        return { productos }
                                    } else if (productos.descripcion.toLowerCase().includes(busqueda.toLowerCase()) || productos.codigo_producto.toLowerCase().includes(busqueda.toLowerCase())) {
                                        return productos
                                    }
                                }).map((productos) => {
                                    return (
                                        <tr key={productos.id}>
                                            <td>{productos.codigo_producto}</td>
                                            <td>{productos.descripcion}</td>
                                            <td>{new Intl.NumberFormat("es-ES").format(productos.valor_unitario)}</td>
                                            <td>{productos.estado}</td>
                                            <td>
                                                <button className="btn btn-danger btn-form " data-bs-toggle="modal" data-bs-target="#editarProducto" onClick={() => { seleccionarProducto(productos) }}><FontAwesomeIcon icon={faEdit} /></button>
                                                {"   "}
                                                <button className="btn btn-danger" onClick={() => { deleteProductos(productos.id) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                            </td>
                                        </tr>
                                    )

                                })}

                            </tbody>
                        </table>
                    </div>
                    <div class="col col-lg-2">

                    </div>
                </div>
                
            </div>




            <div class="modal fade" id="editarProducto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Editar Producto</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-floating mb-3">
                                    <input type="text" name="id" readOnly class="form-control" id="floatingInput" placeholder="descripcion" value={productoSeleccionado && productoSeleccionado.id} />
                                    <label for="floatingInput">ID</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" name="codigo_producto" readOnly class="form-control" id="floatingInput" placeholder="Codigo del Producto" value={productoSeleccionado && productoSeleccionado.codigo_producto} />
                                    <label for="floatingInput">Codigo del Producto</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" name="descripcion" class="form-control" id="floatingInput" placeholder="descripcion" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.descripcion} />
                                    <label for="floatingInput">Descripcion</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="valor_unitario" class="form-control" id="floatingInput" placeholder="valor unitario" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.valor_unitario} />
                                    <label for="floatingInput">Valor Unitario</label>
                                </div>
                                <div class="form-floating floating-select">
                                    <select name="estado" class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.estado} >
                                        <option selected>Estado Producto</option>
                                        <option value="Disponible">Disponible</option>
                                        <option value="No disponible">No Disponible</option>
                                    </select>
                                    <label for="floatingSelect">Estado Producto</label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success  btn-editar" data-bs-dismiss="modal">Cerrar</button>
                            {"   "}
                            <button type="button" class="btn btn-success" onClick={() => updateProductos(productoSeleccionado.id)} data-bs-dismiss="modal">Editar</button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
