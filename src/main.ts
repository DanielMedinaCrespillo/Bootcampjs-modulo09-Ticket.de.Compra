import {
  LineaTicket,
  ResultadoLineaTicket,
  ResultadoTotalTicket,
  TicketFinal,
  TipoIva,
  TotalPorTipoIva,
} from "./modelo";

const productos: LineaTicket[] = [
  {
    producto: {
      nombre: "Legumbres",
      precio: 2,
      tipoIva: "general",
    },
    cantidad: 2,
  },
  {
    producto: {
      nombre: "Perfume",
      precio: 20,
      tipoIva: "general",
    },
    cantidad: 3,
  },
  {
    producto: {
      nombre: "Leche",
      precio: 1,
      tipoIva: "superreducidoC",
    },
    cantidad: 6,
  },
  {
    producto: {
      nombre: "Lasaña",
      precio: 5,
      tipoIva: "superreducidoA",
    },
    cantidad: 1,
  },
];

const obtenerPorcentajeIva = (tipoIva: TipoIva): number => {
  switch (tipoIva) {
    case "general":
      return 21;
    case "reducido":
      return 10;
    case "superreducidoA":
      return 5;
    case "superreducidoB":
      return 4;
    case "superreducidoC":
      return 0;
    case "sinIva":
      return 0;
    default:
      return 0;
  }
};

export const calculaTicket = (
  lineasTicket: LineaTicket[]
): ResultadoLineaTicket[] => {
  return lineasTicket.reduce<ResultadoLineaTicket[]>((acumulador, linea) => {
    const { producto, cantidad } = linea;
    const { nombre, precio, tipoIva } = producto;
    const porcentajeIva = obtenerPorcentajeIva(tipoIva);

    const precioSinIva = precio * cantidad;
    const iva = precioSinIva * (porcentajeIva / 100);
    const precioConIva = precioSinIva + iva;

    const resultadoLinea: ResultadoLineaTicket = {
      nombre,
      cantidad,
      precionSinIva: parseFloat(precioSinIva.toFixed(2)),
      tipoIva,
      precioConIva: parseFloat(precioConIva.toFixed(2)),
    };

    return [...acumulador, resultadoLinea];
  }, []);
};

const resultadoLineaTicket: ResultadoLineaTicket[] = calculaTicket(productos);

const calculaResultadoTotalTicket = (
  resultadoLineaTicket: ResultadoLineaTicket[]
): ResultadoTotalTicket[] => {
  const total = resultadoLineaTicket.reduce(
    (acc, linea) => {
      const { precionSinIva: precioSinIva, precioConIva } = linea;

      return {
        totalSinIva: parseFloat((acc.totalSinIva + precioSinIva).toFixed(2)),
        totalConIva: parseFloat((acc.totalConIva + precioConIva).toFixed(2)),
        totalIva: parseFloat((acc.totalConIva - acc.totalSinIva).toFixed(2)),
      };
    },
    {
      totalSinIva: 0,
      totalConIva: 0,
      totalIva: 0,
    }
  );

  return [total];
};

const resultadoTotalTicket: ResultadoTotalTicket[] =
  calculaResultadoTotalTicket(resultadoLineaTicket);

const mapTotalPorTipoIva = (
  tipoIva: TipoIva,
  lineasTicket: LineaTicket[]
): TotalPorTipoIva => {
  const productosFiltrados = lineasTicket.filter(
    (ticket) => ticket.producto.tipoIva === tipoIva
  );

  const cuantiaTotal = productosFiltrados.reduce((acc, ticket) => {
    const { precio } = ticket.producto;
    const { cantidad } = ticket;
    const porcentajeIva = obtenerPorcentajeIva(tipoIva);
    const precioSinIva = precio * cantidad;
    const iva = precioSinIva * (porcentajeIva / 100);
    return acc + iva;
  }, 0);

  return {
    tipoIva,
    cuantia: parseFloat(cuantiaTotal.toFixed(2)),
  };
};

const totalPorTipoIvaEnLineaTicket = (
  totalPorTipoIva: TotalPorTipoIva,
  lineasTicket: LineaTicket[]
): boolean =>
  lineasTicket.some(
    (ticket) => ticket.producto.tipoIva === totalPorTipoIva.tipoIva
  );

export const calculaTotalPorTipoIva = (
  lineasTicket: LineaTicket[]
): TotalPorTipoIva[] => {
  const tiposDeIva: TipoIva[] = [
    "general",
    "reducido",
    "superreducidoA",
    "superreducidoB",
    "superreducidoC",
    "sinIva",
  ];

  return tiposDeIva
    .map((tipoIva) => mapTotalPorTipoIva(tipoIva, lineasTicket))
    .filter((totalPorTipoIva) =>
      totalPorTipoIvaEnLineaTicket(totalPorTipoIva, lineasTicket)
    );
};

export const ticketFinal = (lineasTicket: LineaTicket[]): TicketFinal => {
  const finalLineaTicket = calculaTicket(lineasTicket);
  const finalTotalTicket = calculaResultadoTotalTicket(finalLineaTicket)[0];
  const desgloseIva = calculaTotalPorTipoIva(lineasTicket);

  const ticketFinal: TicketFinal = {
    lineas: finalLineaTicket,
    total: finalTotalTicket,
    desgloseIva,
  };

  return ticketFinal;
};

const ticketTotal = ticketFinal(productos);

console.log("Array de los productos", productos);
console.log(
  "Array del total de los productos con y sin iva",
  resultadoLineaTicket
);
console.log(
  "Array del total de con iva, sin iva y y el iva",
  resultadoTotalTicket
);
console.log("Array del ticket final", ticketTotal);
