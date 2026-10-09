# Teste técnico QA Júnior - Verzel Store (VZS-142)

Validação da entrega **VZS-142 - Cupom de desconto e frete grátis** (v2.3.0) da Verzel Store.

- **Loja:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Documentação:** https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- **API:** https://verzel-store.qa-test-verzel-store.workers.dev/api

> Autora: Sophia Sales Gato

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|----------------|-----------|
| Cenários de teste (Gherkin) | [`features/`](features) (5 arquivos `.feature`, 52 cenários com IDs `CT-xxx`) |
| Premissas e interpretações das ambiguidades | [`docs/00-premissas.md`](docs/00-premissas.md) |
| Execução dos testes (manuais + exploratórios) e resultado de cada cenário | [`docs/02-execucao.md`](docs/02-execucao.md) |
| Report de bugs | [`docs/03-bugs.md`](docs/03-bugs.md) |
| Evidências da execução | [`docs/04-evidencias.md`](docs/04-evidencias.md) + [`docs/evidencias/`](docs/evidencias) |
| Automação com Playwright | [`tests/`](tests) |

## Estratégia de teste (resumo)

1. **Análise da documentação:** cada critério de aceite (CA01-CA11) e cada regra de cálculo virou cenários. A rastreabilidade está nas tags (`@CA06`, `@CT-020`...).
2. **Técnicas:** partição de equivalência e análise de valor-limite (frete em R$ 199,60 / 199,80 / 200,00; quantidade 0/1/5/6), tabela de decisão (cupom × subtotal × frete), teste de contrato da API (status e códigos de erro) e exploração baseada em sessões.
3. **Prioridade:** P1 (regra financeira/negócio), P2 (validações e bordas), P3 (formato/cosmético).
4. **Fora do escopo (conforme o enunciado):** carga, estresse e segurança. O que a seção "Sobre este ambiente" descreve como simplificação **não** foi reportado como bug.

Legenda das tags: `@ui` / `@api` indica onde o cenário foi executado. `@P1..P3` é a prioridade.

## Como rodar a automação

Pré-requisitos: Node.js 18+.

```bash
npm install
npx playwright install chromium   # só necessário para os testes de UI
npm test                          # roda tudo
npm run test:api                  # só API (não precisa de navegador)
npm run report                    # abre o relatório HTML
```

Para apontar para outro ambiente: `BASE_URL=https://outro-host npm test`.

### O que está automatizado

- **API (Playwright `request`)** - `tests/*.api.spec.ts`: cupom (CA01-CA05, CA09), frete grátis e valores-limite (CA06-CA08), arredondamento/ponto flutuante (CA11), limite de 5 unidades (CA10), criação de pedido, validação de cliente (nome, e-mail, CEP) e contrato de erros da API. Cada teste referencia o ID do cenário (`CT-xxx`).
- **UI** - `tests/loja.ui.spec.ts`: esqueleto com `test.fixme`. Os seletores precisam ser ajustados ao DOM real da loja (ver comentários no arquivo).

Os valores esperados vêm **exclusivamente da documentação**. Um teste que falha indica divergência entre sistema e documentação e deve ser analisado antes de virar bug em `docs/03-bugs.md`.

Os testes rodam com 1 worker, sem paralelismo, para não sobrecarregar o ambiente compartilhado.

## Estrutura

```
.
├── README.md
├── features/            # cenários em Gherkin (pt)
├── docs/
│   ├── 00-premissas.md
│   ├── 02-execucao.md
│   ├── 03-bugs.md
│   ├── 04-evidencias.md
│   └── evidencias/      # prints e respostas da API
├── tests/               # Playwright (TypeScript)
├── scripts/gen_execucao.py  # gera a tabela de docs/02-execucao.md a partir dos .feature
├── playwright.config.ts
└── package.json
```
## Uso de IA

Usei o **Claude (Anthropic)** como assistente neste teste. Abaixo, o que a IA fez e o que eu fiz.

### Onde a IA ajudou
- **Cenários:** gerou uma primeira versão dos cenários em Gherkin e da lista de premissas a partir da documentação VZS-142.
- **Estrutura:** propôs a organização do repositório e os modelos de `02-execucao`, `03-bugs` e `04-evidencias`.
- **Automação:** escreveu a primeira versão dos testes de API em Playwright (TypeScript).
- **Análise:** me ajudou a interpretar as falhas da automação e a redigir os reports de bugs.

### O que eu fiz
- Li a documentação inteira e conferi os cenários e valores esperados contra os critérios de aceite.
- Rodei a automação na minha máquina (87 testes passaram, 8 falharam) e investiguei cada falha.
- Reproduzi manualmente os problemas antes de reportá-los: [descrever: curl/PowerShell e interface].
- Separei bugs de dúvidas de interpretação. Exemplo: os 2 testes do CT-067 falhavam, mas concluí que a documentação era ambígua e ajustei o teste e registrei a premissa PR-14, em vez de reportar bug.
- Executei os testes manuais e exploratórios e coletei as evidências.
- Defini severidade e prioridade dos bugs.

### Limites
- A IA não executou nada na loja: todos os resultados reais vêm das minhas execuções.
- Revisei o que a IA gerou. 