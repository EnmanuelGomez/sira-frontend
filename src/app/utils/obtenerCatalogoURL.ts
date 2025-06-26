type CatalogoMap = {
  [clave: string]: string;
};

const catalogoURLs: CatalogoMap = {
  HumanoSeg: "https://humanoseguros.com/directorio-medico/",
  SegUniversal: "https://enlinea.universal.com.do/salud/buscador-prestadores",
  LaColonial: "https://lacolonial.com.do/seguros-de-personas",
};

export function obtenerCatalogoURL(aseguradora: string): string | null {
  return catalogoURLs[aseguradora] || null;
}
