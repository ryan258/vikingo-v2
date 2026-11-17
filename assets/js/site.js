// ==========================================================================
// Vikingo Estudios · Client-Side Interactivity
// 1. Popover API feature-detection polyfill (`navbar` & `dialog` guides)
// 2. Intrinsic width-measuring responsive navigation (`navbar` guide)
// 3. Native <dialog> Lightbox with closedBy fallback (`dialog` guide)
// 4. Equipment filter & Session inquiry helper
// ==========================================================================

// 1. MANDATORY: Feature detect 'popover' on HTMLElement.prototype
if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  import("https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js");
}

// 2. Responsive Site Navigation (`navbar` guide)
const siteHeader = document.getElementById("site-header");
const siteMenu = document.getElementById("site-menu");

if (siteHeader && siteMenu) {
  const headerInner = siteHeader.querySelector(".header-inner");
  let lastCollapsedWidth = 0;

  const syncNavLayout = () => {
    const wasOpen =
      siteMenu.matches(":popover-open") || siteMenu.classList.contains(":popover-open");

    siteHeader.classList.add("is-measuring", "is-wide");
    siteMenu.removeAttribute("popover");

    const fitsInline = headerInner.scrollWidth <= headerInner.clientWidth;

    if (!fitsInline) {
      siteHeader.classList.remove("is-wide");
      siteMenu.setAttribute("popover", "auto");
      lastCollapsedWidth = headerInner.clientWidth;
      if (wasOpen && typeof siteMenu.showPopover === "function") {
        try {
          siteMenu.showPopover();
        } catch {
          // Ignore if polyfill is still initializing
        }
      }
    }

    requestAnimationFrame(() => {
      siteHeader.classList.remove("is-measuring");
    });
  };

  syncNavLayout();

  const ro = new ResizeObserver(() => {
    const isCurrentlyWide = siteHeader.classList.contains("is-wide");
    if (isCurrentlyWide || headerInner.clientWidth > lastCollapsedWidth) {
      syncNavLayout();
    }
  });

  ro.observe(siteHeader);
  ro.observe(siteMenu);
}

// 3. Native <dialog> Lightbox (`dialog` guide)
if (!("closedBy" in HTMLDialogElement.prototype)) {
  const outside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener("pointerdown", (e) => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener("pointerup", (e) => {
      if (pressedOutside && outside(e, dialog)) dialog.close();
    });
  }
}

const lightboxDialog = document.getElementById("gallery-lightbox");
const galleryTriggers = Array.from(document.querySelectorAll(".gallery-trigger"));

if (lightboxDialog && galleryTriggers.length > 0) {
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbCollection = document.getElementById("lightbox-collection");
  const lbPrev = document.getElementById("lightbox-prev");
  const lbNext = document.getElementById("lightbox-next");
  let currentIndex = 0;

  const renderSlide = (index) => {
    currentIndex = (index + galleryTriggers.length) % galleryTriggers.length;
    const btn = galleryTriggers[currentIndex];
    lbImg.src = btn.dataset.lightboxSrc || "";
    lbImg.alt = btn.dataset.lightboxTitle || "";
    lbImg.width = Number(btn.dataset.lightboxWidth) || 960;
    lbImg.height = Number(btn.dataset.lightboxHeight) || 720;
    lbTitle.textContent = btn.dataset.lightboxTitle || "";
    lbCaption.textContent = btn.dataset.lightboxCaption || "";
    lbCollection.textContent = btn.dataset.lightboxCollection || "";
  };

  galleryTriggers.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      renderSlide(idx);
      lightboxDialog.showModal();
    });
  });

  lbPrev?.addEventListener("click", () => renderSlide(currentIndex - 1));
  lbNext?.addEventListener("click", () => renderSlide(currentIndex + 1));

  lightboxDialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      renderSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      renderSlide(currentIndex + 1);
    }
  });

  lightboxDialog.addEventListener("close", () => {
    lightboxDialog.returnValue = "";
  });
}

// 4. Equipment Filter (`/equipamiento/`)
const gearSearchInput = document.getElementById("gear-filter-input");
const gearCatButtons = Array.from(document.querySelectorAll("[data-gear-cat]"));
const gearBlocks = Array.from(document.querySelectorAll(".gear-category-block"));
const gearEmptyMsg = document.getElementById("gear-empty-state");

if (gearSearchInput && gearBlocks.length > 0) {
  let activeCategory = "all";

  const applyGearFilter = () => {
    const query = gearSearchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    gearBlocks.forEach((block) => {
      const catMatches = activeCategory === "all" || block.dataset.category === activeCategory;
      const rows = Array.from(block.querySelectorAll(".gear-spec-row"));
      let matchingRowsInBlock = 0;

      rows.forEach((row) => {
        const textMatches = !query || (row.dataset.gearText || "").includes(query);
        const showRow = catMatches && textMatches;
        row.hidden = !showRow;
        if (showRow) matchingRowsInBlock++;
      });

      const showBlock = catMatches && matchingRowsInBlock > 0;
      block.hidden = !showBlock;
      if (showBlock) visibleCount += matchingRowsInBlock;
    });

    if (gearEmptyMsg) {
      gearEmptyMsg.hidden = visibleCount > 0;
    }
  };

  gearSearchInput.addEventListener("input", applyGearFilter);

  gearCatButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.gearCat || "all";
      gearCatButtons.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle("is-active", isCurrent);
        b.setAttribute("aria-pressed", isCurrent ? "true" : "false");
      });
      applyGearFilter();
    });
  });
}

// 5. Session Inquiry Form (`/contacto/`)
const inquiryForm = document.getElementById("session-inquiry-form");
if (inquiryForm) {
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("servicio");
  const serviceSelect = document.getElementById("inq-service");

  if (serviceParam && serviceSelect) {
    const map = {
      grabacion: "Grabación en Sala Viva",
      mezcla: "Mezcla Analógica / Híbrida",
      mastering: "Mastering Analógico",
      produccion: "Producción Artística Integral",
    };
    if (map[serviceParam]) {
      serviceSelect.value = map[serviceParam];
    }
  }

  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitter = e.submitter;
    const channel = submitter?.dataset.channel || "whatsapp";

    const name = document.getElementById("inq-name")?.value.trim() || "";
    const contact = document.getElementById("inq-email")?.value.trim() || "";
    const service = document.getElementById("inq-service")?.value || "";
    const details = document.getElementById("inq-details")?.value.trim() || "";

    const bodyLines = [
      `¡Hola Vikingo Estudios!`,
      `Soy ${name} (${contact}).`,
      `Les escribo para consultar por: ${service}.`,
      details ? `\nDetalles del proyecto:\n${details}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (channel === "mailto") {
      const subject = encodeURIComponent(`Consulta de Sesión (${service}) - ${name}`);
      const body = encodeURIComponent(bodyLines);
      window.location.href = `mailto:Vikingostudio@gmail.com?cc=nahuelmartorelli@gmail.com&subject=${subject}&body=${body}`;
    } else {
      const text = encodeURIComponent(bodyLines);
      window.open(`https://wa.me/5491154913025?text=${text}`, "_blank", "noopener");
    }
  });
}
