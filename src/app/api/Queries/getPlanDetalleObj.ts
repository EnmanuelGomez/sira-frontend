import { supabase } from "@/app/lib/supabaseClient";

export interface PlanDetalle {
  id: number;
  id_aseguradora: number;
  nombre_plan: string;
  tipo_de_cobertura: string;
  deductible: string;
  coberturas: string[];
  aseguradora_nombre: string;
  logo_url: string;
}

export const obtenerDetallePlanObj = async (
  nombre_plan: string
): Promise<PlanDetalle | null> => {
  const { data: plan, error: err1 } = await supabase
    .from("plan")
    .select("id, nombre_plan, id_aseguradora")
    .eq("nombre_plan", nombre_plan)
    .single();

  if (!plan || err1) return null;

  const { id, id_aseguradora } = plan;

  const { data: objectData } = await supabase
    .from("plan_object")
    .select("tipo_de_cobertura, deducible")
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
    id,
    id_aseguradora,
    logo_url: aseguradoraData.logo_url,
    aseguradora_nombre: aseguradoraData.nombre,
    nombre_plan: plan.nombre_plan,
    tipo_de_cobertura: objectData?.tipo_de_cobertura ?? "",
    deductible: objectData?.deducible ?? "",
    coberturas,
  };
};
