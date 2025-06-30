import {
  SaludFormPayload,
  VehiculoFormPayload,
  ViajeFormPayload,
  VidaFormPayload,
  ViviendaFormPayload,
} from "../Types/insurance_types";

// 👇 Esto tomará la URL desde el entorno (ideal para Vercel)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function recomendarSalud(data: SaludFormPayload) {
  const response = await fetch(`${API_BASE_URL}/recomendar/salud`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVehiculo(data: VehiculoFormPayload) {
  const response = await fetch(`${API_BASE_URL}/recomendar/vehiculo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarViaje(data: ViajeFormPayload) {
  const response = await fetch(`${API_BASE_URL}/recomendar/viaje`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVida(data: VidaFormPayload) {
  const response = await fetch(`${API_BASE_URL}/recomendar/vida`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}

export async function recomendarVivienda(data: ViviendaFormPayload) {
  const response = await fetch(`${API_BASE_URL}/recomendar/vivienda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error consultando la API");

  return await response.json();
}
