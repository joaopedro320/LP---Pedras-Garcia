# Tracking QH4 | Pedras Garcia

Os mesmos slots aparecem em `index.html`, `obrigado.html` e `404.html`. Procure por `[QH4 SLOT n]`: cada um é um bloco comentado com o título em maiúsculas, o que colar e um exemplo do código.

| Slot | Onde | O que colar |
|---|---|---|
| 1 | `<head>`, logo no topo | Script do Google Tag Manager |
| 2 | `<head>` | Verificações de domínio (Search Console, Meta Business) |
| 3 | `<head>` | Meta Pixel direto, só se NÃO estiver no GTM |
| 4 | `<head>` | gtag do Google Ads / GA4 direto, só se NÃO estiver no GTM |
| 5 | logo após abrir o `<body>` | `<noscript>` do GTM |
| 6 | antes de fechar o `<body>` | Scripts de terceiros (chat, heatmap etc.) |
| 7 | `assets/js/tracking.js` | WhatsApp, webhook do Apps Script, rótulo de conversão do Google Ads |
| 8 | `obrigado.html`, no script | Conversão da página de obrigado se não usar GTM |
| 9 | antes do `</body>` de `index.html` e `obrigado.html` | **Script do IVO (Funil QH4), já instalado** com `data-lp="lp-pedras-garcia"`. Não vai na 404 |

## Com GTM (recomendado)

1. Cole o container nos slots 1 e 5 das três páginas.
2. Crie acionadores de **Evento personalizado** para: `whatsapp_click`, `form_start`, `generate_lead`, `thank_you_view`.
3. Conversão principal de lead: `thank_you_view` (Google Ads + Meta `Lead`).
4. Conversão secundária: `whatsapp_click` (use a variável de camada de dados `wa_local` para separar a origem do clique).

## Sem GTM

1. Cole o Pixel no slot 3 e o gtag no slot 4.
2. Em `tracking.js`, preencha `googleAdsConversao` com `AW-XXXXXXXXX/rotulo`.
3. O `tracking.js` já dispara `fbq('track','Lead')` e a conversão do Google Ads quando a página de obrigado carrega.

## Fluxo do formulário

- `webhook` vazio: o formulário monta a mensagem com todos os campos, vai para `obrigado.html` e abre o WhatsApp com essa mensagem completa.
- `webhook` preenchido: envia os dados para o Apps Script, vai para `obrigado.html` e abre o WhatsApp com "Olá, acabei de preencher o formulário no site. Aguardo mais informações."

## Script do IVO (Funil QH4)

```html
<script src="https://app-validacao-lp-sapp-validacao-lp.vercel.app/api/t" data-lp="lp-pedras-garcia" defer></script>
```

- Já está no SLOT 9 da index e da obrigado. Mede visitas, rolagem, cliques em CTA e WhatsApp, formulário (começou, enviou, campo em que desistiu) e a página de obrigado, sem GA4 e sem cookie.
- Os números aparecem em ivo.maltabusiness.com.br > Funil, na LP `lp-pedras-garcia`.
- Não trocar o endereço do script: o domínio antigo é o coletor oficial e continua recebendo os dados.
- Para testar depois de publicar: abrir a LP numa aba anônima, rolar a página e clicar no WhatsApp. No Funil, clicar em Atualizar: a bolinha fica verde.
- Se um dia a LP for para WordPress: Elementor > Código personalizado no fim do body e, no plugin de cache, colocar `api/t` nas exclusões do "Atrasar JavaScript".
