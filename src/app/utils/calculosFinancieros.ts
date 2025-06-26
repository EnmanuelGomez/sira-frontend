export function calcularMontoPorFrecuencia(prima: string, frecuencia: string): string {
  const primaAnual = parseFloat(prima);
  if (!primaAnual || !frecuencia) return "";

  let divisor = 1;
  switch (frecuencia) {
    case "Mensual":
      divisor = 12;
      break;
    case "Trimestral":
      divisor = 4;
      break;
    case "Semestral":
      divisor = 2;
      break;
    case "Anual":
    case "Pago Unico":
    default:
      divisor = 1;
      break;
  }

  const monto = primaAnual / divisor;

  return `Monto a pagar ${frecuencia.toLowerCase()}: RD$ ${monto.toLocaleString("es-DO", {
    style: "decimal",
    maximumFractionDigits: 2
  })}`;
}