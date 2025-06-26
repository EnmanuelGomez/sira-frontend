import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "@/app/components/Header";
import Link from "next/link";
import TusSegurosGuardados from "@/app/components/TusSegurosGuardados";

interface Params {
  id: string;
}

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

interface Aseguradora {
  id: string;
  nombre: string;
  logo_url: string;
}

export default async function Page({ params }: { params: Params }) {
  const cookieStore = cookies(); 
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const [asegResp, planesResp, tiposResp] = await Promise.all([
    supabase.from("aseguradora").select("*").eq("id", params.id).single(),
    supabase.from("plan").select("*").eq("id_aseguradora", params.id),
    supabase.from("tipo_seguro").select("*"),
  ]);

  const aseguradora = asegResp.data as Aseguradora | null;
  const planes = planesResp.data as Plan[] | null;
  const tiposSeguro = tiposResp.data as TipoSeguro[] | null;

  if (asegResp.error || !aseguradora || planesResp.error || tiposResp.error || !tiposSeguro) {
    return <p>Error al cargar los datos.</p>;
  }

  const planesPorTipo = tiposSeguro.reduce((acc: Record<string, Plan[]>, tipo) => {
    acc[tipo.id] = planes?.filter((plan) => plan.id_tipo_seguro === tipo.id) || [];
    return acc;
  }, {});

  return (
    <>
      <Header />

      <div style={{ padding: "2rem" }}>
        <img
          src={aseguradora.logo_url}
          alt={aseguradora.nombre}
          width={250}
          height={120}
          style={{ marginBottom: "2rem" }}
        />

        <TusSegurosGuardados aseguradoraId={params.id} />

        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Lista de pólizas</h2>

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

                {planesPorTipo[tipo.id].length === 0 ? (
                  <p style={{ fontStyle: "italic", color: "#6b7280" }}>
                    Esta aseguradora no ofrece planes de este tipo.
                  </p>
                ) : (
                  planesPorTipo[tipo.id].map((plan) => (
                    <Link href={`/planes/${plan.id}`} key={plan.id} style={{ textDecoration: "none" }}>
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
        </section>
      </div>
    </>
  );
}