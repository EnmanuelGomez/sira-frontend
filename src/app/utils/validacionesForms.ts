import { HealthFormData, VehicleFormData, HomeInsuranceFormData, TravelFormData, LifeFormData } from "@/app/models/FormData";

export const validateHealthForm = (formData: HealthFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.edad || formData.edad === "0") {
    errors.edad = "La edad es obligatoria.";
  }

  if (!formData.prima || formData.prima === "0") {
    errors.prima = "Debe indicar un monto de prima.";
  }

  if (!formData.sexo) {
    errors.sexo = "Debe seleccionar el sexo.";
  }

  if (!formData.modalidad_plan) {
    errors.modalidad_plan = "Debe seleccionar una modalidad de plan.";
  }

   if (!formData.acceso_internacional) {
    errors.acceso_internacional = "Debe especificar si desea cobertura internacional.";
  }

  if (!formData.condiciones_medicas_previas) {
    errors.condiciones_medicas_previas = "Debe indicar si tiene condiciones médicas.";
  }

  if (
    formData.condiciones_medicas_previas === "Si" &&
    !formData.enfermedad_preexistente
  ) {
    errors.enfermedad_preexistente = "Debe especificar la condición médica.";
  }

  if (!formData.principal_preocupacion) {
    errors.principal_preocupacion = "Debe indicar su principal interés o preocupación.";
  }

  return errors;
};

export const validateTravelForm = (formData: TravelFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.edad || formData.edad === "0") {
    errors.edad = "La edad es obligatoria.";
  }

  if (!formData.sexo) {
    errors.sexo = "Debe seleccionar el sexo.";
  }

  if (!formData.cobertura_medica) {
    errors.cobertura_medica = "Debe especificar si desea cobertura médica.";
  }

  if (!formData.destino) {
    errors.destino = "Debe seleccionar el destino.";
  }

  if (!formData.motivo_viaje) {
    errors.motivo_viaje = "Debe especificar el motivo del viaje.";
  }

  if (!formData.cobertura_equipaje) {
    errors.cobertura_equipaje = "Debe especificar si desea cobertura de equipaje.";
  }

  if (!formData.cobertura_cancelacion) {
    errors.cobertura_cancelacion = "Debe especificar si desea cobertura por cancelación.";
  }

  if (!formData.principal_preocupacion) {
    errors.principal_preocupacion = "Debe indicar su principal interés o preocupación.";
  }

  return errors;
};

export const validateLifeForm = (formData: LifeFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.edad || formData.edad === "0") {
    errors.edad = "La edad es obligatoria.";
  }

  if (!formData.sexo) {
    errors.sexo = "Debe seleccionar el sexo.";
  }

  if (!formData.objetivo) {
    errors.objetivo = "Debe indicar el motivo.";
  }

  if (!formData.tiempo_posesion) {
    errors.tiempo_posesion = "Debe indicar por cuánto tiempo desea mantener la póliza.";
  }

  if (!formData.prima || formData.prima === "0") {
    errors.prima = "Debe indicar un monto de prima.";
  }

  if (!formData.monto_asegurado || formData.monto_asegurado === "0") {
    errors.monto_asegurado = "Debe indicar un monto de asegurado.";
  }

  if (!formData.cobertura_medica) {
    errors.cobertura_medica = "Debe indicar si desea cobertura médica.";
  }

  if (!formData.gastos_funerarios) {
    errors.gastos_funerarios = "Debe indicar si desea cobertura de últimos gastos.";
  }

  if (!formData.principal_preocupacion) {
    errors.principal_preocupacion = "Debe indicar su principal interés o preocupación.";
  }

  return errors;
};

export const validateVehicleForm = (formData: VehicleFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.valor_aproximado || formData.valor_aproximado === "0") {
    errors.valor_aproximado = "Debe indicar un valor aproximado.";
  }

  if (!formData.tipo_de_vehiculo) {
    errors.tipo_de_vehiculo = "Debe indicar el tipo de vehiculo.";
  }

  if (!formData.anio_fabricacion) {
    errors.año_fabricacion = "Debe indicar el año de fabricacion.";
  }

  if (!formData.prima || formData.prima === "0") {
    errors.prima = "Debe indicar un monto de prima.";
  }

  if (!formData.monto_asegurado || formData.monto_asegurado === "0") {
    errors.monto_asegurado = "Debe indicar un monto asegurado.";
  }

  if (!formData.tipo_de_cobertura) {
    errors.tipo_de_cobertura = "Debe indicar el tipo de cobertura.";
  }

  if (!formData.deductible) {
    errors.deducible = "Debe indicar si desea pagar un 1% de deducible.";
  }

  if (
    formData.deductible === "No" &&
    !formData.nivel_deducible_personalizado
  ) {
    errors.nivel_deducible_personalizado = "Debe especificar el porcentaje dispuesto a pagar.";
  }

  if (!formData.principal_preocupacion) {
    errors.principal_preocupacion = "Debe indicar su principal interés o preocupación.";
  }

  return errors;
};

export const validateHousingForm = (formData: HomeInsuranceFormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.valor_aproximado || formData.valor_aproximado === "0") {
    errors.valor_aproximado = "Debe indicar un valor aproximado.";
  }

  if (!formData.prima || formData.prima === "0") {
    errors.prima = "Debe indicar un monto de prima.";
  }

  if (!formData.monto_asegurado || formData.monto_asegurado === "0") {
    errors.monto_asegurado = "Debe indicar un monto asegurado.";
  }

  if (!formData.principal_preocupacion) {
    errors.principal_preocupacion = "Debe indicar su principal interés o preocupación.";
  }

  return errors;
};
