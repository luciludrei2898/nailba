import { defaultServices } from '../data/defaultServices';

const SERVICES_KEY = 'nailba_servicios';
const SALES_KEY = 'nailba_ventas';

const sampleSales = [
  {
    id: 'sale-demo-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      { serviceId: 'svc-1', nombre: 'Manicura semipermanente', precio: 22, cantidad: 1, categoria: 'Manicura' },
      { serviceId: 'svc-8', nombre: 'Decoracion nail art', precio: 6, cantidad: 1, categoria: 'Extras' },
    ],
    total: 28,
  },
  {
    id: 'sale-demo-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    items: [
      { serviceId: 'svc-7', nombre: 'Pedicura semipermanente', precio: 26, cantidad: 1, categoria: 'Pedicura' },
    ],
    total: 26,
  },
];

function safeRead(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadServices() {
  return safeRead(SERVICES_KEY, defaultServices);
}

export function saveServices(services) {
  window.localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function loadSales() {
  return safeRead(SALES_KEY, sampleSales);
}

export function saveSales(sales) {
  window.localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}
