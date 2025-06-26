import { recomendarSalud } from "../Services/recommend";
import { SaludFormPayload } from "../Types/insurance_types";

export async function procesarRecomendacionSalud(formData: any) {
  
  const payload: SaludFormPayload = {
    prima: parseFloat(formData.prima),
    nivel_de_cobertura: formData.nivel_de_cobertura,
    deductible: formData.deductible,
    satisfaccion_del_cliente: formData.satisfaccion_del_cliente,
    aseguradora: formData.aseguradora,
    condiciones_medicas_previas: formData.condiciones_medicas_previas,
    principal_preocupacion: formData.principal_preocupacion,
  };

  return await recomendarSalud(payload);
}