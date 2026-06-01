export function SalesPanel({
  todaySales,
  monthSales,
  todayTotal,
  monthTotal,
  onDeleteSale,
  onExportToday,
  onExportHistory,
}) {
  return (
    <section className="sales-layout">
      <div className="stats-grid">
        <article className="stat-card">
          <span>Ventas de hoy</span>
          <strong>{todaySales.length}</strong>
        </article>
        <article className="stat-card">
          <span>Total de hoy</span>
          <strong>{todayTotal.toFixed(2)} EUR</strong>
        </article>
        <article className="stat-card">
          <span>Ventas del mes</span>
          <strong>{monthSales.length}</strong>
        </article>
        <article className="stat-card">
          <span>Total del mes</span>
          <strong>{monthTotal.toFixed(2)} EUR</strong>
        </article>
      </div>

      <article className="sales-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Registro</p>
            <h2>Ventas del dia</h2>
          </div>
          <div className="button-row">
            <button type="button" className="button-secondary" onClick={onExportToday}>
              Exportar hoy
            </button>
            <button type="button" className="button-primary" onClick={onExportHistory}>
              Exportar historico
            </button>
          </div>
        </div>

        <div className="sales-list">
          {todaySales.length === 0 ? (
            <div className="empty-state">
              <p>No hay ventas registradas hoy.</p>
              <span>Cuando confirmes ventas apareceran aqui.</span>
            </div>
          ) : (
            todaySales
              .slice()
              .reverse()
              .map((sale) => (
                <div key={sale.id} className="sale-row">
                  <div>
                    <strong>{new Date(sale.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong>
                    <span>{sale.items.map((item) => `${item.nombre} x${item.cantidad}`).join(', ')}</span>
                  </div>
                  <div className="sale-actions">
                    <strong>{sale.total.toFixed(2)} EUR</strong>
                    <button type="button" className="button-danger" onClick={() => onDeleteSale(sale.id)}>
                      Eliminar cobro
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </article>
    </section>
  );
}
