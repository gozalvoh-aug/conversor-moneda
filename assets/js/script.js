// Referencias a los elementos del DOM
const montoInput = document.getElementById('monto');
const monedaSelect = document.getElementById('moneda');
const btnBuscar = document.getElementById('btnBuscar');
const resultadoEl = document.getElementById('resultado');
const canvas = document.getElementById('grafico');

// Variable para guardar la instancia del gráfico y poder destruirla al actualizar
let chartInstance = null;

/**
 * Función principal: se ejecuta al hacer clic en "Buscar".
 * Obtiene el valor de la moneda desde mindicador.cl, calcula la conversión
 * y dibuja el historial de los últimos 10 días.
 */
btnBuscar.addEventListener('click', async () => {
  // Limpiar mensajes anteriores
  resultadoEl.textContent = '';
  resultadoEl.classList.remove('error');

  const monto = parseFloat(montoInput.value);
  const moneda = monedaSelect.value;

  // Validaciones básicas
  if (!monto || monto <= 0) {
    mostrarError('Ingrese un monto válido en pesos chilenos.');
    return;
  }
  if (!moneda) {
    mostrarError('Seleccione una moneda a convertir.');
    return;
  }

  // Llamada a la API con try-catch para capturar errores de red o de la API
  try {
    const data = await obtenerIndicador(moneda);

    // El primer elemento de la serie es el valor más reciente
    const valorActual = data.serie[0].valor;

    // Cálculo: CLP / valor de la moneda = cantidad en moneda extranjera
    const convertido = (monto / valorActual).toFixed(2);

    // Mostrar resultado en el DOM
    const nombreMoneda = moneda === 'dolar' ? 'USD' : 'EUR';
    resultadoEl.textContent = `Resultado: $${convertido} ${nombreMoneda}`;

    // Preparar y dibujar el gráfico con los últimos 10 días
    dibujarGrafico(data.serie, moneda);
  } catch (error) {
    // Captura cualquier error (API caída, red, etc.) y lo muestra en el DOM
    console.error(error);
    mostrarError('Error al consultar la API. Intente nuevamente más tarde.');
  }
});

/**
 * Consulta la API de mindicador.cl para el indicador indicado.
 * @param {string} tipo - Código del indicador ("dolar" o "euro")
 * @returns {Promise<object>} Datos del indicador en formato JSON
 */
async function obtenerIndicador(tipo) {
  const url = `https://mindicador.cl/api/${tipo}`;
  const respuesta = await fetch(url);

  // Si la respuesta no es exitosa, lanzamos un error
  if (!respuesta.ok) {
    throw new Error(`HTTP error! status: ${respuesta.status}`);
  }

  return await respuesta.json();
}

/**
 * Muestra un mensaje de error en el elemento de resultado.
 * @param {string} mensaje
 */
function mostrarError(mensaje) {
  resultadoEl.textContent = mensaje;
  resultadoEl.classList.add('error');
}

/**
 * Dibuja el gráfico de línea con los últimos 10 valores disponibles.
 * Los datos vienen ordenados del más reciente al más antiguo, por eso se invierten.
 * @param {Array} serie - Array de objetos { fecha, valor }
 * @param {string} moneda - "dolar" o "euro" (solo para el título)
 */
function dibujarGrafico(serie, moneda) {
  // Tomamos como máximo los 10 registros más recientes
  const ultimos10 = serie.slice(0, 10).reverse(); // invertir para orden cronológico

  const etiquetas = ultimos10.map(item => {
    // Formatear fecha a dd/mm
    const fecha = new Date(item.fecha);
    return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
  });

  const valores = ultimos10.map(item => item.valor);

  // Destruir gráfico anterior si existe (evita superposición)
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Crear nuevo gráfico con Chart.js
  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: `Valor ${moneda === 'dolar' ? 'Dólar' : 'Euro'} (CLP)`,
        data: valores,
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.15)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#00bcd4',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#e0e0e0' }
        },
        title: {
          display: true,
          text: 'Historial últimos 10 días',
          color: '#ffffff',
          font: { size: 14 }
        }
      },
      scales: {
        x: {
          ticks: { color: '#a0aec0' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color: '#a0aec0' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}


