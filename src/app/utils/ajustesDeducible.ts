export const calcularPrimaConDeducible = (
  primaActual: string,
  aceptaDeducibleMayor: string
): string => {
  const prima = parseFloat(primaActual);
  if (aceptaDeducibleMayor === "Si") {
    return (prima * 0.85).toFixed(2); // reduce prima en 15%
  }
  return prima.toFixed(2);
};
