from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Permitir solicitudes desde el frontend (ajusta el origen si no es localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función 
def procesar_recomendacion(data_dict, tipo_seguro):
    base_path = f"app/modelos/{tipo_seguro}"
    model = joblib.load(f"{base_path}/modelo_xgb.pkl")
    encoder = joblib.load(f"{base_path}/label_encoder.pkl")
    columnas_modelo = joblib.load(f"{base_path}/columnas_modelo.pkl")

    aseguradora_usuario = data_dict.get("aseguradora", "").strip().lower()
    df = pd.DataFrame([data_dict])
    df_dummies = pd.get_dummies(df)

    for col in columnas_modelo:
        if col not in df_dummies:
            df_dummies[col] = 0
    df_dummies = df_dummies[columnas_modelo]

    probs = model.predict_proba(df_dummies)[0]
    plan_indices = np.argsort(probs)[::-1]
    nombres_planes = encoder.inverse_transform(plan_indices)

    # Si el usuario especificó una aseguradora, forzar que el top 1 sea de esa aseguradora
    if aseguradora_usuario != "indistinto":
        top1 = None
        for idx in plan_indices:
            nombre_plan = encoder.inverse_transform([idx])[0]
            if aseguradora_usuario in nombre_plan.lower():
                top1 = nombre_plan
                break

        # Si se encuentra una coincidencia de aseguradora, construir el top 3 con ella en primer lugar
        if top1:
            restantes = [p for p in nombres_planes if p != top1]
            top3 = [top1] + restantes[:2]
        else:
            top3 = nombres_planes[:3]
    else:
        top3 = nombres_planes[:3]

    return {"recomendaciones": list(top3)}


# Modelos de entrada por tipo

class SaludInput(BaseModel):
    prima: float
    nivel_de_cobertura: str
    deductible: str
    satisfaccion_del_cliente: str
    aseguradora: str
    condiciones_medicas_previas: str
    principal_preocupacion: str

class VehiculoInput(BaseModel):
    tipo_de_vehiculo: str
    valor_aproximado: float
    tipo_de_cobertura: str
    deductible: str
    aseguradora: str
    cobertura_robo: str
    responsabilidad_civil: str
    cobertura_legal: str
    principal_preocupacion: str

class ViajeInput(BaseModel):
    aseguradora: str
    cobertura_medica: str
    destino: str
    cobertura_equipaje: str
    cobertura_responsabilidad_civil: str
    principal_preocupacion: str

class VidaInput(BaseModel):
    aseguradora: str
    tipo_cobertura: str
    tiempo_posesion: str
    monto_asegurado: float
    cobertura_medica: str
    cobertura_deuda: str
    gastos_funerarios: str
    ahorro: str
    principal_preocupacion: str

class ViviendaInput(BaseModel):
    prima: float
    valor_aproximado: float
    aseguradora: str
    cobertura_bienes: str
    principal_preocupacion: str
    cobertura_des_natural: str
    cobertura_incendios: str
    seguridad: str
    responsabilidad_civil: str
    principal_preocupacion: str

# Endpoints por tipo de seguro

@app.post("/recomendar/salud")
def recomendar_salud(data: SaludInput):
    return procesar_recomendacion(data.dict(), "salud")

@app.post("/recomendar/vehiculo")
def recomendar_vehiculo(data: VehiculoInput):
    return procesar_recomendacion(data.dict(), "vehiculo")

@app.post("/recomendar/viaje")
def recomendar_viaje(data: ViajeInput):
    return procesar_recomendacion(data.dict(), "viaje")

@app.post("/recomendar/vida")
def recomendar_vida(data: VidaInput):
    return procesar_recomendacion(data.dict(), "vida")

@app.post("/recomendar/vivienda")
def recomendar_vivienda(data: ViviendaInput):
    return procesar_recomendacion(data.dict(), "vivienda")