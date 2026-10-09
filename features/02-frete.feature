# language: pt
@VZS-142 @frete
Funcionalidade: Regra de frete grátis
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores
  Para pagar menos nas minhas compras

  @CT-020 @CA06 @CA07 @P1 @ui @api
  Esquema do Cenário: Frete e valor faltante conforme o subtotal (valores-limite)
    Dado que tenho no carrinho <itens>
    Então o subtotal é R$ <subtotal>
    E o frete é R$ <frete>
    E o valor faltante para frete grátis é R$ <faltante>

    Exemplos:
      | itens             | subtotal | frete | faltante | observação                  |
      | 1x P006           | 29,90    | 19,90 | 170,10   | subtotal baixo              |
      | 1x P001           | 59,90    | 19,90 | 140,10   | subtotal médio              |
      | 4x P004           | 199,60   | 19,90 | 0,40     | R$ 0,40 abaixo do limite    |
      | 1x P001 + 1x P002 | 199,80   | 19,90 | 0,20     | R$ 0,20 abaixo do limite    |
      | 2x P005           | 200,00   | 0,00  | 0,00     | exatamente no limite (CA06) |
      | 4x P008           | 200,00   | 0,00  | 0,00     | exatamente no limite        |
      | 1x P003 + 1x P006 | 219,80   | 0,00  | 0,00     | acima do limite             |
      | 1x P007           | 229,90   | 0,00  | 0,00     | um item acima do limite     |

  @CT-021 @CA07 @P1 @ui
  Cenário: Carrinho informa quanto falta para o frete grátis
    Dado que tenho no carrinho 1 unidade de "P001" (R$ 59,90)
    Então o carrinho informa que faltam R$ 140,10 para o frete grátis

  @CT-022 @CA07 @P2 @ui
  Cenário: Aviso de "falta para o frete grátis" some ao atingir R$ 200,00
    Dado que tenho no carrinho 1 unidade de "P005" (R$ 100,00)
    Quando altero a quantidade de "P005" para 2
    Então o aviso de valor faltante deixa de ser exibido (ou indica frete grátis)
    E o frete é R$ 0,00

  @CT-023 @CA08 @P1 @ui @api
  Cenário: Frete grátis considera o subtotal ANTES do cupom
    Dado que tenho no carrinho 2 unidades de "P005" (subtotal R$ 200,00)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 20,00
    E o frete é R$ 0,00
    E o total é R$ 180,00

  @CT-024 @CA08 @P1 @ui @api
  Cenário: Subtotal abaixo de R$ 200,00 com cupom continua pagando frete
    Dado que tenho no carrinho 1 unidade de "P001" e 1 unidade de "P002" (subtotal R$ 199,80)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 19,98
    E o frete é R$ 19,90
    E o total é R$ 199,72

  @CT-025 @CA08 @P2 @ui @api
  Cenário: Total final abaixo de R$ 200,00 mas subtotal acima mantém frete grátis
    Dado que tenho no carrinho 1 unidade de "P003" e 1 unidade de "P006" (subtotal R$ 219,80)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 21,98
    E o frete é R$ 0,00
    E o total é R$ 197,82

  @CT-026 @CA11 @P1 @api @ui
  Esquema do Cenário: Valores monetários sem erro de ponto flutuante (2 casas decimais)
    Dado que tenho no carrinho <itens>
    Então o subtotal é exatamente <subtotal> (sem casas extras como 179.70000000000002)
    E o total é exatamente <total>

    Exemplos:
      | itens   | subtotal | total |
      | 3x P001 | 179.7    | 199.6 |
      | 3x P002 | 419.7    | 419.7 |
      | 3x P006 | 89.7     | 109.6 |
      | 3x P004 | 149.7    | 169.6 |

  @CT-027 @CA06 @P3 @ui
  Cenário: Exibição de valores no formato brasileiro
    Dado que tenho no carrinho 5 unidades de "P007" (R$ 1.149,50)
    Então os valores aparecem como "R$ 1.149,50" (separador de milhar e vírgula decimal)
