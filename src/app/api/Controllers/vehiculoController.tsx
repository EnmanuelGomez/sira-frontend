import { recomendarVehiculo } from "../Services/recommend";
import { VehiculoFormPayload } from "../Types/insurance_types";

export async function procesarRecomendacionVehiculo(formData: any) {
  
  const payload: VehiculoFormPayload = {
    tipo_de_vehiculo: formData.tipo_de_vehiculo,
    valor_aproximado: parseFloat(formData.valor_aproximado),
    tipo_de_cobertura: formData.tipo_de_cobertura,
    deductible: formData.deductible,
    aseguradora: formData.aseguradora,
    cobertura_robo: formData.cobertura_robo,
    responsabilidad_civil: formData.responsabilidad_civil,
    cobertura_legal: formData.cobertura_legal,
    principal_preocupacion: formData.principal_preocupacion,
  };

  return await recomendarVehiculo(payload);
}