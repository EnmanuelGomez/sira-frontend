"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react"; 
import { guardarFormulario } from "@/app/api/Controllers/logFormSubmission";
import { procesarRecomendacionSalud } from "@/app/api/Controllers/saludController";
import { ensureAnonymousId } from "@/app/utils/initAnonymous";
import { calcularMontoPorFrecuencia } from "@/app/utils/calculosFinancieros";
import { obtenerCatalogoURL } from "@/app/utils/obtenerCatalogoURL";
import { validateHealthForm } from "@/app/utils/validacionesForms";
import { HealthFormData } from "@/app/models/FormData";
import { obtenerDetallePlan, PlanDetalle } from "@/app/api/Queries/getPlanDetalle";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import BotonGuardado from "@/app/components/BotonGuardado";
import PlanDetalleModal from "@/app/components/PlanDetalleModal";
import TooltipInfo from "@/app/components/TooltipInfo";
import styles from "../../styles/FormLayout.module.css";

const HealthFormPage = () => {
  const [formData, setFormData] = useState<HealthFormData>({
    edad: "0",
    sexo: "",
    estado_civil: "",
    modalidad_plan: "",
    frecuencia_pago: "",
    preferencia_hospitales: "",
    acceso_internacional: "",
    aseguradora: "",
    otherConcern: "",
    prima: "0",
    nivel_de_cobertura: "",
    deductible: "",
    satisfaccion_del_cliente: "",
    condiciones_medicas_previas: "",
    enfermedad_preexistente: "",
    principal_preocupacion: "",
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
        [name]: checked ? value : "", // sólo actualiza si está checked
      }));
      return;
    }
  }

  // resetea el campo si no se desea atención internacional
    if (name === "acceso_internacional" && value !== "Si") {
      setFormData((prev) => ({
      ...prev,
      deductible: "", 
    }));
    }

  //Limpia los campos de enfermedad preexistente
    if (name === "condiciones_medicas_previas" && value === "No") {
      setFormData((prev) => ({
      ...prev,
      [name]: value,
      preexistente_especifica: "",
      }));
        return;
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

    const errors = validateHealthForm(formData); // validación
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // detener envío si hay errores
    }

    try {
      setLoading(true); // empieza el loading
    // 1. Guardar en la base
      await guardarFormulario("salud", formData, session?.user?.id ?? null);
    // 2. Procesar recomendación
      const response = await procesarRecomendacionSalud(formData);
      setRecomendaciones(response.recomendaciones);
    } catch (error) {
      console.error("Error:", error);
    } finally {
        setLoading(false); // finaliza el loading
      }
  };

  const concernOptions = ["Costo", "Cobertura", "Red de hospitales", "Servicio al cliente", "Facilidad de gestión online",  "Otros"];

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
          <h2 className={styles.formTitle}>Formulario de Seguro de Salud</h2>
          <form onSubmit={handleSubmit}>
            
            {/* preguntas demográficas */}
            <label className={styles.label}>Edad: {formData.edad || "Seleccionar"} </label>
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

            <label className={styles.label}>Estado civil:</label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Soltero/a">Soltero/a</option>
                <option value="Casado/a">Casado/a</option>
                <option value="Unión libre">Unión libre</option>
              </select>
            
            {/* Modalidad o tipo de plan */}
            <label className={styles.label}>Modalidad del plan:</label>
              <select
                name="modalidad_plan"
                value={formData.modalidad_plan}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Individual">Individual</option>
                <option value="Familiar">Familiar</option>
                <option value="Colectivo">Colectivo</option>
              </select>

              {formErrors.modalidad_plan && <p className={styles.errorText}>{formErrors.modalidad_plan}</p>}

            {/* Frecuencia con la que desea pagar */}
            <label className={styles.label}>Frecuencia de pago:</label>
              <select
                name="frecuencia_pago"
                value={formData.frecuencia_pago}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Anual">Anual</option>
                <option value="Semestral">Semestral</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Mensual">Mensual</option>
                <option value="Pago Unico">Pago Único</option>
              </select>

            {/* Prima */}
            <label className={styles.label}> ¿Cuál es su presupuesto para pago de prima?: RD${" "}
              <strong>{Number(formData.prima).toLocaleString("es-DO")}</strong>
              <TooltipInfo text="La prima es el monto total que debes pagar al año por tu póliza de salud." />
            </label>
              <input
                type="range"
                name="prima"
                min="500"
                max="150000"
                step="500"
                value={formData.prima}
                onChange={handleChange}
                className={styles.slider}
              /> 

              {formErrors.prima && <p className={styles.errorText}>{formErrors.prima}</p>} 

            {formData.frecuencia_pago && formData.prima && (
              <p className={styles.label} style={{ marginTop: "5px", marginBottom: "15px", fontWeight: "bold" }}>
                {calcularMontoPorFrecuencia(formData.prima, formData.frecuencia_pago)}
              </p>
            )}  

            {/* Que tanta cobertura desea */}
            <label className={styles.label}>Nivel de cobertura:</label>
            <select
              name="nivel_de_cobertura"
              value={formData.nivel_de_cobertura}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Basico">Básico</option>
              <option value="Medio">Medio</option>
              <option value="Complementario">Complementario</option>
              <option value="Completo">Completo</option>
            </select>

            {/* Públicos o Privadas */}
            <label className={styles.label}>Preferencia por hospitales o clínicas:</label>
              <select
                name="preferencia_hospitales"
                value={formData.preferencia_hospitales}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Publicos">Públicos</option>
                <option value="Privados">Privados</option>
                <option value="Indistinto">Indistinto</option>
              </select>

            {/* Cobertura Internacional */}
            <label className={styles.label}>¿Desea acceso a atención internacional?
              <TooltipInfo text="Las pólizas de salud solo aplican deducible cuando incluyen cobertura internacional." />
            </label>
              <select
                name="acceso_internacional"
                value={formData.acceso_internacional}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>

              {formErrors.acceso_internacional && <p className={styles.errorText}>{formErrors.acceso_internacional}</p>}

            {/* Pago de deducible */}
            <label className={styles.label}>¿Está dispuesto a pagar un deducible?
            <TooltipInfo text="El deducible es la cantidad que usted paga de su bolsillo antes de que el seguro comience a cubrir los gastos." />
            </label>
              <select
                name="deductible"
                value={formData.deductible}
                onChange={handleChange}
                className={styles.select}
                disabled={formData.acceso_internacional !== "Si"}
              >
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>

            {/* Historial de preferencias */}
            <label className={styles.label}>Nivel de satisfacción de clientes:</label>
            <select
              name="satisfaccion_del_cliente"
              value={formData.satisfaccion_del_cliente}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Muy Satisfactorio">Muy Satisfactorio</option>
              <option value="Satisfactorio">Satisfactorio</option>
              <option value="Neutro">Neutro</option>
              <option value="Insatisfactorio">Insatisfactorio</option>
              <option value="Muy Insatisfactorio">Muy Insatisfactorio</option>
            </select>

            {/* Aseguradora */}
            <label className={styles.label}>¿Le interesa una aseguradora en específico?</label>
            <select
              name="aseguradora"
              value={formData.aseguradora}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="HumanoSeg">Humano Seguros</option>
              <option value="SegUniversal">Seguros Universal</option>
              <option value="LaColonial">La Colonial</option>
              <option value="Indistinto">Indistinto</option>
            </select>

            {formData.aseguradora && obtenerCatalogoURL(formData.aseguradora) && (
              <p className={styles.label} style={{ marginTop: "5px", marginBottom: "15px" }}>
              <a
                href={obtenerCatalogoURL(formData.aseguradora)!}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0066cc", textDecoration: "underline", fontWeight: "bold" }}
              >
                Catálogo de Prestadores
              </a>
              </p>
            )}

            {/* Condición médica previa */}
            <label className={styles.label}>¿Tiene alguna condición médica preexistente?
              <TooltipInfo text="Si tienes una enfermedad preexistente, la aseguradora puede tardar más en aprobar o incluso rechazar el contrato." />
            </label>
            <select
              name="condiciones_medicas_previas"
              value={formData.condiciones_medicas_previas}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="No">No</option>
              <option value="Si">Sí</option>
            </select>

            {formErrors.condiciones_medicas_previas && <p className={styles.errorText}>{formErrors.condiciones_medicas_previas}</p>}

            {formData.condiciones_medicas_previas === "Si" && (
          <>
            <label className={styles.label}>Especifique la condición médica:</label>
            <select
              name="enfermedad_preexistente"
              value={formData.enfermedad_preexistente}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Hipertensión">Hipertensión</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Asma">Asma</option>
              <option value="Enfermedades cardíacas">Enfermedades cardíacas</option>
              <option value="Cáncer">Cáncer</option>
              <option value="Artritis">Artritis</option>
              <option value="Enfermedad renal crónica">Enfermedad renal crónica</option>
              <option value="Otra">Otra</option>
            </select>

              {formErrors.enfermedad_preexistente && <p className={styles.errorText}>{formErrors.enfermedad_preexistente}</p>}
          </>
            )}

            {/* Principal preocupacion o interes */}
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

export default HealthFormPage;