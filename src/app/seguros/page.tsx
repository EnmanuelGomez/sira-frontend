"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header"; 
import styles from "./seguros.module.css";
import ManualButton from "../components/ManualButton";

export default function SeguroSelectorPage() {
  return (

    <div>
      
    <Header />
    <ManualButton />
    
    <main className={styles.page}>
      <h2 className={styles.titulo}>Selecciona la categoría de seguro</h2>

      <div className={styles.container}>
    <Link href="/peopleOriented">
      <div className={styles.recuadro}>
        <Image src="/icons/person-icon.png" alt="Personas" width={100} height={100} />
        <span>Orientado a Personas</span>
      </div>
    </Link>

    <Link href="/objectsOriented">
      <div className={styles.recuadro}>
        <Image src="/icons/objects-icon.png" alt="Objetos" width={100} height={100} />
        <span>Orientado a Bienes</span>
      </div>
    </Link>
    
      </div>

    </main>
    </div>
  );
}