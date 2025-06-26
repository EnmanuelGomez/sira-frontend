import { supabase } from "@/app/lib/supabaseClient";
import styles from "./../plan.module.css";
import Header from "@/app/components/Header";

interface Plan {
  id: string;
  nombre_plan: string;
  id_tipo_seguro: string;
}

interface TipoSeguro {
  id: string;
  nombre: string;
}

export default async function DetallePlan({ params }: { params: { id: string } }) {
  // Obtener plan base
  const { data: plan, error: errorPlan } = await supabase
    .from("plan")
    .select("*")
    .eq("id", params.id)
    .single();

  if (errorPlan || !plan) {
    return <p className={styles.error}>Error al cargar el plan.</p>;
  }

  // Obtener tipo de seguro
  const { data: tipoSeguro } = await supabase
    .from("tipo_seguro")
    .select("nombre")
    .eq("id", plan.id_tipo_seguro)
    .single();

  // Obtener detalles específicos según tipo
  let detalles: any = null;

  if (["salud", "vida", "viaje"].includes(tipoSeguro?.nombre)) {
    const { data } = await supabase
      .from("plan_people")
      .select("prima, nivel_de_cobertura, duracion_poliza, deductible, condiciones_medicas_previas")
      .eq("id_plan", plan.id);
    detalles = data?.[0];
  } else if (["vehiculo", "vivienda"].includes(tipoSeguro?.nombre)) {
    const { data } = await supabase
      .from("plan_objeto")
      .select("tipo_de_cobertura, deducible")
      .eq("id_plan", plan.id);
    detalles = data?.[0];
  }

  // Obtener coberturas
  const { data: coberturasRelacionadas } = await supabase
    .from("plan_cobertura")
    .select("id_cobertura")
    .eq("id_plan", plan.id);

  const coberturaIds = coberturasRelacionadas?.map((c) => c.id_cobertura) || [];

  const { data: coberturas } = await supabase
    .from("cobertura")
    .select("cobertura")
    .in("id", coberturaIds);

  return (
     <>
        <Header />
        
    <div className={styles.container}>
      <h1 className={styles.title}>{plan.nombre_plan}</h1>
      <p className={styles.subtitle}><strong>Tipo de seguro:</strong> {tipoSeguro?.nombre}</p>

      {detalles && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Detalles del plan</h2>
          <ul className={styles.detailList}>
            {Object.entries(detalles).map(([key, value]) => (
              <li key={key} className={styles.detailItem}>
                <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {coberturas && coberturas.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Coberturas incluidas</h2>
          <ul className={styles.coverageList}>
            {coberturas.map((c, index) => (
              <li key={index} className={styles.coverageItem}>{c.cobertura}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}
