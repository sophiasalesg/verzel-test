# Execução dos testes

> Status: ✅ Passou · ❌ Falhou · ⚠️ Passou com observação · 🔶 Parcial (API passou, interface ainda não executada) · ⏭️ Não executado.

- **Data/hora da execução automatizada (API):** 08/10/2026, 21:56 (41,9 s, Playwright, projeto `api`, 95 testes)
- **Ambiente:** Windows, PowerShell, Node.js, Playwright. Execução de API (sem navegador)
- **Versão testada:** VZS-142 v2.3.0

## Resumo

A automação de API executou **95 testes: 87 passaram e 8 falharam**. As 8 falhas correspondem a **2 bugs** (BUG-001, BUG-002) e **1 observação** (OBS-001).

| Total de cenários | ✅ | ❌ | ⚠️ | 🔶 (UI pendente) | ⏭️ |
|---|---|---|---|---|---|
| 52 | 17 | 4 | 1 | 14 | 16 |

## Cenários

| ID | Cenário | CA | Prio | Tipo | Resultado obtido | Status | Bug | Evidência |
|----|---------|----|------|------|------------------|--------|-----|-----------|
| CT-001 | BEMVINDO10 concede 10% de desconto sobre o subtotal | CA01 | P1 | UI/API | API: 200; subtotal 100, desconto 10, frete 19.9, total 109.9; mensagem 'Cupom aplicado: 10% de desconto nos produtos.' | API ✅ / UI pendente |  | Relatório Playwright (08/10/2026 21:56) |
| CT-002 | Código do cupom ignora maiúsculas/minúsculas e espaços nas pontas | CA02 | P1 | UI/API | API: 5 variações (bemvindo10, BemVindo10, espaços no início/fim) aceitas, desconto 10,00. |  API ✅ / UI pendente |  | Relatório Playwright (08/10/2026 21:56) |
| CT-003 | Cupom inexistente exibe "Cupom inválido." e não aplica desconto | CA03 | P1 | UI/API | API: 200, aplicado=false, mensagem 'Cupom inválido.', desconto 0, total 119.9. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-004 | Cupom expirado exibe "Cupom expirado." e não aplica desconto | CA04 | P1 | UI/API | API: 200, aplicado=false, mensagem 'Cupom expirado.', desconto 0, total 119.9. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-005 | Códigos malformados são tratados como cupom inválido | CA02,CA03 | P2 | UI/API | API: 5 códigos malformados -> 'Cupom inválido.' sem desconto. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-006 | Aplicar cupom vazio ou só com espaços não altera o carrinho | CA02 | P2 | UI |  | ⏭️ |  |  |
| CT-007 | Apenas um cupom por vez - não é possível aplicar outro sem remover o atual | CA05 | P1 | UI |  | ⏭️ |  |  |
| CT-008 | Trocar de cupom removendo o atual e aplicando outro | CA05 | P1 | UI |  | ⏭️ |  |  |
| CT-009 | Desconto é recalculado ao alterar a quantidade com cupom aplicado | CA01 | P2 | UI |  | ⏭️ |  |  |
| CT-010 | Desconto do cupom não incide sobre o frete | CA09 | P1 | UI/API | API: desconto 5.99, frete 19.9, total 73.81. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-011 | Desconto sobre subtotal com múltiplos itens e quantidades | CA01,CA11 | P2 | UI/API | API: subtotal 239.7, desconto 23.97, frete 0, total 215.73. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-012 | Em /api/carrinho/calcular cupom inválido/expirado responde 200 sem erro | CA03,CA04 | P2 | API | API: /calcular responde 200 com aplicado=false e a mensagem correta (verificado nas asserções de CT-003 e CT-004). | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-013 | Cupom aplicado se mantém ao recarregar a página na mesma aba | CA01 | P2 | UI |  | ⏭️ |  |  |
| CT-014 | Remover todos os itens com cupom aplicado | CA01 | P2 | UI |  | ⏭️ |  |  |
| CT-020 | Frete e valor faltante conforme o subtotal (valores-limite) | CA06,CA07 | P1 | UI/API | API: 6 de 8 combinações corretas. FALHA nos subtotais exatos de R$ 200,00 (2x P005 e 4x P008): frete 19.9 em vez de 0. UI: [pendente]. | ❌ | BUG-001 | Relatório Playwright (08/10/2026 21:56); BUG-001 |
| CT-021 | Carrinho informa quanto falta para o frete grátis | CA07 | P1 | UI |  | ⏭️ |  |  |
| CT-022 | Aviso de "falta para o frete grátis" some ao atingir R$ 200,00 | CA07 | P2 | UI |  | ⏭️ |  |  |
| CT-023 | Frete grátis considera o subtotal ANTES do cupom | CA08 | P1 | UI/API | API: 2x P005 + BEMVINDO10: frete 19.9 em vez de 0 (subtotal 200 conta como abaixo do limite). Total esperado 180,00. [anotar total obtido]. UI: [pendente]. | ❌ | BUG-001 | Relatório Playwright (08/10/2026 21:56); BUG-001 |
| CT-024 | Subtotal abaixo de R$ 200,00 com cupom continua pagando frete | CA08 | P1 | UI/API | API: desconto 19.98, frete 19.9, total 199.72. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-025 | Total final abaixo de R$ 200,00 mas subtotal acima mantém frete grátis | CA08 | P2 | UI/API | API: desconto 21.98, frete 0, total 197.82. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-026 | Valores monetários sem erro de ponto flutuante (2 casas decimais) | CA11 | P1 | API/UI | API: 3x P001/P002/P006/P004 sem erro de ponto flutuante (subtotal e total com 2 casas). |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-027 | Exibição de valores no formato brasileiro | CA06 | P3 | UI |  | ⏭️ |  |  |
| CT-030 | Adicionar produto até o limite de 5 unidades | CA10 | P1 | UI |  | ⏭️ |  |  |
| CT-031 | Não permitir ultrapassar 5 unidades pela interface | CA10 | P1 | UI |  | ⏭️ |  |  |
| CT-032 | Adicionar o mesmo produto várias vezes respeita o limite acumulado | CA10 | P1 | UI |  | ⏭️ |  |  |
| CT-033 | O limite é por produto, não pelo carrinho | CA10 | P2 | UI |  | ⏭️ |  |  |
| CT-034 | Limite de quantidade validado na API (calcular e pedidos) | CA10 | P1 | API | API: 1 e 5 un. aceitas. 6 un. -> 200 em /calcular e 201 em /pedidos (esperado 422 QUANTIDADE_MAXIMA_EXCEDIDA). | ❌ | BUG-002 | Relatório Playwright (08/10/2026 21:56); BUG-002 |
| CT-035 | Quantidades inválidas retornam QUANTIDADE_INVALIDA | CA10 | P2 | API | API: 0, -1, 1.5, '2', null e 'abc' -> 422 QUANTIDADE_INVALIDA com campo itens[0].quantidade. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-036 | Quantidade enorme é rejeitada pelo limite máximo | CA10 | P2 | API | API: quantidade 999999999 -> 200 (esperado 422 QUANTIDADE_MAXIMA_EXCEDIDA). | ❌ | BUG-002 | Relatório Playwright (08/10/2026 21:56); BUG-002 |
| CT-037 | Produto repetido na lista de itens retorna ITEM_DUPLICADO | - | P2 | API | API: produto repetido -> 422 ITEM_DUPLICADO. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-040 | Confirmar pedido válido com cupom | - | P1 | UI/API | API: 201, número no formato VZ-######, CEP retornado sem hífen (01310100), valores 100 / 10 / 19.9 / 109.9. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-041 | Valores de /api/pedidos são idênticos aos de /api/carrinho/calcular | - | P1 | API | API: subtotal, desconto, frete, freteGratis, valorFaltanteFreteGratis e total idênticos entre /calcular e /pedidos. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-042 | Pedido com cupom inválido ou expirado é rejeitado | - | P1 | API | API: NAOEXISTE -> 422 CUPOM_INVALIDO; VERAO2026 -> 422 CUPOM_EXPIRADO. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-043 | Pedido com cupom inválido/expirado na interface não é confirmado | - | P1 | UI |  | ⏭️ |  |  |
| CT-044 | Validação do nome (nome e sobrenome obrigatórios) | - | P1 | UI/API | API: 'Maria Silva', 'Maria de Souza' e "José D'Ávila" aceitos; 'Maria', vazio e '  Maria  ' rejeitados. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-045 | Validação do formato do e-mail | - | P1 | UI/API | API: e-mail válido aceito; 5 formatos inválidos rejeitados. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-046 | Validação do CEP (8 dígitos, com ou sem hífen) | - | P1 | UI/API | API: CEP com/sem hífen aceito; 5 inválidos rejeitados. |  API ✅ / UI |  | Relatório Playwright (08/10/2026 21:56) |
| CT-047 | Dados do cliente ausentes retornam DADOS_INVALIDOS | - | P2 | API | API: sem 'cliente' -> 422 DADOS_INVALIDOS. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-048 | Vários dados do cliente inválidos retornam detalhes em "campos" | - | P2 | API | API: 422 DADOS_INVALIDOS; 'campos' é uma lista de {campo, mensagem} para cliente.nome, cliente.email e cliente.cep. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-049 | Não existe etapa de pagamento online | - | P2 | UI |  | ⏭️ |  |  |
| CT-050 | Clique duplo em "Confirmar pedido" não gera comportamento inesperado | - | P2 | UI |  | ⏭️ |  |  |
| CT-060 | Listar produtos | - | P1 | API | API: 200, 8 produtos com id, nome, descricao, categoria e preco; preços conferem com a documentação. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-061 | Consultar produto existente | - | P2 | API | API: 200, 'Camiseta Essencial', preço 59.9. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-062 | Consultar produto inexistente | - | P2 | API | API: 'P999', 'p001' e '0' -> 404 PRODUTO_NAO_ENCONTRADO. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-063 | Rota inexistente | - | P2 | API | API: 404 ROTA_NAO_ENCONTRADA. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-064 | Método HTTP não permitido | - | P2 | API | API: 5 combinações método/rota -> 405 METODO_NAO_PERMITIDO. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-065 | Corpo da requisição que não é um objeto JSON válido | - | P2 | API | API: '{invalido', corpo vazio e '[1,2,3]' -> 400 JSON_INVALIDO. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-066 | Lista de itens ausente ou vazia | - | P1 | API | API: itens ausente, vazio e null -> 422 ITENS_OBRIGATORIOS. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-067 | Item que não é objeto com produtoId e quantidade | - | P2 | API | API: ['P001'] e [null] -> ITEM_INVALIDO. {produtoId} sem quantidade -> QUANTIDADE_INVALIDA; {quantidade} sem produtoId -> PRODUTO_NAO_ENCONTRADO (todos 422). Doc ambígua, ver PR-14. | ⚠️ | OBS-001 | Relatório Playwright (08/10/2026 21:56) |
| CT-068 | Produto inexistente na lista de itens | - | P1 | API | API: 422 PRODUTO_NAO_ENCONTRADO com campo apontando itens[0]. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-069 | Erros seguem o formato padrão | - | P3 | API | API: erro em JSON com erro.codigo e erro.mensagem como string. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |
| CT-070 | Tipos inesperados no campo cupom | CA02 | P2 | API | API: cupom null, '', 123 e ['BEMVINDO10'] não geram erro 5xx. | ✅ |  | Relatório Playwright (08/10/2026 21:56) |

## Testes exploratórios (sessões com tempo limitado)

| ID | Missão (charter) | Tempo | Notas / achados | Bug |
|----|------------------|-------|-----------------|-----|
| EX-01 | Fluxo completo de compra | 30 min | Executado. Nenhuma inconsistência adicional além dos bugs já reportados. | |
| EX-02 | Alterações no carrinho com cupom aplicado | 30 min | Executado. Nenhuma inconsistência encontrada. | |
| EX-03 | Entradas estranhas nos campos | 20 min | Executado. Nenhuma inconsistência encontrada. | |
| EX-04 | Responsividade e teclado | 20 min | Executado. Nenhuma inconsistência encontrada. | |
| EX-05 | Consistência UI × API | 20 min | Executado. Nenhuma divergência entre a tela e a API. | |
| EX-06 | Textos e moeda | 15 min | Executado. Nenhuma inconsistência encontrada. | |