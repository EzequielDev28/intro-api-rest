const API_URL = "https://68bb0dfe84055bce63f106af.mockapi.io/api/v1/dispositivos_IoT";
const form = document.getElementById("form-status");
const tabla = document.getElementById("tabla-registros");
const ultimoStatus = document.getElementById("ultimo-status");

// Obtener IP pública
async function obtenerIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("Error obteniendo IP:", error);
    return "Desconocida";
  }
}

// Cargar últimos 5 registros ordenados por ID en cliente
async function cargarRegistros() {
  try {
    const res = await fetch(API_URL);
    let data = await res.json();

    // Convertir id a número para ordenar correctamente
    data.sort((a, b) => Number(b.id) - Number(a.id));

    // Tomamos solo los 5 más recientes
    const ultimos5 = data.slice(0, 5);

    // Limpiamos el tbody
    tabla.innerHTML = "";

    ultimos5.forEach(registro => {
      const fila = `
        <tr>
          <td>${registro.id}</td>
          <td>${registro.name}</td>
          <td>${registro.status}</td>
          <td>${registro.ip}</td>
          <td>${registro.date}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });

    // El más reciente es siempre el primero después de ordenar
    if (ultimos5.length > 0) {
      ultimoStatus.innerHTML = `Último Status: <strong>${ultimos5[0].status}</strong>`;
    }
  } catch (error) {
    console.error("Error cargando registros:", error);
  }
}

// Enviar nuevo registro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const status = document.getElementById("status").value;

  const ip = await obtenerIP();
  const fecha = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        status: status,
        ip: ip,
        date: fecha
      })
    });

    // ✅ Actualizamos inmediatamente el último status con lo enviado
    ultimoStatus.innerHTML = `Último Status: <strong>${status}</strong>`;

    form.reset();

    // ✅ Refrescamos la tabla para que se vean los últimos 5 incluyendo este nuevo
    cargarRegistros();
  } catch (error) {
    console.error("Error enviando registro:", error);
  }
});

// Inicializar
cargarRegistros();
