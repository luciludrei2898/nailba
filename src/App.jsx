import { useEffect, useMemo, useState } from 'react';
import { ServiceCard } from './components/ServiceCard';
import { ServicesAdmin } from './components/ServicesAdmin';
import { SalesPanel } from './components/SalesPanel';
import { TicketPanel } from './components/TicketPanel';
import { exportDailyWorkbook, exportSalesWorkbook } from './lib/exportExcel';
import { loadSales, loadServices, saveSales, saveServices } from './lib/storage';

const tabs = [
  { id: 'cobro', label: 'Cobro' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'ventas', label: 'Ventas y exportacion' },
];

const newServiceDraft = {
  nombre: '',
  precio: '',
  categoria: '',
};

function isSameDay(left, right) {
  return left.toDateString() === right.toDateString();
}

function isSameMonth(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export default function App() {
  const [activeTab, setActiveTab] = useState('cobro');
  const [services, setServices] = useState(() => loadServices());
  const [sales, setSales] = useState(() => loadSales());
  const [ticket, setTicket] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [draft, setDraft] = useState(newServiceDraft);
  const [toast, setToast] = useState('');

  useEffect(() => {
    saveServices(services);
  }, [services]);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const categories = useMemo(() => ['Todas', ...new Set(services.map((service) => service.categoria).filter(Boolean))], [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'Todas' || service.categoria === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  const ticketTotal = useMemo(() => ticket.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [ticket]);

  const today = new Date();
  const todaySales = useMemo(() => sales.filter((sale) => isSameDay(new Date(sale.createdAt), today)), [sales, today]);
  const monthSales = useMemo(() => sales.filter((sale) => isSameMonth(new Date(sale.createdAt), today)), [sales, today]);
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);

  function addToTicket(service) {
    setTicket((current) => {
      const existing = current.find((item) => item.serviceId === service.id);
      if (existing) {
        return current.map((item) =>
          item.serviceId === service.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }

      return [
        ...current,
        {
          serviceId: service.id,
          nombre: service.nombre,
          precio: service.precio,
          categoria: service.categoria,
          cantidad: 1,
        },
      ];
    });
  }

  function changeTicketQuantity(serviceId, delta) {
    setTicket((current) =>
      current
        .map((item) =>
          item.serviceId === serviceId ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function removeFromTicket(serviceId) {
    setTicket((current) => current.filter((item) => item.serviceId !== serviceId));
  }

  function clearTicket() {
    setTicket([]);
  }

  function confirmSale() {
    if (ticket.length === 0) {
      return;
    }

    const sale = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: ticket,
      total: Number(ticketTotal.toFixed(2)),
      paymentMethod,
    };

    setSales((current) => [...current, sale]);
    setTicket([]);
    setActiveTab('ventas');
    setToast('Venta guardada correctamente');
  }

  function handleDraftChange(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function addService() {
    const nombre = draft.nombre.trim();
    const categoria = draft.categoria.trim() || 'General';
    const precio = Number(draft.precio);

    if (!nombre || Number.isNaN(precio) || precio < 0) {
      setToast('Revisa nombre y precio antes de guardar');
      return;
    }

    setServices((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        nombre,
        categoria,
        precio: Number(precio.toFixed(2)),
      },
    ]);

    setDraft(newServiceDraft);
    setToast('Servicio creado');
  }

  function updateService(serviceId, field, value) {
    setServices((current) =>
      current.map((service) => {
        if (service.id !== serviceId) {
          return service;
        }

        if (field === 'precio') {
          return { ...service, precio: Number(value || 0) };
        }

        return { ...service, [field]: value };
      }),
    );
  }

  function deleteService(serviceId) {
    setServices((current) => current.filter((service) => service.id !== serviceId));
    setTicket((current) => current.filter((item) => item.serviceId !== serviceId));
    setToast('Servicio eliminado');
  }

  function exportToday() {
    if (todaySales.length === 0) {
      setToast('No hay ventas de hoy para exportar');
      return;
    }

    exportDailyWorkbook(sales, today, `ventas-dia-${today.toISOString().slice(0, 10)}.xlsx`);
  }

  function exportHistory() {
    if (sales.length === 0) {
      setToast('No hay ventas guardadas para exportar');
      return;
    }

    exportSalesWorkbook(sales, 'ventas-historico-nailba.xlsx');
  }

  function deleteSale(saleId) {
    const confirmed = window.confirm('Se eliminara este cobro del historial. Quieres continuar?');

    if (!confirmed) {
      return;
    }

    setSales((current) => current.filter((sale) => sale.id !== saleId));
    setToast('Cobro eliminado');
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-left" />
      <div className="bg-orb bg-orb-right" />

      <header className="hero">
        <div className="brand-block">
          <p className="eyebrow">Uso interno del salon</p>
          <h1 className="brand-title">Nailba</h1>
          <p className="hero-copy">
            Cobro rapido, control diario y exportacion lista para caja o datafono.
          </p>
        </div>

        <div className="hero-stats">
          <div>
            <span>Hoy</span>
            <strong>{todayTotal.toFixed(2)} EUR</strong>
          </div>
          <div>
            <span>Mes</span>
            <strong>{monthTotal.toFixed(2)} EUR</strong>
          </div>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'cobro' && (
        <main className="checkout-layout">
          <section className="catalog-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Cobro</p>
                <h2>Selecciona servicios</h2>
              </div>
            </div>

            <div className="filters">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar servicio"
              />

              <div className="chips">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={categoryFilter === category ? 'chip active' : 'chip'}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="services-grid">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} onAdd={addToTicket} />
              ))}
            </div>
          </section>

          <TicketPanel
            items={ticket}
            total={ticketTotal}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onIncrease={(serviceId) => changeTicketQuantity(serviceId, 1)}
            onDecrease={(serviceId) => changeTicketQuantity(serviceId, -1)}
            onRemove={removeFromTicket}
            onClear={clearTicket}
            onConfirm={confirmSale}
          />
        </main>
      )}

      {activeTab === 'servicios' && (
        <ServicesAdmin
          services={services}
          draft={draft}
          onDraftChange={handleDraftChange}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
        />
      )}

      {activeTab === 'ventas' && (
        <SalesPanel
          todaySales={todaySales}
          monthSales={monthSales}
          todayTotal={todayTotal}
          monthTotal={monthTotal}
          onDeleteSale={deleteSale}
          onExportToday={exportToday}
          onExportHistory={exportHistory}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
