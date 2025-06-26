export function generarAnios(desde: number = 1990, hasta: number = new Date().getFullYear()): number[] {
  const anios = [];
  for (let i = hasta; i >= desde; i--) {
    anios.push(i);
  }
  return anios;
}
