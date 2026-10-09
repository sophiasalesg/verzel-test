# language: pt
@VZS-142 @cupom
Funcionalidade: Aplicação de cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  @CT-001 @CA01 @P1 @ui @api
  Cenário: BEMVINDO10 concede 10% de desconto sobre o subtotal
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando aplico o cupom "BEMVINDO10"
    Então vejo a mensagem "Cupom aplicado: 10% de desconto nos produtos."
    E o subtotal é R$ 100,00
    E o desconto é R$ 10,00
    E o frete é R$ 19,90
    E o total é R$ 109,90

  @CT-002 @CA02 @P1 @ui @api
  Esquema do Cenário: Código do cupom ignora maiúsculas/minúsculas e espaços nas pontas
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando aplico o cupom "<codigo>"
    Então o cupom é aplicado com desconto de R$ 10,00

    Exemplos:
      | codigo            |
      | bemvindo10        |
      | BemVindo10        |
      | "  BEMVINDO10"    |
      | "BEMVINDO10  "    |
      | "  bemvindo10  "  |

  @CT-003 @CA03 @P1 @ui @api
  Cenário: Cupom inexistente exibe "Cupom inválido." e não aplica desconto
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando aplico o cupom "NAOEXISTE"
    Então vejo a mensagem "Cupom inválido."
    E o desconto é R$ 0,00
    E o total é R$ 119,90

  @CT-004 @CA04 @P1 @ui @api
  Cenário: Cupom expirado exibe "Cupom expirado." e não aplica desconto
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."
    E o desconto é R$ 0,00
    E o total é R$ 119,90

  @CT-005 @CA02 @CA03 @P2 @ui @api
  Esquema do Cenário: Códigos malformados são tratados como cupom inválido
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando aplico o cupom "<codigo>"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado

    Exemplos:
      | codigo       | observação         |
      | BEMVINDO 10  | espaço no meio     |
      | BEMVINDO1    | truncado           |
      | BEMVINDO100  | caractere a mais   |
      | BEM-VINDO10  | hífen              |
      | BEMVINDO10!  | caractere especial |

  @CT-006 @CA02 @P2 @ui
  Cenário: Aplicar cupom vazio ou só com espaços não altera o carrinho
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando tento aplicar o cupom "   "
    Então nenhum desconto é aplicado
    E a interface não apresenta erro inesperado

  @CT-007 @CA05 @P1 @ui
  Cenário: Apenas um cupom por vez - não é possível aplicar outro sem remover o atual
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    E apliquei o cupom "BEMVINDO10"
    Quando tento aplicar o cupom "VERAO2026"
    Então o cupom "BEMVINDO10" continua aplicado
    E o desconto continua sendo R$ 10,00

  @CT-008 @CA05 @P1 @ui
  Cenário: Trocar de cupom removendo o atual e aplicando outro
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    E apliquei o cupom "BEMVINDO10"
    Quando removo o cupom atual
    Então o desconto volta a ser R$ 0,00
    E o total volta a ser R$ 119,90
    Quando aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."

  @CT-009 @CA01 @P2 @ui
  Cenário: Desconto é recalculado ao alterar a quantidade com cupom aplicado
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    E apliquei o cupom "BEMVINDO10"
    Quando altero a quantidade de "P005" para 3
    Então o subtotal é R$ 300,00
    E o desconto é R$ 30,00
    E o frete é R$ 0,00
    E o total é R$ 270,00

  @CT-010 @CA09 @P1 @ui @api
  Cenário: Desconto do cupom não incide sobre o frete
    Dado que tenho no carrinho 1 unidade de "P001" (R$ 59,90)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 5,99
    E o frete é R$ 19,90
    E o total é R$ 73,81

  @CT-011 @CA01 @CA11 @P2 @ui @api
  Cenário: Desconto sobre subtotal com múltiplos itens e quantidades
    Dado que tenho no carrinho 1 unidade de "P002" e 2 unidades de "P004"
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 239,70
    E o desconto é R$ 23,97
    E o frete é R$ 0,00
    E o total é R$ 215,73

  @CT-012 @CA03 @CA04 @P2 @api
  Cenário: Em /api/carrinho/calcular cupom inválido/expirado responde 200 sem erro
    Quando calculo o carrinho com cupom "NAOEXISTE"
    Então o status é 200
    E cupom.aplicado é false e cupom.mensagem é "Cupom inválido."
    Quando calculo o carrinho com cupom "VERAO2026"
    Então o status é 200
    E cupom.aplicado é false e cupom.mensagem é "Cupom expirado."

  @CT-013 @CA01 @P2 @ui
  Cenário: Cupom aplicado se mantém ao recarregar a página na mesma aba
    Dado que apliquei o cupom "BEMVINDO10" com 1 unidade de "P005" no carrinho
    Quando recarrego a página
    Então o carrinho e o cupom aplicado continuam iguais (ver premissa PR-05)

  @CT-014 @CA01 @P2 @ui
  Cenário: Remover todos os itens com cupom aplicado
    Dado que apliquei o cupom "BEMVINDO10" com 1 unidade de "P005" no carrinho
    Quando removo o item do carrinho
    Então o carrinho vazio é exibido sem desconto e sem erros (ver premissa PR-06)
