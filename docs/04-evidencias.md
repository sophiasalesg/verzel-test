# Evidências da execução

> Arquivos em `docs/evidencias/`. Nomes sugeridos: `CT-xxx_descricao.png`, `BUG-xxx_descricao.png/json`.

## Ambiente

- Execução automatizada (API): 08/10/2026 21:56 · Windows · Playwright `@playwright/test` · projeto `api` · 95 testes · 41,9 s
- Execução manual (UI): [data, navegador/versão, viewport]
- Ferramentas: Playwright, PowerShell (`Invoke-RestMethod`/`Invoke-WebRequest`), DevTools

## Resumo da execução automatizada

- 95 testes: **87 passaram, 8 falharam**.
- 6 falhas = **BUG-001** (3) e **BUG-002** (3). 2 falhas = **OBS-001** (CT-067).

## Índice de evidências

| Evidência | Cenário/Bug | O que mostra | Arquivo |
|-----------|-------------|--------------|---------|
| Relatório Playwright (HTML) | Todos (API) | Resultado dos 95 testes | `evidencias/playwright-report-api.png` [salvar print do `npm run report`] |
| Saída do terminal | Todos (API) | `npm run test:api` completo | `evidencias/npm-test-api.txt` [salvar] |
| Resposta da API (frete) | BUG-001 | `frete: 19.9` com subtotal 200 | `evidencias/BUG-001_resposta-api.json` [salvar] |
| Print da UI (frete) | BUG-001 | Carrinho com 2x Mochila Urbana | `evidencias/BUG-001_ui.png` [capturar] |
| Resposta do pedido com 6 un. | BUG-002 | Status 201, `quantidade: 6`, `total: 359.4` | `evidencias/BUG-002_pedido-6-unidades.json` [salvar] |
| Resposta do cálculo com 6 un. | BUG-002 | Status 200 em /calcular | `evidencias/BUG-002_calcular-6-unidades.json` [salvar] |
| Print da UI (limite) | BUG-002 | Comportamento da 6ª unidade na interface | `evidencias/BUG-002_ui.png` [capturar] |

## Evidências por bug

### BUG-001 - Frete cobrado com subtotal de R$ 200,00
- **Execução:** `POST /api/carrinho/calcular` com 2x P005 (e 4x P008).
- **Esperado:** `frete: 0`. **Obtido:** `frete: 19.9`.
- ![BUG-001 API](evidencias/BUG-001_resposta-api.png)

### BUG-002 - Limite de 5 unidades
- **Execução:** `POST /api/pedidos` com 6x P001.
- **Esperado:** 422 `QUANTIDADE_MAXIMA_EXCEDIDA`. **Obtido:** 201.
- ![BUG-002 API](evidencias/BUG-002_pedido-6-unidades.png)

## Evidências dos cenários manuais (UI)

[Para cada cenário executado na interface, incluir: ID, passos, resultado e print. Priorize CT-001, CT-020, CT-023, CT-031.]

## Execução da automação

```
87 passed, 8 failed (95 testes) - ver evidencias/npm-test-api.txt
```