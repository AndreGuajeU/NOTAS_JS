

let notas = JSON.parse(localStorage.getItem("notas")) || [];        //Busca si hay notas guardadas en el navegador (localStorage), Si hay, las convierte de texto a objeto con JSON.parse.

const form = document.querySelector("form");                        // form -> apunta al formulario de la página
const notasContainer = document.getElementById("notasContainer");   //notasContainer -> es donde se van a mostrar las tarjetas de notas

form.addEventListener("submit", (e) => {                            // Captura el evento cuando se envía el formulario.
  e.preventDefault();                                               //e.preventDefault() evita que la página se recargue.

  const titulo = document.getElementById("Actividad").value;         //Obtiene los valores escritos por el usuario (Actividad)
  const descripcion = document.getElementById("Descripción").value;  //Obtiene los valores escritos por el usuario (Descripción)
  const categoria = document.getElementById("Categoria").value;      //Obtiene los valores escritos por el usuario (Categoría)

  if (!titulo || !descripcion || !categoria) return;                 //Verifica que todo esté lleno, Si algún campo está vacío, no hace nada.

  const nuevaNota = {                                                // Crea una nueva nota
    id: Date.now(),
    titulo,
    descripcion,
    categoria,
  };

  notas.push(nuevaNota);                                             // Guarda la nota
  localStorage.setItem("notas", JSON.stringify(notas));              // Guarda el arreglo en localStorage
  form.reset();                                                      // Limpia el formulario.
  mostrarNotas();                                                    // Muestra nuevamente todas las notas en pantalla.
});


// Función mostrar notas -----------------------------------------------------------------------------------------------------------------------

function mostrarNotas() {                                            // Define una función llamada mostrarNotas. El código dentro de las llaves {} se ejecutará cada vez que se llame a esta función
    notasContainer.innerHTML = "";                                   // Hace referencia a un elemento HTML (como un <div>) donde se van a mostrar las notas
  
    if (notas.length === 0) {                                        // Verificación de si hay Notas: Se verifica si la longitud de un array llamado notas es igual a 0
      notasContainer.innerHTML = "<p>No hay notas guardadas.</p>";   //Si no hay notas, muestra un mensaje con la función "return"
      return;
    }
  
    notas.forEach(nota => {                                          // Iteración sobre las notas (cuando existen)
      const col = document.createElement("div");                     // Se crea un nuevo elemento <div> y se asigna a la constante col.
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center";  //Estilo y diseño a partir de bootstrap
  
      const div = document.createElement("div");                     // Se crea otro nuevo elemento <div> y se asigna a la constante div. Este div representará la tarjeta individual de la nota.
      div.className = `card p-3 border-start border-2 nota-card ${getCategoriaColor(nota.categoria)}`;  //Se asignan clases CSS a este div. Esto es dinámico. Se llama a una función llamada getCategoriaColor pasándole la categoria de la nota actual
      div.style.width = "200px";                                     // Se establece el ancho del div.
      div.style.minHeight = "160px";                                 //  Se establece una altura mínima para el div
  

     //Se establece el contenido HTML dentro de este div ` utilizando template literals (las comillas invertidas) ``
     //<h5 class="fw-bold">${nota.titulo}</h5>: Un encabezado con el título de la nota (extraído de la propiedad titulo del objeto nota)
     //Un párrafo <p> con la descripción de la nota (extraída de la propiedad descripcion del objeto nota).
     // Un elemento <span> que actúa como una etiqueta (badge: clase de estilo para la etiqueta) mostrando la categoría de la nota.
     // button onclick: llama la función correspondiente (editar o eliminar) con el ID de la nota

      div.innerHTML = `                                              
        <h5 class="fw-bold">${nota.titulo}</h5>                                                     
        <p>${nota.descripcion}</p>
        <span class="badge ${getBadgeColor(nota.categoria)}">${nota.categoria}</span>
        <div class="mt-2 d-flex justify-content-between">
          <button onclick="editarNota(${nota.id})" class="btn btn-success btn-sm">Editar</button>
          <button onclick="eliminarNota(${nota.id})" class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      `;
  
      col.appendChild(div);                                       // El div que representa la tarjeta de la nota se añade como hijo al elemento col (la columna).
      notasContainer.appendChild(col);                            // La columna (col) que contiene la tarjeta de la nota se añade como hijo al elemento notasContainer, haciéndola visible en la página.
    });
  }
  
  //Función estilo de las notas -----------------------------------------------------------------------------------------------------------------------
  function getCategoriaColor(categoria) {                            //Colores de borde según categoría
    switch (categoria) {                                             //La función utiliza una estructura switch para evaluar el valor del parámetro categoria. Un switch es una forma eficiente de realizar múltiples comparaciones contra un solo valor.
      case "Trabajo":                                                //CASE: evalua cada caso dependiendo de la categoría
        return "border-primary bg-light";
      case "Personal":
        return "border-info bg-light";
      case "Estudio":
        return "border-warning bg-light";
      default:
        return "border-secondary bg-light";
    }
  }

  function getBadgeColor(categoria) {                               // Determina qué clases CSS aplicar a un badge (una etiqueta pequeña) que muestra la categoría de la nota.
    switch (categoria) {
      case "Trabajo":
        return "bg-primary"; // Azul
      case "Personal":
        return "bg-info"; // Verde
      case "Estudio":
        return "bg-warning text-dark"; // Amarillo con texto oscuro
      default:
        return "bg-secondary";
    }
  }

  // Función eliminar notas -----------------------------------------------------------------------------------------------------------------------

function eliminarNota(id) {                                       // Define una función llamada eliminarNota. Recibe un único argumento llamado id.
  notas = notas.filter(n => n.id !== id);                         // Utiliza el método filter() en el array notas. Crea un nuevo array que contiene solo los elementos del array original (
  localStorage.setItem("notas", JSON.stringify(notas));           // Se encarga de persistir los cambios realizados en el array notas en el almacenamiento local del navegador (localStorage).
  mostrarNotas();
}

// Función editar notas -----------------------------------------------------------------------------------------------------------------------
 
function editarNota(id) {                                          // Define una función llamada editarNota. Recibe un único argumento llamado id
  const nota = notas.find(n => n.id === id);                       // Busca las notas a editar. El método find() itera sobre el array notas y devuelve el primer elemento que cumpla con la condición proporcionada por la función de prueba
  document.getElementById("Actividad").value = nota.titulo;        // Esto llena el campo de "Actividad" con el título actual de la nota que se va a editar.
  document.getElementById("Descripción").value = nota.descripcion; // Esto llena el campo de "Descripción" con la descripción actual de la nota.
  document.getElementById("Categoria").value = nota.categoria;     // Esto llena el campo de "Categoría" con la categoría actual de la nota
  eliminarNota(id);                                                // Se elimina y se vuelve a agregar la nota modificada
}

mostrarNotas();

