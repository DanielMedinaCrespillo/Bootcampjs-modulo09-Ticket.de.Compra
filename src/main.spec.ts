import { calculaTicket, calculaTotalPorTipoIva, ticketFinal } from "./main";
import { LineaTicket } from "./modelo";

describe("calculaTicket", () => {
  it("debería calcular correctamente el precio sin IVA y con IVA para productos", () => {
    const productos: LineaTicket[] = [
      {
        producto: {
          nombre: "Legumbres",
          precio: 2,
          tipoIva: "general",
        },
        cantidad: 2,
      },
    ];

    const resultado = calculaTicket(productos);

    expect(resultado).toEqual([
      {
        nombre: "Legumbres",
        cantidad: 2,
        precionSinIva: 4,
        tipoIva: "general",
        precioConIva: 4.84,
      },
    ]);
  });
});

describe("calculaTotalPorTipoIva", () => {
  it("debería calcular correctamente el IVA total para cada tipo", () => {
    const lineasTicket: LineaTicket[] = [
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
          nombre: "Leche",
          precio: 1,
          tipoIva: "superreducidoC",
        },
        cantidad: 6,
      },
    ];

    const resultado = calculaTotalPorTipoIva(lineasTicket);

    expect(resultado).toEqual([
      { tipoIva: "general", cuantia: 0.84 }, // IVA del 21%
      { tipoIva: "superreducidoC", cuantia: 0 }, // IVA del 0%
    ]);
  });
});

describe("ticketFinal", () => {
  it("debería generar correctamente el ticket final", () => {
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
          nombre: "Leche",
          precio: 1,
          tipoIva: "superreducidoC",
        },
        cantidad: 6,
      },
    ];

    const resultado = ticketFinal(productos);

    expect(resultado).toEqual({
      lineas: [
        {
          nombre: "Legumbres",
          cantidad: 2,
          precionSinIva: 4,
          tipoIva: "general",
          precioConIva: 4.84,
        },
        {
          nombre: "Leche",
          cantidad: 6,
          precionSinIva: 6,
          tipoIva: "superreducidoC",
          precioConIva: 6,
        },
      ],
      total: {
        totalSinIva: 10,
        totalConIva: 10.84,
        totalIva: 0.84,
      },
      desgloseIva: [
        { tipoIva: "general", cuantia: 0.84 },
        { tipoIva: "superreducidoC", cuantia: 0 },
      ],
    });
  });
});
