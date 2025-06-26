export interface SaludFormPayload {
  prima: number;
  nivel_de_cobertura: string;
  deductible: string;
  satisfaccion_del_cliente: string;
  aseguradora: string;
  condiciones_medicas_previas: string;
  principal_preocupacion: string;
}

export interface VehiculoFormPayload {
  tipo_de_vehiculo: string;
  valor_aproximado: number;
  tipo_de_cobertura: string;
  deductible: string;
  aseguradora: string;
  cobertura_robo: string;
  responsabilidad_civil: string;
  cobertura_legal: string;
  principal_preocupacion: string;
}

export interface ViajeFormPayload {
  aseguradora: string;
  cobertura_medica: string;
  destino: string;
  cobertura_equipaje: string;
  cobertura_responsabilidad_civil: string;
  principal_preocupacion: string;
}

export interface VidaFormPayload {
  aseguradora: string;
  tipo_cobertura: string;
  tiempo_posesion: string;
  monto_asegurado: number;
  cobertura_medica: string;
  cobertura_deuda: string;
  gastos_funerarios: string;
  ahorro: string;
  principal_preocupacion: string;
}

export interface ViviendaFormPayload {
  prima: number;
  valor_aproximado: number;
  aseguradora: string;
  cobertura_bienes: string;
  cobertura_des_natural: string;
  cobertura_incendios: string;
  seguridad: string;
  responsabilidad_civil: string;
  principal_preocupacion: string;
}