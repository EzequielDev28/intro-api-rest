const API_URL = "https://68bb0dfe84055bce63f106af.mockapi.io/api/v1/dispositivos_IoT";
const tablaAuto = document.getElementById("tabla-auto");
const ultimoStatusAuto = document.getElementById("ultimo-status-auto");

// Cargar últimos 10 registros
async function cargarRegistrosAuto() {
  try {
    const res = await fetch(API_URL);
    let data = await res.json();

    // Ordenamos por ID desc
    data.sort((a, b) => Number(b.id) - Number(a.id));

    // Tomamos los últimos 10
    const ultimos10 = data.slice(0, 10);

    // Limpiar tabla
    tablaAuto.innerHTML = "";

    ultimos10.forEach(registro => {
      const fila = `
        <tr>
          <td>${registro.id}</td>
          <td>${registro.name}</td>
          <td>${registro.status}</td>
          <td>${registro.ip}</td>
          <td>${registro.date}</td>
        </tr>
      `;
      tablaAuto.innerHTML += fila;
    });

    // Último status (el más nuevo)
    if (ultimos10.length > 0) {
      ultimoStatusAuto.innerHTML = `Último Status: <strong>${ultimos10[0].status}</strong>`;
    }
  } catch (error) {
    console.error("Error en polling:", error);
  }
}

// Polling cada 5 segundos
setInterval(cargarRegistrosAuto, 5000);

// Inicializar
cargarRegistrosAuto();
