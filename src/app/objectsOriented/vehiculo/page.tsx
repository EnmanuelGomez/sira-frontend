"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "@supabase/auth-helpers-react"; 
import { guardarFormulario } from "@/app/api/Controllers/logFormSubmission";
import { useEffect } from "react";
import { ensureAnonymousId } from "@/app/utils/initAnonymous";
import { procesarRecomendacionVehiculo } from "@/app/api/Controllers/vehiculoController";
import { obtenerDetallePlanObj, PlanDetalle } from "@/app/api/Queries/getPlanDetalleObj";
import { calcularMontoPorFrecuencia } from "@/app/utils/calculosFinancieros";
import { generarAnios } from "@/app/utils/generarAnios";
import { calcularPrimaConDeducible } from "@/app/utils/ajustesDeducible";
import { VehicleFormData } from "@/app/models/FormData";
import { validateVehicleForm } from "@/app/utils/validacionesForms";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import BotonGuardado from "@/app/components/BotonGuardado";
import PlanDetalleModal from "@/app/components/PlanDetalleModalObj";
import TooltipInfo from "@/app/components/TooltipInfo";
import styles from "../../styles/FormLayout.module.css"; 

const VehicleFormPage = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    edad: "0",
    sexo: "",
    estado_civil: "",
    anio_fabricacion: "",
    monto_asegurado: "0",
    frecuencia_uso: "",
    presupuesto_mensual: "",
    deducible_mayor_para_menor_prima: "",
    asistencia_en_carretera: "",
    frecuencia_pago: "",
    prima: "0",
    tipo_de_vehiculo: "",
    valor_aproximado: "0",
    tipo_de_cobertura: "",
    deductible: "",
    nivel_deducible_personalizado: "",
    aseguradora: "",
    cobertura_robo: "",
    responsabilidad_civil: "",
    cobertura_legal: "",
    cobertura_rotura: "",
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

      if (name === "deductible" && value !== "Si") {
        setFormData((prev) => ({
        ...prev,
        deducible_mayor_para_menor_prima: "", // resetea si elige "No"
      }));
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

          const errors = validateVehicleForm(formData); 
              setFormErrors(errors);
          
              if (Object.keys(errors).length > 0) {
                return; // detener envío si hay errores
              }
      
          try {
            setLoading(true);
          // 1. Guardar en la base
            await guardarFormulario("vehiculo", formData, session?.user?.id ?? null);
          // 2. Procesar recomendación
            const response = await procesarRecomendacionVehiculo(formData);
            setRecomendaciones(response.recomendaciones);
          } catch (error) {
            console.error("Error:", error);
          } finally {
              setLoading(false); 
            }
        };
  
    const concernOptions = ["Costo", "Cobertura", "Catálogo de talleres ", "Servicio al cliente", "Facilidad de gestión online", "Otros"];

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
          <h2 className={styles.formTitle}>Formulario de Seguro de Vehículos</h2>
          <form onSubmit={handleSubmit}>

            {/* preguntas demográficas */}
            <label className={styles.label}>Edad: {formData.edad || "Seleccionar"}</label>
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
              </select>

            {/* Monto valor vehiculo */}
            <label className={styles.label}>Valor aproximado del vehículo : RD${" "}
              <strong>{Number(formData.valor_aproximado).toLocaleString("es-DO")}</strong>
            </label>
            <input
              type="range"
              name="valor_aproximado"
              min="50000"
              max="10000000"
              step="50000"
              value={formData.valor_aproximado}
              onChange={handleChange}
              className={styles.slider}
            />

            {formErrors.valor_aproximado && <p className={styles.errorText}>{formErrors.valor_aproximado}</p>}

            {/* Tipo de vehículo */}
            <label className={styles.label}>Tipo de vehículo:</label>
            <select
              name="tipo_de_vehiculo"
              value={formData.tipo_de_vehiculo}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Carro">Carro</option>
              <option value="Moto">Moto</option>
              <option value="Camioneta">Camioneta</option>
            </select>

            {formErrors.tipo_de_vehiculo && <p className={styles.errorText}>{formErrors.tipo_de_vehiculo}</p>}

            {/* Año de fabricación */}
            <label className={styles.label}>Año de fabricación del vehículo:
              <TooltipInfo text="Algunas aseguradoras no aceptan asegurar vehículos con más de 10 o 15 años de antigüedad." />
            </label>
              <select
                name="anio_fabricacion"
                value={formData.anio_fabricacion}
                onChange={handleChange}
                className={`${styles.select} ${styles.anioSelect}`}
              >
                <option value="">Seleccionar año</option>
                {generarAnios().map((anio) => (
                <option key={anio} value={anio}>
                {anio}
                </option>
                ))}
              </select>

              {formErrors.anio_fabricacion && <p className={styles.errorText}>{formErrors.anio_fabricacion}</p>}

            {/* Monto asegurado */}
            <label className={styles.label}>Monto asegurado: RD${" "}
              <strong>{Number(formData.monto_asegurado).toLocaleString("es-DO")}</strong>
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

            {/* Frecuencia de uso */}
            <label className={styles.label}>¿Con qué frecuencia utiliza el vehículo?</label>
              <select
                name="frecuencia_uso"
                value={formData.frecuencia_uso}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Diario">Diario</option>
                <option value="Ocasional">Ocasional</option>
                <option value="Fines de semana">Solo fines de semana</option>
              </select>

            {/* Tipo de cobertura */}
            <label className={styles.label}>¿Qué tipo de cobertura busca?</label>
            <select
              name="tipo_de_cobertura"
              value={formData.tipo_de_cobertura}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Por Ley">Por Ley</option>
              <option value="Full">Full</option>
            </select>

            {formErrors.tipo_de_cobertura && <p className={styles.errorText}>{formErrors.tipo_de_cobertura}</p>}
            
            {/* Frecuencia con la que prefiere realizar pagos */}
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
            <label className={styles.label}>¿Cuánto estaría dispuesto a pagar por la prima?: RD${" "}
              <strong>{Number(formData.prima).toLocaleString("es-DO")}</strong>
              <TooltipInfo text="La prima es el monto anual que pagas para mantener tu seguro de vehículo activo, calculado según el tipo de cobertura, marca, uso y perfil del conductor." />
            </label>
              <input
                type="range"
                name="prima"
                min="500"
                max="1000000"
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

            {/* Deducible */}
            <label className={styles.label}>¿Está dispuesto a pagar un deducible del 1% ?
              <TooltipInfo text="Es una cantidad fija o porcentual que pagas en caso de un accidente o daño cubierto por la póliza." />
            </label>
            <select
              name="deductible"
              value={formData.deductible}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {formErrors.deductible && <p className={styles.errorText}>{formErrors.deducible}</p>}


            {formData.deductible === "No" && (
              <>
                <label className={styles.label}>
                  Seleccione el porcentaje de deducible:
                  <TooltipInfo text="Selecciona un porcentaje entre 2% y 5% que se aplicará sobre el monto asegurado." />
                </label>
                  <select
                    name="nivel_deducible_personalizado"
                    value={formData.nivel_deducible_personalizado}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Seleccionar</option>
                    <option value="2">2%</option>
                    <option value="3">3%</option>
                    <option value="4">4%</option>
                    <option value="5">5%</option>
                  </select>

                  {formErrors.nivel_deducible_personalizado && <p className={styles.errorText}>{formErrors.nivel_deducible_personalizado}</p>}

              {formData.nivel_deducible_personalizado && formData.monto_asegurado && (
                <p className={styles.label} style={{ marginTop: "5px", marginBottom: "15px"}}>
                  Monto a pagar en caso de siniestro:{" "}
                  <strong>
                    RD${" "}
                    {Number(
                      (+formData.nivel_deducible_personalizado / 100) *
                      +formData.monto_asegurado
                    ).toLocaleString("es-DO")}
                  </strong>
                </p>
                )}
                </>
                )}

            {/* Deducible mayor para menor prima */}
            <label className={styles.label}>¿Aceptaría un deducible más alto para pagar una prima más baja?
              <TooltipInfo text="Mientras más alto es el deducible, menor es la prima que pagas; es una forma de reducir el costo mensual del seguro." />
            </label>
              <select
                name="deducible_mayor_para_menor_prima"
                value={formData.deducible_mayor_para_menor_prima}
                onChange={handleChange}
                className={styles.select}
                disabled={formData.deductible !== "No"}
              >
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>

              <p className={styles.label} style={{ marginTop: "5px", marginBottom: "15px", fontWeight: "bold" }}>
                {calcularMontoPorFrecuencia(calcularPrimaConDeducible(formData.prima, formData.deducible_mayor_para_menor_prima),
                formData.frecuencia_pago
                )}
              </p>

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

            {/* rotura cristales */}
            <label className={styles.label}>¿Desea cobertura contra rotura de cristales?</label>
            <select
              name="cobertura_rotura"
              value={formData.cobertura_rotura}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {/* Cobertura robo */}
            <label className={styles.label}>¿Desea cobertura contra robo?</label>
            <select
              name="cobertura_robo"
              value={formData.cobertura_robo}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>

            {/* Asistencia en carretera */}
            <label className={styles.label}>¿Desea incluir asistencia en carretera?</label>
              <select
                name="asistencia_en_carretera"
                value={formData.asistencia_en_carretera}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>

            {/* Responsabilidad civil */}
            <label className={styles.label}>¿Desea responsabilidad civil?</label>
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

            {/* Cobertura legal */}
            <label className={styles.label}>¿Desea cobertura legal?
              <TooltipInfo text="La cobertura legal no está incluida en todos los seguros y suele requerir una prima adicional; cubre asistencia en procesos judiciales." />
            </label>
            <select
              name="cobertura_legal"
              value={formData.cobertura_legal}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
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

export default VehicleFormPage;