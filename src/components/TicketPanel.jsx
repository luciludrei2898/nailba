export function TicketPanel({
  items,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onConfirm,
}) {
  return (
    <aside className="ticket-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Ticket actual</p>
          <h2>Cobro rapido</h2>
        </div>
        <button type="button" className="button-ghost" onClick={onClear} disabled={items.length === 0}>
          Vaciar
        </button>
      </div>

      <div className="ticket-items">
        {items.length === 0 ? (
          <div className="empty-state">
            <p>Aun no has añadido servicios.</p>
            <span>Toca un servicio para empezar a cobrar.</span>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.serviceId} className="ticket-item">
              <div>
                <strong>{item.nombre}</strong>
                <span>
                  {item.cantidad} x {(Number(item.precio) || 0).toFixed(2)} EUR
                </span>
              </div>
              <div className="ticket-actions">
                <button type="button" className="stepper" onClick={() => onDecrease(item.serviceId)}>
                  -
                </button>
                <span>{item.cantidad}</span>
                <button type="button" className="stepper" onClick={() => onIncrease(item.serviceId)}>
                  +
                </button>
                <button type="button" className="text-button" onClick={() => onRemove(item.serviceId)}>
                  Quitar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="payment-section">
        <p className="eyebrow">Método de pago</p>
        <div className="payment-options">
          {['efectivo', 'tarjeta'].map((method) => (
            <label key={method} className={paymentMethod === method ? 'payment-option active' : 'payment-option'}>
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => onPaymentMethodChange(method)}
              />
              <span>{method === 'tarjeta' ? 'Tarjeta' : 'Efectivo'}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="ticket-totals">
        <div>
          <span>Servicios</span>
          <strong>{items.reduce((sum, item) => sum + item.cantidad, 0)}</strong>
        </div>
        <div>
          <span>Total final</span>
          <strong className="total-amount">{total.toFixed(2)} EUR</strong>
        </div>
      </div>

      <button type="button" className="button-primary button-large" onClick={onConfirm} disabled={items.length === 0}>
        Confirmar venta
      </button>
    </aside>
  );
}
