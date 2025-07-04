import { supabase } from "@/app/lib/supabaseClient";

export const guardarFormulario = async (
  formType: "salud" | "vehiculo" | "vida" | "vivienda" | "viaje",
  formData: any,
  userId: string | null
) => {
  let anonId: string | null = null;

  // Solo generar anon_id si NO hay userId
  if (!userId && typeof window !== "undefined") {
    anonId = localStorage.getItem("anon_id") || generarAnonId();
  }

  const result = await supabase.from("form_submissions").insert([
    {
      form_type: formType,
      user_id: userId,
      anonymous_id: anonId,
      was_authenticated: !!userId,
      raw_data: formData,
      source_ip: null,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : null,
    },
  ]);

  return result;
};

function generarAnonId(): string {
  const nuevo = crypto.randomUUID();
  localStorage.setItem("anon_id", nuevo);
  return nuevo;
}