# react_next_js_nlw5

## 🐳 Instalação e Execução (Docker) — recomendado

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

### Rodar com Docker
```bash
docker compose up --build
```


### Sem Docker (local)
```bash
npm install
npm start
```


**Projeto de estudo** — primeiros passos com Next.js + TypeScript e Sass, praticados como continuação dos aprendizados da Next Level Week 5 da Rocketseat, em junho de 2021.

![TypeScript](https://img.shields.io/badge/TypeScript-4-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-11-black?style=flat&logo=next.js)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Status](https://img.shields.io/badge/status-projeto%20de%20estudo-blue)

## Sobre

Exercício de estruturação de um app Next.js (Pages Router) no formato de um player de podcast: layout global com cabeçalho e player, CSS Modules com Sass e formatação de data em português. O projeto está **incompleto** — é um recorte de estudo com a casca do player e a página inicial ainda em `"Index"`.

## Funcionalidades

Comprovadas pelo código:

- Cabeçalho com logo, texto fixo e data atual formatada em pt-BR via `date-fns` (`src/Header/index.tsx`);
- Layout global que envolve as páginas e mantém o player fixo (`src/pages/_app.tsx`);
- Componente `Player` com estilos em SCSS Modules (casca, sem controles implementados) (`src/Player/index.tsx`);
- Documento customizado do Next (`src/pages/_document.tsx`) e estilos globais em Sass.
- Assets SVG de controles de mídia em `public/` (play, pause, shuffle, repeat, etc.).

## Stack

- **Next.js 11** (Pages Router, `next dev`/`next build`/`next start`/`next lint`)
- **React 17** + **TypeScript 4**
- **Sass** (`sass`) com CSS Modules
- **date-fns** com locale `pt-BR`
- **ESLint** (`eslint-config-next`)

## Como rodar

```bash
yarn install
yarn dev
```

Abre em `http://localhost:3000`. Outros scripts:

```bash
yarn build   # build de produção
yarn start   # serve o build
yarn lint    # next lint
```

## Estrutura do projeto

```
.
├── public/                  # SVGs de controle e ícones
├── src/
│   ├── Header/              # cabeçalho com data em pt-BR
│   ├── Player/              # casca do player + styles.module.scss
│   ├── pages/
│   │   ├── _app.tsx         # layout global
│   │   ├── _document.tsx
│   │   └── index.tsx        # página inicial (placeholder)
│   └── styles/              # global.scss e wrapper
├── aula.md                  # anotações de aula
└── package.json
```

## Observações

- `aula.md` registra os comandos usados na aula (create-next-app, TypeScript, Sass, date-fns).
- O arquivo `server json.txt` aparece como deletado no working tree antes deste trabalho — a alteração não foi feita por este README e não foi revertida.

## Licença

MIT — veja [LICENSE](LICENSE).
