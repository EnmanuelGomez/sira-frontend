"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Header from "../components/Header";
import styles from "./saved.module.css";
import { useRouter } from "next/navigation";
import ManualButton from "../components/ManualButton";

interface Aseguradora {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  sitio_web: string;
  logo_url: string;
}

export default function SeguroSelectorPage() {
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("aseguradora").select("*");
      if (error) console.error("Error:", error);
      else setAseguradoras(data);
    };
    fetchData();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/guardados/${id}`);
  };

  return (
    <div>
      <Header />
      <ManualButton />
      <main className={styles.page}>
        <h2 className={styles.titulo}>Aseguradoras</h2>
        <div className={styles.container}>
          {aseguradoras.map((aseg) => (
            <div key={aseg.id} className={styles.card} onClick={() => handleClick(aseg.id)}>
              <div className={styles.cardLeft}>
                <img src={aseg.logo_url} alt={aseg.nombre} className={styles.logo} />
                
              </div>
              <div className={styles.cardRight}>
                <h3>{aseg.nombre}</h3>
                <p><strong>Dirección:</strong> {aseg.direccion}</p>
                <p><strong>Teléfono:</strong> {aseg.telefono}</p>
                <p>
                  <a
                    href={aseg.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                  > Sitio Web
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}