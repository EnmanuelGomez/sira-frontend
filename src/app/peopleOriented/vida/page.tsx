"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react"; 
import { guardarFormulario } from "@/app/api/Controllers/logFormSubmission";
import { procesarRecomendacionVida } from "@/app/api/Controllers/vidaController";
import { ensureAnonymousId } from "@/app/utils/initAnonymous";
import { validateLifeForm } from "@/app/utils/validacionesForms";
import { LifeFormData } from "@/app/models/FormData";
import { obtenerDetallePlan, PlanDetalle } from "@/app/api/Queries/getPlanDetalle";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import BotonGuardado from "@/app/components/BotonGuardado";
import PlanDetalleModal from "@/app/components/PlanDetalleModal";
import TooltipInfo from "@/app/components/TooltipInfo";
import styles from "../../styles/FormLayout.module.css";

const LifeFormPage = () => {
  const [formData, setFormData] = useState<LifeFormData>({
    edad: "0",
    sexo: "",
    dependientes: "",
    objetivo: "",
    prima: "0",
    aseguradora: "",
    tipo_cobertura: "",
    tiempo_posesion: "",
    monto_asegurado: "0",
    cobertura_medica: "",
    cobertura_deuda: "",
    gastos_funerarios: "",
    ahorro: "",
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
    
        const errors = validateLifeForm(formData);
        setFormErrors(errors);
    
        if (Object.keys(errors).length > 0) {
          return; // detener envío si hay errores
        }

      try {
        setLoading(true);
      // 1. Guardar en la base
        await guardarFormulario("vida", formData, session?.user?.id ?? null);
      // 2. Procesar recomendación
        const response = await procesarRecomendacionVida(formData);
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
          <h2 className={styles.formTitle}>Formulario de Seguro de Vida</h2>
          <form onSubmit={handleSubmit}>

            <label className={styles.label}>
              Seleccione el rango de edad:

              <input
                type="number"
                name="edad"
                min="18"
                max="70"
                step="1"
                value={formData.edad}
                onChange={handleChange}
                className={styles.inlineInput}
              />

            </label>

              <input
                type="range"
                name="edad"
                min="18"
                max="70"
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

              {formErrors.sexo && <p className={styles.errorText}>{formErrors.sexo}</p>}

              <label className={styles.label}>¿Tiene personas que dependen económicamente de usted?
                <TooltipInfo text="Los beneficiarios son las personas designadas para recibir el dinero de la póliza en caso de fallecimiento del asegurado." />
              </label>
                <select
                  name="dependientes"
                  value={formData.dependientes || ""}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccionar</option>
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>

              <label className={styles.label}>¿Cuál es su objetivo principal con esta póliza?</label>
                <select
                  name="objetivo"
                  value={formData.objetivo || ""}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccionar</option>
                  <option value="Protección familiar">Protección familiar</option>
                  <option value="Ahorro o inversión">Ahorro o inversión</option>
                  <option value="Cubrir deudas">Cubrir deudas</option>
                  <option value="Gastos funerarios">Gastos funerarios</option>
                  <option value="Otro">Otro</option>
                </select>

                {formErrors.objetivo && <p className={styles.errorText}>{formErrors.objetivo}</p>}
            
            {/* Duración de la póliza */}
            <label className={styles.label}>¿Por cuánto tiempo desea mantener la póliza?</label>
            <select
              name="tiempo_posesion"
              value={formData.tiempo_posesion}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="5-10">5 a 10 años</option>
              <option value="10-20">10 a 20 años</option>
              <option value="toda la vida">Toda la vida</option>
            </select>

            {formErrors.tiempo_posesion && <p className={styles.errorText}>{formErrors.tiempo_posesion}</p>}

            {/* Prima */}
            <label className={styles.label}>
              ¿Cuál es su presupuesto para pago de prima?: RD${" "}
  
              <input
                type="number"
                name="prima"
                min="500"
                max="150000"
                step="500"
                value={formData.prima}
                onChange={handleChange}
                className={styles.inlineInput}
              />

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

            {/* Monto para beneficiario */}
            <label className={styles.label}>Monto asegurado: RD${" "}

              <input
                type="number"
                name="monto_asegurado"
                min="50000"
                max="10000000"
                step="10000"
                value={formData.monto_asegurado}
                onChange={handleChange}
                className={styles.inlineInput}
              />

            </label>
            <input
              type="range"
              name="monto_asegurado"
              min="50000"
              max="10000000"
              step="10000"
              value={formData.monto_asegurado}
              onChange={handleChange}
              className={styles.slider}
            />

            {formErrors.monto_asegurado && <p className={styles.errorText}>{formErrors.monto_asegurado}</p>}
            
            {/* Cobertura medica */}
            <label className={styles.label}>¿Desea cobertura médica?</label>
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

            {/* Cobertura deuda */}
            <label className={styles.label}>¿Desea cobertura para deudas?
              <TooltipInfo text="La cobertura de deudas solo está incluida en pólizas de vida muy específicas que lo establecen expresamente." />
            </label>
            <select
              name="cobertura_deuda"
              value={formData.cobertura_deuda}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {/* Cobertura ultimos gastos */}
            <label className={styles.label}>¿Desea incluir gastos funerarios?</label>
            <select
              name="gastos_funerarios"
              value={formData.gastos_funerarios}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {formErrors.gastos_funerarios && <p className={styles.errorText}>{formErrors.gastos_funerarios}</p>}

            {/* Cobertura ahorro */}
            <label className={styles.label}>¿Está interesado en un plan con ahorro?
              <TooltipInfo text="La cobertura con componente de ahorro solo aplica a pólizas diseñadas para combinar protección y acumulación de capital." />
            </label>
            <select
              name="ahorro"
              value={formData.ahorro}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {/* Factores importantes */}
            <label className={styles.label}>Principal preocupación:</label>
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

export default LifeFormPage;