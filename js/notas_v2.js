

let notas = JSON.parse(localStorage.getItem("notas")) || [];        //Busca si hay notas guardadas en el navegador (localStorage), Si hay, las convierte de texto a objeto con JSON.parse.

//Variables de paginación de las tabla
let notasPorPagina = 5;
let paginaActual = 1;



const form = document.querySelector("form");                        // form -> apunta al formulario de la página
const notasContainer = document.getElementById("notasContainer");   //notasContainer -> es donde se van a mostrar las tarjetas de notas

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("Actividad").value;
  const descripcion = document.getElementById("Descripción").value;
  const categoria = document.getElementById("Categoria").value;

  if (!titulo || !descripcion || !categoria) {
    if (!categoria) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar una categoría antes de guardar.",
      });
    }
    return;
  }

  const nuevaNota = {
    id: Date.now(),
    titulo,
    descripcion,
    categoria,
    fecha: new Date().toLocaleString(),
  };

  notas.push(nuevaNota);
  localStorage.setItem("notas", JSON.stringify(notas));
  form.reset();
  mostrarNotas();
});

// Función mostrar notas -----------------------------------------------------------------------------------------------------------------------

function mostrarNotas() {
  notasContainer.innerHTML = ""; // Limpiar

  if (notas.length === 0) {
    notasContainer.innerHTML = "<p>No hay notas guardadas.</p>";
    return;
  }

  // Calcular rango de notas a mostrar
  const inicio = (paginaActual - 1) * notasPorPagina;
  const fin = inicio + notasPorPagina;
  const notasPaginadas = notas.slice(inicio, fin);

  const tabla = document.createElement("table");
  tabla.className = "table table-bordered table-hover";

  tabla.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>Título</th>
        <th>Descripción</th>
        <th>Categoría</th>
        <th>Fecha Registro</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${notasPaginadas.map(nota => `
        <tr>
          <td>${nota.titulo}</td>
          <td>${nota.descripcion}</td>
          <td><span class="badge ${getBadgeColor(nota.categoria)}">${nota.categoria}</span></td>
          <td>${nota.fecha}</td>
          <td>
            <button onclick="editarNota(${nota.id})" class="btn btn-success btn-sm me-2">Editar</button>
            <button onclick="eliminarNota(${nota.id})" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  notasContainer.appendChild(tabla);

  // PAGINACIÓN
  const paginacionWrapper = document.createElement("div");
paginacionWrapper.className = "d-flex justify-content-center mt-3"; // Centra completamente

const paginacion = document.createElement("div");
paginacion.className = "btn-group"; // Agrupa botones y texto en línea con espaciado

  const totalPaginas = Math.ceil(notas.length / notasPorPagina);
  
  paginacion.innerHTML = `
  <button class="btn btn-outline-secondary" ${paginaActual === 1 ? "disabled" : ""} onclick="cambiarPagina(-1)">Anterior</button>
  <button class="btn btn-light disabled">Página ${paginaActual} de ${totalPaginas}</button>
  <button class="btn btn-outline-secondary" ${paginaActual === totalPaginas ? "disabled" : ""} onclick="cambiarPagina(1)">Siguiente</button>
`;

paginacionWrapper.appendChild(paginacion);
notasContainer.appendChild(paginacionWrapper);
}


function cambiarPagina(direccion) {
  paginaActual += direccion;
  mostrarNotas();
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

function getBadgeColor(categoria) {
  switch (categoria) {
    case "Trabajo":
      return "bg-primary"; // Azul
    case "Personal":
      return "bg-info"; // Celeste
    case "Estudio":
      return "bg-warning text-dark"; // Amarillo
    default:
      return "bg-secondary"; // Gris
  }
}

// Función eliminar notas -----------------------------------------------------------------------------------------------------------------------

function eliminarNota(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la nota de forma permanente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      notas = notas.filter(n => n.id !== id);
      localStorage.setItem("notas", JSON.stringify(notas));
      mostrarNotas();

      Swal.fire({
        title: "¡Eliminada!",
        text: "La nota ha sido eliminada correctamente.",
        icon: "success"
      });
    }
  });
}

// Función editar notas -----------------------------------------------------------------------------------------------------------------------

function editarNota(id) {
  Swal.fire({
    title: "¿Estás seguro de editar esta nota?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, editar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      const nota = notas.find(n => n.id === id);
      document.getElementById("Actividad").value = nota.titulo;
      document.getElementById("Descripción").value = nota.descripcion;
      document.getElementById("Categoria").value = nota.categoria;

      // Elimina la nota original para reemplazarla al guardar nuevamente
      notas = notas.filter(n => n.id !== id);
      localStorage.setItem("notas", JSON.stringify(notas));
      mostrarNotas();

    }
  });
}


// Función botón eliminar todas las notas -----------------------------------------------------------------------------------------------------------------------

function eliminarTodasLasNotas() {
  if (notas.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'No hay notas para eliminar',
      text: 'Tu lista de notas está vacía.',
    });
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esto eliminará todas tus notas guardadas.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar todo",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      notas = [];
      localStorage.removeItem("notas");
      mostrarNotas();

      Swal.fire({
        title: "¡Todas las notas han sido eliminadas!",
        icon: "success"
      });
    }
  });
}


mostrarNotas();

