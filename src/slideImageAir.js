let solutionIndex = 0;
      let L = localStorage.getItem("glp-lang") || "lo";

      function renderAirSolution(animate = false) {
        const languageIndex = L === "lo" ? 0 : 1;
        const slide = solutionSlides[solutionIndex];
        const image = document.getElementById("solution-image");
        const imageFrame = document.getElementById("solution-image-frame");
        const content = document.getElementById("solution-content");
        const ecoIllustration =
          slide.image === "Images/Stop Burning Waste_ Choose Composting.png" ||
          slide.image === "Images/Eco-Friendly Transportation Showcase.png";
        const illustrationImage = solutionIndex === 0 || ecoIllustration;

        imageFrame.classList.toggle(
          "solution-clean-air-background",
          solutionIndex === 0,
        );
        imageFrame.classList.toggle(
          "solution-eco-background",
          ecoIllustration,
        );
        image.classList.toggle("object-contain", illustrationImage);
        image.classList.toggle("object-cover", !illustrationImage);
        image.src = slide.image;
        image.alt = slide.alt[languageIndex];
        document.getElementById("solution-title").textContent =
          T[slide.title][languageIndex];
        document.getElementById("solution-description").textContent =
          T[slide.description][languageIndex];
        document.getElementById("solution-examples").replaceChildren(
          ...slide.examples.map((example) => {
            const item = document.createElement("li");
            item.className =
              "flex items-start gap-3 rounded-xl border border-deep/10 bg-white px-3 py-3 text-sm text-deep";
            const icon = document.createElement("i");
            icon.className = "ri-check-line mt-0.5 text-lg text-leaf";
            icon.setAttribute("aria-hidden", "true");
            const label = document.createElement("span");
            label.textContent = example[languageIndex];
            item.append(icon, label);
            return item;
          }),
        );
        const resource = document.getElementById("solution-resource");
        resource.replaceChildren();
        if (slide.resourceLink) {
          const link = document.createElement("a");
          link.href = slide.resourceLink.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.className =
            "inline-flex items-center gap-1 text-sm font-semibold text-forest underline decoration-forest/40 underline-offset-4 transition hover:text-leaf";
          link.textContent = slide.resourceLink.label[languageIndex];
          const icon = document.createElement("i");
          icon.className = "ri-external-link-line";
          icon.setAttribute("aria-hidden", "true");
          link.append(icon);
          resource.append(link);
        }

        const step = `${String(solutionIndex + 1).padStart(2, "0")} / ${String(solutionSlides.length).padStart(2, "0")}`;
        document.getElementById("solution-step").textContent = step;
        document.getElementById("solution-count").textContent = step;

        const progress = document.getElementById("solution-progress");
        progress.setAttribute(
          "aria-label",
          L === "lo" ? "ຄວາມຄືບໜ້າຂອງແນວທາງແກ້ໄຂ" : "Air solutions progress",
        );
        progress.replaceChildren(
          ...solutionSlides.map((item, index) => {
            const indicator = document.createElement("span");
            indicator.className = "h-2.5 rounded-full transition-all duration-300";
            indicator.style.backgroundColor =
              index === solutionIndex ? "#0d4a34" : "#d1d5db";
            indicator.style.width = index === solutionIndex ? "2rem" : "0.625rem";
            indicator.setAttribute(
              "aria-label",
              `${L === "lo" ? "ຂັ້ນຕອນ" : "Step"} ${index + 1}: ${T[item.title][languageIndex]}`,
            );
            if (index === solutionIndex) indicator.setAttribute("aria-current", "step");
            return indicator;
          }),
        );

        document.getElementById("solution-previous").disabled = solutionIndex === 0;
        document.getElementById("solution-next").disabled =
          solutionIndex === solutionSlides.length - 1;

        if (animate) {
          content.classList.remove("solution-content-enter");
          image.classList.remove("solution-image-enter");
          void content.offsetWidth;
          content.classList.add("solution-content-enter");
          image.classList.add("solution-image-enter");
        }
      }

      function renderAirPage() {
        document.documentElement.lang = L;
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.dataset.i18n;
          if (T[key]) {
            el.innerHTML = T[key][L === "lo" ? 0 : 1];
          }
        });
        renderAirSolution();
        document.querySelectorAll("[data-lang]").forEach((b) => {
          const active = b.dataset.lang === L;
          b.classList.toggle("act", active);
          b.setAttribute("aria-pressed", String(active));
        });
      }

      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-lang]");
        if (b) {
          L = b.dataset.lang;
          try {
            localStorage.setItem("glp-lang", L);
          } catch (x) {}
          renderAirPage();
        }
      });

      document.getElementById("solution-previous").addEventListener("click", () => {
        if (solutionIndex > 0) {
          solutionIndex -= 1;
          renderAirSolution(true);
        }
      });

      document.getElementById("solution-next").addEventListener("click", () => {
        if (solutionIndex < solutionSlides.length - 1) {
          solutionIndex += 1;
          renderAirSolution(true);
        }
      });

      renderAirPage();
