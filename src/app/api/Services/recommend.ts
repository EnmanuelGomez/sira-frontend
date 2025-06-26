import { SaludFormPayload, VehiculoFormPayload, ViajeFormPayload, VidaFormPayload, ViviendaFormPayload } from "../Types/insurance_types";

export async function recomendarSalud(data: SaludFormPayload) {
  const response = await fetch("http://localhost:8000/recomendar/salud", {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVehiculo(data: VehiculoFormPayload) {
  const response = await fetch("http://localhost:8000/recomendar/vehiculo", {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarViaje(data: ViajeFormPayload) {
  const response = await fetch("http://localhost:8000/recomendar/viaje", {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVida(data: VidaFormPayload) {
  const response = await fetch("http://localhost:8000/recomendar/vida", {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVivienda(data: ViviendaFormPayload) {
  const response = await fetch("http://localhost:8000/recomendar/vivienda", {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}