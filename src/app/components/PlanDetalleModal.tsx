"use client";
import styles from "@/app/styles/FormLayout.module.css";

interface PlanDetalle {
  nombre_plan: string;
  prima: number;
  nivel_de_cobertura: string;
  duracion_poliza: string;
  deductible: string;
  condiciones_medicas_previas: string;
  coberturas: string[];
  aseguradora_nombre: string;
  logo_url: string;
}

interface PlanDetalleModalProps {
  detallePlan: PlanDetalle;
  onClose: () => void;
}

const PlanDetalleModal = ({ detallePlan, onClose }: PlanDetalleModalProps) => {
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

        <p><strong>Aseguradora:</strong> {detallePlan.aseguradora_nombre}</p>
        <p><strong>Prima:</strong> RD${detallePlan.prima}</p>
        <p><strong>Nivel de cobertura:</strong> {detallePlan.nivel_de_cobertura}</p>
        <p><strong>Duración de la póliza:</strong> {detallePlan.duracion_poliza}</p>
        <p><strong>Deducible:</strong> {detallePlan.deductible}</p>
        <p><strong>Condiciones médicas previas:</strong> {detallePlan.condiciones_medicas_previas}</p>
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
