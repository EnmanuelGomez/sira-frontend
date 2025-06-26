import { recomendarVida } from "../Services/recommend";
import { VidaFormPayload } from "../Types/insurance_types";

export async function procesarRecomendacionVida(formData: any) {
  
  const payload: VidaFormPayload = {
    aseguradora: formData.aseguradora,
    tipo_cobertura: formData.tipo_cobertura,
    tiempo_posesion: formData.tiempo_posesion,
    monto_asegurado: parseFloat(formData.monto_asegurado),
    cobertura_medica: formData.cobertura_medica,
    cobertura_deuda: formData.cobertura_deuda,
    gastos_funerarios: formData.gastos_funerarios,
    ahorro: formData.ahorro,
    principal_preocupacion: formData.principal_preocupacion
  };

  return await recomendarVida(payload);
}