# react_next_js_nlw5

Exercício de estudo da Next Level Week 5 da Rocketseat, iniciado em junho de 2021. O projeto
continua incompleto: a página inicial é um placeholder e o player ainda não tem controles. Não
use este repositório como um produto de podcast pronto.

## Requisitos

- Node.js 20.19 ou superior para executar localmente;
- Docker para executar a imagem.

## Desenvolvimento local

```bash
npm ci
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Para conferir o build de produção:

```bash
npm run lint
npm run build
npm start
```

## Docker

```bash
docker build -t react-next-nlw5 .
docker run --rm --name react-next-nlw5 -p 3000:3000 react-next-nlw5
```

A imagem usa o build standalone do Next.js, executa como usuário sem privilégios e inclui um
healthcheck. Acesse [http://localhost:3000](http://localhost:3000).

## O que este exercício contém

- Next.js 16 com Pages Router, React 19 e TypeScript;
- cabeçalho com data atual em português usando `date-fns`;
- casca do player com estilos em Sass Modules;
- layout global, documento customizado e assets SVG de controles.

## Estrutura

```text
public/                  SVGs e ícones
src/
├── Header/              cabeçalho com data em pt-BR
├── Player/              casca do player
├── pages/               páginas do Pages Router
└── styles/              Sass global e módulos
aula.md                  anotações da aula original
```

## Licença

MIT — veja [LICENSE](LICENSE).
