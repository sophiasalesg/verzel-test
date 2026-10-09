import { test, expect } from '@playwright/test';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

test.describe('Contrato da API', () => {
  test('CT-060 GET /api/produtos lista 8 produtos com preços corretos', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);
    const lista = await res.json();
    expect(lista).toHaveLength(8);
    const precos: Record<string, number> = {
      P001: 59.9, P002: 139.9, P003: 189.9, P004: 49.9,
      P005: 100, P006: 29.9, P007: 229.9, P008: 50,
    };
    for (const p of lista) {
      expect(Object.keys(p)).toEqual(expect.arrayContaining(['id', 'nome', 'descricao', 'categoria', 'preco']));
      expect(p.preco, p.id).toBe(precos[p.id]);
    }
  });

  test('CT-061 GET /api/produtos/P001', async ({ request }) => {
    const res = await request.get('/api/produtos/P001');
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.nome).toBe('Camiseta Essencial');
    expect(p.preco).toBe(59.9);
  });

  for (const id of ['P999', 'p001', '0']) {
    test(`CT-062 produto inexistente "${id}" -> 404 PRODUTO_NAO_ENCONTRADO`, async ({ request }) => {
      const res = await request.get(`/api/produtos/${id}`);
      expect(res.status()).toBe(404);
      expect((await res.json()).erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
    });
  }

  test('CT-063 rota inexistente -> 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    const res = await request.get('/api/naoexiste');
    expect(res.status()).toBe(404);
    expect((await res.json()).erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });

  const metodos: Array<['post' | 'delete' | 'get' | 'put', string]> = [
    ['post', '/api/produtos'], ['delete', '/api/produtos/P001'],
    ['get', '/api/carrinho/calcular'], ['get', '/api/pedidos'], ['put', '/api/pedidos'],
  ];
  for (const [metodo, rota] of metodos) {
    test(`CT-064 ${metodo.toUpperCase()} ${rota} -> 405 METODO_NAO_PERMITIDO`, async ({ request }) => {
      const res = await request[metodo](rota);
      expect(res.status()).toBe(405);
      expect((await res.json()).erro.codigo).toBe('METODO_NAO_PERMITIDO');
    });
  }

  const corposInvalidos: Array<[string, string]> = [
    ['/api/carrinho/calcular', '{invalido'],
    ['/api/carrinho/calcular', ''],
    ['/api/pedidos', '{invalido'],
    ['/api/carrinho/calcular', '[1,2,3]'],
  ];
  for (const [rota, corpo] of corposInvalidos) {
    test(`CT-065 POST ${rota} com corpo ${JSON.stringify(corpo)} -> 400 JSON_INVALIDO`, async ({ request }) => {
      const res = await request.post(rota, { headers: JSON_HEADERS, data: corpo });
      expect(res.status()).toBe(400);
      expect((await res.json()).erro.codigo).toBe('JSON_INVALIDO');
    });
  }

  const semItens: Array<[string, unknown]> = [
    ['ausente', {}], ['vazio', { itens: [] }], ['null', { itens: null }],
  ];
  for (const [nome, corpo] of semItens) {
    test(`CT-066 itens ${nome} -> 422 ITENS_OBRIGATORIOS`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { headers: JSON_HEADERS, data: corpo });
      expect(res.status()).toBe(422);
      expect((await res.json()).erro.codigo).toBe('ITENS_OBRIGATORIOS');
    });
  }

  const itensInvalidos: unknown[] = [['P001'], [{ produtoId: 'P001' }], [{ quantidade: 1 }], [null]];
  for (const itens of itensInvalidos) {
    test(`CT-067 itens ${JSON.stringify(itens)} -> 422 ITEM_INVALIDO`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { headers: JSON_HEADERS, data: { itens } });
      expect(res.status()).toBe(422);
      expect((await res.json()).erro.codigo).toBe('ITEM_INVALIDO');
    });
  }

  test('CT-068 produto inexistente na lista -> 422 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      headers: JSON_HEADERS,
      data: { itens: [{ produtoId: 'P999', quantidade: 1 }] },
    });
    expect(res.status()).toBe(422);
    const e = (await res.json()).erro;
    expect(e.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
    expect(e.campo).toContain('itens[0]');
  });

  test('CT-069 erros seguem o formato padrão e são JSON', async ({ request }) => {
    const res = await request.get('/api/naoexiste');
    expect(res.headers()['content-type']).toContain('application/json');
    const e = (await res.json()).erro;
    expect(typeof e.codigo).toBe('string');
    expect(typeof e.mensagem).toBe('string');
  });

  for (const cupom of [null, '', 123, ['BEMVINDO10']]) {
    test(`CT-070 cupom ${JSON.stringify(cupom)} não causa erro 5xx`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', {
        headers: JSON_HEADERS,
        data: { itens: [{ produtoId: 'P005', quantidade: 1 }], cupom },
      });
      expect(res.status(), await res.text()).toBeLessThan(500);
    });
  }
});
