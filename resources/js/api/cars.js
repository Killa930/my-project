import { apiGet } from "./http";

export function fetchCars() {
  return apiGet("/api/cars");
}
