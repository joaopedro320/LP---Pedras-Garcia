/* ==========================================================================
   [QH4 SLOT 7] CONFIGURAÇÃO CENTRAL DE TRACKING . LP Pedras Garcia
   ==========================================================================
   Tudo que muda por cliente fica aqui: WhatsApp, webhook e rótulos de conversão.
   Os eventos de dataLayer são sempre os mesmos em toda LP da QH4:
   whatsapp_click (com wa_local), form_start, generate_lead, thank_you_view */
window.QH4 = {
  cliente: "Pedras Garcia",
  whatsapp: "5511998252857",          // principal (briefing). Secundário: 5511968530985
  mensagemPadrao: "Olá, acabei de preencher o formulário no site. Aguardo mais informações.",
  mensagemBotao: "Olá! Vim pelo site da Pedras Garcia e gostaria de um orçamento.",
  mensagemArquiteto: "Olá! Sou arquiteto(a) / designer e gostaria de enviar um projeto para orçamento.",
  // Google Apps Script: cole a URL /exec aqui. Vazio = formulário monta a mensagem completa e manda pro WhatsApp.
  webhook: "",
  // Conversões diretas (sem GTM). Deixe vazio se a conversão for configurada no GTM.
  googleAdsConversao: "",            // ex.: "AW-XXXXXXXXX/abcDEFghiJKL"
  metaPixelEvento: "Lead"
};

window.dataLayer = window.dataLayer || [];
window.qh4Track = function (evento, dados) {
  var payload = Object.assign({ event: evento }, dados || {});
  window.dataLayer.push(payload);
  if (evento === "generate_lead" || evento === "thank_you_view") {
    if (typeof window.fbq === "function" && evento === "thank_you_view") window.fbq("track", window.QH4.metaPixelEvento);
    if (typeof window.gtag === "function" && window.QH4.googleAdsConversao && evento === "thank_you_view") {
      window.gtag("event", "conversion", { send_to: window.QH4.googleAdsConversao });
    }
  }
};

window.qh4WaLink = function (mensagem) {
  return "https://wa.me/" + window.QH4.whatsapp + "?text=" + encodeURIComponent(mensagem || window.QH4.mensagemBotao);
};
