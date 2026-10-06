# MELHORIAS — react_next_js_nlw5

> **Gerado por análise de código em 2026-10-05** · Stack: Next.js 11 + React 17 (NLW5) · Branch: `main`

## 0. Como usar este documento

- Cada item tem 6 campos fixos: **Arquivo:**, **Evidência:**, **Impacto:**, **Mudança:**, **Aceite:**, **Verificação:** (bloco `bash`).
- **Evidência** é sempre um fato lido/executado no repositório (caminho + linha ou comando). Nenhum arquivo:linha foi inventado; nenhum CVE foi citado sem conferência.
- Prioridades: `[P0]` crítico · `[P1]` alto · `[P2]` médio · `[P3]` baixo.
- Execute na ordem da §8 (waves); cada item pode ser validado isoladamente pelo bloco **Verificação:**.
- Este é um projeto de estudo (NLW5 / Rocketseat) — a decisão de manter vs. arquivar está na §9.

## 1. Diagnóstico executivo

**O que está bem (verificado):**

- `next.config.js` (3 linhas) usa `reactStrictMode: true` — modo estrito ativo por padrão.
- ESLint configurado: `.eslintrc` estende `["next", "next/core-web-vitals"]` + script `lint` = `next lint` (`package.json` linha 9).
- TypeScript no projeto (`tsconfig.json`, `src/pages/*.tsx`); páginas são `.tsx`.
- Dockerfile multi-stage presente (13 linhas) com `.dockerignore` (inclui `.env`, `node_modules`, `.git`).
- Lockfile `yarn.lock` presente (lockfile v1, 3197 linhas) — dependências versionadas.
- README documenta stack, estrutura de pastas, licença MIT e avisa que o projeto é um estudo incompleto (linha 30).
- Assets íntegros: `public/logo.svg` (usado por `src/Header/index.tsx` linha 10) e todos os SVGs do player existem em `public/`.
- Working tree limpo (`git status --porcelain` vazio) na branch `main`.

**O que está quebrado (verificado):**

- `next` preso em `11.0.0` (`package.json` linha 13) — versão EOL, sem patches de segurança; `npm audit` **não roda** no repo (falhou com `ENOLOCK`: só existe `yarn.lock`, e `yarn` não está instalado no ambiente).
- `README.md` manda rodar `docker compose up --build` (linha 10), mas **não existe** `docker-compose.yml`/`compose.yaml` nem `.yml` algum na raiz — comando inexecutável.
- `README.md` seção "Sem Docker" manda `npm install` + `npm start` sem `npm run build` — `next start` falha sem `.next`; além disso não há `package-lock.json` para o npm seguir.
- Dockerfile linha 4: `RUN npm ci 2>/dev/null || npm install --legacy-peer-deps` — sem `package-lock.json`, o `npm ci` falha sempre e o build cai no fallback silencioso (não reprodutível).
- Zero arquivos de teste (`find` por `*.test.*`/`*.spec.*` vazio) e nenhum script `test` em `package.json`.
- Sem `.github/` — nenhum CI; lint/build só rodam se alguém lembrar.
- `src/pages/index.tsx` linha 1 importa `Header` e nunca usa (página é só `<h1>Index</h1>`).
- README mistura gerenciadores (npm nas linhas 14–18, yarn nas linhas 50–63) e cita `server json.txt` (linha 85), arquivo inexistente.

## 2. Tabela de prioridades

| Prioridade | Item | Título | Esforço |
| --- | --- | --- | --- |
| [P1] | SEC-01 | Next 11.0.0 EOL + auditoria de dependências impossível (ENOLOCK) | Alto (upgrade — ver IMP-01) |
| [P1] | DEVOPS-01 | Dockerfile: `npm ci` sempre falha; fallback `npm install --legacy-peer-deps` não reprodutível | Baixo |
| [P2] | SEC-02 | `.dockerignore` cobre `.env` mas não `.env.local`/`.env.production` com `COPY . .` | Baixo |
| [P2] | BUG-01 | README manda `docker compose up --build` mas não há compose file | Baixo |
| [P2] | BUG-02 | README manda `npm start` sem `npm run build` (e sem lockfile npm) | Baixo |
| [P2] | TEST-01 | Nenhum teste e nenhum script `test` | Médio |
| [P2] | DEVOPS-02 | Sem CI (`.github/` ausente) | Baixo |
| [P2] | DEVOPS-03 | Build em `node:16-alpine` (EOL) vs runtime `node:20-alpine`; imagem final com devDeps e fonte | Médio |
| [P2] | DOC-01 | README: mistura yarn/npm, nota órfã e ausência de aviso EOL | Baixo |
| [P3] | BUG-03 | `src/pages/index.tsx` import não usado (`Header`) | Baixo |
| [P3] | IMP-01 | Upgrade 11 → 14/15 como estratégia única (escopo mínimo verificado) | Alto |

## 3. Segurança

### SEC-01 — Next 11.0.0 EOL e impossibilidade de rodar `npm audit` [P1]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/package.json` (linha 13: `"next": "11.0.0"`; linha 22: `"eslint-config-next": "11.0.0"`)
- **Evidência:** `next 11.0.0` fixo no manifest. O comando `npm audit --json` foi executado no repositório e falhou com `npm ERR! code ENOLOCK — This command requires an existing lockfile` (o repo só tem `yarn.lock`, lockfile v1; `yarn` não está instalado neste ambiente, então `yarn audit` também não rodou). Consequência honesta: **nenhuma CVE específica foi levantada nesta análise** — o que se verifica é que o Next 11 está fora de suporte e que a auditoria de dependências é inexequível como o repo está hoje.
- **Impacto:** framework sem correções de segurança há anos, combinado com cegueira total sobre vulnerabilidades transitivas (não há como saber quantas existem sem rodar a auditoria).
- **Mudança:** (1) gerar `package-lock.json` com `npm i --package-lock-only` para destravar a auditoria; (2) rodar `npm audit --audit-level=high` e revisar o relatório; (3) seguir o caminho de upgrade do IMP-01 (Next 11 → 14/15) para voltar a receber patches. Não citar CVE específica sem conferência em fonte oficial.
- **Aceite:** `npm audit` executa sem `ENOLOCK` e o relatório é revisado/registrado; `next` declarado ≥ 14 (ou risco de manter 11 aceito por escrito na §9).
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
test -f package-lock.json || npm i --package-lock-only
npm audit --audit-level=high; echo "audit exit=$?"
grep -n '"next"' package.json
```

### SEC-02 — `.dockerignore` não bloqueia variantes de `.env` usadas pelo Next [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/.dockerignore` (linha `.env`) e `/home/servidor/Git/react_next_js_nlw5/Dockerfile` (linha 5: `COPY . .`)
- **Evidência:** o `.dockerignore` lista exatamente: `node_modules`, `.git`, `dist`, `build`, `*.log`, `.env`, `npm-debug.log*` — só o `.env` literal. O Next também lê `.env.local`, `.env.development`, `.env.production`, que **não** estão na lista; o `COPY . .` (linha 5) copia tudo que sobrar para a camada de build, e a linha 11 `COPY --from=build /app ./` propaga o conteúdo para a imagem final.
- **Impacto:** segredos locais em `.env.local`/`.env.production` podem ser embutidos na imagem (inclusive publicada em registry), além de irem para o cache de camadas do builder.
- **Mudança:** trocar a linha `.env` por `.env*` no `.dockerignore` (mantendo `!.env.example` caso venha a existir).
- **Aceite:** nenhuma variante `.env*` entra na imagem em `docker build`.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
grep -qx '\.env\*' .dockerignore && echo "padrao OK"
touch .env.local.test && docker build -t nlw5-sec02 . >/dev/null 2>&1
docker run --rm --entrypoint sh nlw5-sec02 -c 'ls -a /app | grep "^\.env" | wc -l'
rm -f .env.local.test   # deve imprimir 0 arquivos .env na imagem
```

## 4. Bugs e defeitos funcionais

### BUG-01 — README executa `docker compose up --build` sem existir arquivo de compose [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/README.md` (linha 10: `docker compose up --build`)
- **Evidência:** verificação no repo: `ls *.yml *.yaml` → "sem arquivos yaml na raiz"; não existe `docker-compose.yml`, `compose.yaml` nem qualquer workflow equivalente. O README apresenta esse comando como caminho "**recomendado**" (linha 3).
- **Impacto:** a primeira instrução de execução do README falha com `no configuration file provided: none found` — o adotante trava já no passo 1.
- **Mudança:** escolher uma das duas: (a) criar `docker-compose.yml` na raiz (`build: .`, `ports: ["3000:3000"]`) mantendo o comando do README; ou (b) trocar a instrução do README por `docker build -t nlw5 . && docker run --rm -p 3000:3000 nlw5`.
- **Aceite:** o comando documentado na seção Docker sobe o app em `http://localhost:3000` a partir de clone limpo.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
docker compose up --build -d && sleep 8
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000   # espera 200
docker compose down
```

### BUG-02 — Instrução "Sem Docker" roda `npm start` sem build e sem lockfile npm [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/README.md` (linhas 14–18: `npm install` / `npm start`)
- **Evidência:** `package.json` linha 8 define `"start": "next start"` — o `next start` exige um build prévio em `.next`, e o README **não** manda `npm run build` nessa seção (o script `build` existe, linha 7). Ainda: não há `package-lock.json` no repo (só `yarn.lock`), então o `npm install` do README instala versões diferentes das lockadas.
- **Impacto:** quem segue o caminho "Sem Docker (local)" recebe erro de build ausente (e instalação não reprodutível) — dois defeitos numa única instrução.
- **Mudança:** corrigir a seção para `npm install && npm run build && npm start`, ou (preferível, coerente com o `yarn.lock` existente) unificar tudo em `yarn install && yarn build && yarn start`.
- **Aceite:** seguindo literalmente a seção "Sem Docker", o servidor sobe em modo produção em `http://localhost:3000`.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
npm install && npm run build && (npm start & sleep 8)
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000   # espera 200
kill %1 2>/dev/null || true
```

### BUG-03 — Import não usado em `src/pages/index.tsx` [P3]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/src/pages/index.tsx` (linha 1)
- **Evidência:** linha 1: `import { Header } from '../Header/index';` — o componente retorna apenas `<h1>Index</h1>` (linhas 2–6) e não referencia `Header`; o cabeçalho já é renderizado globalmente por `src/pages/_app.tsx` (linha 10: `<Header />`).
- **Impacto:** código morto/ruído de lint; confunde quem for migrar a página no upgrade (IMP-01). (Observação: a página ainda é placeholder — refazer a feature está fora de escopo, ver §9.)
- **Mudança:** remover a linha 1 (import não usado); manter o restante da página como está.
- **Aceite:** `npx tsc --noEmit` e `npm run lint` passam e nenhuma referência a `Header` resta em `index.tsx`.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
! grep -q "Header" src/pages/index.tsx && echo "import morto removido"
npx tsc --noEmit && npm run lint && echo "lint/tsc OK"
```

## 5. Qualidade: testes

### TEST-01 — Repositório sem nenhum teste e sem script `test` [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/package.json` (linhas 5–10: scripts apenas `dev`, `build`, `start`, `lint`)
- **Evidência:** `find . -name '*.test.*' -o -name '*.spec.*'` (fora `node_modules`) retornou **vazio**; `devDependencies` (linhas 18–24) não contêm jest, vitest, testing-library ou playwright; não há diretório `__tests__`.
- **Impacto:** o upgrade de plataforma do IMP-01 (Next 11 → 14/15, React 17 → 18) será feito sem rede de segurança — regressões de render (Header com data pt-BR, casca do Player, layout do `_app`) só seriam pegas na inspeção manual.
- **Mudança:** adicionar um runner de testes leve (Vitest ou Jest) + `@testing-library/react` e 2 testes de regressão: (1) `Header` renderiza o texto fixo e a data formatada com locale `pt-BR`; (2) a página inicial renderiza `<h1>Index</h1>` e o `_app` envolve com `Header` + `Player`. Criar o script `"test"`.
- **Aceite:** `npm test` existe e passa localmente, cobrindo os dois pontos acima.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
grep -q '"test"' package.json && npm test
find src -name '*.test.*' -o -name '*.spec.*' | head
```

## 6. DevOps / Infra

### DEVOPS-01 — Dockerfile: `npm ci` sempre falha e o fallback esconde o motivo [P1]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/Dockerfile` (linha 3: `COPY package*.json ./`; linha 4: `RUN npm ci 2>/dev/null || npm install --legacy-peer-deps`)
- **Evidência:** não existe `package-lock.json` no repo (só `yarn.lock`, lockfile v1); o `npm ci` **exige** lockfile, portanto a linha 4 sempre cai no `|| npm install --legacy-peer-deps` — e o `2>/dev/null` suprime exatamente o erro que explicaria isso. A linha 3 `COPY package*.json` não copia o `yarn.lock`, então nem o yarn é aproveitado na imagem. O fallback `--legacy-peer-deps` ainda silencia conflitos de peerDependencies (ex.: `eslint 7.28.0` vs `eslint-config-next 11.0.0`).
- **Impacto:** builds de imagem não reprodutíveis (cada host instala um resolvedor de dependências diferente), dependências que podem divergir entre dev/CI/prod, e diagnóstico dificultado pelo stderr descartado.
- **Mudança:** escolher **um** gerenciador e travá-lo: (a) npm → gerar/commitar `package-lock.json`, `COPY package.json package-lock.json ./` e `RUN npm ci --omit=dev` (sem `2>/dev/null`, sem fallback); ou (b) yarn → `COPY package.json yarn.lock ./` e `RUN yarn install --frozen-lockfile`. Em ambos, remover `--legacy-peer-deps` e tratar conflito de peer como erro real.
- **Aceite:** com o lockfile removido (teste), o `docker build` **falha** (em vez de instalar versões soltas); build normal instala sempre as mesmas versões.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
grep -n 'npm ci\|frozen-lockfile' Dockerfile
grep -n '2>/dev/null\|legacy-peer-deps' Dockerfile && echo "ainda tem fallback" || echo "fallback removido"
docker build -t nlw5-devops1 . >/dev/null && echo "build reprodutivel OK"
```

### DEVOPS-02 — Sem pipeline de CI (diretório `.github/` ausente) [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/` (inexistência de `/home/servidor/Git/react_next_js_nlw5/.github`)
- **Evidência:** `ls -la .github` → "no .github"; não há nenhum workflow/CI (GitHub Actions, GitLab CI, Circle etc.) em todo o repositório. Os scripts necessários já existem no `package.json` (`lint`, `build`) mas não são executados automaticamente — a branch ativa é `main`.
- **Impacto:** lint e build só rodam quando alguém lembra; como não há testes (TEST-01), uma regressão pode chegar à `main` sem nenhuma checagem automática.
- **Mudança:** criar `.github/workflows/ci.yml` disparado em `push`/`pull_request`: checkout + `actions/setup-node` (Node 20, cache npm/yarn) + instalação via lockfile (`npm ci` **ou** `yarn --frozen-lockfile`, dependendo da escolha do DEVOPS-01) + `npm run lint` + `npm run build` (+ `npm test` assim que o TEST-01 existir).
- **Aceite:** workflow existe e fica verde num push à `main`; falhas de lint/build bloqueiam o PR.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
test -f .github/workflows/ci.yml && echo "CI presente"
grep -E 'run:.*(lint|build)' .github/workflows/ci.yml
```

### DEVOPS-03 — Imagens de base mistas (Node 16 EOL no build) e imagem final inchada [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/Dockerfile` (linha 1: `FROM node:16-alpine AS build`; linha 8: `FROM node:20-alpine`; linha 11: `COPY --from=build /app ./`)
- **Evidência:** o estágio de build usa **Node 16** (EOL) enquanto o runtime usa **Node 20** — dependências instaladas numa toolchain EOL e executadas noutra major. A linha 11 copia `/app` inteiro do build: fonte **e** `node_modules` completo (o `npm install` da linha 4 instala também `devDependencies`, já que não há `--omit=dev`). O `next.config.js` não tem configuração de imagens/domains (só `reactStrictMode: true`, linhas 1–3) — o gargalo é a imagem, não a config.
- **Impacto:** imagem final maior e com superfície de ataque ampliada (devDeps + fonte); e **Node 16 trava o upgrade** do IMP-01, pois Next ≥ 14 exige Node 18.17+.
- **Mudança:** alinhar as duas stages na mesma major suportada (`node:20-alpine` ou `node:22-alpine`); no estágio final, manter só produção (`npm ci --omit=dev` no stage final ou cópia seletiva de `.next/`, `package.json` e `node_modules` de produção), em vez de `COPY --from=build /app ./`.
- **Aceite:** as duas linhas `FROM` usam a mesma major de Node ≥ 20; a imagem final não contém `devDependencies` nem fonte desnecessária; `docker run` sobe o app.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
grep -n '^FROM' Dockerfile
docker build -t nlw5-devops3 . >/dev/null
docker run --rm --entrypoint sh nlw5-devops3 -c 'node -v; ls /app'
```

### IMP-01 — Upgrade do Next 11 → 14/15 como estratégia única de remendo de plataforma [P3]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/package.json` (linha 13: `"next": "11.0.0"`; linha 14: `"react": "17.0.2"`) e `/home/servidor/Git/react_next_js_nlw5/src/pages/`
- **Evidência:** o app tem apenas 3 páginas (`_app.tsx`, `_document.tsx`, `index.tsx` em `src/pages/`); grep em `src/` por `getServerSideProps`, `getStaticProps`, `fetch(` e rotas `pages/api` retornou "sem data fetching/fetch" — **zero** telas para migrar; `next.config.js` só contém `reactStrictMode: true` (linhas 1–3), sem `images.domains`; Pages Router, sem diretório `app/`. Ou seja: o escopo de migração verificado é mínimo.
- **Impacto:** como o SEC-01 mostra que a manutenção de segurança só se resolve atualizando a plataforma, e o upgrade puxa React 17 → 18, os pontos de atrito serão peer deps (`eslint-config-next`, `@types/react@17`, `sass@1.35`) e o requisito de Node ≥ 18.17 para Next ≥ 14 (travado hoje pelo `node:16-alpine` do build — DEVOPS-03). Não há risco de quebra de data fetching porque ele não existe.
- **Mudança:** subir `next` + `react` + `react-dom` juntos (direto para 14/15 ou em degraus 11→12→13→14), com bump de `eslint-config-next` e `@types/*` correspondentes; **manter Pages Router** (migração para App Router fora deste plano, §9); rodar `build` + `lint` + testes (TEST-01) a cada degrau.
- **Aceite:** `npm run build` e `npm run lint` verdes com `next` ≥ 14 declarado; `/`, `_app` e `_document` renderizando normalmente; Docker build roda com Node ≥ 18.17.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
npm run build && npm run lint && echo "upgrade OK"
grep -n '"next"\|"react"' package.json
```

## 7. Documentação

### DOC-01 — README: gerenciadores misturados, referência órfã e ausência de aviso de EOL [P2]

- **Arquivo:** `/home/servidor/Git/react_next_js_nlw5/README.md` (89 linhas; mistura nas linhas 10, 14–18 e 50–63; nota na linha 85)
- **Evidência:** o README instrui `docker compose up --build` (linha 10, sem compose file — BUG-01), `npm install`/`npm start` (linhas 16–17, sem build e sem `package-lock.json` — BUG-02) e, mais abaixo, `yarn install`/`yarn dev`/`yarn build` (linhas 53–62) — **dois gerenciadores diferentes na mesma página**, sendo que o repo só tem `yarn.lock`. A linha 85 (seção Observações) cita o arquivo `server json.txt` como "deletado no working tree", mas esse arquivo não existe no repositório — referência órfã. Nenhum aviso de que `next@11`, `react@17` e a imagem `node:16-alpine` do build estão EOL. O que está **bom** e deve ser mantido: seção "Sobre" honesta sobre o projeto estar incompleto (linha 30), estrutura de pastas (linhas 65–80) e badges (linhas 23–26), todos conferidos com o filesystem.
- **Impacto:** o adotante não sabe qual caminho seguir (npm vs yarn vs docker), executa comandos que quebram (BUG-01/BUG-02) e não é avisado de que a stack está fora de suporte.
- **Mudança:** padronizar **um** gerenciador em todo o README (recomendado: yarn, coerente com o `yarn.lock` existente) e corrigir os comandos das seções Docker/Sem Docker conforme BUG-01/BUG-02; remover a nota órfã de `server json.txt`; acrescentar aviso no topo: projeto de estudo com dependências EOL, não destinado a produção.
- **Aceite:** um único caminho (instalação → dev → build → produção) documentado, sem referência a arquivos inexistentes e com aviso de EOL visível.
- **Verificação:**

```bash
cd /home/servidor/Git/react_next_js_nlw5
! grep -q 'server json.txt' README.md && echo "nota orfa removida"
grep -n 'EOL\|não destinado a produção' README.md | head -3
! grep -qE '^\s*npm (install|start)' README.md && echo "caminho unificado (sem npm solto)"
```

## 8. Ordem de execução (waves)

- **Wave 0 — correções imediatas (sem tocar código-fonte):** BUG-01 (compose file ou instrução Docker), BUG-02 (comando "Sem Docker"), DOC-01 (README unificado + aviso EOL), SEC-02 (`.dockerignore` → `.env*`). Esforço baixo, risco quase nulo.
- **Wave 1 — reprodutibilidade e higiene:** DEVOPS-01 (gerenciador único + lockfile + `npm ci` real), DEVOPS-03 (Node majors alinhados ≥ 20, imagem enxuta), BUG-03 (remover import morto). Depende da decisão de gerenciador da Wave 0 (DOC-01).
- **Wave 2 — segurança e plataforma:** TEST-01 (smoke tests primeiro, como rede de segurança) → SEC-01 (gerar lockfile npm se adotar npm, rodar `npm audit`, revisar relatório) → IMP-01 (upgrade Next 11 → 14/15 + React 18, com build e testes verdes).
- **Wave 3 — automação:** DEVOPS-02 (CI em `.github/workflows/ci.yml` rodando lint + build + test em push/PR). Fecha o ciclo para que nada das waves anteriores regrida silenciosamente.

## 9. Fora de escopo / riscos

- **Fora de escopo (decisão consciente):**
  - **Não refazer features.** O player é uma casca (`src/Player/index.tsx` retorna `div` vazia) e a página inicial é placeholder (`<h1>Index</h1>`) — implementar controles do player, listagem de episódios ou áudio **não** faz parte deste plano (é o escopo da NLW5 original, não da melhoria de código).
  - **Não migrar para App Router.** O projeto usa Pages Router (`src/pages/`); a migração para `app/` é opcional e cara, sem benefício de segurança proporcional — manter `pages/` no upgrade (IMP-01).
  - Nada de refatoração estética, novas features, redesign de SCSS ou troca de `date-fns`.
- **Decisão de manter vs. arquivar (projeto de aula):**
  - **Opção A — manter com upgrade:** executar as waves da §8 até SEC-01/IMP-01; indicador: `next` ≥ 14, audit executado, CI verde. Faz sentido se o repo for referência de estudo ativa.
  - **Opção B — arquivar com aviso:** arquivar o repositório com aviso no topo do README: "projeto de estudo NLW5 (2021) com dependências EOL — não usar em produção nem copiar como base". Também é decisão válida e barata; nesse caso apenas as correções factualmente erradas da Wave 0 valem a pena antes de congelar.
  - Recomendação: **Wave 0 + Opção A parcial** (até DEVOPS-01/SEC-01 com audit executado); o upgrade completo (IMP-01) só se o projeto seguir vivo — senão, Opção B com aviso explícito.
- **Riscos residuais:**
  - O upgrade 11 → 14/15 puxa React 17 → 18: peer deps de `eslint-config-next`, `@types/react@17` e `sass@1.35` podem exigir bump — monitorar com build + audit. Mitigação verificada: **não há data fetching para migrar** (grep em `src/` não encontrou `getServerSideProps`, `getStaticProps`, `fetch(` nem rotas `pages/api`).
  - Enquanto SEC-01 não for executada, **não é possível afirmar** quantas vulnerabilidades existem — a única afirmação verificada é que a auditoria não roda hoje (`ENOLOCK`) e que a versão é EOL.
  - Se mantiver o Next 11 por decisão, documentar o risco aceito (não há backport de segurança para Next 11).

## 10. Definição de pronto (DoD)

- [ ] SEC-01: `npm audit` roda sem `ENOLOCK`, relatório revisado; `next` ≥ 14 declarado **ou** risco aceito por escrito (§9).
- [ ] SEC-02: `grep -qx '\.env\*' .dockerignore` verdadeiro e build da imagem sem variantes `.env*`.
- [ ] BUG-01: comando documentado na seção Docker do README sobe o app (`curl` → 200) a partir de clone limpo.
- [ ] BUG-02: seção "Sem Docker" (ou caminho unificado) sobe o servidor de produção conforme escrito, com lockfile respeitado.
- [ ] BUG-03: nenhuma referência a `Header` em `src/pages/index.tsx`; `npx tsc --noEmit` e `npm run lint` verdes.
- [ ] TEST-01: script `test` existe e `npm test` passa, com ao menos os 2 testes de regressão definidos.
- [ ] DEVOPS-01: sem `2>/dev/null`/`--legacy-peer-deps` na linha de instalação; `docker build` usa `npm ci` (ou `yarn --frozen-lockfile`) e falha quando o lockfile diverge.
- [ ] DEVOPS-02: `.github/workflows/ci.yml` existe, roda lint + build (+ test) em push/PR e está verde na `main`.
- [ ] DEVOPS-03: as duas linhas `FROM` do Dockerfile usam a mesma major de Node ≥ 20; imagem final sem `devDependencies`.
- [ ] DOC-01: README com um único gerenciador, sem `server json.txt`, com aviso de EOL e comandos executáveis de ponta a ponta.
- [ ] IMP-01: `next build` e `npm run lint` verdes com `next` ≥ 14, Pages Router mantido, todas as páginas (`/`, `_app`, `_document`) funcionando.
- [ ] Revalidação do contrato: `python3 /tmp/validate.py react_next_js_nlw5` retorna `OK`.

*Fim do plano. Gerado por leitura direta do código em 2026-10-05 — somente fatos verificados no repositório (`package.json`, `next.config.js`, `.eslintrc`, `Dockerfile`, `.dockerignore`, `README.md`, `aula.md`, `tsconfig.json`, `src/pages/*`, `src/Header`, `src/Player`, `public/`, árvore git) e por comandos executados no ambiente (`npm audit` → ENOLOCK, `find` de testes vazio, ausência de `.github`/compose/lockfile npm). Nenhum arquivo:linha ou CVE foi inventado.*
