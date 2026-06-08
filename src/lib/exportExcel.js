import * as XLSX from 'xlsx';

function monthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function monthLabel(date) {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function saleToRow(sale) {
  const date = new Date(sale.createdAt);
  const paymentLabel = sale.paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Efectivo';

  return {
    Fecha: date.toLocaleDateString('es-ES'),
    Hora: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    Servicios: sale.items.map((item) => `${item.nombre} x${item.cantidad}`).join(', '),
    'Metodo de pago': paymentLabel,
    Total: sale.total,
  };
}

function buildMonthSheet(sales) {
  const rows = sales.map(saleToRow);
  const count = sales.length;
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);

  rows.push({});
  rows.push({ Fecha: 'Resumen mensual' });
  rows.push({ Fecha: 'Numero de ventas', Hora: count });
  rows.push({ Fecha: 'Total facturado', Hora: total });

  return XLSX.utils.json_to_sheet(rows, { skipHeader: false });
}

export function exportSalesWorkbook(sales, fileName = 'ventas-nailba.xlsx') {
  const workbook = XLSX.utils.book_new();
  const salesByMonth = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt);
    const key = monthKey(date);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(sale);
    return acc;
  }, {});

  if (Object.keys(salesByMonth).length === 0) {
    XLSX.utils.book_append_sheet(workbook, buildMonthSheet([]), 'Sin ventas');
  }

  Object.entries(salesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, monthSales]) => {
      const [year, month] = key.split('-');
      const sheetDate = new Date(Number(year), Number(month) - 1, 1);
      const sheetName = monthLabel(sheetDate)
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .slice(0, 31);

      XLSX.utils.book_append_sheet(workbook, buildMonthSheet(monthSales), sheetName);
    });

  XLSX.writeFile(workbook, fileName);
}

export function exportDailyWorkbook(sales, date, fileName = 'ventas-dia.xlsx') {
  const workbook = XLSX.utils.book_new();
  const sameDaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === date.toDateString();
  });

  const sheet = buildMonthSheet(sameDaySales);
  const label = date.toLocaleDateString('es-ES').replaceAll('/', '-');
  XLSX.utils.book_append_sheet(workbook, sheet, `Dia ${label}`.slice(0, 31));
  XLSX.writeFile(workbook, fileName);
}
