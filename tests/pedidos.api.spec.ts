import { test, expect } from '@playwright/test';
import { expectMoney, CLIENTE_VALIDO } from './helpers';

const pedir = (request: any, corpo: unknown) =>
  request.post('/api/pedidos', { headers: { 'Content-Type': 'application/json' }, data: corpo });

const itens = [{ produtoId: 'P005', quantidade: 1 }];

test.describe('Pedidos', () => {
  test('CT-040 pedido válido com cupom retorna 201 e número VZ-000000', async ({ request }) => {
    const res = await pedir(request, { cliente: CLIENTE_VALIDO, itens, cupom: 'BEMVINDO10' });
    expect(res.status()).toBe(201);
    const b = await res.json();
    expect(b.numero).toMatch(/^VZ-\d{6}$/);
    expect(b.cliente.cep).toBe('01310100');
    expectMoney(b.subtotal, 100, 'subtotal');
    expectMoney(b.desconto, 10, 'desconto');
    expectMoney(b.frete, 19.9, 'frete');
    expectMoney(b.total, 109.9, 'total');
  });

  test('CT-041 valores do pedido = valores do cálculo do carrinho', async ({ request }) => {
    const calc = await (
      await request.post('/api/carrinho/calcular', {
        headers: { 'Content-Type': 'application/json' },
        data: { itens, cupom: 'BEMVINDO10' },
      })
    ).json();
    const ped = await (await pedir(request, { cliente: CLIENTE_VALIDO, itens, cupom: 'BEMVINDO10' })).json();
    for (const campo of ['subtotal', 'desconto', 'frete', 'freteGratis', 'valorFaltanteFreteGratis', 'total']) {
      expect(ped[campo], campo).toBe(calc[campo]);
    }
  });

  for (const [cupom, codigo] of [
    ['NAOEXISTE', 'CUPOM_INVALIDO'],
    ['VERAO2026', 'CUPOM_EXPIRADO'],
  ]) {
    test(`CT-042 pedido com cupom ${cupom} retorna 422 ${codigo}`, async ({ request }) => {
      const res = await pedir(request, { cliente: CLIENTE_VALIDO, itens, cupom });
      expect(res.status()).toBe(422);
      expect((await res.json()).erro.codigo).toBe(codigo);
    });
  }

  test('CT-034 pedido com 6 unidades é rejeitado (limite vale na API)', async ({ request }) => {
    const res = await pedir(request, { cliente: CLIENTE_VALIDO, itens: [{ produtoId: 'P001', quantidade: 6 }] });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  const nomes: Array<[string, boolean]> = [
    ['Maria Silva', true], ['Maria de Souza', true], ["José D'Ávila", true],
    ['Maria', false], ['', false], ['  Maria  ', false],
  ];
  for (const [nome, ok] of nomes) {
    test(`CT-044 nome ${JSON.stringify(nome)} -> ${ok ? 'aceito' : 'rejeitado'}`, async ({ request }) => {
      const res = await pedir(request, { cliente: { ...CLIENTE_VALIDO, nome }, itens });
      expect(res.status()).toBe(ok ? 201 : 422);
      if (!ok) expect((await res.json()).erro.codigo).toBe('DADOS_INVALIDOS');
    });
  }

  const emails: Array<[string, boolean]> = [
    ['maria@exemplo.com', true], ['maria@exemplo', false], ['maria.exemplo.com', false],
    ['@exemplo.com', false], ['maria@@exemplo.com', false], ['', false],
  ];
  for (const [email, ok] of emails) {
    test(`CT-045 e-mail ${JSON.stringify(email)} -> ${ok ? 'aceito' : 'rejeitado'}`, async ({ request }) => {
      const res = await pedir(request, { cliente: { ...CLIENTE_VALIDO, email }, itens });
      expect(res.status()).toBe(ok ? 201 : 422);
    });
  }

  const ceps: Array<[string, boolean]> = [
    ['01310-100', true], ['01310100', true], ['0131010', false],
    ['013101000', false], ['0131-0100', false], ['ABCDE-FGH', false], ['', false],
  ];
  for (const [cep, ok] of ceps) {
    test(`CT-046 CEP ${JSON.stringify(cep)} -> ${ok ? 'aceito' : 'rejeitado'}`, async ({ request }) => {
      const res = await pedir(request, { cliente: { ...CLIENTE_VALIDO, cep }, itens });
      expect(res.status()).toBe(ok ? 201 : 422);
    });
  }

  test('CT-047 sem objeto cliente -> DADOS_INVALIDOS', async ({ request }) => {
    const res = await pedir(request, { itens });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('DADOS_INVALIDOS');
  });

  test('CT-048 vários campos inválidos listados em "campos"', async ({ request }) => {
    const res = await pedir(request, { cliente: { nome: 'Maria', email: 'x', cep: '1' }, itens });
    expect(res.status()).toBe(422);
    const e = (await res.json()).erro;
    expect(e.codigo).toBe('DADOS_INVALIDOS');
    console.log('Formato de erro.campos observado:', JSON.stringify(e.campos ?? (await res.json())));
    expect(e.campos ?? (await res.json()).campos, 'detalhes dos campos inválidos').toBeTruthy();
  });
});
