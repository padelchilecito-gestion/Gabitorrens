import { useState, useEffect } from "react";

// Este hook maneja la sincronización con el navegador
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Al iniciar, leemos del navegador
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Si existe data guardada, la usamos. Si no, usamos la inicial del archivo data.ts
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage clave "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Cada vez que cambiamos el estado, guardamos en el navegador
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error guardando en localStorage clave "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}