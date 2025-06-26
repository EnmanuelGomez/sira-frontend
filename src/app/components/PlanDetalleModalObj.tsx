"use client";
import styles from "@/app/styles/FormLayout.module.css";

interface PlanDetalleObj {
  nombre_plan: string;
  deductible: string;
  coberturas: string[];
  aseguradora_nombre: string;
  logo_url: string;
}

interface PlanDetalleModalObjProps {
  detallePlan: PlanDetalleObj;
  onClose: () => void;
}

const PlanDetalleModal = ({ detallePlan, onClose }: PlanDetalleModalObjProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>X</button>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          {detallePlan.logo_url && (
            <img
              src={detallePlan.logo_url}
              alt={`Logo de ${detallePlan.aseguradora_nombre}`}
              style={{ width: "75px", height: "75px", marginRight: "1rem", objectFit: "contain" }}
            />
          )}
          <h2>{detallePlan.nombre_plan}</h2>
        </div>

        <p><strong>Deducible:</strong> {detallePlan.deductible}</p>
        <p><strong>Coberturas:</strong></p>
        <ul>
          {detallePlan.coberturas.map((cob, i) => (
            <li key={i}>{cob}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanDetalleModal;
