(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Nav toggle ──
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("siteNav");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) return;
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  // ── Active nav on scroll ──
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { threshold: 0.25, rootMargin: "-20% 0px -58% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  // ── Reading progress bar ──
  const progressBar = document.getElementById("page-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ── Back to top button ──
  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener(
      "scroll",
      () => { backBtn.classList.toggle("visible", window.scrollY > 480); },
      { passive: true }
    );
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  // ── Animated stat counters ──
  const statEls = document.querySelectorAll(".stats strong[data-count]");
  if (statEls.length && "IntersectionObserver" in window && !prefersReduced) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const countUp = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const isFloat = String(target).includes(".");
      const duration = 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const val = easeOut(progress) * target;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
        }
      };
      requestAnimationFrame(tick);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          statsObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach((el) => statsObserver.observe(el));
  }

  // ── Scroll reveal ──
  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealEls = document.querySelectorAll([
      ".fit-cards article",
      ".flow article",
      ".work-card",
      ".matrix article",
      ".job-grid article",
      ".cert-grid article",
      ".stats article",
      ".story-card",
      ".hero-card",
    ].join(", "));

    revealEls.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -36px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }
})();