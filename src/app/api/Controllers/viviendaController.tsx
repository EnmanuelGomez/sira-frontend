import { recomendarVivienda } from "../Services/recommend";
import { ViviendaFormPayload } from "../Types/insurance_types";

export async function procesarRecomendacionVivienda(formData: any) {
  
  const payload: ViviendaFormPayload = {
    prima: parseFloat(formData.prima),
    valor_aproximado: parseFloat(formData.valor_aproximado),
    aseguradora: formData.aseguradora,
    cobertura_bienes: formData.cobertura_bienes,
    cobertura_des_natural: formData.cobertura_des_natural,
    cobertura_incendios: formData.cobertura_incendios,
    seguridad: formData.seguridad,
    responsabilidad_civil: formData.responsabilidad_civil,
    principal_preocupacion: formData.principal_preocupacion
  };

  return await recomendarVivienda(payload);
}