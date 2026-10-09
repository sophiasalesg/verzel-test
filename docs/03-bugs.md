# Relatório de bugs


## Índice

| ID | Título | Severidade | Camada | CA | Cenários | Status |
|----|--------|------------|--------|----|----------|--------|
| BUG-001 | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00 | Alta | API [+ UI] | CA06, CA08 | CT-020, CT-023 | Aberto |
| BUG-002 | Limite de 5 unidades por produto não é validado na API | Alta | API [+ UI?] | CA10 | CT-034, CT-036 | Aberto |
| OBS-001 | `ITEM_INVALIDO` não é usado quando falta campo no item (observação) | Baixa | API | - | CT-067 | Observação |

**Severidade:** Crítica (impede comprar / valor financeiro errado em larga escala) · Alta (regra de negócio incorreta com impacto financeiro) · Média (comportamento errado com contorno) · Baixa (cosmético/texto)

---

## BUG-001 - [Frete] Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00

- **Severidade / Prioridade:** Alta / P1
- **Camada:** API [e UI, se confirmado]
- **Critério violado:** CA06 ("frete grátis a partir de R$ 200,00, inclusive") e regra de cálculo ("R$ 0,00 quando o subtotal é igual ou maior que R$ 200,00")
- **Cenários:** CT-020 (2x P005 e 4x P008), CT-023
- **Ambiente:** Windows, Playwright (API), loja v2.3.0, 08/10/2026 [e navegador/versão, se testou na UI]

**Passos para reproduzir**
1. Enviar `POST /api/carrinho/calcular` com `{"itens":[{"produtoId":"P005","quantidade":2}]}` (subtotal 200,00).
2. Repetir com `{"itens":[{"produtoId":"P008","quantidade":4}]}` (subtotal 200,00).
3. Repetir o passo 1 com `"cupom":"BEMVINDO10"` (CT-023).
4. [UI: adicionar 2 unidades de "Mochila Urbana 20L" ao carrinho e observar o frete.]

```powershell
$u = "https://verzel-store.qa-test-verzel-store.workers.dev/api"
Invoke-RestMethod -Method Post -Uri "$u/carrinho/calcular" -ContentType "application/json" `
  -Body '{"itens":[{"produtoId":"P005","quantidade":2}]}' | ConvertTo-Json -Depth 5
```

**Resultado esperado:** `subtotal: 200`, `frete: 0`, `freteGratis: true`, `valorFaltanteFreteGratis: 0`.
No CT-023 (com cupom), `desconto: 20`, `frete: 0`, `total: 180`.

**Resultado obtido:** `subtotal: 200` e `frete: 19.9`. [Anotar `freteGratis` e `valorFaltanteFreteGratis` retornados.] No CT-023 o frete também é 19,9 [anotar total obtido].

**Frequência:** sempre (3 de 3 execuções automatizadas).

**Observações / impacto:** os subtotais de R$ 199,80 (frete cobrado) e R$ 219,80 (frete grátis) estão corretos, então só o valor exato do limite falha. Indica comparação "maior que" em vez de "maior ou igual". O cliente paga R$ 19,90 a mais justamente no valor-limite anunciado.

**Evidência:** relatório do Playwright (08/10/2026 21:56), `docs/evidencias/BUG-001_*.json` [e prints].

---

## BUG-002 - [API] Limite de 5 unidades por produto não é validado

- **Severidade / Prioridade:** Alta / P1
- **Camada:** API [UI: preencher]
- **Critério violado:** CA10 ("máximo de 5 unidades por produto por pedido; a regra vale para a interface e para a API"). Códigos documentados: `QUANTIDADE_MAXIMA_EXCEDIDA` (422).
- **Cenários:** CT-034 (calcular e pedidos), CT-036
- **Ambiente:** Windows, Playwright (API), loja v2.3.0, 08/10/2026

**Passos para reproduzir**
1. Enviar `POST /api/pedidos` com cliente válido e `{"produtoId":"P001","quantidade":6}`.
2. Enviar `POST /api/carrinho/calcular` com `{"produtoId":"P001","quantidade":6}`.
3. Enviar `POST /api/carrinho/calcular` com `quantidade: 999999999`.

```powershell
$u = "https://verzel-store.qa-test-verzel-store.workers.dev/api"
Invoke-WebRequest -Method Post -Uri "$u/pedidos" -ContentType "application/json" `
  -Body '{"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":6}]}'
```

**Resultado esperado:** status 422 com `erro.codigo: "QUANTIDADE_MAXIMA_EXCEDIDA"` nas três chamadas.

**Resultado obtido:** `/api/pedidos` com 6 unidades responde **201** (pedido confirmado); `/api/carrinho/calcular` com 6 unidades e com 999999999 unidades responde **200**. Resposta com 6 unidades de P001: `quantidade: 6`, `total: 359.4`, `subtotal: 359.4`, `frete: 0`, `freteGratis: true`, `cupom: null`.

**Frequência:** sempre.

**Observações / impacto:** 1 e 5 unidades são aceitas e 0, -1, 1.5, "2", null e "abc" são rejeitados com `QUANTIDADE_INVALIDA`, então só falta a validação do máximo. Qualquer cliente ou integração consegue fechar pedido acima do limite. [Interface: informar se a UI bloqueia a 6ª unidade. Se bloquear, o defeito fica restrito à API; se não, reportar também na UI.]

**Evidência:** relatório do Playwright (08/10/2026 21:56), `docs/evidencias/BUG-002_*.json` [e prints].

---

## OBS-001 - ITEM_INVALIDO não cobre item com campo ausente (observação)

- **Cenário:** CT-067 · **Severidade:** Baixa · **Classificação:** dúvida de interpretação, não bug.
- **Documentação:** `ITEM_INVALIDO` - "um item não é um objeto com produtoId e quantidade".
- **Observado:** `["P001"]` e `[null]` -> `ITEM_INVALIDO`. `{"produtoId":"P001"}` (sem quantidade) -> `QUANTIDADE_INVALIDA`. `{"quantidade":1}` (sem produtoId) -> `PRODUTO_NAO_ENCONTRADO`. Todos retornam 422 com mensagem coerente.
- **Análise:** a documentação pode ser lida como "não é objeto" (comportamento atual) ou "não tem os dois campos". Como o erro continua específico e o status está correto, não reportei como bug. Registrado em PR-14. Sugestão ao time: esclarecer a documentação.