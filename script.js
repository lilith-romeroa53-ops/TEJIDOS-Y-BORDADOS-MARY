/* ========================
   Datos del catálogo
======================== */
const PRODUCT_DATA = {
  servilletas: {
    title: "Servilletas",
    img: "img/servilletas.jpg",
    prices: [
      ["Chica", 70],
      ["Grande", 120],
    ],
  },
  tortillero: {
    title: "Tortilleros de tela",
    img: "img/tortillero.jpg",
    prices: [
      ["Único", 50],
    ],
  },
  manteles: {
    title: "Manteles",
    img: "img/mantel.jpg",
    prices: [
      ["Mediano", 1000],
      ["Grande", 1500],
    ],
  },
  decoraciones: {
    title: "Decoraciones de crochet",
    img: "img/decoraciones.jpg",
    prices: [
      ["Chica", 200],
      ["Mediana", 600],
      ["Grande", 1200],
    ],
  },
  bolsas: {
    title: "Bolsas a crochet",
    img: "img/bolsa.jpg",
    prices: [
      ["Única", 300],
    ],
  },
  ropa: {
    title: "Ropa a crochet",
    img: "img/ropa.jpg",
    prices: [
      ["Falda", 600],
      ["Blusa", 750],
      ["Mañanitas", 1000],
    ],
  },
};

/* ========================
   Página de catálogo
======================== */
(function initCatalog(){
  const grid = document.querySelector(".gallery");
  if(!grid) return;

  const overlay = document.getElementById("overlay");
  const detail = document.getElementById("detail");
  const title = document.getElementById("detailTitle");
  // QUITADO: const img = document.getElementById("detailImg");
  const rows = document.getElementById("detailRows");
  const close = document.getElementById("closeDetail");

  document.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const key = card.dataset.key;
      const data = PRODUCT_DATA[key];
      if(!data) return;

      title.textContent = data.title;
      // QUITADO: img.src = data.img;
      rows.innerHTML = data.prices.map(([size, price]) =>
        `<tr><td>${size}</td><td>$${Number(price).toLocaleString("es-MX")}</td></tr>`
      ).join("");

      overlay.hidden = false;
      detail.hidden = false;
    });
  });

  function closeDetail(){
    overlay.hidden = true;
    detail.hidden = true;
  }
  overlay?.addEventListener("click", closeDetail);
  close?.addEventListener("click", closeDetail);
})();

/* ========================
   Página de cotización
======================== */
(function initQuote(){
  const form = document.getElementById("cotizacionForm");
  if(!form) return;

  const sel = document.getElementById("c_producto");
  const qty = document.getElementById("c_cantidad");
  const priceInput = document.getElementById("c_precio");
  const totalEl = document.getElementById("c_total");
  const btnPDF = document.getElementById("btn_pdf");

  function updateTotals(){
    const opt = sel.options[sel.selectedIndex];
    const price = opt ? Number(opt.dataset.price || 0) : 0;
    const cant = Math.max(1, Number(qty.value || 1));
    const total = price * cant;

    priceInput.value = price ? `$${price.toLocaleString("es-MX", {minimumFractionDigits: 2})}` : "$0.00";
    totalEl.textContent = `$${total.toLocaleString("es-MX", {minimumFractionDigits: 2})}`;
  }

  sel.addEventListener("change", updateTotals);
  qty.addEventListener("input", updateTotals);
  updateTotals();

  btnPDF.addEventListener("click", async ()=>{
    // Validación mínima
    const nombre = document.getElementById("c_nombre").value.trim();
    const email  = document.getElementById("c_email").value.trim();
    const tel    = document.getElementById("c_tel").value.trim();
    const opt    = sel.options[sel.selectedIndex];

    if(!nombre || !email || !tel || !opt?.value){
      alert("Completa nombre, email, teléfono y producto.");
      return;
    }

    const precio = Number(opt.dataset.price || 0);
    const cantidad = Math.max(1, Number(qty.value || 1));
    const total = precio * cantidad;

    // Generar PDF (jsPDF)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const lineY = (y)=>{ doc.setDrawColor(230); doc.line(60, y, 535, y); };

    // Encabezado
    doc.setFillColor(101, 39, 204);
    doc.rect(0,0,595,90,"F");
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold"); doc.setFontSize(20);
    doc.text("Tejidos y Bordados Mary", 60, 55);

    // Datos cliente
    doc.setTextColor(0,0,0); doc.setFont("helvetica","normal"); doc.setFontSize(11);
    const fecha = new Date().toLocaleString("es-MX");
    doc.text(`Fecha: ${fecha}`, 60, 120);
    doc.text(`Cliente: ${nombre}`, 60, 140);
    doc.text(`Email: ${email}`, 60, 160);
    doc.text(`Teléfono: ${tel}`, 60, 180);
    lineY(190);

    // Tabla simple
    doc.setFont("helvetica","bold"); doc.text("Producto", 60, 220);
    doc.text("Cantidad", 300, 220);
    doc.text("P. Unitario", 400, 220);
    doc.text("Total", 500, 220);

    doc.setFont("helvetica","normal");
    doc.text(opt.value, 60, 245);
    doc.text(String(cantidad), 300, 245);
    doc.text(`$${precio.toLocaleString("es-MX")}`, 400, 245, { align: "left" });
    doc.text(`$${total.toLocaleString("es-MX")}`, 500, 245, { align: "left" });
    lineY(260);

    // Total grande
    doc.setFont("helvetica","bold"); doc.setFontSize(14);
    doc.text(`Total a pagar: $${total.toLocaleString("es-MX")}`, 60, 300);

    // Nota
    doc.setFont("helvetica","normal"); doc.setFontSize(10);
    doc.text("Gracias por su preferencia. Precios en MXN. Vigencia 7 días.", 60, 330);

    doc.save(`Cotizacion_${nombre.replace(/\s+/g,"_")}.pdf`);
  });
})();

