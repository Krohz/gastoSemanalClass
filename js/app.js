//Variables y selectores 172 < > Alvias Cristian
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Variable global para el presupuesto
let presupuesto;

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto)
}

//Classes
class Presupuesto{
    constructor(presupuesto){
        //se pone number porque el prompt nos lo va a traer como cadena
        this.presupuesto =Number( presupuesto );
        this.restante = Number(presupuesto);
        this.gasto = [];
    }

    nuevoGasto(gastos){
        this.gasto = [...this.gasto, gastos]
        //console.log(this.gasto);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gasto.reduce((total, gasto)=>total + gasto.cantidad, 0
        );

        this.restante = this.presupuesto - gastado;
        //console.log(this.restante);
    }

    eliminarGasto(id){
        this.gasto = this.gasto.filter(gasto => gasto.id !== id)

        console.log(this.gasto);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuseto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }
    imprimirAlerta(mensaje, tipo){
        //creamos el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger")
        }else{
            divMensaje.classList.add("alert-success");
        }
        //asigarle el mensaje
        divMensaje.textContent = mensaje;

        //insertar en el html

        document.querySelector(".primario").insertBefore(divMensaje, formulario)

        //quitar el texto despues de un tiempo
        setTimeout(()=>{
            divMensaje.remove();
        },3000);
    }

    MostrarGastos(gastos){

        this.limpiarHTML();
        gastos.forEach((gasto)=>{
            const{cantidad, nombre, id} = gasto;

            // - crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";

            // ponerle un ID al html
            nuevoGasto.dataset.id = id;

            //console.log(nuevoGasto);
            // - Agregar HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`
            // - Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gastos");
            btnBorrar.innerHTML = "Borrar &times"
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);
            // - agregar al HTML
            gastoListado.appendChild(nuevoGasto);

            if (nuevoGasto) {
                
            }
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector(".restante");

        //Comprobar 77
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        }else if((presupuesto / 2) > restante ){
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        }else{
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        //si el total es menor a 0
        if(restante <= 0){
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
//instanciar
const ui = new UI();

//Funciones

function preguntarPresupuesto(){
    const presupestoUsuario = prompt("Cual es tu presupuesto?");

    if (presupestoUsuario === "" || presupestoUsuario === null || isNaN(presupestoUsuario) || presupestoUsuario <= 0) {
        window.location.reload();
    }

    //Ya existe un presupuesto valido
    presupuesto = new Presupuesto(presupestoUsuario);

    ui.insertarPresupuseto(presupuesto);
}


//añadir gastos
function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad =Number(document.querySelector("#cantidad").value);

    //validar el form
    if (nombre === "" || cantidad ==="") {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    }
    else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no valida", "error");
        return;
    }

    //generar un objeto con el gasto

    const gastos = {
        //key : value
        nombre, 
        cantidad : cantidad, 
        id:Date.now()
    }

    //añadir un nuevo gasto
    presupuesto.nuevoGasto(gastos);
    //mensaje de todo bien
    ui.imprimirAlerta("Gasto agregado correctamente");

    // Imprimir los gastos
    const {gasto, restante} = presupuesto;
    ui.MostrarGastos(gasto);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //se reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Eliminar del objeto
    presupuesto.eliminarGasto(id);

    // Eliminar los gastos del HTML
    const {gasto, restante} = presupuesto;
    ui.MostrarGastos(gasto)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}