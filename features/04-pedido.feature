# language: pt
@VZS-142 @pedido
Funcionalidade: Confirmação do pedido com cupom e validação de cliente
  Como cliente da Verzel Store
  Quero confirmar meu pedido informando meus dados
  Para receber minhas compras e pagar na entrega

  @CT-040 @P1 @ui @api
  Cenário: Confirmar pedido válido com cupom
    Dado que tenho no carrinho 1 unidade de "P005" e apliquei "BEMVINDO10"
    Quando confirmo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então o pedido é confirmado com número no formato "VZ-" seguido de 6 dígitos
    E os valores são subtotal 100,00, desconto 10,00, frete 19,90 e total 109,90
    E o CEP é retornado sem hífen "01310100"

  @CT-041 @P1 @api
  Cenário: Valores de /api/pedidos são idênticos aos de /api/carrinho/calcular
    Quando calculo e depois confirmo o mesmo carrinho com o mesmo cupom
    Então subtotal, desconto, frete, freteGratis, valorFaltanteFreteGratis e total são iguais

  @CT-042 @P1 @api
  Esquema do Cenário: Pedido com cupom inválido ou expirado é rejeitado
    Quando confirmo um pedido com o cupom "<cupom>"
    Então o status é 422
    E o código de erro é "<codigo>"

    Exemplos:
      | cupom     | codigo         |
      | NAOEXISTE | CUPOM_INVALIDO |
      | VERAO2026 | CUPOM_EXPIRADO |

  @CT-043 @P1 @ui
  Cenário: Pedido com cupom inválido/expirado na interface não é confirmado
    Dado que tenho itens no carrinho e um cupom inválido
    Quando tento confirmar o pedido com dados válidos
    Então o pedido não é confirmado e a interface mostra o motivo

  @CT-044 @P1 @ui @api
  Esquema do Cenário: Validação do nome (nome e sobrenome obrigatórios)
    Quando confirmo o pedido com nome "<nome>"
    Então o resultado é "<resultado>"

    Exemplos:
      | nome           | resultado                    |
      | Maria Silva    | aceito                       |
      | Maria          | rejeitado (DADOS_INVALIDOS)  |
      | (vazio)        | rejeitado (DADOS_INVALIDOS)  |
      | "  Maria  "    | rejeitado (apenas um nome)   |
      | Maria de Souza | aceito                       |
      | José D'Ávila   | aceito (acentos e apóstrofo) |

  @CT-045 @P1 @ui @api
  Esquema do Cenário: Validação do formato do e-mail
    Quando confirmo o pedido com e-mail "<email>"
    Então o resultado é "<resultado>"

    Exemplos:
      | email              | resultado |
      | maria@exemplo.com  | aceito    |
      | maria@exemplo      | rejeitado |
      | maria.exemplo.com  | rejeitado |
      | @exemplo.com       | rejeitado |
      | maria@@exemplo.com | rejeitado |
      | (vazio)            | rejeitado |

  @CT-046 @P1 @ui @api
  Esquema do Cenário: Validação do CEP (8 dígitos, com ou sem hífen)
    Quando confirmo o pedido com CEP "<cep>"
    Então o resultado é "<resultado>"

    Exemplos:
      | cep       | resultado |
      | 01310-100 | aceito    |
      | 01310100  | aceito    |
      | 0131010   | rejeitado |
      | 013101000 | rejeitado |
      | 0131-0100 | rejeitado |
      | ABCDE-FGH | rejeitado |
      | (vazio)   | rejeitado |

  @CT-047 @P2 @api
  Cenário: Dados do cliente ausentes retornam DADOS_INVALIDOS
    Quando confirmo o pedido sem o objeto "cliente"
    Então o status é 422
    E o código de erro é "DADOS_INVALIDOS"

  @CT-048 @P2 @api
  Cenário: Vários dados do cliente inválidos retornam detalhes em "campos"
    Quando confirmo o pedido com nome "Maria", e-mail "x" e CEP "1"
    Então o status é 422
    E a resposta lista os três campos inválidos em "campos"

  @CT-049 @P2 @ui
  Cenário: Não existe etapa de pagamento online
    Quando percorro o fluxo até a confirmação
    Então não há etapa de pagamento online (pagamento na entrega)

  @CT-050 @P2 @ui
  Cenário: Clique duplo em "Confirmar pedido" não gera comportamento inesperado
    Dado que preenchi dados válidos
    Quando clico duas vezes rapidamente em confirmar
    Então a interface mostra uma única confirmação coerente
