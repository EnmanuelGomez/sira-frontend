"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react"; 
import { guardarFormulario } from "@/app/api/Controllers/logFormSubmission";
import { useEffect } from "react";
import { ensureAnonymousId } from "@/app/utils/initAnonymous";
import { procesarRecomendacionVivienda } from "@/app/api/Controllers/viviendaController";
import { obtenerDetallePlanObj, PlanDetalle } from "@/app/api/Queries/getPlanDetalleObj";
import { HomeInsuranceFormData } from "@/app/models/FormData";
import { validateHousingForm } from "@/app/utils/validacionesForms";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import BotonGuardado from "@/app/components/BotonGuardado";
import PlanDetalleModal from "@/app/components/PlanDetalleModalObj";
import TooltipInfo from "@/app/components/TooltipInfo";
import styles from "../../styles/FormLayout.module.css"; 

const HousingFormPage = () => {
  const [formData, setFormData] = useState<HomeInsuranceFormData>({
    edad: "0",
    sexo:"",
    estado_civil: "",
    prima: "0",
    valor_aproximado: "0",
    monto_asegurado: "0",
    aseguradora: "",
    cobertura_bienes: "",
    cobertura_des_natural: "",
    cobertura_incendios: "",
    seguridad: "",
    responsabilidad_civil: "",
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

      const errors = validateHousingForm(formData); 
        setFormErrors(errors);
                
        if (Object.keys(errors).length > 0) {
          return; // detener envío si hay errores
        }
  
      try {
        setLoading(true);
      // 1. Guardar en la base
        await guardarFormulario("vivienda", formData, session?.user?.id ?? null);
      // 2. Procesar recomendación
        const response = await procesarRecomendacionVivienda(formData);
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
            const detalle = await obtenerDetallePlanObj(nombre_plan);
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
          <h2 className={styles.formTitle}>Formulario de Seguro de Viviendas</h2>
          <form onSubmit={handleSubmit}>

            <label className={styles.label}>
              Seleccione el rango de edad:

              <input
                type="number"
                name="edad"
                min="18"
                max="100"
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
                max="100"
                step="1"
                value={formData.edad}
                onChange={handleChange}
                className={styles.slider}
              />

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
            
            {/* Monto máximo de prima */}
            <label className={styles.label}>
                ¿Cuánto estaría dispuesto a pagar por la prima?: RD${" "}
              <input
                type="number"
                name="prima"
                min="500"
                max="3000000"
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
                max="3000000"
                step="500"
                value={formData.prima}
                onChange={handleChange}
                className={styles.slider}
              />

              {formErrors.prima && <p className={styles.errorText}>{formErrors.prima}</p>}

            {/* Valor de la propiedad */}
            <label className={styles.label}>
                ¿Cuál es el valor estimado de la propiedad? RD${" "}
              <input
                type="number"
                name="valor_aproximado"
                min="500000"
                max="30000000"
                step="100000"
                value={formData.valor_aproximado}
                onChange={handleChange}
                className={styles.inlineInput}
              />
            </label>

              <input
                type="range"
                name="valor_aproximado"
                min="500000"
                max="30000000"
                step="100000"
                value={formData.valor_aproximado}
                onChange={handleChange}
                className={styles.slider}
              />


            {formErrors.valor_aproximado && <p className={styles.errorText}>{formErrors.valor_aproximado}</p>}

            {/* Monto asegurado */}
            <label className={styles.label}>
                Monto asegurado: RD${" "}
              <input
                type="number"
                name="monto_asegurado"
                min="50000"
                max="3000000"
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
                max="3000000"
                step="10000"
                value={formData.monto_asegurado}
                onChange={handleChange}
                className={styles.slider}
              />

            {formErrors.monto_asegurado && <p className={styles.errorText}>{formErrors.monto_asegurado}</p>}

            {/* Cobertura interior */}
            <label className={styles.label}>¿Desea cobertura para bienes dentro de la vivienda?</label>
            <select
              name="cobertura_bienes"
              value={formData.cobertura_bienes}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

          {/* Cobertura desastres naturales */}
            <label className={styles.label}>¿Desea cobertura ante desastres naturales?</label>
            <select
              name="cobertura_des_natural"
              value={formData.cobertura_des_natural}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

          {/* Cobertura incendios */}
            <label className={styles.label}>¿Desea cobertura ante incendios?</label>
            <select
              name="cobertura_incendios"
              value={formData.cobertura_incendios}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

          {/* Seguridad */}
            <label className={styles.label}>¿La propiedad cuenta con medidas de seguridad?</label>
            <select
              name="seguridad"
              value={formData.seguridad}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

          {/* Cobertura responsabilidad civil */}
            <label className={styles.label}>¿Desea cobertura de responsabilidad civil?
              <TooltipInfo text="La responsabilidad civil en seguros de vivienda requiere un pago extra y cubre daños a terceros ocurridos dentro del hogar." />
            </label>
            <select
              name="responsabilidad_civil"
              value={formData.responsabilidad_civil}
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

export default HousingFormPage;