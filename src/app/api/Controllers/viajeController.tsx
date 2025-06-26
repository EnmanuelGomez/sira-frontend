import { recomendarViaje } from "../Services/recommend";
import { ViajeFormPayload } from "../Types/insurance_types";

export async function procesarRecomendacionViaje(formData: any) {
  
  const payload: ViajeFormPayload = {
    aseguradora: formData.aseguradora,
    cobertura_medica: formData.cobertura_medica,
    destino: formData.destino,
    cobertura_equipaje: formData.cobertura_equipaje,
    cobertura_responsabilidad_civil: formData.cobertura_responsabilidad_civil,
    principal_preocupacion: formData.principal_preocupacion
  };

  return await recomendarViaje(payload);
}