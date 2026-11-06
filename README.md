# LP Pedras Garcia | Rafa Mármores

Landing page da Pedras Garcia (marmoraria em São Paulo/SP desde 1972), cliente QH4 Growth.
Produto: Método Stones High Ticket + Social Media Orbia 1. Contrato de 23/10/2026 a 23/04/2027.

## Estrutura

```
pedras-garcia-lp/
├── index.html            LP principal
├── obrigado.html         página de obrigado (dispara thank_you_view e abre o WhatsApp)
├── 404.html              página de erro personalizada
├── assets/
│   ├── css/style.css
│   ├── js/tracking.js    [QH4 SLOT 7] config: WhatsApp, webhook, conversões
│   ├── js/main.js        interações, reveal, parallax, formulário
│   └── img/              fotos reais do Instagram do cliente + logo, favicon, OG
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── vercel.json
├── apps-script.gs        opcional, para salvar leads numa planilha
├── README.md
└── TRACKING-QH4.md       onde colar GTM, Pixel e conversões
```

## Como publicar na Vercel

1. Descompacte o zip.
2. Na Vercel: Add New > Project > arraste a pasta `pedras-garcia-lp` (ou suba num repositório e importe).
3. Framework Preset: **Other**. Sem build command, output directory na raiz.
4. Deploy. A 404 personalizada é servida automaticamente pela Vercel.
5. Domínio: Settings > Domains > adicionar o domínio e apontar o DNS (o domínio do cliente está na **Locaweb**).

## Pendências antes de publicar

- [ ] **GTM**: colar o container nos slots 1 e 5 das três páginas (index, obrigado, 404). Pixel e gtag diretos só se não usar GTM (slots 3 e 4). Mapa completo dos slots no `TRACKING-QH4.md`.
- [x] **Script do IVO (Funil)**: já instalado no slot 9 da index e da obrigado com `data-lp="lp-pedras-garcia"`. Depois de publicar, testar numa aba anônima e conferir no Funil.
- [ ] **Domínio / canonical**: o briefing diz `www.pedrasgarcia.com.br` e a mensagem do contrato diz `pedrasgarcia.com`. Usei `https://www.pedrasgarcia.com.br/` no canonical, OG, JSON-LD, robots e sitemap. Se for outro, trocar em `index.html`, `robots.txt` e `sitemap.xml`.
- [ ] **Hospedagem**: cliente informou que já tem hospedagem e domínio na Locaweb. Decidir se a LP fica na Vercel (apontando DNS) ou sobe na Locaweb (é só HTML estático, funciona igual).
- [ ] **WhatsApp**: principal `(11) 99825-2857` em `assets/js/tracking.js`. O segundo número `(11) 96853-0985` aparece só no rodapé. Confirmar com a Marina qual recebe os leads de anúncio.
- [ ] **Webhook**: sem Apps Script, o formulário monta a mensagem completa com todos os campos e manda pro WhatsApp. Se for usar planilha/CRM, publicar o `apps-script.gs` e colar a URL em `tracking.js > webhook`; aí o WhatsApp abre com a mensagem padrão.
- [ ] **Nome da marca**: o briefing inteiro fala em "Rafa Mármores", mas o cliente e a logo são "Pedras Garcia" com "Rafa Mármores" embaixo. A LP usa Pedras Garcia como marca principal e Rafa Mármores como assinatura (rodapé e `alternateName` no JSON-LD). Confirmar com a Marina.
- [ ] **Endereço**: não veio no briefing, então não entrou na página nem no JSON-LD (só São Paulo/SP). Quando confirmar, adicionar `streetAddress` e `postalCode` no JSON-LD e um bloco de mapa se fizer sentido.
- [ ] **Depoimentos**: o link de avaliações do briefing é um link da App Store, não do Google Meu Negócio. Por isso não tem seção de depoimentos. Quando o GMN for atualizado (está na entrega prata), dá pra incluir avaliações reais.

## Fonte do conteúdo

Tudo veio do briefing (Google Forms) e da mensagem de contrato: história desde 1972, empresa familiar, serviços, destaques, 10 perguntas e respostas do FAQ (texto do próprio cliente), diferenciais, horário, CNPJ, Instagram, paleta azul, fundo mesclado e personalidade tradicional. Nada inventado: sem números de obras, sem anos de garantia, sem depoimentos, sem endereço.

Fotos: 15 imagens do Instagram @pedrasgarcia (pasta `02. Imagens`), recortadas e comprimidas. Os créditos de repost que apareciam na parte de baixo de duas fotos foram cortados.

Tipografia: Poppins (títulos) + Inter (corpo), padrão QH4, já que o cliente não pediu fonte.
Cores: azul da logo `#2378B4`, azul grafite `#18344B` nas seções escuras, branco mármore `#EEF2F4`.
Assinatura visual: a "régua" acima dos títulos vem da barra horizontal da logo e reforça o "sob medida"; as linhas do telhado da logo se desenham sobre a foto do hero.

## Eventos de rastreamento (dataLayer)

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | clique em qualquer link de WhatsApp | `wa_local`: hero, arquitetos, orcamento-info, faq, rodape, flutuante, obrigado, 404 |
| `form_start` | primeiro foco no formulário | `form_id` |
| `generate_lead` | envio válido do formulário | `form_id`, `lead_perfil`, `lead_momento` |
| `thank_you_view` | carregamento da página de obrigado | `form_id` |
| `gallery_open` | abertura de foto em tela cheia | `foto` (legenda) |

Além do dataLayer, o script do IVO registra visitas, rolagem, CTAs, WhatsApp, formulário e obrigado direto no Funil (ivo.maltabusiness.com.br).

Detalhes de configuração no `TRACKING-QH4.md`.

## Animações e galeria

- Entrada do hero em sequência (texto sobe, foto abre em cortina com zoom, linhas da logo se desenham) e header desce ao carregar.
- Réguas dos títulos se desenham ao entrar na tela; fotos dos ambientes abrem em cortina com legenda subindo; chapas de pedra entram em leque; marcadores do processo e losangos dos diferenciais aparecem em sequência; brilho passando nos botões principais.
- Clique (ou Enter) em qualquer foto abre a galeria em tela cheia com 13 imagens: setas, teclado (← → Esc), swipe no celular e Fullscreen API no desktop.
- Tudo respeita `prefers-reduced-motion`.

## Formulário (pré-qualificação)

Campos obrigatórios: nome, WhatsApp (com máscara), bairro/cidade da obra, perfil (proprietário, arquiteto, engenheiro/construtora, reformas), ambiente principal, momento da obra e material. Detalhes é opcional. O botão nasce desabilitado e só libera quando tudo está válido. Os campos de momento da obra e perfil ajudam a IA de pré-qualificação e o comercial a separar quem tem obra em andamento de quem só está pesquisando preço.

## Checklist de SEO

- [x] Title e meta description com nicho + cidade
- [x] H1 com "Marmoraria" e "perto de você"
- [x] JSON-LD `HomeAndConstructionBusiness` + `FAQPage`
- [x] Open Graph completo + Twitter Card (imagem 1200x630)
- [x] Canonical
- [x] robots.txt, sitemap.xml, site.webmanifest
- [x] Favicon, apple-touch-icon, ícones 192/512
- [x] width/height em todas as imagens, lazy loading abaixo da dobra, preload da imagem do hero
- [x] Página de obrigado com noindex
- [x] 404 personalizada
- [x] vercel.json com cache de assets e headers de segurança
- [x] Testado no Chromium (desktop 1440 e mobile 390), sem erros de console, fluxo do formulário validado até o link de WhatsApp
