# language: pt
@VZS-142 @quantidade
Funcionalidade: Limite de 5 unidades por produto
  Como loja
  Quero limitar a 5 unidades de cada produto por pedido
  Para evitar compras fora do padrão

  @CT-030 @CA10 @P1 @ui
  Cenário: Adicionar produto até o limite de 5 unidades
    Dado que o carrinho está vazio
    Quando altero a quantidade de "P004" para 5
    Então a quantidade fica em 5
    E o subtotal é R$ 249,50

  @CT-031 @CA10 @P1 @ui
  Cenário: Não permitir ultrapassar 5 unidades pela interface
    Dado que tenho 5 unidades de "P004" no carrinho
    Quando tento aumentar a quantidade para 6
    Então a quantidade permanece 5
    E a interface informa o limite (ou desabilita o aumento)

  @CT-032 @CA10 @P1 @ui
  Cenário: Adicionar o mesmo produto várias vezes respeita o limite acumulado
    Dado que tenho 4 unidades de "P001" no carrinho
    Quando adiciono "P001" ao carrinho mais 2 vezes
    Então a quantidade de "P001" no carrinho não passa de 5

  @CT-033 @CA10 @P2 @ui
  Cenário: O limite é por produto, não pelo carrinho
    Dado que tenho 5 unidades de "P001" no carrinho
    Quando adiciono 5 unidades de "P002" ao carrinho
    Então o carrinho tem 5x "P001" e 5x "P002"

  @CT-034 @CA10 @P1 @api
  Esquema do Cenário: Limite de quantidade validado na API (calcular e pedidos)
    Quando envio <quantidade> unidades de "P001" para <endpoint>
    Então o status é <status>
    E o código de erro é "<codigo>"

    Exemplos:
      | endpoint               | quantidade | status | codigo                     |
      | /api/carrinho/calcular | 1          | 200    |                            |
      | /api/carrinho/calcular | 5          | 200    |                            |
      | /api/carrinho/calcular | 6          | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |
      | /api/pedidos           | 5          | 201    |                            |
      | /api/pedidos           | 6          | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |

  @CT-035 @CA10 @P2 @api
  Esquema do Cenário: Quantidades inválidas retornam QUANTIDADE_INVALIDA
    Quando envio quantidade <valor> para "P001" em /api/carrinho/calcular
    Então o status é 422
    E o código de erro é "QUANTIDADE_INVALIDA"
    E o campo é "itens[0].quantidade"

    Exemplos:
      | valor | observação      |
      | 0     | zero            |
      | -1    | negativo        |
      | 1.5   | decimal         |
      | "2"   | string numérica |
      | null  | nulo            |
      | "abc" | texto           |

  @CT-036 @CA10 @P2 @api
  Cenário: Quantidade enorme é rejeitada pelo limite máximo
    Quando envio quantidade 999999999 para "P001" em /api/carrinho/calcular
    Então o status é 422
    E o código de erro é "QUANTIDADE_MAXIMA_EXCEDIDA"

  @CT-037 @P2 @api
  Cenário: Produto repetido na lista de itens retorna ITEM_DUPLICADO
    Quando envio "P001" duas vezes na lista de itens (1 unidade cada)
    Então o status é 422
    E o código de erro é "ITEM_DUPLICADO"
