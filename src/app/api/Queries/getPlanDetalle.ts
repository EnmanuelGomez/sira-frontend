import { supabase } from "@/app/lib/supabaseClient";

export interface PlanDetalle {
  nombre_plan: string;
  prima: number;
  nivel_de_cobertura: string;
  duracion_poliza: string;
  deductible: string;
  condiciones_medicas_previas: string;
  coberturas: string[];
  aseguradora_nombre: string;
  logo_url: string;
}

export const obtenerDetallePlan = async (nombre_plan: string): Promise<PlanDetalle | null> => {
  const { data: plan, error: err1 } = await supabase
    .from("plan")
    .select("id, nombre_plan, id_aseguradora")
    .eq("nombre_plan", nombre_plan)
    .single();

  if (!plan || err1) return null;

  const { id, id_aseguradora } = plan;

  const { data: peopleData } = await supabase
    .from("plan_people")
    .select("prima, nivel_de_cobertura, duracion_poliza, deductible, condiciones_medicas_previas")
    .eq("id_plan", id)
    .single();

  const { data: coberturaData } = await supabase
    .from("plan_cobertura")
    .select("cobertura(cobertura)")
    .eq("id_plan", id);

  const coberturas = coberturaData?.map((c: any) => c.cobertura.cobertura) || [];

  const { data: aseguradoraData, error: err2 } = await supabase
    .from("aseguradora")
    .select("nombre, logo_url")
    .eq("id", id_aseguradora)
    .single();

  if (!aseguradoraData || err2) return null;

  return {
    aseguradora_nombre: aseguradoraData.nombre,
    nombre_plan: plan.nombre_plan,
    prima: peopleData?.prima ?? 0,
    nivel_de_cobertura: peopleData?.nivel_de_cobertura ?? "",
    duracion_poliza: peopleData?.duracion_poliza ?? "",
    deductible: peopleData?.deductible ?? "",
    condiciones_medicas_previas: peopleData?.condiciones_medicas_previas ?? "",
    coberturas,
    logo_url: aseguradoraData.logo_url,
  };
};