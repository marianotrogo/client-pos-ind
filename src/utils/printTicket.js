import axios from "../api/axios.js";

export const printTicket = async (sale) => {
  // Traer la configuración del negocio
  let settings = {
    businessName: "MI TIENDA",
    address: "Dirección genérica",
    phone: "0000-000000",
    headerText: "",
    footerText: "",
    logoUrl: "",
    qrLink: "",
  };

  try {
    const res = await axios.get("/settings");
    if (res.data) settings = res.data;
  } catch (err) {
    console.error("No se pudieron cargar los settings:", err);
  }

  const isExchange = sale.isExchange || sale.items.some(i => i.isReturn);

  // HTML de los items (solo descripción, talla y cantidad x precio)
  const itemsHTML = sale.items.map(i => {
    const qtyDisplay = i.isReturn ? `-${i.qty}` : i.qty;
    return `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:bold;">
        <span style="max-width:150px; font-weight:bold;">${i.description} (${i.size || "-"})</span>
        <span style="font-weight:bold;">${qtyDisplay} x $${i.price.toFixed(2)}</span>
      </div>
    `;
  }).join("");

  const ticketHTML = `
    <div style="
      font-family:'Courier New', monospace;
      font-size:14px;
      font-weight:bold;
      width:280px;
      padding:10px;
      line-height:1.4;
      color:#000;
    ">
      <!-- Encabezado -->
      <div style="text-align:center; margin-bottom:10px;">
        ${settings.logoUrl ? `<img src="${settings.logoUrl}" alt="Logo" style="max-width:80px; margin-bottom:6px;">` : ""}
        <h1 style="font-size:18px; font-weight:bold; margin:0;">${settings.businessName}</h1>
        ${settings.address ? `<p style="margin:2px 0; font-weight:bold;">${settings.address}</p>` : ""}
        ${settings.phone ? `<p style="margin:2px 0; font-weight:bold;">Tel: ${settings.phone}</p>` : ""}
        ${settings.headerText ? `<p style="margin:2px 0; font-weight:bold;">${settings.headerText}</p>` : ""}
      </div>

      <hr style="border:0; border-top:2px dashed #000; margin:8px 0;" />

      <!-- Datos de la venta -->
      <p style="margin:2px 0; font-weight:bold;">N° Ticket: ${sale.number}</p>
      <p style="margin:2px 0; font-weight:bold;">Fecha: ${new Date(sale.createdAt).toLocaleString()}</p>
      <p style="margin:2px 0; font-weight:bold;">Cliente: ${sale.client?.name || "Consumidor Final"}</p>
      <p style="margin:2px 0; font-weight:bold;">Operación: ${isExchange ? "CAMBIO" : "VENTA"}</p>

      <hr style="border:0; border-top:2px dashed #000; margin:8px 0;" />

      <!-- Productos -->
      ${itemsHTML}

      <hr style="border:0; border-top:2px dashed #000; margin:8px 0;" />

      <!-- Totales -->
      <p style="margin:2px 0; font-weight:bold;">Subtotal: $${sale.subtotal.toFixed(2)}</p>
      <p style="margin:2px 0; font-weight:bold;">Descuento: ${sale.discount}%</p>
      <p style="margin:2px 0; font-weight:bold;">Recargo: ${sale.surcharge}%</p>
      <h2 style="text-align:right; font-size:16px; font-weight:bold; margin-top:6px;">
        TOTAL: $${sale.total.toFixed(2)}
      </h2>
      <p style="margin:2px 0; font-weight:bold;">Forma de pago: ${sale.paymentType}</p>

      <!-- QR debajo de totales -->
      ${settings.qrLink ? `<div style="text-align:center; margin-top:8px;"><img src="${settings.qrLink}" alt="QR" style="max-width:60px;"></div>` : ""}

      <!-- Footer del negocio -->
      ${settings.footerText ? `<p style="text-align:center; font-size:12px; margin-top:10px; font-weight:bold;">${settings.footerText}</p>` : `
        <p style="text-align:center; font-size:12px; margin-top:10px; font-weight:bold;">¡Gracias por su compra!</p>
      `}
    </div>
  `;

  const w = window.open("", "_blank", "width=400,height=600");
  w.document.write(ticketHTML);
  w.document.close();
  w.print();
  w.close();
};
