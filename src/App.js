import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:4000/articulos/";

class App extends Component {
state={
data:[],
modalInsertar: false,
modalEliminar: false,
form:{
  id:'',
  nombrearticulo:'',
  precio:'',
  cantidad:'',
  departamento:'',
  tipoModal:''

}
 
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}


peticionPut=()=>{
  axios.put(url+this.state.form.id, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}


peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}


modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}


seleccionarArticulo=(articulo)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: articulo.id,
      nombrearticulo: articulo.nombrearticulo,
      precio: articulo.precio,
      cantidad: articulo.cantidad,
      departamento: articulo.departamento
      
    }
  })
}


handleChange=async e=>{
  e.persist();
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });


  console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <div className='App'>
    <br/>
    <button className='btn btn-success' onClick={()=>{this.setState({form:null, tipoModal:'insertar'});this.modalInsertar()}}>Agregar Articulo</button>
    <br/><br/>
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>nombrearticulo</th>
          <th>precio</th>
          <th>cantidad</th>
          <th>departamento</th>
        </tr>
      </thead>
      <tbody>
       {this.state.data.map(articulo=>{
         return(
           <tr>
           <td>{articulo.id}</td>
           <td>{articulo.nombrearticulo}</td>
           <td>{articulo.precio}</td>
           <td>{articulo.cantidad}</td>
           <td>{articulo.departamento}</td>
           <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarArticulo(articulo); this.modalInsertar()}} ><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarArticulo(articulo); this.setState({modalEliminar: true})}} ><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
           </tr>
         )
       })}
       

      </tbody>
      
    </table>
    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombrearticulo" id="nombrearticulo" onChange={this.handleChange} value={form?form.nombrearticulo: ''}/>
                    <br />
                    <label htmlFor="nombre">Precio</label>
                    <input className="form-control" type="text" name="precio" id="precio" onChange={this.handleChange} value={form?form.precio: ''}/>
                    <br />
                    <label htmlFor="capital_bursatil">Cantidad</label>
                    <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form?form.cantidad: ''}/>
                    <br/>
                    <label htmlFor="capital_bursatil">departamento</label>
                    <input className="form-control" type="text" name="departamento" id="departamento" onChange={this.handleChange} value={form?form.departamento: ''}/>
                  </div>
                </ModalBody>
                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>:<button className='btn btn-primary' onClick={()=>this.peticionPut()} >
                    actualizar
                  </button>
  }
                  <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar el articulo {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
    
  </div>

   );
  }
}

export default App;
