(function () {
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Links de WhatsApp: todos usam a config do tracking.js e disparam whatsapp_click */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var tipo = a.getAttribute("data-wa-msg");
    var msg = tipo === "arquiteto" ? QH4.mensagemArquiteto : QH4.mensagemBotao;
    a.href = qh4WaLink(msg);
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () {
      qh4Track("whatsapp_click", { wa_local: a.getAttribute("data-wa") });
    });
  });

  /* Header com sombra ao rolar */
  var topo = document.querySelector(".topo");
  var onScroll = function () { if (topo) topo.classList.toggle("rolou", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Linhas da logo desenhando no hero */
  document.querySelectorAll(".hero-linhas .ln").forEach(function (l) {
    try { l.style.setProperty("--len", Math.ceil(l.getTotalLength())); } catch (e) {}
  });

  /* Parallax leve na foto do hero */
  var heroImg = document.querySelector(".hero-foto img");
  if (heroImg && !reduz) {
    var tick = false;
    window.addEventListener("scroll", function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        heroImg.style.transform = "translateY(" + (y * -0.06) + "px)";
        tick = false;
      });
    }, { passive: true });
  }

  /* Scroll reveal (progressivo, com segurança se o observer falhar) */
  var alvos = document.querySelectorAll(".rv, .proc");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    alvos.forEach(function (el) { io.observe(el); });
    setTimeout(function () { alvos.forEach(function (el) { el.classList.add("visivel"); }); }, 6000);
  } else {
    alvos.forEach(function (el) { el.classList.add("visivel"); });
  }

  /* FAQ: um aberto por vez */
  var itens = document.querySelectorAll(".faq details");
  itens.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) itens.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Formulário */
  var form = document.getElementById("form-orcamento");
  if (!form) return;
  var botao = form.querySelector("button[type=submit]");
  var tel = form.querySelector("#f-whatsapp");
  var iniciou = false;

  tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").slice(0, 11);
    var f = d;
    if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) f = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    tel.value = f;
  });

  var checar = function () {
    botao.disabled = !form.checkValidity();
  };
  form.addEventListener("input", checar);
  form.addEventListener("change", checar);
  form.addEventListener("focusin", function () {
    if (!iniciou) { iniciou = true; qh4Track("form_start", { form_id: "orcamento" }); }
  });
  form.querySelectorAll("input,select").forEach(function (c) {
    c.addEventListener("blur", function () { c.classList.toggle("erro", c.value !== "" && !c.checkValidity()); });
  });
  checar();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var v = function (id) { var el = form.querySelector(id); return el ? el.value.trim() : ""; };
    var dados = {
      nome: v("#f-nome"),
      whatsapp: v("#f-whatsapp"),
      local: v("#f-local"),
      perfil: v("#f-perfil"),
      ambiente: v("#f-ambiente"),
      momento: v("#f-momento"),
      material: v("#f-material"),
      detalhes: v("#f-detalhes"),
      origem: location.href
    };
    var msg = "Olá! Acabei de pedir um orçamento pelo site da Pedras Garcia.\n\n" +
      "*Nome:* " + dados.nome + "\n" +
      "*WhatsApp:* " + dados.whatsapp + "\n" +
      "*Bairro/cidade da obra:* " + dados.local + "\n" +
      "*Sou:* " + dados.perfil + "\n" +
      "*Ambiente:* " + dados.ambiente + "\n" +
      "*Momento da obra:* " + dados.momento + "\n" +
      "*Material:* " + dados.material +
      (dados.detalhes ? "\n*Detalhes:* " + dados.detalhes : "");

    botao.disabled = true;
    botao.textContent = "Enviando...";
    qh4Track("generate_lead", { form_id: "orcamento", lead_perfil: dados.perfil, lead_momento: dados.momento });

    var seguir = function (mensagemWa) {
      try { sessionStorage.setItem("pg_wa_msg", mensagemWa); } catch (er) {}
      window.location.href = "obrigado.html";
    };

    if (QH4.webhook) {
      var fd = new FormData();
      Object.keys(dados).forEach(function (k) { fd.append(k, dados[k]); });
      fetch(QH4.webhook, { method: "POST", mode: "no-cors", body: fd })
        .catch(function () {})
        .then(function () { seguir(QH4.mensagemPadrao); });
      setTimeout(function () { seguir(QH4.mensagemPadrao); }, 3500);
    } else {
      seguir(msg);
    }
  });
})();

/* Galeria em tela cheia: clique em qualquer foto */
(function () {
  var lb = document.getElementById("lb");
  if (!lb) return;
  var itens = Array.prototype.slice.call(document.querySelectorAll("[data-zoom]"));
  var img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
  var atual = 0, ultimoFoco = null, toqueX = null;

  function legenda(el) {
    var f = el.querySelector("figcaption");
    var i = el.querySelector("img");
    return f ? f.textContent : (i ? i.alt : "");
  }
  function mostrar(n) {
    atual = (n + itens.length) % itens.length;
    var el = itens[atual], src = el.querySelector("img");
    img.classList.remove("ok");
    var novo = new Image();
    novo.onload = function () { img.src = novo.src; img.alt = src.alt; requestAnimationFrame(function () { img.classList.add("ok"); }); };
    novo.src = src.currentSrc || src.src;
    cap.innerHTML = "";
    cap.appendChild(document.createTextNode(legenda(el)));
    var sm = document.createElement("small");
    sm.textContent = (atual + 1) + " de " + itens.length;
    cap.appendChild(sm);
  }
  function abrir(n) {
    ultimoFoco = document.activeElement;
    mostrar(n);
    lb.classList.add("aberto");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-ativo");
    try { if (lb.requestFullscreen && window.innerWidth > 560) lb.requestFullscreen().catch(function () {}); } catch (e) {}
    setTimeout(function () { lb.querySelector(".lb-fechar").focus(); }, 60);
    if (window.qh4Track) qh4Track("gallery_open", { foto: legenda(itens[atual]) });
  }
  function fechar() {
    lb.classList.remove("aberto");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-ativo");
    try { if (document.fullscreenElement) document.exitFullscreen().catch(function () {}); } catch (e) {}
    if (ultimoFoco) ultimoFoco.focus();
  }
  itens.forEach(function (el, i) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Ver em tela cheia: " + legenda(el));
    el.addEventListener("click", function () { abrir(i); });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(i); } });
  });
  lb.querySelector(".lb-fechar").addEventListener("click", fechar);
  lb.querySelector(".lb-ant").addEventListener("click", function () { mostrar(atual - 1); });
  lb.querySelector(".lb-prox").addEventListener("click", function () { mostrar(atual + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.tagName === "FIGURE") fechar(); });
  document.addEventListener("fullscreenchange", function () { if (!document.fullscreenElement && lb.classList.contains("aberto") && window.innerWidth > 560) fechar(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
  lb.addEventListener("touchstart", function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });
})();
