'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/app/supabase/auth-provider'; 
import { supabase } from '@/app/utils/supabase/client';
import Link from 'next/link';

interface Plan {
  id: string;
  nombre_plan: string;
  id_tipo_seguro: string;
  id_aseguradora: string;
}

interface TipoSeguro {
  id: string;
  nombre: string;
}

export default function TusSegurosGuardados({ aseguradoraId }: { aseguradoraId: string }) {
  const { session } = useSession();
  const [planesPorTipo, setPlanesPorTipo] = useState<Record<string, Plan[]>>({});
  const [tiposSeguro, setTiposSeguro] = useState<TipoSeguro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardados = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: guardados, error } = await supabase
        .from("Seguros_guardados")
        .select("*")
        .eq("usuario_id", session.user.id);

      if (error) {
        setLoading(false);
        return;
      }

      const filtrados = guardados?.filter(
        (g) => g.aseguradora_id === Number(aseguradoraId)
      );

      const planIds = filtrados?.map((g) => g.plan_id);

      if (!planIds || planIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: planesData, error: planError } = await supabase
        .from("plan")
        .select("*")
        .in("id", planIds);

      if (planError) {
        setLoading(false);
        return;
      }

      const { data: tiposData, error: tiposError } = await supabase
        .from("tipo_seguro")
        .select("*");

      if (tiposError) {
        setLoading(false);
        return;
      }

      const agrupado: Record<string, Plan[]> = {};
      tiposData.forEach((tipo) => {
        agrupado[tipo.id] = planesData?.filter((p) => p.id_tipo_seguro === tipo.id) || [];
      });

      setTiposSeguro(tiposData || []);
      setPlanesPorTipo(agrupado);
      setLoading(false);
    };

    fetchGuardados();
  }, [session, aseguradoraId]);

  if (loading) return <p>Cargando seguros guardados...</p>;

  if (!session) {
    return (
      <div style={mensajeBoxStyle}>
        Debes crear una cuenta para guardar seguros.
      </div>
    );
  }

  const hayPlanes = Object.values(planesPorTipo).some((lista) => lista.length > 0);

  if (!hayPlanes) {
    return (
      <div style={mensajeBoxStyle}>
        Aún no tienes seguros guardados.
      </div>
    );
  }

  return (
    <>
      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Tus Seguros Guardados</h2>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {tiposSeguro.map((tipo) => (
          <div
            key={tipo.id}
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3 style={{ textTransform: "capitalize", color: "#1f2937", marginBottom: "1rem" }}>
              {tipo.nombre}
            </h3>

            {planesPorTipo[tipo.id]?.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "#6b7280" }}>
                No tienes planes guardados de este tipo.
              </p>
            ) : (
              planesPorTipo[tipo.id].map((plan) => (
                <Link
                  href={`/planes/${plan.id}`}
                  key={plan.id}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      marginBottom: "1rem",
                      background: "#fff",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    }}
                  >
                    <p style={{ color: "#1f2937" }}>{plan.nombre_plan}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const mensajeBoxStyle = {
  background: "#f1f5f9",
  height: "150px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  color: "#6b7280",
};
