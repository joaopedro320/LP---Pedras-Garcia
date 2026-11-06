/**
 * Google Apps Script (opcional) para salvar os leads da LP Pedras Garcia numa planilha.
 * 1. Crie uma planilha, vá em Extensões > Apps Script e cole este código.
 * 2. Implantar > Nova implantação > App da Web: executar como "Eu", acesso "Qualquer pessoa".
 * 3. Copie a URL /exec e cole em assets/js/tracking.js no campo webhook.
 */
function doPost(e) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var p = e.parameter;
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Data", "Nome", "WhatsApp", "Bairro/cidade", "Perfil", "Ambiente", "Momento da obra", "Material", "Detalhes", "Origem"]);
  }
  sh.appendRow([new Date(), p.nome, p.whatsapp, p.local, p.perfil, p.ambiente, p.momento, p.material, p.detalhes, p.origem]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
