// Gallery Filters
function filterGallery(category) {
  const items = document.querySelectorAll(".gallery-item");
  const buttons = document.querySelectorAll(".gallery-filter-btn");
  const grid = document.getElementById("gallery-grid");
  const isFiltered = category !== "all";

  if (grid) {
    grid.style.display = isFiltered ? "flex" : "";
    grid.style.justifyContent = isFiltered ? "center" : "";
  }

  buttons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    const isAll = isActive && button.dataset.filter === "all";
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("bg-emerald-800", isAll);
    button.classList.toggle("text-white", isAll);
    button.classList.toggle("text-emerald-800", !isAll);
    button.classList.toggle("shadow-sm", isAll);
    button.classList.toggle("border", isAll);
    button.classList.toggle("border-emerald-900/10", isAll);
  });

  items.forEach((item) => {
    item.style.width = isFiltered ? "100%" : "";
    item.style.maxWidth = isFiltered ? "40rem" : "";

    item.style.display =
      !item.hidden && (category === "all" || item.classList.contains(category))
        ? ""
        : "none";

    const photo = item.querySelector(".bg-cover");
    if (photo) photo.style.height = isFiltered ? "24rem" : "";
  });
}

// Lightbox Control
let lightboxPhotos = [];
let lightboxIndex = -1;
let lightboxFrameSize = null;
let lightboxAspectRatio = null;

function openLightbox(imgSrc, captionText) {
  const modal = document.getElementById("dlg");
  const content = document.getElementById("dc");

  if (!modal || !content) {
    throw new Error("Gallery lightbox dialog elements are missing.");
  }

  lightboxPhotos = [{ src: imgSrc, caption: captionText }];
  lightboxIndex = 0;
  lightboxFrameSize = null;
  lightboxAspectRatio = null;
  if (!modal.open) modal.showModal();
  renderLightboxPhoto();
}

function renderLightboxPhoto() {
  const content = document.getElementById("dc");
  if (!content || lightboxIndex < 0 || !lightboxPhotos[lightboxIndex]) return;

  const { src, caption: captionText } = lightboxPhotos[lightboxIndex];
  const photoIndex = lightboxIndex;
  const frame = document.createElement("div");
  frame.className = "relative mx-auto flex items-center justify-center";
  if (lightboxFrameSize) {
    frame.style.width = `${lightboxFrameSize.width}px`;
    frame.style.height = `${lightboxFrameSize.height}px`;
  }

  const image = document.createElement("img");
  image.alt = captionText;
  image.className = "mx-auto block rounded-xl object-contain object-center";
  if (lightboxAspectRatio) image.style.objectFit = "contain";
  if (lightboxFrameSize) {
    image.style.width = "100%";
    image.style.height = "100%";
  }
  const setImageSize = () => {
    if (
      lightboxFrameSize ||
      photoIndex !== lightboxIndex ||
      !image.naturalWidth ||
      !image.naturalHeight
    ) {
      return;
    }

    const maxWidth = Math.min(
      window.innerWidth * 0.9,
      window.innerWidth * 0.94 - 24,
      80 * 16 - 24,
    );
    const maxHeight = window.innerHeight * 0.75;
    let width;
    let height;
    if (lightboxAspectRatio) {
      width = Math.min(maxWidth, maxHeight * lightboxAspectRatio);
      height = width / lightboxAspectRatio;
    } else {
      const scale = Math.min(
        maxWidth / image.naturalWidth,
        maxHeight / image.naturalHeight,
      );
      width = image.naturalWidth * scale;
      height = image.naturalHeight * scale;
    }

    lightboxFrameSize = { width, height };
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    document.getElementById("dlg").style.width = `${width + 24}px`;
  };
  image.addEventListener("load", setImageSize, { once: true });
  frame.append(image);

  const caption = document.createElement("p");
  caption.textContent = captionText;
  caption.className = "mt-2 text-center font-medium";

  const controls = document.createElement("div");
  controls.className = "mt-2 flex items-center justify-center";

  if (lightboxPhotos.length > 1) {
    const previous = document.createElement("button");
    previous.type = "button";
    previous.dataset.galleryStep = "-1";
    previous.setAttribute("aria-label", "Previous picture");
    previous.className =
      "absolute left-3 top-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-emerald-900 text-2xl text-white shadow-lg transition hover:bg-leaf";
    previous.style.transform = "translateY(-50%)";
    const previousIcon = document.createElement("i");
    previousIcon.className = "ri-arrow-left-line";
    previousIcon.setAttribute("aria-hidden", "true");
    previous.append(previousIcon);

    const position = document.createElement("span");
    position.className = "text-sm text-deep/70";
    position.textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;

    const next = document.createElement("button");
    next.type = "button";
    next.dataset.galleryStep = "1";
    next.setAttribute("aria-label", "Next picture");
    next.className =
      "absolute right-3 top-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-emerald-900 text-2xl text-white shadow-lg transition hover:bg-leaf";
    next.style.transform = "translateY(-50%)";
    const nextIcon = document.createElement("i");
    nextIcon.className = "ri-arrow-right-line";
    nextIcon.setAttribute("aria-hidden", "true");
    next.append(nextIcon);

    frame.append(previous, next);
    controls.append(position);
  }

  content.replaceChildren(frame, caption, controls);
  const modal = document.getElementById("dlg");
  if (modal) {
    modal.style.width = lightboxFrameSize
      ? `${lightboxFrameSize.width + 24}px`
      : "fit-content";
  }
  image.src = src;
  if (image.complete) setImageSize();
}

function closeLightbox() {
  const modal = document.getElementById("dlg");
  if (modal?.open) modal.close();
  lightboxPhotos = [];
  lightboxIndex = -1;
  lightboxFrameSize = null;
  lightboxAspectRatio = null;
}

function showGalleryPhoto(item) {
  const category = ["cleanup", "booth", "caps", "education"].find((name) =>
    item.classList.contains(name),
  );
  if (!category) {
    throw new Error("Gallery item is missing its activity category.");
  }

  const items = [...document.querySelectorAll(".gallery-item")].filter(
    (galleryItem) => galleryItem.classList.contains(category),
  );
  lightboxPhotos = items.map((galleryItem) => {
    const image = galleryItem.querySelector(".bg-cover");
    if (!image) {
      throw new Error("Gallery item is missing its photo.");
    }

    const background = getComputedStyle(image).backgroundImage;
    const src = background.match(/^url\(["']?(.*?)["']?\)$/)?.[1];
    if (!src) {
      throw new Error("Gallery photo URL could not be read.");
    }

    return {
      src,
      caption:
        galleryItem.querySelector("[data-i18n]")?.textContent.trim() ||
        "Gallery photo",
    };
  });
  lightboxIndex = items.indexOf(item);
  lightboxFrameSize = null;
  lightboxAspectRatio = 16 / 9;

  const modal = document.getElementById("dlg");
  if (!modal) throw new Error("Gallery lightbox dialog is missing.");
  if (!modal.open) modal.showModal();
  renderLightboxPhoto();
}

const cleanupPhotos = [
  "790412110_1556039532435207_9120863940681163647_n.png",
  "796510241_1615852653208563_1305650704094513287_n.png",
  "797150604_2699087827186736_6129148163098709632_n.png",
  "798709576_1714102363038880_5481323223471763241_n.png",
  "798826055_1790339829083434_6621362589083271894_n.png",
  "808138703_1111676288071406_2583434535310263684_n.png",
  "825614906_3188474814683952_8604844769624270597_n.png",
  "828127946_2267977663992700_5574788943299751175_n.png",
  "840765525_1119456370732053_6804029758921597333_n.png",
  "854944080_1488870426418765_8871877238937711309_n.png",
  "waste activity 3.jpeg",
  "waste activity 4.jpeg",
  "waste activity 5.jpeg",
  "waste activity1.jpeg",
  "waste activity2.jpeg",
  "WhatsApp Image 2026-10-21 at 19.15.38.jpeg",
];
const galleryGrid = document.getElementById("gallery-grid");

function addHiddenGalleryPhotos(category, folder, filenames) {
  const template = document.querySelector(`.gallery-item.${category}`);
  if (!template || !galleryGrid) {
    throw new Error(`Gallery template or grid is missing for ${category}.`);
  }

  filenames.forEach((filename) => {
    const item = template.cloneNode(true);
    const image = item.querySelector(".bg-cover");
    item.removeAttribute("onclick");
    item.hidden = true;
    image.style.backgroundImage = `url("${folder}/${filename}")`;
    galleryGrid.append(item);
  });
}

addHiddenGalleryPhotos("cleanup", "Images_cleanup", cleanupPhotos);
addHiddenGalleryPhotos("booth", "Images_booth", [
  "798182137_1632308501931275_1479341947757508990_n.jpg",
  "799143030_2697452203983638_9121662904165428970_n.png",
  "801786203_1632445038584288_2039532962091720220_n.jpg",
  "801938844_1972121116814873_2432539839671547412_n.png",
  "802002942_1704446783981202_776436672939173326_n.png",
  "802245306_2146671552596620_7684147480234990833_n.png",
  "802245313_1547855873322153_6098408591890437148_n.png",
  "802334955_1444266504239545_2937575064168415444_n.png",
  "802988655_1632445995250859_3307640659352464774_n.jpg",
  "Booth1.jpeg",
  "Booth2.jpeg",
  "WhatsApp Image 2026-10-29 at 12.49.04.jpeg",
]);

addHiddenGalleryPhotos("caps", "Images_collectCaps", [
  "799142879_1632444705250988_4724820050884289470_n.jpg",
  "donate caps.jpeg",
  "donate caps2.jpeg",
]);

addHiddenGalleryPhotos("education", "Images_donateTable", [
  "Donate Table 1.jpeg",
  "Donate Table2.jpeg",
  "Donate Table3.jpeg",
  "Donate Table4.jpeg",
  "Donate Table5.jpeg",
  "WhatsApp Image 2026-10-24 at 14.22.43.jpeg",
]);

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.setAttribute("role", "button");
  item.tabIndex = 0;
});

document.addEventListener(
  "click",
  (event) => {
    const item = event.target.closest(".gallery-item");
    if (!item) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    showGalleryPhoto(item);
  },
  true,
);

document.addEventListener("keydown", (event) => {
  if (lightboxPhotos.length > 1 && lightboxIndex >= 0) {
    if (event.key === "ArrowRight") {
      lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
      renderLightboxPhoto();
    } else if (event.key === "ArrowLeft") {
      lightboxIndex =
        (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
      renderLightboxPhoto();
    }
  }

  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches(".gallery-item")
  ) {
    event.preventDefault();
    showGalleryPhoto(event.target);
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-step]");
  if (!button || lightboxPhotos.length < 2) return;

  lightboxIndex =
    (lightboxIndex +
      Number(button.dataset.galleryStep) +
      lightboxPhotos.length) %
    lightboxPhotos.length;
  renderLightboxPhoto();
});

document.getElementById("dlg")?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeLightbox();
});

document.getElementById("dlg")?.addEventListener("close", () => {
  lightboxPhotos = [];
  lightboxIndex = -1;
  lightboxFrameSize = null;
  lightboxAspectRatio = null;
});

filterGallery("all");
