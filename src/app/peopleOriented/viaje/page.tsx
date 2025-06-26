"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react"; 
import { guardarFormulario } from "@/app/api/Controllers/logFormSubmission";
import { procesarRecomendacionViaje } from "@/app/api/Controllers/viajeController";
import { ensureAnonymousId } from "@/app/utils/initAnonymous";
import { validateTravelForm } from "@/app/utils/validacionesForms";
import { TravelFormData } from "@/app/Models/FormData";
import { obtenerDetallePlan, PlanDetalle } from "@/app/api/Queries/getPlanDetalle";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import BotonGuardado from "@/app/components/BotonGuardado";
import PlanDetalleModal from "@/app/components/PlanDetalleModal";
import TooltipInfo from "@/app/components/TooltipInfo";
import styles from "../../styles/FormLayout.module.css";

const TravelFormPage = () => {
  const [formData, setFormData] = useState<TravelFormData>({
    edad: "0",
    sexo: "",
    aseguradora: "",
    cobertura_medica: "",
    destino: "",
    cobertura_equipaje: "",
    cobertura_responsabilidad_civil: "",
    frecuencia_viajes: "",
    duracion_viaje:  "",
    motivo_viaje: "",
    cobertura_cancelacion:  "",
    actividades_riesgo: "",
    principal_preocupacion: "",
    otherConcern: "",
  });

  useEffect(() => {
    ensureAnonymousId(); 
  }, []);

  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
  
    if (type === "radio" || type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;
  
      // Para el caso específico de la preocupación principal (radio)
      if (name === "principal_preocupacion") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked ? value : "", 
        }));
        return;
      }
    }
  
    // Resto de campos normales
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    };
    
    const session = useSession();
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors = validateTravelForm(formData); 
          setFormErrors(errors);
      
          if (Object.keys(errors).length > 0) {
            return; // detener envío si hay errores
          }
  
      try {
        setLoading(true);
      // 1. Guardar en la base
        await guardarFormulario("viaje", formData, session?.user?.id ?? null);
      // 2. Procesar recomendación
        const response = await procesarRecomendacionViaje(formData);
        setRecomendaciones(response.recomendaciones);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); 
      }
    };
  
    const concernOptions = ["Costo", "Cobertura", "Servicio al cliente", "Facilidad de gestión online", "Otros"];

    // COMPONENTES DEL MODAL
    
        const [showModal, setShowModal] = useState(false);
        const [detallePlan, setDetallePlan] = useState<PlanDetalle | null>(null);
    
    // FUNCIÓN DE CARGA DE DETALLES
    
        const cargarDetallePlan = async (nombre_plan: string) => {
        const detalle = await obtenerDetallePlan(nombre_plan);
          if (!detalle) return;
          setDetallePlan(detalle);
          setShowModal(true);
        };
  

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        {/* FORMULARIO */}
        <div className={styles.leftColumn}>
          <h2 className={styles.formTitle}>Formulario de Seguro de Viajes</h2>
          <form onSubmit={handleSubmit}>

            {/* Edad */}
            <label className={styles.label}>Edad: {formData.edad || "Seleccionar"}</label>
              <input
                type="range"
                name="edad"
                min="18"
                max="64"
                step="1"
                value={formData.edad}
                onChange={handleChange}
                className={styles.slider}
            />

            {formErrors.edad && <p className={styles.errorText}>{formErrors.edad}</p>}

            {/* Sexo */}
            <label className={styles.label}>Sexo:</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>

              {formErrors.sexo && <p className={styles.errorText}>{formErrors.sexo}</p>}

            {/* Frecuencia viaje */}
            <label className={styles.label}>¿Con qué frecuencia viaja al año?</label>
              <select
                name="frecuencia_viajes"
                value={formData.frecuencia_viajes}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="1">1 vez</option>
                <option value="2-3">2-3 veces</option>
                <option value="4+">4 o más veces</option>
              </select>
              
            {/* Cobertura médica */}
            <label className={styles.label}>¿Requiere cobertura médica en el viaje?
              <TooltipInfo text="La cobertura médica internacional requiere un pago adicional para ser incluida en la póliza de viaje." />
            </label>
            <select
              name="cobertura_medica"
              value={formData.cobertura_medica}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {formErrors.cobertura_medica && <p className={styles.errorText}>{formErrors.cobertura_medica}</p>}

            {/* Destino principal */}
            <label className={styles.label}>¿Cuál es el destino principal de su viaje?</label>
              <select
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Seleccione una opción</option>
                <option value="nacional">República Dominicana</option>
                <option value="caribe">El Caribe</option>
                <option value="centroamerica">Centroamérica</option>
                <option value="norteamerica">EE. UU. / Canadá / México</option>
                <option value="sudamerica">Sudamérica</option>
                <option value="europa">Europa</option>
                <option value="asia">Asia</option>
                <option value="mediooriente">Medio Oriente</option>
                <option value="africa">África</option>
                <option value="oceania">Oceanía</option>
              </select>

              {formErrors.destino && <p className={styles.errorText}>{formErrors.destino}</p>}

            {/* Duración del viaje */}
            <label className={styles.label}>Duración del viaje:</label>
              <div className={`${styles.radioGroup} ${styles.marginBottom}`}>
              {["1 a 7 días", "8 a 14 días", "15 a 30 días", "Más de 30 días"].map((duracion) => (
            <label key={duracion} className={styles.radioLabel}>
              <input
                type="radio"
                name="duracion_viaje"
                value={duracion}
                checked={formData.duracion_viaje === duracion}
                onChange={handleChange}
              />
                {duracion}
            </label>
              ))}
              </div>

            {/* Motivo */}
            <label className={styles.label}>Motivo del viaje:</label>
              <select
                name="motivo_viaje"
                value={formData.motivo_viaje}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="turismo">Turismo</option>
                <option value="negocios">Negocios</option>
                <option value="estudios">Estudios</option>
              </select>

              {formErrors.motivo_viaje && <p className={styles.errorText}>{formErrors.motivo_viaje}</p>}

            {/* Pérdida de equipaje */}
            <label className={styles.label}>¿Le preocupa la pérdida o daño de su equipaje?
              <TooltipInfo text="La protección del equipaje requiere un pago adicional e incluye compensación por pérdida, daño o retraso." />
            </label>
            <select
              name="cobertura_equipaje"
              value={formData.cobertura_equipaje}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {formErrors.cobertura_equipaje && <p className={styles.errorText}>{formErrors.cobertura_equipaje}</p>}

            {/* Cancelación  */}
            <label className={styles.label}>¿Desea cobertura por cancelación o interrupción?
              <TooltipInfo text="La cobertura por cancelación o interrupción del viaje requiere un pago adicional y permite recuperar gastos no reembolsables ante eventos imprevistos." />
            </label>
              <select
                name="cobertura_cancelacion"
                value={formData.cobertura_cancelacion}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>

              {formErrors.cobertura_cancelacion && <p className={styles.errorText}>{formErrors.cobertura_cancelacion}</p>}

            {/* Responsabilidad civil */}
            <label className={styles.label}>¿Necesita un seguro con cobertura de responsabilidad civil?
              <TooltipInfo text="La cobertura de responsabilidad civil requiere un pago adicional y cubre daños a terceros causados durante el viaje." />
            </label>
            <select
              name="cobertura_responsabilidad_civil"
              value={formData.cobertura_responsabilidad_civil}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {/* Actividades de riesgo */}
            <label className={styles.label}>¿Planea actividades de riesgo o aventura?
              <TooltipInfo text="Las actividades de riesgo, como deportes extremos, requieren pago adicional y deben estar explícitamente incluidas en la póliza." />
            </label>
              <select
                name="actividades_riesgo"
                value={formData.actividades_riesgo}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="No">No</option>
                <option value="Si">Sí</option>
              </select>

            {/* Factores importantes */}
            <label className={styles.label}>Principales preocupaciones:</label>
            <div className={styles.checkboxGroup}>
              {concernOptions.map((concern) => (
                <label key={concern} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="principal_preocupacion"
                    value={concern}
                    checked={formData.principal_preocupacion === concern}
                    onChange={handleChange}
                  />
                  {concern}
                </label>
              ))}
            </div>

            {formErrors.principal_preocupacion && <p className={styles.errorText}>{formErrors.principal_preocupacion}</p>}

            {formData.principal_preocupacion === "Otros" && (
              <input
                type="text"
                name="otherConcern"
                placeholder="Especifique otra preocupación"
                value={formData.otherConcern}
                onChange={handleChange}
                className={styles.input}
              />
            )}

            <button type="submit" className={styles.button}>Enviar</button>
          </form>
        </div>

          {/* RECOMENDACIONES */}
          <div className={styles.rightColumn}>
            <h2 className={styles.rightTitle}>Recomendaciones</h2>

            <div className={styles.cardsContainer}>
              {loading ? (
                <Loader />
              ) : recomendaciones.length > 0 ? (
                  recomendaciones.map((nombre, index) => (
            <div key={index} className={styles.cardRow}>
            <div
              className={styles.card}
              onClick={() => cargarDetallePlan(nombre)}
              style={{ cursor: "pointer", flex: 1 }}
            >
              <h3>{nombre}</h3>
            </div>
                <BotonGuardado nombrePlan={nombre} />
            </div>
              ))
              ) : (
                <p>No hay recomendaciones aún.</p>
              )}
        </div>
      </div>
    </div>

    {/* MODAL */}
        {showModal && detallePlan && (
          <PlanDetalleModal detallePlan={detallePlan} onClose={() => setShowModal(false)} />
    )}

    </>
  );
};

export default TravelFormPage;