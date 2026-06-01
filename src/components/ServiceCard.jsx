export function ServiceCard({ service, onAdd }) {
  const price = Number(service.precio) || 0;

  return (
    <article className="service-card">
      <div>
        <p className="service-category">{service.categoria}</p>
        <h3>{service.nombre}</h3>
      </div>
      <div className="service-card-footer">
        <strong>{price.toFixed(2)} EUR</strong>
        <button type="button" className="button-primary" onClick={() => onAdd(service)}>
          Añadir
        </button>
      </div>
    </article>
  );
}
