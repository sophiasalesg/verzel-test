import { test, expect } from '@playwright/test';
import { expectMoney, Item } from './helpers';

const calcular = (request: any, itens: Item[], cupom?: unknown) =>
  request.post('/api/carrinho/calcular', {
    headers: { 'Content-Type': 'application/json' },
    data: cupom === undefined ? { itens } : { itens, cupom },
  });

test.describe('Cupom de desconto (CA01-CA05, CA09)', () => {
  test('CT-001 BEMVINDO10 aplica 10% sobre o subtotal', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'BEMVINDO10');
    expect(res.status()).toBe(200);
    const b = await res.json();
    expectMoney(b.subtotal, 100, 'subtotal');
    expectMoney(b.desconto, 10, 'desconto');
    expectMoney(b.frete, 19.9, 'frete');
    expectMoney(b.total, 109.9, 'total');
    expect(b.cupom.aplicado).toBe(true);
    expect(b.cupom.mensagem).toBe('Cupom aplicado: 10% de desconto nos produtos.');
  });

  for (const codigo of ['bemvindo10', 'BemVindo10', '  BEMVINDO10', 'BEMVINDO10  ', '  bemvindo10  ']) {
    test(`CT-002 código "${codigo}" é aceito (case-insensitive, trim)`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], codigo);
      expect(res.status()).toBe(200);
      const b = await res.json();
      expect(b.cupom.aplicado, JSON.stringify(b.cupom)).toBe(true);
      expectMoney(b.desconto, 10, 'desconto');
    });
  }

  test('CT-003 cupom inexistente -> "Cupom inválido." sem desconto', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'NAOEXISTE');
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.cupom.aplicado).toBe(false);
    expect(b.cupom.mensagem).toBe('Cupom inválido.');
    expectMoney(b.desconto, 0, 'desconto');
    expectMoney(b.total, 119.9, 'total');
  });

  test('CT-004 cupom expirado -> "Cupom expirado." sem desconto', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], 'VERAO2026');
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.cupom.aplicado).toBe(false);
    expect(b.cupom.mensagem).toBe('Cupom expirado.');
    expectMoney(b.desconto, 0, 'desconto');
    expectMoney(b.total, 119.9, 'total');
  });

  for (const codigo of ['BEMVINDO 10', 'BEMVINDO1', 'BEMVINDO100', 'BEM-VINDO10', 'BEMVINDO10!']) {
    test(`CT-005 código malformado "${codigo}" é inválido`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P005', quantidade: 1 }], codigo);
      expect(res.status()).toBe(200);
      const b = await res.json();
      expect(b.cupom.aplicado).toBe(false);
      expect(b.cupom.mensagem).toBe('Cupom inválido.');
      expectMoney(b.desconto, 0, 'desconto');
    });
  }

  test('CT-010 desconto não incide sobre o frete', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P001', quantidade: 1 }], 'BEMVINDO10');
    const b = await res.json();
    expectMoney(b.desconto, 5.99, 'desconto');
    expectMoney(b.frete, 19.9, 'frete');
    expectMoney(b.total, 73.81, 'total');
  });

  test('CT-011 múltiplos itens e quantidades com cupom', async ({ request }) => {
    const res = await calcular(
      request,
      [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P004', quantidade: 2 }],
      'BEMVINDO10',
    );
    const b = await res.json();
    expectMoney(b.subtotal, 239.7, 'subtotal');
    expectMoney(b.desconto, 23.97, 'desconto');
    expectMoney(b.frete, 0, 'frete');
    expectMoney(b.total, 215.73, 'total');
  });
});

test.describe('Frete grátis (CA06-CA08)', () => {
  const casos: Array<[string, Item[], number, number, number]> = [
    ['1x P006', [{ produtoId: 'P006', quantidade: 1 }], 29.9, 19.9, 170.1],
    ['1x P001', [{ produtoId: 'P001', quantidade: 1 }], 59.9, 19.9, 140.1],
    ['4x P004 (R$ 0,40 abaixo)', [{ produtoId: 'P004', quantidade: 4 }], 199.6, 19.9, 0.4],
    [
      'P001+P002 (R$ 0,20 abaixo)',
      [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }],
      199.8, 19.9, 0.2,
    ],
    ['2x P005 (exatamente 200,00)', [{ produtoId: 'P005', quantidade: 2 }], 200, 0, 0],
    ['4x P008 (exatamente 200,00)', [{ produtoId: 'P008', quantidade: 4 }], 200, 0, 0],
    [
      'P003+P006 (acima)',
      [{ produtoId: 'P003', quantidade: 1 }, { produtoId: 'P006', quantidade: 1 }],
      219.8, 0, 0,
    ],
    ['1x P007', [{ produtoId: 'P007', quantidade: 1 }], 229.9, 0, 0],
  ];

  for (const [nome, itens, subtotal, frete, faltante] of casos) {
    test(`CT-020 ${nome}`, async ({ request }) => {
      const res = await calcular(request, itens);
      expect(res.status()).toBe(200);
      const b = await res.json();
      expectMoney(b.subtotal, subtotal, 'subtotal');
      expectMoney(b.frete, frete, 'frete');
      expectMoney(b.valorFaltanteFreteGratis, faltante, 'valorFaltanteFreteGratis');
      expect(b.freteGratis).toBe(frete === 0);
    });
  }

  test('CT-023 frete grátis considera o subtotal ANTES do cupom', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P005', quantidade: 2 }], 'BEMVINDO10');
    const b = await res.json();
    expectMoney(b.desconto, 20, 'desconto');
    expectMoney(b.frete, 0, 'frete');
    expectMoney(b.total, 180, 'total');
    expect(b.freteGratis).toBe(true);
  });

  test('CT-024 subtotal 199,80 com cupom continua pagando frete', async ({ request }) => {
    const res = await calcular(
      request,
      [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }],
      'BEMVINDO10',
    );
    const b = await res.json();
    expectMoney(b.desconto, 19.98, 'desconto');
    expectMoney(b.frete, 19.9, 'frete');
    expectMoney(b.total, 199.72, 'total');
  });

  test('CT-025 subtotal 219,80 com cupom mantém frete grátis (total < 200)', async ({ request }) => {
    const res = await calcular(
      request,
      [{ produtoId: 'P003', quantidade: 1 }, { produtoId: 'P006', quantidade: 1 }],
      'BEMVINDO10',
    );
    const b = await res.json();
    expectMoney(b.desconto, 21.98, 'desconto');
    expectMoney(b.frete, 0, 'frete');
    expectMoney(b.total, 197.82, 'total');
  });

  for (const [id, qtd, subtotal, total] of [
    ['P001', 3, 179.7, 199.6],
    ['P002', 3, 419.7, 419.7],
    ['P006', 3, 89.7, 109.6],
    ['P004', 3, 149.7, 169.6],
  ] as const) {
    test(`CT-026 sem erro de ponto flutuante: ${qtd}x ${id}`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: id, quantidade: qtd }]);
      const b = await res.json();
      expectMoney(b.subtotal, subtotal, 'subtotal');
      expectMoney(b.total, total, 'total');
      expectMoney(b.itens[0].total, subtotal, 'itens[0].total');
    });
  }
});

test.describe('Limite de quantidade (CA10)', () => {
  for (const q of [1, 5]) {
    test(`CT-034 quantidade ${q} é aceita`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P001', quantidade: q }]);
      expect(res.status()).toBe(200);
    });
  }

  test('CT-034 quantidade 6 retorna 422 QUANTIDADE_MAXIMA_EXCEDIDA', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P001', quantidade: 6 }]);
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  for (const valor of [0, -1, 1.5, '2', null, 'abc']) {
    test(`CT-035 quantidade ${JSON.stringify(valor)} retorna QUANTIDADE_INVALIDA`, async ({ request }) => {
      const res = await calcular(request, [{ produtoId: 'P001', quantidade: valor }]);
      expect(res.status()).toBe(422);
      const e = (await res.json()).erro;
      expect(e.codigo).toBe('QUANTIDADE_INVALIDA');
      expect(e.campo).toBe('itens[0].quantidade');
    });
  }

  test('CT-036 quantidade enorme é rejeitada', async ({ request }) => {
    const res = await calcular(request, [{ produtoId: 'P001', quantidade: 999999999 }]);
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('CT-037 produto repetido retorna ITEM_DUPLICADO', async ({ request }) => {
    const res = await calcular(request, [
      { produtoId: 'P001', quantidade: 1 },
      { produtoId: 'P001', quantidade: 1 },
    ]);
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('ITEM_DUPLICADO');
  });
});
