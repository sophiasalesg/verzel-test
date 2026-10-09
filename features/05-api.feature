# language: pt
@VZS-142 @api
Funcionalidade: Contrato da API (rotas, métodos e erros)
  Como consumidor da API
  Quero respostas previsíveis e padronizadas
  Para integrar com segurança

  @CT-060 @P1 @api
  Cenário: Listar produtos
    Quando faço GET em "/api/produtos"
    Então o status é 200
    E recebo 8 produtos (P001 a P008) com id, nome, descricao, categoria e preco
    E os preços batem com a tabela da documentação

  @CT-061 @P2 @api
  Cenário: Consultar produto existente
    Quando faço GET em "/api/produtos/P001"
    Então o status é 200
    E o produto é "Camiseta Essencial" com preço 59.9

  @CT-062 @P2 @api
  Esquema do Cenário: Consultar produto inexistente
    Quando faço GET em "/api/produtos/<id>"
    Então o status é 404
    E o código de erro é "PRODUTO_NAO_ENCONTRADO"

    Exemplos:
      | id   |
      | P999 |
      | p001 |
      | 0    |

  @CT-063 @P2 @api
  Cenário: Rota inexistente
    Quando faço GET em "/api/naoexiste"
    Então o status é 404
    E o código de erro é "ROTA_NAO_ENCONTRADA"

  @CT-064 @P2 @api
  Esquema do Cenário: Método HTTP não permitido
    Quando faço <metodo> em "<rota>"
    Então o status é 405
    E o código de erro é "METODO_NAO_PERMITIDO"

    Exemplos:
      | metodo | rota                   |
      | POST   | /api/produtos          |
      | DELETE | /api/produtos/P001     |
      | GET    | /api/carrinho/calcular |
      | GET    | /api/pedidos           |
      | PUT    | /api/pedidos           |

  @CT-065 @P2 @api
  Esquema do Cenário: Corpo da requisição que não é um objeto JSON válido
    Quando faço POST em "<rota>" com o corpo "<corpo>"
    Então o status é 400
    E o código de erro é "JSON_INVALIDO"

    Exemplos:
      | rota                   | corpo     |
      | /api/carrinho/calcular | {invalido |
      | /api/carrinho/calcular | (vazio)   |
      | /api/pedidos           | {invalido |
      | /api/carrinho/calcular | [1,2,3]   |

  @CT-066 @P1 @api
  Esquema do Cenário: Lista de itens ausente ou vazia
    Quando calculo o carrinho com itens "<itens>"
    Então o status é 422
    E o código de erro é "ITENS_OBRIGATORIOS"

    Exemplos:
      | itens     |
      | (ausente) |
      | []        |
      | null      |

  @CT-067 @P2 @api
  Esquema do Cenário: Item que não é objeto com produtoId e quantidade
    Quando calculo o carrinho com itens <itens>
    Então o status é 422
    E o código de erro é "ITEM_INVALIDO"

    Exemplos:
      | itens                  |
      | ["P001"]               |
      | [{"produtoId":"P001"}] |
      | [{"quantidade":1}]     |
      | [null]                 |

  @CT-068 @P1 @api
  Cenário: Produto inexistente na lista de itens
    Quando calculo o carrinho com 1 unidade de "P999"
    Então o status é 422
    E o código de erro é "PRODUTO_NAO_ENCONTRADO"
    E o campo aponta o item inválido

  @CT-069 @P3 @api
  Cenário: Erros seguem o formato padrão
    Quando provoco qualquer erro da API
    Então o corpo tem "erro.codigo" e "erro.mensagem" e a mensagem está em português legível
    E o Content-Type da resposta é application/json

  @CT-070 @CA02 @P2 @api
  Esquema do Cenário: Tipos inesperados no campo cupom
    Quando calculo o carrinho com cupom <cupom>
    Então a API não retorna erro 5xx

    Exemplos:
      | cupom          |
      | null           |
      | ""             |
      | 123            |
      | ["BEMVINDO10"] |
