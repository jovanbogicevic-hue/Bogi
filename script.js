/* ============================================================
   NovaCare test page — script.js
   Loaded from GitHub. If buttons/counters work, JS is running.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- tiny helper ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    setupTheme();
    setupHeroButtons();
    renderCards();
    setupCounters();
    renderPricing();
    setupForm();
    console.log("%c NovaCare test page loaded ✔", "color:#35e0c4;font-weight:bold");
  }

  /* ---------- footer year ---------- */
  function setYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- theme toggle ---------- */
  function setupTheme() {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const light = document.body.classList.toggle("light");
      btn.textContent = light ? "☀️ Light" : "🌙 Dark";
    });
  }

  /* ---------- hero buttons ---------- */
  function setupHeroButtons() {
    const status = $("#statusLine");
    let clicks = 0;

    const cta = $("#ctaBtn");
    if (cta) cta.addEventListener("click", () => {
      clicks++;
      status.textContent = `Status: CTA clicked ${clicks} time${clicks > 1 ? "s" : ""} — JS is alive.`;
    });

    const ping = $("#pingBtn");
    if (ping) ping.addEventListener("click", () => {
      status.textContent = "Status: running test…";
      ping.disabled = true;
      let dots = 0;
      const t = setInterval(() => {
        dots = (dots + 1) % 4;
        status.textContent = "Status: running test" + ".".repeat(dots);
      }, 250);
      setTimeout(() => {
        clearInterval(t);
        ping.disabled = false;
        const ms = Math.floor(Math.random() * 80) + 20;
        status.textContent = `Status: ✅ all systems go (simulated ${ms}ms).`;
      }, 1400);
    });
  }

  /* ---------- feature cards (injected) ---------- */
  function renderCards() {
    const grid = $("#cardGrid");
    if (!grid) return;
    const data = [
      { icon: "📡", title: "Passive sensing", text: "Wearables track daily patterns without lifting a finger." },
      { icon: "🧠", title: "Predictive alerts", text: "Anomaly detection flags risks before they become events." },
      { icon: "📊", title: "Care dashboards", text: "Every caregiver sees the same clear picture, in real time." },
    ];
    data.forEach((d, i) => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <div class="card__icon">${d.icon}</div>
        <h3 class="card__title">${d.title}</h3>
        <p class="card__text">${d.text}</p>`;
      grid.appendChild(el);
      // stagger the entrance
      setTimeout(() => el.classList.add("in"), 120 * i + 100);
    });
  }

  /* ---------- animated counters ---------- */
  function setupCounters() {
    const nums = $$(".stat__num");
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const dur = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      nums.forEach((n) => io.observe(n));
    } else {
      nums.forEach(animate);
    }
  }

  /* ---------- pricing (with billing toggle) ---------- */
  const PLANS = [
    { name: "Starter", monthly: 0, features: ["1 facility", "Up to 25 residents", "Email support"] },
    { name: "Pro", monthly: 49, features: ["10 facilities", "Unlimited residents", "Predictive alerts", "Priority support"], featured: true },
    { name: "Enterprise", monthly: 149, features: ["Unlimited facilities", "Custom integrations", "Dedicated manager", "SLA"] },
  ];

  function renderPricing() {
    const grid = $("#pricingGrid");
    const sw = $("#billingSwitch");
    if (!grid || !sw) return;

    const draw = (yearly) => {
      grid.innerHTML = "";
      PLANS.forEach((p) => {
        const price = yearly ? Math.round(p.monthly * 12 * 0.8) : p.monthly;
        const unit = yearly ? "/yr" : "/mo";
        const priceLabel = p.monthly === 0 ? "Free" : `$${price}<span>${unit}</span>`;
        const el = document.createElement("div");
        el.className = "plan" + (p.featured ? " plan--featured" : "");
        el.innerHTML = `
          ${p.featured ? '<div class="plan__tag">Most popular</div>' : ""}
          <div class="plan__name">${p.name}</div>
          <div class="plan__price">${priceLabel}</div>
          <ul class="plan__list">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          <button class="btn btn--primary" style="width:100%">Choose ${p.name}</button>`;
        grid.appendChild(el);
      });
    };

    const monthlyLabel = $("#monthlyLabel");
    const yearlyLabel = $("#yearlyLabel");
    sw.addEventListener("change", () => {
      draw(sw.checked);
      monthlyLabel.classList.toggle("active", !sw.checked);
      yearlyLabel.classList.toggle("active", sw.checked);
    });
    draw(false);
  }

  /* ---------- contact form validation ---------- */
  function setupForm() {
    const form = $("#demoForm");
    if (!form) return;
    const name = $("#name"), email = $("#email"), msg = $("#message");
    const fb = $("#formFeedback");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      [name, email, msg].forEach((f) => f.classList.remove("invalid"));

      if (name.value.trim().length < 2) { name.classList.add("invalid"); ok = false; }
      if (!emailRe.test(email.value.trim())) { email.classList.add("invalid"); ok = false; }
      if (msg.value.trim().length < 5) { msg.classList.add("invalid"); ok = false; }

      if (!ok) {
        fb.textContent = "Please fix the highlighted fields.";
        fb.className = "form__feedback err";
        return;
      }
      fb.textContent = `Thanks, ${name.value.trim()}! Message received (this is a front-end test).`;
      fb.className = "form__feedback ok";
      form.reset();
    });
  }
})();
