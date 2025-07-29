export interface HealthFormData {
  edad: string;
  sexo: string;
  estado_civil: string;
  modalidad_plan: string;
  frecuencia_pago: string;
  aseguradora: string;
  prima: string;
  nivel_de_cobertura: string;
  preferencia_hospitales: string;
  acceso_internacional: string;
  deductible: string;
  satisfaccion_del_cliente: string;
  condiciones_medicas_previas: string;
  enfermedad_preexistente: string;
  principal_preocupacion: string;
  otherConcern: string;
}

export interface VehicleFormData {
  edad: string;
  sexo: string;
  estado_civil: string;
  anio_fabricacion: string;
  monto_asegurado: string;
  frecuencia_uso: string;
  presupuesto_mensual: string;
  deducible_mayor_para_menor_prima: string;
  asistencia_en_carretera: string;
  frecuencia_pago: string;
  prima: string;
  tipo_de_vehiculo: string;
  valor_aproximado: string;
  tipo_de_cobertura: string;
  deductible: string;
  nivel_deducible_personalizado: string;
  aseguradora: string;
  cobertura_robo: string;
  responsabilidad_civil: string;
  cobertura_legal: string;
  cobertura_rotura: string;
  principal_preocupacion: string;
  otherConcern: string;
}

export interface TravelFormData {
  frecuencia_viajes: string;
  duracion_viaje: string;
  motivo_viaje: string;
  cobertura_cancelacion: string;
  actividades_riesgo: string;
  edad: string;
  sexo: string;
  aseguradora: string;
  cobertura_medica: string;
  destino: string;
  cobertura_equipaje: string;
  cobertura_responsabilidad_civil: string;
  principal_preocupacion: string;
  otherConcern: string | number | readonly string[] | undefined;
}

export interface LifeFormData {
  edad: string;
  sexo: string;
  dependientes: string;
  objetivo: string;
  prima: string;
  aseguradora: string;
  tipo_cobertura: string;
  tiempo_posesion: string;
  monto_asegurado: string;
  cobertura_medica: string;
  cobertura_deuda: string;
  gastos_funerarios: string;
  ahorro: string;
  principal_preocupacion: string;
  otherConcern: string | number | readonly string[] | undefined;
}

export interface HomeInsuranceFormData {
  edad: string;
  sexo: string;
  estado_civil: string;
  prima: string;
  valor_aproximado: string;
  monto_asegurado: string;
  aseguradora: string;
  cobertura_bienes: string;
  cobertura_des_natural: string;
  cobertura_incendios: string;
  seguridad: string;
  responsabilidad_civil: string;
  principal_preocupacion: string;
  otherConcern: string;
}
