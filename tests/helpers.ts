import { expect } from '@playwright/test';

/** Valor monetário correto: igual ao esperado E com no máximo 2 casas decimais (CA11). */
export function expectMoney(real: number, esperado: number, rotulo = 'valor') {
  expect(real, `${rotulo} deveria ser ${esperado}`).toBeCloseTo(esperado, 2);
  expect(
    Math.round(real * 100) / 100,
    `${rotulo} (${real}) tem mais de 2 casas decimais (erro de ponto flutuante)`,
  ).toBe(real);
}

export type Item = { produtoId: string; quantidade: unknown };

export const CLIENTE_VALIDO = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};
