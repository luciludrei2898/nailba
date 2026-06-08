export function ServicesAdmin({
  services,
  draft,
  onDraftChange,
  onAddService,
  onUpdateService,
  onDeleteService,
}) {
  return (
    <section className="admin-layout">
      <article className="admin-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Gestion interna</p>
            <h2>Servicios</h2>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Nombre
            <input
              type="text"
              value={draft.nombre}
              onChange={(event) => onDraftChange('nombre', event.target.value)}
              placeholder="Ej. Manicura rusa"
            />
          </label>
          <label>
            Precio
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.precio}
              onChange={(event) => onDraftChange('precio', event.target.value)}
              placeholder="0.00"
            />
          </label>
          <label>
            Categoría
            <input
              type="text"
              value={draft.categoria}
              onChange={(event) => onDraftChange('categoria', event.target.value)}
              placeholder="Ej. Extras"
            />
          </label>
        </div>

        <button type="button" className="button-primary" onClick={onAddService}>
          Guardar nuevo servicio
        </button>
      </article>

      <article className="admin-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Mantenimiento</p>
            <h2>Editar servicios existentes</h2>
          </div>
        </div>

        <div className="editable-services">
          {services.map((service) => (
            <div key={service.id} className="editable-row">
              <input
                type="text"
                value={service.nombre}
                onChange={(event) => onUpdateService(service.id, 'nombre', event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={service.precio}
                onChange={(event) => onUpdateService(service.id, 'precio', event.target.value)}
              />
              <input
                type="text"
                value={service.categoria}
                onChange={(event) => onUpdateService(service.id, 'categoria', event.target.value)}
              />
              <button type="button" className="button-danger" onClick={() => onDeleteService(service.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
