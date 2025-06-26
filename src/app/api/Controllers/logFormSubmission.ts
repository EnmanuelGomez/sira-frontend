import { supabase } from "@/app/lib/supabaseClient";

export const guardarFormulario = async (
  formType: "salud" | "vehiculo" | "vida" | "vivienda" | "viaje",
  formData: any,
  userId: string | null
) => {
  const anonId =
    typeof window !== "undefined"
      ? localStorage.getItem("anon_id") || generarAnonId()
      : null;

  const result = await supabase.from("form_submissions").insert([
    {
      form_type: formType,
      user_id: userId || null,
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
