
 emailjs.init("x-ws3TFN_A-xqOo8W");
 document.addEventListener("DOMContentLoaded", () => {
        // --- VARIABLES GLOBALES ---
        const navbar = document.getElementById("navbar");
        const indicator = document.getElementById("nav-indicator");
        const navLinks = document.querySelectorAll(".nav-link");
        const navMenu = document.querySelector(".nav-menu");
        const body = document.body;

        // --- 1. LENIS (SMOOTH SCROLL GLOBAL) ---
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // --- 2. SCROLL & NAVBAR STATE ---
        window.addEventListener(
          "scroll",
          () => {
            if (window.innerWidth > 768) {
              if (window.scrollY > 50) {
                body.classList.add("scrolled");
              } else {
                body.classList.remove("scrolled");
              }
            }
            // En móvil no tocamos la clase: el CSS con !important maneja todo
          },
          { passive: true },
        );

        // Estado inicial correcto según viewport
        if (window.innerWidth <= 768) {
          body.classList.remove("scrolled");
        } else if (window.scrollY > 50) {
          body.classList.add("scrolled");
        }

        // --- 3. MAGNETIC INDICATOR ---
        function moveIndicator(el) {
          const menuRect = navMenu.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const menuStyles = getComputedStyle(navMenu);
          const paddingLeft = parseFloat(menuStyles.paddingLeft);
          const left = elRect.left - menuRect.left - paddingLeft;

          gsap.to(indicator, {
            width: elRect.width,
            x: left,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        if (navLinks && indicator) {
          navLinks.forEach((link) => {
            link.addEventListener("mouseenter", (e) => moveIndicator(e.target));
          });

          navMenu.addEventListener("mouseleave", () => {
            gsap.to(indicator, { opacity: 0, duration: 0.3 });
          });
        }

        // --- 4. SMOOTH SCROLL PARA ENLACES (con Lenis) ---
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
          link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId !== "#" && document.querySelector(targetId)) {
              e.preventDefault();
              const offset = navbar ? navbar.offsetHeight + 20 : 80;
              lenis.scrollTo(targetId, {
                offset: -offset,
                duration: 1.2,
              });
            }
          });
        });
        window.toggleCard = function (id) {
          const card = document.getElementById("card-" + id);
          const body = document.getElementById("body-" + id);
          const inner = body.querySelector(".service-card-body-inner");
          const chevron = card.querySelector(".service-card-chevron");
          const isOpen = card.classList.contains("is-open");

          document.querySelectorAll(".service-card.is-open").forEach((c) => {
            if (c.id === "card-" + id) return;
            const b = c.querySelector(".service-card-body");
            const ch = c.querySelector(".service-card-chevron");
            c.classList.remove("is-open");
            gsap.to(b, {
              height: 0,
              duration: 0.35,
              ease: "power2.inOut",
              onComplete: () => gsap.set(b, { visibility: "hidden" }),
            });
            gsap.to(ch, { rotation: 0, duration: 0.35, ease: "power2.inOut" });
          });

          if (!isOpen) {
            card.classList.add("is-open");
            const fullH = inner.offsetHeight;
            gsap.set(body, { visibility: "visible", height: 0 });
            gsap.to(body, {
              height: fullH,
              duration: 0.45,
              ease: "power3.out",
            });
            gsap.to(chevron, {
              rotation: 180,
              duration: 0.4,
              ease: "back.out(1.4)",
            });
          } else {
            card.classList.remove("is-open");
            gsap.to(body, {
              height: 0,
              duration: 0.38,
              ease: "power2.inOut",
              onComplete: () => gsap.set(body, { visibility: "hidden" }),
            });
            gsap.to(chevron, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.inOut",
            });
          }
        };
        function openFaq(item) {
  const summary = item.querySelector("summary");
  const answer = item.querySelector(".faq-answer");

  // Abrir primero para poder medir
  item.setAttribute("open", "");
  void item.offsetHeight;

  // Medir con el contenido visible
  const targetHeight = item.scrollHeight;

  // Ahora restringir y animar
  gsap.set(item, { height: summary.offsetHeight, overflow: "hidden" });

  gsap.to(item, {
    height: targetHeight,
    duration: 0.45,
    ease: "power2.out",
    onComplete: () => {
      item.style.height = "auto";
      item.style.overflow = "";
    },
  });
}

function shrinkFaq(item) {
  const summary = item.querySelector("summary");
  const currentHeight = item.offsetHeight;

  gsap.set(item, { height: currentHeight, overflow: "hidden" });

  gsap.to(item, {
    height: summary.offsetHeight,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      item.removeAttribute("open");
      item.style.height = "auto";
      item.style.overflow = "";
    },
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = item.hasAttribute("open");

    document.querySelectorAll(".faq-item[open]").forEach((openItem) => {
      if (openItem !== item) shrinkFaq(openItem);
    });

    isOpen ? shrinkFaq(item) : openFaq(item);
  });
});

        // --- 6. FORM VALIDATION & PHONE SELECT ---
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("telefono");

        if (emailInput) {
          const validateEmail = () => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              emailInput.value.trim(),
            );
            emailInput.classList.toggle(
              "invalid",
              !isValid && emailInput.value !== "",
            );
            const emailError = document.getElementById("emailError");
            if (emailError) {
              emailError.style.display =
                !isValid && emailInput.value !== "" ? "block" : "none";
            }
            return isValid;
          };
          emailInput.addEventListener("input", validateEmail);
        }

        if (phoneInput) {
          phoneInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          });
        }

        const select = document.getElementById("customPhoneSelect");
        const trigger = document.getElementById("selectTrigger");
        const hiddenInput = document.getElementById("phoneCode");

        if (trigger && select) {
          trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            select.classList.toggle("open");
          });

          document.querySelectorAll(".dropdown-option").forEach((opt) => {
            opt.addEventListener("click", function () {
              trigger.querySelector(".select-flag").src =
                `https://flagcdn.com/w40/${this.dataset.flag}.png`;
              trigger.querySelector(".select-code").textContent =
                this.dataset.value;
              if (hiddenInput) hiddenInput.value = this.dataset.value;
              select.classList.remove("open");
            });
          });

          document.addEventListener("click", () =>
            select.classList.remove("open"),
          );
        }

   // --- EmailJS Form Submit ---
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".form-submit");
    const originalText = submitBtn.textContent;

    // Validar campos vacíos
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const emailVal = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !apellido || !telefono || !mensaje) {
      submitBtn.textContent = "Completá todos los campos";
      submitBtn.style.background = "#c0392b";
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
      }, 3000);
      return;
    }

    // Validar email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailOk) {
      const emailError = document.getElementById("emailError");
      if (emailError) emailError.style.display = "block";
      return;
    }

    // Estado cargando
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    const templateParams = {
      nombre,
      apellido,
      email: emailVal,
      phoneCode: document.getElementById("phoneCode").value,
      telefono,
      mensaje,
    };

    emailjs
      .send("service_prueba", "template_d1vssai", templateParams)
      .then(() => {
        submitBtn.textContent = "¡Mensaje enviado!";
        submitBtn.style.background = "#458988";
        contactForm.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        submitBtn.textContent = "Error al enviar. Intentá de nuevo.";
        submitBtn.style.background = "#c0392b";
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 4000);
      });
  });
}

        // --- 7. HERO PHOTO STACK (GSAP desktop hover only) ---
        const stack = document.querySelector(".hero-photo-stack");
        if (stack) {
          const layer1 = stack.querySelector(".photo-layer-1");
          const layer2 = stack.querySelector(".photo-layer-2");
          const layer3 = stack.querySelector(".photo-layer-3");

          const isMobile = () => window.innerWidth <= 768;
          let stackTl = null;

          function setBasePositions() {
            if (isMobile()) {
              gsap.set(layer1, {
                rotation: 0,
                x: 0,
                y: 0,
                zIndex: 3,
                opacity: 1,
              });
            } else {
              gsap.set(layer3, {
                rotation: -5,
                x: -30,
                y: 10,
                zIndex: 1,
                opacity: 0.9,
              });
              gsap.set(layer2, {
                rotation: 2,
                x: 20,
                y: -5,
                zIndex: 2,
                opacity: 0.95,
              });
              gsap.set(layer1, {
                rotation: -1,
                x: -10,
                y: 5,
                zIndex: 3,
                opacity: 1,
              });
            }
          }

          function desktopOpen() {
            if (stackTl) stackTl.kill();
            stackTl = gsap.timeline();
            stackTl
              .to(
                layer3,
                {
                  rotation: -8,
                  x: -55,
                  y: 20,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              )
              .to(
                layer2,
                {
                  rotation: 5,
                  x: 45,
                  y: -10,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              )
              .to(
                layer1,
                {
                  rotation: -1,
                  x: -10,
                  y: 5,
                  scale: 1.01,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              );
          }

          function desktopClose() {
            if (stackTl) stackTl.kill();
            stackTl = gsap.timeline({ onComplete: setBasePositions });
            stackTl
              .to(
                layer3,
                {
                  rotation: -5,
                  x: -30,
                  y: 10,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                layer2,
                {
                  rotation: 2,
                  x: 20,
                  y: -5,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                layer1,
                {
                  rotation: -1,
                  x: -10,
                  y: 5,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              );
          }

          setBasePositions();

          stack.addEventListener("mouseenter", () => {
            if (!isMobile()) desktopOpen();
          });
          stack.addEventListener("mouseleave", () => {
            if (!isMobile()) desktopClose();
          });

          let lastWidthStack = window.innerWidth;
          window.addEventListener("resize", () => {
            const currentWidth = window.innerWidth;
            if (currentWidth === lastWidthStack) return;
            lastWidthStack = currentWidth;

            if (stackTl) stackTl.kill();
            setBasePositions();
            gsap.set(stack, {
              height: isMobile() ? "auto" : "34.375rem",
            });
          });
        }
        // --- 8. POLAROID STACK (GSAP desktop hover + móvil click) ---
        const polaroidCard = document.querySelector(".polaroid-stack-card");
        if (polaroidCard) {
          const p1 = polaroidCard.querySelector(".polaroid-1");
          const p2 = polaroidCard.querySelector(".polaroid-2");
          const p3 = polaroidCard.querySelector(".polaroid-3");

          const isMobile = () => window.innerWidth <= 768;
          let polaroidTl = null;
          let polaroidExpanded = false;

          function setPolaroidBase() {
            if (isMobile()) {
              gsap.set(p1, { rotation: -5, x: -20, y: -10, zIndex: 1 });
              gsap.set(p2, { rotation: 3, x: 8, y: 8, zIndex: 2 });
              gsap.set(p3, { rotation: -2, x: 28, y: -6, zIndex: 3 });
            } else {
              gsap.set(p1, { rotation: -8, x: -30, y: -20, zIndex: 1 });
              gsap.set(p2, { rotation: 5, x: 10, y: 10, zIndex: 2 });
              gsap.set(p3, { rotation: -3, x: 40, y: -10, zIndex: 3 });
            }
          }

          function polaroidOpen() {
            if (polaroidTl) polaroidTl.kill();
            polaroidTl = gsap.timeline();
            polaroidTl
              .to(
                p1,
                {
                  rotation: -12,
                  x: -50,
                  y: -30,
                  scale: 1,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              )
              .to(
                p2,
                {
                  rotation: 8,
                  x: 15,
                  y: 15,
                  scale: 1.02,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              )
              .to(
                p3,
                {
                  rotation: -5,
                  x: 60,
                  y: -15,
                  scale: 1,
                  duration: 0.45,
                  ease: "power3.out",
                },
                0,
              );
          }

          function polaroidClose() {
            if (polaroidTl) polaroidTl.kill();
            polaroidTl = gsap.timeline({ onComplete: setPolaroidBase });
            polaroidTl
              .to(
                p1,
                {
                  rotation: -8,
                  x: -30,
                  y: -20,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                p2,
                {
                  rotation: 5,
                  x: 10,
                  y: 10,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                p3,
                {
                  rotation: -3,
                  x: 40,
                  y: -10,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.inOut",
                },
                0,
              );
          }

          function polaroidExpand() {
            polaroidExpanded = true;
            if (polaroidTl) polaroidTl.kill();

            const offset = window.innerWidth <= 480 ? 220 : 255;
            const offset3 = window.innerWidth <= 480 ? 215 : 250;

            gsap.to(polaroidCard, {
              height: offset * 2 + 140,
              duration: 0.7,
              ease: "power2.out",
            });

            polaroidTl = gsap.timeline();
            polaroidTl
              .to(
                p2,
                { rotation: 0, x: 0, y: 0, duration: 0.6, ease: "power2.out" },
                0,
              )
              .to(
                p1,
                {
                  rotation: 0,
                  x: 0,
                  y: -offset,
                  duration: 0.65,
                  ease: "power2.out",
                },
                0.1,
              )
              .to(
                p3,
                {
                  rotation: 0,
                  x: 0,
                  y: offset3,
                  duration: 0.7,
                  ease: "power2.out",
                },
                0.2,
              );
          }

          function polaroidCollapse() {
            polaroidExpanded = false;
            if (polaroidTl) polaroidTl.kill();

            const baseHeight = window.innerWidth <= 480 ? "15rem" : "18rem";
            gsap.to(polaroidCard, {
              height: baseHeight,
              duration: 0.6,
              ease: "power2.inOut",
            });

            polaroidTl = gsap.timeline();
            polaroidTl
              .to(
                p3,
                {
                  rotation: -2,
                  x: 28,
                  y: -6,
                  scale: 1,
                  duration: 0.6,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                p2,
                {
                  rotation: 3,
                  x: 8,
                  y: 8,
                  scale: 1,
                  duration: 0.65,
                  ease: "power2.inOut",
                },
                0.08,
              )
              .to(
                p1,
                {
                  rotation: -5,
                  x: -20,
                  y: -10,
                  scale: 1,
                  duration: 0.7,
                  ease: "power2.inOut",
                },
                0.16,
              );
          }

          setPolaroidBase();

          polaroidCard.addEventListener("click", () => {
            if (isMobile()) {
              polaroidExpanded ? polaroidCollapse() : polaroidExpand();
            } else {
              polaroidExpanded ? polaroidCollapse() : polaroidExpand();
            }
          });

          let lastWidthP = window.innerWidth;
          window.addEventListener("resize", () => {
            const currentWidth = window.innerWidth;
            if (currentWidth === lastWidthP) return;
            lastWidthP = currentWidth;

            if (polaroidTl) polaroidTl.kill();
            polaroidExpanded = false;
            polaroidCard.classList.remove("expanded");
            setPolaroidBase();
            gsap.set(polaroidCard, {
              height: isMobile()
                ? window.innerWidth <= 480
                  ? "15rem"
                  : "18rem"
                : "25rem",
            });
          });
        }

        // --- 9. EXPERIENCES CAROUSEL - Infinito continuo ---
        const gallery = document.querySelector(".experiences-gallery");
        if (gallery) {
          const isMobile = () => window.innerWidth <= 768;

          let xPos = 0;
          let xVelocity = 0;
          let speed = 1;
          let isDragging = false;
          let dragStartX = 0;
          let dragStartY = 0;
          let dragStartPos = 0;
          let lastDragX = 0;
          let isPaused = false;
          let resumeTimeout = null;
          let rafId = null;
          let totalWidth = 0;
          let touchDirLocked = null;

          function getOriginalSlides() {
            return Array.from(
              gallery.querySelectorAll(
                ".polaroid-item:not(.carousel-clone), .center-text-item:not(.carousel-clone)",
              ),
            );
          }

          function setupInfinite() {
            if (!isMobile()) {
              cancelAnimationFrame(rafId);
              gsap.set(gallery, { x: 0 });
              gallery
                .querySelectorAll(".carousel-clone")
                .forEach((el) => el.remove());
              gallery.style.flexDirection = "";
              gallery.style.flexWrap = "";
              return;
            }

            gallery
              .querySelectorAll(".carousel-clone")
              .forEach((el) => el.remove());

            const slides = getOriginalSlides();

            [1, 2].forEach(() => {
              slides.forEach((slide) => {
                const clone = slide.cloneNode(true);
                clone.classList.add("carousel-clone");
                gallery.appendChild(clone);
              });
            });

            setTimeout(() => {
              const originals = getOriginalSlides();
              totalWidth = originals.reduce((acc, el) => {
                const style = window.getComputedStyle(el);
                const margin = parseFloat(style.marginRight) || 0;
                return acc + el.getBoundingClientRect().width + 16 + margin;
              }, 0);

              xPos = 0;
              xVelocity = 0;
              gsap.set(gallery, { x: 0 });
              startLoop();
            }, 150);
          }

          function startLoop() {
            cancelAnimationFrame(rafId);

            function tick() {
              if (!isDragging) {
                if (isPaused) {
                  xVelocity *= 0.88;
                  if (Math.abs(xVelocity) > 0.1) {
                    xPos += xVelocity;
                  } else {
                    xVelocity = 0;
                  }
                } else {
                  xVelocity *= 0.92;
                  xPos -= speed + Math.max(0, -xVelocity);
                }

                if (xPos < -totalWidth) xPos += totalWidth;
                if (xPos > 0) xPos -= totalWidth;

                gsap.set(gallery, { x: xPos });
              }

              rafId = requestAnimationFrame(tick);
            }

            rafId = requestAnimationFrame(tick);
          }

          function pauseCarousel() {
            isPaused = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
          }

          function resumeCarousel() {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
              isPaused = false;
              xVelocity = 0;
            }, 2000);
          }

          gallery.addEventListener(
            "touchstart",
            (e) => {
              if (!isMobile()) return;
              isDragging = false;
              touchDirLocked = null;
              dragStartX = e.touches[0].clientX;
              dragStartY = e.touches[0].clientY;
              lastDragX = dragStartX;
              dragStartPos = xPos;
              xVelocity = 0;
              pauseCarousel();
            },
            { passive: true },
          );

          gallery.addEventListener(
            "touchmove",
            (e) => {
              if (!isMobile()) return;

              const dx = e.touches[0].clientX - dragStartX;
              const dy = e.touches[0].clientY - dragStartY;

              if (!touchDirLocked) {
                if (Math.abs(dx) > Math.abs(dy) + 4)
                  touchDirLocked = "horizontal";
                else if (Math.abs(dy) > Math.abs(dx) + 4)
                  touchDirLocked = "vertical";
              }

              if (touchDirLocked === "vertical") return;

              if (touchDirLocked === "horizontal") {
                isDragging = true;
                xVelocity = (e.touches[0].clientX - lastDragX) * 0.6;
                lastDragX = e.touches[0].clientX;
                xPos = dragStartPos + dx;
                if (xPos < -totalWidth) xPos += totalWidth;
                if (xPos > 0) xPos -= totalWidth;
                gsap.set(gallery, { x: xPos });
              }
            },
            { passive: true },
          );

          gallery.addEventListener(
            "touchend",
            () => {
              if (!isMobile()) return;
              isDragging = false;
              touchDirLocked = null;
              resumeCarousel();
            },
            { passive: true },
          );

          gallery.addEventListener("mousedown", (e) => {
            if (!isMobile()) return;
            isDragging = true;
            dragStartX = e.clientX;
            lastDragX = e.clientX;
            dragStartPos = xPos;
            xVelocity = 0;
            pauseCarousel();
            gallery.style.cursor = "grabbing";
          });

          window.addEventListener("mousemove", (e) => {
            if (!isMobile() || !isDragging) return;
            const dx = e.clientX - dragStartX;
            xVelocity = (e.clientX - lastDragX) * 0.6;
            lastDragX = e.clientX;
            xPos = dragStartPos + dx;
            if (xPos < -totalWidth) xPos += totalWidth;
            if (xPos > 0) xPos -= totalWidth;
            gsap.set(gallery, { x: xPos });
          });

          window.addEventListener("mouseup", () => {
            if (!isMobile() || !isDragging) return;
            isDragging = false;
            gallery.style.cursor = "grab";
            resumeCarousel();
          });

          setupInfinite();

          let lastW = window.innerWidth;
          window.addEventListener("resize", () => {
            const cw = window.innerWidth;
            if (cw === lastW) return;
            lastW = cw;
            cancelAnimationFrame(rafId);
            setupInfinite();
          });
        }

        // --- 10. MOBILE MENU LOGIC ---
        const mobileToggle = document.getElementById("mobile-toggle");
        const closeMenu = document.getElementById("close-menu");
        const navOverlay = document.getElementById("nav-overlay");
        const mobileLinks = document.querySelectorAll(".nav-link-mobile");

        if (mobileToggle && navOverlay) {
          // Forzar estado inicial del overlay via GSAP
          gsap.set(navOverlay, {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            bottom: "-100%",
            visibility: "hidden",
            pointerEvents: "none",
          });

          gsap.set(".nav-link-mobile", { opacity: 0, y: 20 });

          const menuTL = gsap.timeline({ paused: true });

          const buildMenuTimeline = () => {
            menuTL.clear();
            gsap.set(".nav-link-mobile", { opacity: 0, y: 20 });
            menuTL
              .set(navOverlay, { visibility: "visible", pointerEvents: "auto" })
              .to(navOverlay, { bottom: 0, duration: 0.55, ease: "expo.inOut" })
              .to(".nav-link-mobile", {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "back.out(1.7)",
              });
          };

          buildMenuTimeline();

          window.addEventListener("resize", () => {
            if (!menuTL.isActive()) buildMenuTimeline();
          });

          const closeAll = () => {
            mobileToggle.setAttribute("aria-expanded", "false");
            mobileToggle.classList.remove("active");
            menuTL.reverse().then(() => {
              gsap.set(navOverlay, {
                visibility: "hidden",
                pointerEvents: "none",
              });
            });
            lenis.start();
          };

          // Abrir
          mobileToggle.addEventListener("click", () => {
            const isOpen = mobileToggle.classList.contains("active");
            if (isOpen) {
              closeAll();
            } else {
              mobileToggle.setAttribute("aria-expanded", "true");
              mobileToggle.classList.add("active");
              menuTL.play();
              lenis.stop();
            }
          });

          closeMenu.addEventListener("click", closeAll);

          // Cerrar con Escape
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menuTL.progress() > 0) closeAll();
          });

          // Links del overlay → scroll a sección
          mobileLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const targetId = link.getAttribute("href");
              closeAll();
              setTimeout(() => {
                lenis.scrollTo(targetId, { offset: -80, duration: 1.5 });
              }, 700);
            });
          });
        } // fin guarda mobileToggle
      }); // fin DOMContentLoaded