# Premissas e interpretações

A documentação (VZS-142, v2.3.0) deixa alguns pontos em aberto. Abaixo, cada ambiguidade, a interpretação adotada e como ela foi tratada nos testes.
Se o sistema se comportar de forma diferente da interpretação, o comportamento é reportado como **dúvida/observação** (e como bug apenas quando contradiz um critério de aceite explícito).

| ID | Ponto ambíguo | Interpretação adotada | Impacto nos testes |
|----|---------------|-----------------------|--------------------|
| PR-01 | CA11 exige 2 casas decimais, mas com o único cupom válido (10%) e preços múltiplos de R$ 0,10, o desconto nunca gera 3ª casa decimal. | O arredondamento é testado pelo lado do **ponto flutuante** (ex.: `59.9 * 3 = 179.70000000000002` em JS). | CT-026 |
| PR-02 | CA02 diz que espaços no início/fim são ignorados. Não diz nada sobre tabs/quebras de linha nem espaços internos. | Espaço interno (`BEMVINDO 10`) torna o código inválido. Tab/quebra de linha nas pontas é tratado como "espaço" (exploratório). | CT-002, CT-005 |
| PR-03 | Cupom vazio ou só com espaços: a doc não define. | Equivale a "sem cupom" (sem mensagem de erro e sem desconto). Se o sistema mostrar "Cupom inválido.", registro como observação, não como bug. | CT-006, CT-070 |
| PR-04 | CA05 ("apenas um cupom por vez"): não diz o que acontece ao tentar aplicar um segundo cupom sem remover o atual. | O primeiro continua aplicado e o segundo é bloqueado (campo desabilitado ou mensagem). A API recebe só um campo `cupom` (string), então a regra é de interface. | CT-007, CT-008 |
| PR-05 | "Carrinho fica guardado na aba do navegador". Não diz se sobrevive ao refresh. | Recarregar a página na mesma aba mantém o carrinho. O cupom aplicado também deveria se manter (ou ser claramente reaplicado). | CT-013 |
| PR-06 | Carrinho vazio: frete e "faltante" não estão definidos. | Carrinho vazio mostra estado vazio, sem cobrança de frete nem desconto, e não permite finalizar. A API retorna `ITENS_OBRIGATORIOS`. | CT-014, CT-066 |
| PR-07 | CA07 não define o texto/formato do aviso "quanto falta". | Qualquer texto que mostre o valor correto em R$ atende. | CT-021, CT-022 |
| PR-08 | CA10: "5 unidades por pedido" por produto. A doc não diz o que a UI faz ao tentar o 6º (bloqueia? avisa?). | Aceito bloquear silenciosamente **ou** avisar. Não aceito: permitir 6 ou deixar o carrinho em estado inconsistente. | CT-031, CT-032 |
| PR-09 | `ITEM_DUPLICADO` existe na API. Na UI, adicionar o mesmo produto de novo deveria somar a quantidade. | UI soma quantidades (respeitando o limite de 5) e nunca envia o mesmo produto duas vezes. | CT-032, CT-037 |
| PR-10 | Validade do BEMVINDO10: a doc só informa "Válido". | Sem data de expiração conhecida. Não testo expiração dele. | - |
| PR-11 | Nome com sobrenome: não define se `"  Maria  "` (espaços) ou nomes com apóstrofo/acento são aceitos. | Espaços nas pontas são ignorados (logo "Maria" sozinho é inválido). Acentos e apóstrofos são válidos. | CT-044 |
| PR-12 | Resposta da API sem cupom: a doc não mostra como vem o objeto `cupom`. | Observado: `cupom` vem `null` quando não há cupom. Aceito como válido. | CT-070 |
| PR-14 | `ITEM_INVALIDO`: a doc diz "um item não é um objeto com produtoId e quantidade". Não diz se item sem um dos campos entra nesse código. | Aceito `ITEM_INVALIDO` ou o erro específico do campo ausente (`QUANTIDADE_INVALIDA`/`PRODUTO_NAO_ENCONTRADO`). Observado: a API usa o erro específico (OBS-001). | CT-067 |
| PR-13 | Itens exibidos no resumo/UI: ordem não definida. | Qualquer ordem estável é aceita. | - |

## O que NÃO foi reportado como bug (conforme "Sobre este ambiente")

- Carrinho vazio em outra aba, navegador ou janela anônima.
- Número de pedido fictício, ausência de consulta de pedidos, ausência de e-mail/cobrança.
- Ausência de controle de estoque, produtos/preços/cupons fixos.
- API sem estado entre chamadas.
- Login, cadastro, pagamento online e consulta de pedidos (fora de escopo).

## Fora de escopo por regra do teste

Testes de carga, estresse e segurança não foram executados (ambiente compartilhado).