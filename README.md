# Conversor de Monedas Nacional

Página web que permite convertir un monto en **pesos chilenos (CLP)** a **dólar (USD)** o **euro (EUR)** utilizando la API pública de [mindicador.cl](https://mindicador.cl).

Además, muestra un gráfico con el historial de los últimos 10 días del valor de la moneda seleccionada.

## Características

- Input para ingresar la cantidad de pesos chilenos.
- Select con dos monedas: Dólar y Euro.
- Botón "Buscar" que consulta la API y calcula la conversión.
- Resultado mostrado en el DOM.
- Gráfico de línea (Chart.js) con el historial de los últimos 10 días.
- Manejo de errores con `try/catch`: si la API falla, se muestra el mensaje de error en pantalla.
- Diseño oscuro inspirado en el mockup del enunciado.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- [Chart.js](https://www.chartjs.org/) (vía CDN)
- API REST de [mindicador.cl](https://mindicador.cl)

## Cómo usar

1. Abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, etc.).
2. Ingresa un monto en pesos chilenos.
3. Selecciona la moneda de destino (Dólar o Euro).
4. Haz clic en **Buscar**.
5. Verás el resultado de la conversión y el gráfico con el historial.

> **Nota:** Se requiere conexión a internet para consultar la API de mindicador.cl.

## Estructura de archivos

```
.
├── index.html      # Estructura de la página
├── styles.css      # Estilos (tema oscuro)
├── script.js       # Lógica de conversión, fetch y gráfico
└── README.md       # Este archivo
```

## Endpoints de la API utilizados

| Endpoint                      | Descripción                              |
|-------------------------------|------------------------------------------|
| `https://mindicador.cl/api/dolar` | Valores recientes del dólar observado   |
| `https://mindicador.cl/api/euro`  | Valores recientes del euro              |

La respuesta incluye un array `serie` ordenado del más reciente al más antiguo. Se usa el primer elemento para el cálculo actual y los primeros 10 para el gráfico.

## Cálculo de la conversión

```
monto_en_moneda_extranjera = monto_CLP / valor_actual_de_la_moneda
```

Ejemplo: si el dólar vale 922,12 CLP y se ingresan 10.000 CLP:

```
10.000 / 922,12 ≈ 10,84 USD
```

## Requisitos cumplidos

1. Se obtienen los tipos de cambio desde mindicador.cl
2. Se calcula correctamente el cambio y se muestra en el DOM
3. El select implementa más de un tipo de moneda (dólar y euro)
4. Se usa `try/catch` para el método `fetch` y se muestran los errores en el DOM
5. Se implementa el gráfico de historial de los últimos 10 días

## Autor

