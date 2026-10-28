
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const parametros = new URLSearchParams(window.location.search);
    const marcaSolicitada = (parametros.get("marca") || "").toLowerCase();

    // PRECIOS CONFIGURADOS PARA EL PROYECTO
    const preciosPorMarca = {
        uno: {
            regular: "$4.68",
            especial: "$5.13",
            diesel: "$4.86"
        },
        texaco: {
            regular: "$4.70",
            especial: "$5.13",
            diesel: "$4.86"
        },
        puma: {
            regular: "$4.80",
            especial: "$5.13",
            diesel: "$4.86"
        },
        shell: {
            regular: "$4.80",
            especial: "$5.13",
            diesel: "$4.86"
        }
    };

    const zona = "Zona central";
    const vigencia = "27 de octubre al 9 de noviembre de 2026";

    // INFORMACIÓN DE LAS MARCAS Y CONTACTOS
    const marcas = {
                uno: {
            nombre: "UNO",
            imagen: "img/uno.jpg",
            descripcion:
                "Conoce la oferta de combustibles y servicios de las estaciones UNO en El Salvador.",
            sitio: "https://www.uno-ca.com/sv/",
            combustibles:
                "Gasolina regular, gasolina especial y diésel. Confirma los productos disponibles en la estación que visitarás.",
            servicios:
                "La disponibilidad de servicios vehiculares depende de cada estación. Consulta directamente la sucursal para confirmar los servicios disponibles.",
            tienda:
                "UNO cuenta con tiendas Pronto en estaciones seleccionadas.",
            telefono: "+503 2528-8000",
            correo: ""
        },

        texaco: {
            nombre: "Texaco",
            imagen: "img/texaco.jpg",
            descripcion:
                "Estaciones de servicio Texaco en El Salvador, con combustibles y productos para el cuidado del vehículo.",
            sitio: "https://roceli.com/",
            combustibles:
                "Gasolina regular, gasolina especial y diésel. Confirma la disponibilidad y denominación de los productos en cada estación.",
            servicios:
                "Las estaciones pueden ofrecer distintos servicios. Consulta la sucursal para confirmar disponibilidad y horarios.",
            tienda:
                "La disponibilidad de tiendas de conveniencia y productos adicionales depende de cada sucursal.",
            telefono: "+503 2233-6800",
            correo: "servicioalcliente@roceli.com"
        },

        puma: {
            nombre: "Puma",
            imagen: "img/puma.jpg",
            descripcion:
                "Puma Energy ofrece combustibles, lubricantes y opciones de conveniencia para automovilistas en El Salvador.",
            sitio: "https://pumaenergy.com/es/country/el-salvador-es/",
            combustibles:
                "Gasolinas y diésel. La disponibilidad de cada producto debe confirmarse en la estación.",
            servicios:
                "La oferta puede incluir venta de combustibles, lubricantes y servicios complementarios según la sucursal.",
            tienda:
                "Puma Energy cuenta con las marcas de conveniencia Super7 y Shop Express. La disponibilidad varía por sucursal.",
            telefono: "+503 2241-0200",
            correo: ""
        },

        shell: {
            nombre: "Shell",
            imagen: "img/shell.jpg",
            descripcion:
                "Shell ofrece combustibles y productos para automovilistas en El Salvador mediante su distribuidor local.",
            sitio: "https://www.shell.com.sv/",
            combustibles:
                "Shell Regular, Shell V-Power y diésel, según la disponibilidad de cada estación.",
            servicios:
                "La oferta de servicios depende de cada estación. Consulta directamente la sucursal para confirmar los servicios disponibles.",
            tienda:
                "La disponibilidad de tiendas y servicios complementarios depende de cada estación.",
            telefono: "+503 2241-0200",
            correo: ""
        }
    };

    const marca = marcas[marcaSolicitada];

    const nombreMarca = document.getElementById("nombre-marca");
    const descripcionMarca = document.getElementById("descripcion-marca");
    const datoMarca = document.getElementById("dato-marca");
    const datoCombustibles = document.getElementById("dato-combustibles");
    const datoServicios = document.getElementById("dato-servicios");
    const datoTienda = document.getElementById("dato-tienda");
    const datoTelefono = document.getElementById("dato-telefono");
    const datoCorreo = document.getElementById("dato-correo");
    const enlaceOficial = document.getElementById("enlace-oficial-marca");
    const buscarEstaciones = document.getElementById("buscar-estaciones-marca");
    const listaEstaciones = document.getElementById("estaciones-marca");
    const tablaPrecios = document.getElementById("tabla-precios-marca");

    // MARCA NO ENCONTRADA
    if (!marca) {
        document.title = "Marca no encontrada | Gasolineras SV";

        if (nombreMarca) {
            nombreMarca.textContent = "Marca no encontrada";
        }

        if (descripcionMarca) {
            descripcionMarca.textContent =
                "Selecciona UNO, Texaco, Puma o Shell desde la página principal.";
        }

        if (datoMarca) {
            datoMarca.textContent = "No seleccionada";
        }

        if (listaEstaciones) {
            listaEstaciones.textContent =
                "Vuelve a la página principal para seleccionar una marca.";
        }

        if (buscarEstaciones) {
            buscarEstaciones.hidden = true;
        }

        return;
    }

    // INFORMACIÓN GENERAL
    document.title = `${marca.nombre} | Gasolineras SV`;
    // MOSTRAR IMAGEN DE LA MARCA
const imagenMarca = document.getElementById("imagen-marca");

if (imagenMarca) {
    imagenMarca.src = marca.imagen;
    imagenMarca.alt = `Gasolinera ${marca.nombre}`;

    imagenMarca.onerror = () => {
        console.error("No se pudo cargar la imagen:", marca.imagen);
    };
}

    if (nombreMarca) nombreMarca.textContent = marca.nombre;
    if (descripcionMarca) descripcionMarca.textContent = marca.descripcion;
    if (datoMarca) datoMarca.textContent = marca.nombre;

    if (datoCombustibles) {
        datoCombustibles.textContent = marca.combustibles;
    }

    if (datoServicios) {
        datoServicios.textContent = marca.servicios;
    }

    if (datoTienda) {
        datoTienda.textContent = marca.tienda;
    }

    // MOSTRAR TELÉFONO Y CORREO COMO ENLACES
    function mostrarContacto(elemento, valor, tipo) {
        if (!elemento) return;

        elemento.replaceChildren();

        if (!valor) {
            elemento.textContent =
                "No se ha publicado un contacto general verificado.";
            return;
        }

        const enlace = document.createElement("a");
        enlace.textContent = valor;

        if (tipo === "telefono") {
            enlace.href = `tel:${valor.replace(/[^\d+]/g, "")}`;
            enlace.setAttribute("aria-label", `Llamar a ${valor}`);
        } else if (tipo === "correo") {
            enlace.href = `mailto:${valor}`;
            enlace.setAttribute("aria-label", `Enviar correo a ${valor}`);
        }

        elemento.appendChild(enlace);
    }

    mostrarContacto(datoTelefono, marca.telefono, "telefono");
    mostrarContacto(datoCorreo, marca.correo, "correo");

    // SITIO OFICIAL
    if (enlaceOficial) {
        enlaceOficial.href = marca.sitio;
        enlaceOficial.textContent = `Visitar sitio oficial de ${marca.nombre}`;
        enlaceOficial.target = "_blank";
        enlaceOficial.rel = "noopener noreferrer";
    }

    // TABLA DE PRECIOS CONFIGURADOS
    if (tablaPrecios) {
        const precios = preciosPorMarca[marcaSolicitada];

        tablaPrecios.replaceChildren();

        const filas = [
            ["Gasolina regular", `${precios.regular} por galón`],
            ["Gasolina especial", `${precios.especial} por galón`],
            ["Diésel bajo en azufre", `${precios.diesel} por galón`],
            ["Zona de referencia", zona],
            ["Vigencia indicada", vigencia]
        ];

        filas.forEach(([combustible, precio]) => {
            const fila = document.createElement("tr");
            const celdaCombustible = document.createElement("td");
            const celdaPrecio = document.createElement("td");

            celdaCombustible.textContent = combustible;
            celdaPrecio.textContent = precio;

            fila.append(celdaCombustible, celdaPrecio);
            tablaPrecios.appendChild(fila);
        });
    }

    // BÚSQUEDA EN GOOGLE MAPS
    const consulta = `gasolineras ${marca.nombre} en El Salvador`;
    const urlGoogleMaps =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(consulta);

    if (buscarEstaciones) {
        buscarEstaciones.href = urlGoogleMaps;
    }

    // ESCAPAR TEXTO HTML
    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);
    }

    // BUSCAR ESTACIONES CERCANAS CON OPENSTREETMAP
    async function cargarEstacionesCercanas(posicion) {
        if (!listaEstaciones) return;

        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;

        listaEstaciones.textContent = "Buscando estaciones cercanas...";

        const consultaOverpass = `
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
                encodeURIComponent(consultaOverpass)
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo consultar el mapa.");
            }

            const datos = await respuesta.json();

            const estaciones = datos.elements
                .map(elemento => {
                    const tags = elemento.tags || {};

                    const textoMarca = [
                        tags.brand,
                        tags.name,
                        tags.operator
                    ].filter(Boolean).join(" ").toLowerCase();

                    const latitud = elemento.lat ?? elemento.center?.lat;
                    const longitud = elemento.lon ?? elemento.center?.lon;

                    if (latitud == null || longitud == null) {
                        return null;
                    }

                    const coincide = marcaSolicitada === "uno"
                        ? /\buno\b/.test(textoMarca)
                        : textoMarca.includes(marca.nombre.toLowerCase());

                    if (!coincide) return null;

                    return {
                        nombre:
                            tags.name ||
                            tags.brand ||
                            "Estación de combustible",
                        lat: latitud,
                        lon: longitud
                    };
                })
                .filter(Boolean);

            if (estaciones.length === 0) {
                listaEstaciones.innerHTML = `
                    <p>
                        No encontramos estaciones registradas de
                        ${escapar(marca.nombre)} dentro de los 10 km consultados.
                        Esto no significa necesariamente que no existan.
                    </p>
                    <p>
                        <a href="${urlGoogleMaps}"
                           target="_blank"
                           rel="noopener noreferrer">
                           Buscar ${escapar(marca.nombre)} en Google Maps
                        </a>
                    </p>
                `;
                return;
            }

            listaEstaciones.innerHTML = estaciones.map(estacion => {
                const destino = `${estacion.lat},${estacion.lon}`;

                const ruta =
                    "https://www.google.com/maps/dir/?api=1&destination=" +
                    encodeURIComponent(destino);

                return `
                    <article class="resultado-estacion">
                        <h3>${escapar(estacion.nombre)}</h3>
                        <p>Marca: ${escapar(marca.nombre)}</p>
                        <a class="boton boton-principal"
                           href="${ruta}"
                           target="_blank"
                           rel="noopener noreferrer">
                           Cómo llegar
                        </a>
                    </article>
                `;
            }).join("");

        } catch (error) {
            console.error("Error al buscar estaciones:", error);

            listaEstaciones.innerHTML = `
                <p>No fue posible cargar las estaciones cercanas.</p>
                <p>
                    <a href="${urlGoogleMaps}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Buscar ${escapar(marca.nombre)} en Google Maps
                    </a>
                </p>
            `;
        }
    }

    // SOLICITAR UBICACIÓN
    if (navigator.geolocation && listaEstaciones) {
        navigator.geolocation.getCurrentPosition(
            cargarEstacionesCercanas,
            () => {
                listaEstaciones.innerHTML = `
                    <p>
                        No se pudo acceder a tu ubicación.
                        Puedes buscar estaciones directamente en Google Maps.
                    </p>
                    <p>
                        <a href="${urlGoogleMaps}"
                           target="_blank"
                           rel="noopener noreferrer">
                           Buscar ${escapar(marca.nombre)} en Google Maps
                        </a>
                    </p>
                `;
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    } else if (listaEstaciones) {
        listaEstaciones.textContent =
            "Tu navegador no permite obtener la ubicación. Utiliza Google Maps para buscar estaciones.";
    }

    console.log(`Página de ${marca.nombre} preparada.`);
});
