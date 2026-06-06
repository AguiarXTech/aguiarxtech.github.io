# AguiarXTech — Site institucional 🚀

Site de página única (one-page) da **AguiarXTech**, com tema espacial: céu
estrelado animado e cometas em Canvas, glassmorphism, glow e animações de
entrada ao rolar a página. Feito em **HTML + CSS + JavaScript puro** (sem
frameworks), pronto para o **GitHub Pages**.

🔗 **No ar em:** https://aguiarxtech.github.io

---

## 📁 Estrutura de arquivos

```
aguiarxtech.github.io/
├── index.html      → conteúdo e seções do site
├── styles.css      → todo o visual (tema espacial, cores, responsivo)
├── script.js       → céu estrelado + cometas (Canvas), animações, menu
├── favicon.svg     → ícone do site (águia tech)
├── .nojekyll        → evita que o GitHub Pages processe os arquivos com Jekyll
├── README.md
└── assets/
    ├── logo-aguiarxtech.png    → logo principal (a águia)
    ├── logo-xtaskplan.png      → logo do projeto XTaskPlan
    └── logo-enternofuturo.png  → logo do projeto Enter no Futuro
```

---

## 🚀 Como publicar no GitHub Pages

O repositório **precisa** se chamar exatamente `aguiarxtech.github.io`
(usuário/organização `AguiarXTech`). Assim o site fica numa URL limpa, sem
subpasta.

1. Crie o repositório no GitHub com o nome **`aguiarxtech.github.io`** (público).
2. Na pasta deste projeto, envie os arquivos para a branch `main`:

   ```bash
   git init
   git add .
   git commit -m "Site AguiarXTech"
   git branch -M main
   git remote add origin https://github.com/AguiarXTech/aguiarxtech.github.io.git
   git push -u origin main
   ```

3. No GitHub: **Settings → Pages → Build and deployment → Source: _Deploy from a
   branch_**, escolha a branch **`main`** e a pasta **`/ (root)`** e salve.
4. Aguarde 1–2 minutos. O site estará em **https://aguiarxtech.github.io**.

> Para testar localmente, basta abrir o `index.html` no navegador (clique duplo).

---

## ✏️ Como editar

### Trocar textos
Abra o **`index.html`**. Cada seção está comentada (Hero, Sobre, Projetos,
Serviços, Contato, Rodapé). Edite o texto entre as tags normalmente.

### Trocar cores
Abra o **`styles.css`** e edite as variáveis no topo, dentro de `:root`:

```css
:root {
  --bg-deep: #050814;   /* fundo escuro */
  --bg-soft: #0a0f24;   /* fundo um pouco mais claro */
  --cyan:    #22d3ee;   /* acento ciano */
  --blue:    #3b82f6;   /* acento azul */
  --text:    #e8eefc;   /* cor do texto */
}
```

Mudar essas variáveis altera o site inteiro (botões, brilhos, cometas seguem o
ciano/azul definidos).

### Trocar logos
Substitua os arquivos dentro de **`assets/`** mantendo os mesmos nomes
(`logo-aguiarxtech.png`, `logo-xtaskplan.png`, `logo-enternofuturo.png`).
Use **PNG com fundo transparente** para melhor resultado.

### Adicionar/trocar a foto de apresentação
Coloque sua foto em **`assets/foto-perfil.jpg`** (de preferência **quadrada**,
ex.: 600×600px). Enquanto o arquivo não existir, aparece um ícone reservado no
lugar. O nome, cargo e texto ficam na seção `#fundador` do `index.html`.

### Ajustar o WhatsApp
No `index.html`, procure por `wa.me/0000000000` e troque pelo seu número no
formato internacional, ex.: `wa.me/5599999999999`.

### Intensidade da animação de fundo
No **`script.js`**:
- **Densidade de estrelas:** função `createStars()`, ajuste o divisor em
  `Math.floor(area / 4500)` (número maior = menos estrelas).
- **Frequência dos cometas:** função `loop()`, em
  `Math.random() * 6000 + 3000` (valores em milissegundos).

> ♿ O site respeita `prefers-reduced-motion`: usuários que pedem menos
> movimento veem o céu estrelado **estático**, sem cometas nem animações.

---

© AguiarXTech — Enter no Futuro 🚀
