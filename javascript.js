
const productos = [
    { id: 01, nombre: "Pollo al Horno", categoria: "PROTEINA", precio: 4000.00, stock: 10, img: "./img/Pollo.webp" },
    { id: 02, nombre: "Cerdo Horneado", categoria: "PROTEINA", precio: 3500.00, stock: 10, img: "./img/Cerdo.webp" },
    { id: 03, nombre: "Salmon al Horno", categoria: "PROTEINA", precio: 7000.00, stock: 10, img: "./img/Pescado.webp" },
    { id: 04, nombre: "Arroz ", categoria: "CONTORNO", precio: 1990.00, stock: 10, img: "./img/Arroz.webp" },
    { id: 05, nombre: "Fideos in amore ", categoria: "CONTORNO", precio: 1000.00, stock: 10, img: "./img/Fideos.webp" },
    { id: 06, nombre: "Papas Rusticas ", categoria: "CONTORNO", precio: 1500.00, stock: 10, img: "./img/Papas.webp" }
]

let carritoJSON = "" 
let totalFinal = ""
let unidades = ""
let contenedor = document.getElementById("contenedor")
let carritoRender = document.getElementById("cart-row")
let carritoRender2 = document.getElementById("cart-row-2")
let total = document.getElementById("total")
let cartNav = document.getElementById("cart-nav")
let botonCarrito = document.getElementById("cart-button")

renderizar(productos)

let carrito = []
if (localStorage.getItem("Carrito")) {
    carrito = JSON.parse(localStorage.getItem("Carrito"))
    renderizarCarro(carrito)
    totalRender(carrito)
} else {
    totalRenderVacio(carrito)
}

/*              Buscador       Filtros                        */
let proteina = document.getElementById("PROTEINA")
let contorno = document.getElementById("CONTORNO")
proteina.addEventListener("click", filtroCategoria)
acompañamiento.addEventListener("click", filtroCategoria)

function filtroCategoria(e) {
    e.preventDefault()
    let categoriafiltrado = productos.filter(producto => producto.categoria.toLowerCase() == e.target.id)
    renderizar(categoriafiltrado)
}

let input = document.getElementById("input")
let button = document.getElementById("buscador")
button.addEventListener("click", buscar)
function buscar(e) {
    e.preventDefault()
    let productoFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(input.value.toLowerCase()) || producto.categoria.toLowerCase().includes(input.value.toLowerCase()))
    renderizar(productoFiltrado)
}

/*                           Renderizar productos                  */
function renderizar(array) {

    contenedor.innerHTML = ""
    for (const producto of array) {

        let tarjetaBody = document.createElement("div")
        tarjetaBody.className = "col-lg-4"
        tarjetaBody.innerHTML = `
        <div class="div-img" ><img class="thumbnail" src="${producto.img}"></div>
        <div class="box-element product">
            <h6><strong>${producto.nombre}</strong></h6>
            <h6 class= "precio"><strong>Price: $ ${producto.precio.toFixed(2)}</strong></h6><hr>
            <button id ="${producto.id}" class="btn btn-outline-secondary add-btn update-cart">Add to Cart</button>
            <a class="btn btn-outline-success" href="#">View</a>
        </div>
        `
        contenedor.append(tarjetaBody)
    }
    let agregarCarrito = document.getElementsByClassName('btn btn-outline-secondary add-btn update-cart')
    for (boton of agregarCarrito) {
        boton.addEventListener("click", addItem)

    }
}

/*                         Agregar Productos al Carrito                   */
function addItem(e) {

    let productoBuscado = productos.find(producto => producto.id == e.target.id)
    let indexProduct = carrito.findIndex(producto => producto.id == productoBuscado.id)

    if (indexProduct != -1) {
        carrito[indexProduct].unidades++
        carrito[indexProduct].subtotal = carrito[indexProduct].precio * carrito[indexProduct].unidades
        carritoJSON = JSON.stringify(carrito)
        localStorage.setItem("Carrito", carritoJSON)
    }
    else {
        carrito.push({ id: productoBuscado.id, nombre: productoBuscado.nombre, categoria: productoBuscado.categoria, precio: productoBuscado.precio, 
            subtotal: productoBuscado.precio, unidades: 1,
             img: productoBuscado.img 
            })
        carritoJSON = JSON.stringify(carrito)
        localStorage.setItem("Carrito", carritoJSON)
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            // gravity: "top",
            position: 'top-right',
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            // width:"400px",
            // display:"block",
            maxWidth:"50%",
            className: "toastify",
            zIndex: 100
        }).showToast();

    }
    totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
    unidades = carrito.reduce((a, b) => a + b.unidades, 0)
    renderizarCarro(carrito)
    totalRender(carrito)
    
}
/*                     Renderizar Carrito                     */
function renderizarCarro(array) {
    carritoRender.innerHTML = ""
    for (let producto of array) {
        let cart = document.createElement("div")
        cart.className = "cart-render"
        cart.innerHTML = `
        <div class="cart-row">
        <div  style="flex:2"><img class="row-image" src="${producto.img}"></div>
        <div  style="flex:2"><p>${producto.nombre}</p></div>
        <div  style="flex:1"><p>$${producto.precio.toFixed(2)}</p></div>
        <div style="flex:1">
        <p class="quantity">${producto.unidades}</p>
        <div class="quantity">
        <img id="${producto.id}" class="chg-quantity update-cart " src="images/arrow-up.png">
        <img id="${producto.id}" class="chg-quantity-2 update-cart" src="images/arrow-down.png">
        </div>
        </div>
        <div style="flex:1"><p>$${producto.subtotal.toFixed(2)}</p></div>
        </div>
        `
        carritoRender.append(cart)
    }
    let add = document.getElementsByClassName("chg-quantity update-cart")
    for (let a of add) {
        a.addEventListener("click", addItem)
    }
    let remove = document.getElementsByClassName("chg-quantity-2 update-cart")
    for (let b of remove) {
        b.addEventListener("click", removeItem)
    }
    let botones = document.getElementsByClassName("boton")
    for (let boton of botones) {
        boton.addEventListener("click", showToast)
    }

}

/*               Eliminar Items del Carrito            */
function removeItem(e) {

    let productoBuscado = productos.find(producto => producto.id == e.target.id)
    let indexProduct = carrito.findIndex(producto => producto.id == productoBuscado.id)
    if (indexProduct != -1) {
        if (carrito[indexProduct].unidades >= 2) {
            carrito[indexProduct].unidades--
            carrito[indexProduct].subtotal = carrito[indexProduct].subtotal - carrito[indexProduct].precio
            carritoJSON = JSON.stringify(carrito)
            localStorage.setItem("Carrito", carritoJSON)
        }
        else {
            carrito.splice(indexProduct, 1)
            carritoJSON = JSON.stringify(carrito)
            localStorage.setItem("Carrito", carritoJSON)
        }
    }
    totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
    unidades = carrito.reduce((a, b) => a + b.unidades, 0)

    renderizarCarro(carrito)
    totalRender(carrito)
}
/*                   Renderizar Total de Precio y Unidades del Carrito             */
function totalRender(array) {
    totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
    unidades = carrito.reduce((a, b) => a + b.unidades, 0)
    total.innerHTML = ""
    let totalResumen = document.createElement("div")
    totalResumen.className = "total"
    totalResumen.innerHTML = `
    <h5>Items: <strong>${unidades} </strong></h5>
    <h5>Total:<strong> $ ${totalFinal.toFixed(2)}</strong></h5>
    <a id="clear" style="float:right; margin:5px;" type="button" class="btn btn-success" href="index.html">Pagar</a>
    `
    total.append(totalResumen)

    cartNav.innerHTML = ""
    if (array.lenght != 0) {
        let parrafo = document.createElement("div")
        parrafo.className = "cart-total"
        parrafo.innerHTML = `<p>${unidades}</p>`
        cartNav.append(parrafo)
    } else {
        let parrafo = document.createElement("div")
        parrafo.className = "cart-total"
        parrafo.innerHTML = `<p>0</p>`
        cartNav.append(parrafo)
    }
    let clear = document.getElementById("clear")
    clear.addEventListener("click", borrarStorage)
}
function totalRenderVacio(array) {

    total.innerHTML = ""
    let totalResumen = document.createElement("div")
    totalResumen.className = "total"
    totalResumen.innerHTML = `
    <h5>Items: <strong>  0 </strong></h5>
    <h5>Total:<strong> $ 0.00 </strong></h5>
    <a id="clear" style="float:right; margin:5px;" type="button" class="btn btn-success" href="index.html">Pagar</a>
    `
    total.append(totalResumen)

    cartNav.innerHTML = ""
    let parrafo = document.createElement("div")
    parrafo.className = "cart-total"
    parrafo.innerHTML = `<p>0</p>`
    cartNav.append(parrafo)
}
/*       Eliminar Carrito del LocalStorage  */
function borrarStorage() {
    localStorage.removeItem("Carrito")
}

botonCarrito.addEventListener("click", esconder)

function esconder(e) {
    contenedor.innerHTML = ""
    if (carrito.length == 0){
        let boton = document.createElement("div")
    boton.className = "boton-render"
    boton.innerHTML = `
        <a type="button" class="btn btn-success" href="index.html">Ir a la Tienda</a>
        `
    contenedor.append(boton)
    } else{

        let boton = document.createElement("div")
        boton.className = "boton-render"
        boton.innerHTML = `
        <a type="button" class="btn btn-success" href="index.html">Seguir comprando</a>
        `
        contenedor.append(boton)
    }

}