"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonUbicacion = document.getElementById("btn-ubicacion");
    const mensaje = document.getElementById("mensaje-ubicacion");
    const resultados = document.getElementById("resultados-gasolineras");
    const tabla = document.getElementById("tabla-comparacion");

    let ubicacion = null;
    let estaciones = [];

    // PRECIOS POR GASOLINERA
    // Deben coincidir con index.html y detalle.js.
    const marcas = [
        {
            nombre: "UNO",
            regular: "$4.68",
            especial: "$5.13",
            diesel: "$4.86"
        },
        {
            nombre: "Texaco",
            regular: "$4.70",
            especial: "$5.13",
            diesel: "$4.86"
        },
        {
            nombre: "Puma",
            regular: "$4.80",
            especial: "$5.13",
            diesel: "$4.86"
        },
        {
            nombre: "Shell",
            regular: "$4.80",
            especial: "$5.13",
            diesel: "$4.86"
        }
    ];

    // Evita insertar HTML no deseado.
    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);
    }

    // Calcula la distancia aproximada entre coordenadas.
    function distanciaKm(lat1, lon1, lat2, lon2) {
        const rad = grados => grados * Math.PI / 180;
        const dLat = rad(lat2 - lat1);
        const dLon = rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(lat1)) *
            Math.cos(rad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return 6371 * 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );
    }

    // Identifica la marca usando los datos del mapa.
    function detectarMarca(tags) {
        const texto = [
            tags.brand,
            tags.name,
            tags.operator
        ].filter(Boolean).join(" ").toLowerCase();

        if (/\btexaco\b/.test(texto)) return "Texaco";
        if (/\bpuma\b/.test(texto)) return "Puma";
        if (/\bshell\b/.test(texto)) return "Shell";
        if (/\buno\b/.test(texto)) return "UNO";

        return tags.brand || tags.name || tags.operator || "Sin identificar";
    }

    // Busca cómo llegar a una estación.
    function enlaceMapa(estacion) {
        const destino = `${estacion.lat},${estacion.lon}`;

        return "https://www.google.com/maps/dir/?api=1&destination=" +
            encodeURIComponent(destino);
    }

    // Busca estaciones en Google Maps.
    function buscarEnMaps(marca = "") {
        let consulta = marca
            ? `gasolineras ${marca}`
            : "gasolineras";

        if (ubicacion) {
            consulta += ` cerca de ${ubicacion.lat},${ubicacion.lon}`;
        } else {
            consulta += " en El Salvador";
        }

        return "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(consulta);
    }

    // MUESTRA LA TABLA DE COMPARACIÓN CON LOS PRECIOS
    function mostrarComparacion() {
        if (!tabla) return;

        tabla.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Gasolinera</th>
                        <th>Regular</th>
                        <th>Especial</th>
                        <th>Diésel</th>
                    </tr>
                </thead>

                <tbody>
                    ${marcas.map(marca => {
                        const cantidad = estaciones.filter(
                            estacion =>
                                estacion.marca.toLowerCase() ===
                                marca.nombre.toLowerCase()
                        ).length;

                        return `
                            <tr>
                                <td>
                                    <strong>${escapar(marca.nombre)}</strong>
                                    <br>
                                    <small>
                                        ${cantidad} estación(es) encontrada(s)
                                        cerca de ti
                                    </small>
                                </td>
                                <td>${marca.regular}</td>
                                <td>${marca.especial}</td>
                                <td>${marca.diesel}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>

            
        `;
    }

    // Consulta estaciones registradas en OpenStreetMap.
    async function cargarEstaciones() {
        if (!ubicacion || !resultados) return;

        if (mensaje) {
            mensaje.textContent = "Buscando estaciones cercanas...";
        }

        resultados.innerHTML =
            "<p>Consultando el mapa. Espera un momento...</p>";

        const { lat, lon } = ubicacion;

        const consulta = `
            [out:json][timeout:25];
            (
                node["amenity"="fuel"](around:10000,${lat},${lon});
                way["amenity"="fuel"](around:10000,${lat},${lon});
                relation["amenity"="fuel"](around:10000,${lat},${lon});
            );
            out center tags;
        `;

        try {
            const respuesta = await fetch(
                "https://overpass-api.de/api/interpreter?data=" +
                encodeURIComponent(consulta)
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo consultar OpenStreetMap.");
            }

            const datos = await respuesta.json();

            estaciones = datos.elements
                .map(elemento => {
                    const latitud =
                        elemento.lat ?? elemento.center?.lat;

                    const longitud =
                        elemento.lon ?? elemento.center?.lon;

                    if (latitud == null || longitud == null) {
                        return null;
                    }

                    const tags = elemento.tags || {};

                    return {
                        nombre:
                            tags.name ||
                            tags.brand ||
                            "Estación de combustible",
                        marca: detectarMarca(tags),
                        lat: latitud,
                        lon: longitud,
                        distancia: distanciaKm(
                            lat,
                            lon,
                            latitud,
                            longitud
                        )
                    };
                })
                .filter(Boolean)
                .sort((a, b) => a.distancia - b.distancia);

            if (mensaje) {
                mensaje.textContent =
                    `Se encontraron ${estaciones.length} estaciones ` +
                    "registradas en un radio de 10 km.";
            }

            mostrarEstaciones();
            mostrarComparacion();

        } catch (error) {
            console.error("Error al cargar estaciones:", error);

            if (mensaje) {
                mensaje.textContent =
                    "No pudimos consultar el mapa. Revisa tu conexión e inténtalo de nuevo.";
            }

            resultados.innerHTML = `
                <article class="resultado-estacion">
                    <h3>No se pudieron cargar las estaciones</h3>
                    <p>
                        Puedes intentar la búsqueda directamente
                        en Google Maps.
                    </p>
                    <a
                        class="boton boton-principal"
                        href="${buscarEnMaps()}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Buscar en Google Maps
                    </a>
                </article>
            `;
        }
    }

    // Muestra las estaciones cercanas ordenadas por distancia.
    function mostrarEstaciones() {
        if (!resultados) return;

        if (estaciones.length === 0) {
            resultados.innerHTML = `
                <article class="resultado-estacion">
                    <h3>No encontramos estaciones cercanas</h3>
                    <p>
                        Es posible que no haya estaciones registradas
                        dentro de los 10 km consultados.
                    </p>
                    <a
                        class="boton boton-principal"
                        href="${buscarEnMaps()}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Buscar en Google Maps
                    </a>
                </article>
            `;
            return;
        }

        resultados.innerHTML = estaciones.map(estacion => `
            <article class="resultado-estacion">
                <h3>${escapar(estacion.nombre)}</h3>

                <p>
                    <strong>Marca:</strong>
                    ${escapar(estacion.marca)}
                </p>

                <p>
                    <strong>Distancia aproximada:</strong>
                    ${estacion.distancia.toFixed(2)} km en línea recta
                </p>

                <a
                    class="boton boton-principal"
                    href="${enlaceMapa(estacion)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Cómo llegar
                </a>
            </article>
        `).join("");
    }

    // Muestra la comparación inmediatamente, sin esperar la ubicación.
    mostrarComparacion();

    // Activa la búsqueda cuando se pulsa el botón.
    if (botonUbicacion) {
        botonUbicacion.addEventListener("click", () => {
            if (!navigator.geolocation) {
                if (mensaje) {
                    mensaje.textContent =
                        "Tu navegador no permite obtener la ubicación.";
                }
                return;
            }

            botonUbicacion.disabled = true;
            botonUbicacion.textContent = "Buscando ubicación...";

            navigator.geolocation.getCurrentPosition(
                async posicion => {
                    ubicacion = {
                        lat: posicion.coords.latitude,
                        lon: posicion.coords.longitude
                    };

                    try {
                        await cargarEstaciones();
                    } finally {
                        botonUbicacion.disabled = false;
                        botonUbicacion.textContent = "Actualizar ubicación";
                    }
                },
                error => {
                    if (mensaje) {
                        mensaje.textContent =
                            error.code === 1
                                ? "Permite el acceso a tu ubicación en Chrome."
                                : "No se pudo obtener tu ubicación. Inténtalo de nuevo.";
                    }

                    botonUbicacion.disabled = false;
                    botonUbicacion.textContent = "Intentar de nuevo";
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 60000
                }
            );
        });
    }

    console.log("Gasolineras SV está lista.");
});