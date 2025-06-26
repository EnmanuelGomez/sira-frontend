"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/utils/supabase/client";
import { useSession } from "@/app/supabase/auth-provider";
import { obtenerDetallePlanObj } from "@/app/api/Queries/getPlanDetalleObj";

interface BotonGuardadoProps {
  nombrePlan: string;
}

const BotonGuardado = ({ nombrePlan }: BotonGuardadoProps) => {
  const [guardado, setGuardado] = useState(false);
  const { session } = useSession(); // asegúrate de que esto retorna el usuario logueado

  const handleClick = async () => {
    if (!guardado && session) {
      const detalle = await obtenerDetallePlanObj(nombrePlan);
      if (!detalle) return alert("Error al obtener detalle del plan");

      console.log("Detalle del plan:", detalle);
      console.log("Usuario logueado:", session?.user?.id);
      console.log("Supabase:", supabase);

      const { data, error } = await supabase.from("Seguros_guardados").insert({
        aseguradora_id: detalle.id_aseguradora,
        plan_id: detalle.id,
        usuario_id: session.user.id,
      });

      if (error) {
        console.error("Error al guardar:", error);
        alert("No se pudo guardar el plan");
        return;
      }

      alert("Plan guardado");
      setGuardado(true);
    } else if (guardado) {
      const confirmar = confirm("¿Deseas quitar este plan?");
      if (confirmar) {
        setGuardado(false);
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: "#e5e7eb",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Image
        src={guardado ? "/icons/remove-icon.png" : "/icons/save-icon.png"}
        alt={guardado ? "Quitar" : "Guardar"}
        width={24}
        height={24}
      />
    </div>
  );
};

export default BotonGuardado;
