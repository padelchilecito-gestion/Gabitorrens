import { useState, useEffect } from "react";

// Este hook maneja la sincronización con el navegador y entre pestañas
export function useLocalStorage<T>(key: string, initialValue: T) {
  
  // Función auxiliar para leer de localStorage de forma segura
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage clave "${key}":`, error);
      return initialValue;
    }
  };

  // 1. Estado inicial
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 2. Función personalizada para guardar (actualiza Estado + LocalStorage + Avisa a otros)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función (como useState normal)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 1. Guardar en el estado de React (actualiza esta pestaña)
      setStoredValue(valueToStore);
      
      // 2. Guardar en el navegador
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 3. Disparar un evento manual para notificar a componentes en la MISMA pestaña si fuera necesario
        // (Aunque React ya maneja esto por el cambio de estado, esto ayuda a forzar sincronización extra si se usa en varios lugares)
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error guardando en localStorage clave "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      // Si es un evento de almacenamiento (otra pestaña) y la clave coincide
      if ((e as StorageEvent).key && (e as StorageEvent).key !== key) {
        return;
      }
      // O si es nuestro evento manual "local-storage"
      setStoredValue(readValue());
    };

    // Escuchar cambios en OTRAS pestañas
    window.addEventListener("storage", handleStorageChange);
    // Escuchar cambios en la MISMA pestaña (por si acaso se usa el hook en múltiples componentes disjuntos)
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
    // eslint-disable-next-line
  }, [key]);

  return [storedValue, setValue] as const;
}