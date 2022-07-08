// variables de sector en HTML
const nuevoGasto = document.querySelector("#agregar-gasto")
const gastosListado = document.querySelector("#gastos",  ".ul")
const presupuestoMostrado = document.querySelector("#presupuesto")

eventListener();
function eventListener(){
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto)
    nuevoGasto.addEventListener("submit", agregarGasto)
    gastosListado.addEventListener("click", eliminarGasto)

}


class Presupuesto{
    constructor(presupuestoTotal){
        this.presupuestoTotal = Number(presupuestoTotal)
        this.restante = Number(presupuestoTotal)
        this.listGastos = []
    }
    agregarGasto(nombre, valor){
        this.restante -= valor
        const gasto = { nombre, valor, id: Date.now()}
        this.listGastos = [...this.listGastos, gasto]
    }
    eliminarGasto(id){
        this.restante += this.listGastos.find(gasto => gasto.id === id).valor
        this.listGastos = this.listGastos.filter(gasto => gasto.id !== id)
    }

}

class UI {
    iniciarPresupuesto(presupuesto){
        presupuestoMostrado.querySelector("#total").textContent = presupuesto
        presupuestoMostrado.querySelector("#restante").textContent = presupuesto
    }
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert');
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }
        divMensaje.textContent = mensaje
        document.querySelector(".primario").insertBefore(divMensaje, nuevoGasto)
        setTimeout(() => {
            //document.querySelector(".primario .alert").remove()
            divMensaje.remove()
        },3000)
    }
    actualizarGastosEnListado(presupuesto){
        this.limpiarHTML()
        presupuesto.listGastos.forEach( gasto =>{ 
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            nuevoGasto.dataset.id = gasto.id

            nuevoGasto.innerHTML = `
                ${gasto.nombre}
                <span class="badge badge-primary badge-pill">$ ${gasto.valor}</span>
                `

            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.textContent = 'Borrar'
            nuevoGasto.appendChild(btnBorrar)

            gastosListado.appendChild(nuevoGasto)
        })

    }
    actualizarRestante(presupuesto){
        const restanteSelect = document.querySelector('.restante')
        presupuestoMostrado.querySelector("#restante").textContent = presupuesto.restante

        if (presupuesto.restante < 0){
            ui.imprimirAlerta("Se agoto el presupuesto", 'error')
            nuevoGasto.querySelector('button[type="submit"]').disabled = true            
        }else{
            nuevoGasto.querySelector('button[type="submit"]').disabled = false
        }
        if (presupuesto.restante  < presupuesto.presupuestoTotal /4 ){
            restanteSelect.classList.remove('alert-success','alert-warning' )
            restanteSelect.classList.add('alert-danger')  
        }else if (presupuesto.restante  < presupuesto.presupuestoTotal /2 ){
            restanteSelect.classList.remove('alert-success', 'alert-danger')
            restanteSelect.classList.add('alert-warning')
        }else{
            restanteSelect.classList.remove('alert-warning', 'alert-danger')
            restanteSelect.classList.add('alert-success')
        }
    }

    limpiarHTML(){
        while(gastosListado.firstChild){
            gastosListado.removeChild(gastosListado.firstChild)
        }
    }
}

let ui = new UI()
let presu = new Presupuesto()

function preguntarPresupuesto(){
    const presupuestoInicial = prompt("presupuesto inicial es?")
    if (presupuestoInicial === null || presupuestoInicial==="" || isNaN(presupuestoInicial) || presupuestoInicial <= 0){
        window.location.reload();
    }
    ui.iniciarPresupuesto(Number(presupuestoInicial))
    presu.presupuestoTotal = presupuestoInicial
    presu.restante = presupuestoInicial
}
function agregarGasto(gastoAAgregar){
    gastoAAgregar.preventDefault()
    const NombreGasto = nuevoGasto.querySelector("#gasto").value
    const valorGasto = Number(nuevoGasto.querySelector("#cantidad").value)
    if (NombreGasto === "" || valorGasto === null)
        ui.imprimirAlerta("Inserte un valor válido", 'error')
    else if (valorGasto === null || isNaN(valorGasto) || valorGasto < 0){
        ui.imprimirAlerta("Debe insertar un numero positivo", 'error')
    }else{
        presu.agregarGasto(NombreGasto, valorGasto)
        if (presu.restante > 0){
            ui.imprimirAlerta("Se agrego correctamente")
        }
        ui.actualizarGastosEnListado(presu)
        ui.actualizarRestante(presu)
        nuevoGasto.reset()
    }
}
function eliminarGasto(gastoAEliminar){
    if (gastoAEliminar.target.classList.contains("borrar-gasto")){
        const { id } = gastoAEliminar.target.parentElement.dataset
        presu.eliminarGasto(Number(id))
        ui.actualizarGastosEnListado(presu)
        ui.actualizarRestante(presu)
    }

}
