import { test, expect } from '@playwright/test';

/**
 * TESTES DE UI - ESQUELETO
 *
 * Os seletores abaixo (getByRole/getByLabel/getByText) são palpites baseados na
 * documentação. Abra a loja, inspecione os elementos reais (DevTools) e AJUSTE
 * os seletores antes de remover o `test.fixme`.
 *
 * Cenários sugeridos para automatizar na UI (alto valor): CT-001, CT-023, CT-031.
 */

test.describe('UI - cupom e frete', () => {
  test.fixme('CT-001 aplicar BEMVINDO10 mostra 10% de desconto', async ({ page }) => {
    await page.goto('/');
    // TODO: adicionar P005 ao carrinho (ajustar seletores)
    await page.getByRole('button', { name: /adicionar/i }).nth(4).click();
    // TODO: abrir o carrinho
    await page.getByRole('button', { name: /carrinho/i }).click();
    // TODO: aplicar o cupom
    await page.getByLabel(/cupom/i).fill('BEMVINDO10');
    await page.getByRole('button', { name: /aplicar/i }).click();
    await expect(page.getByText('Cupom aplicado: 10% de desconto nos produtos.')).toBeVisible();
    await expect(page.getByText(/R\$\s*10,00/)).toBeVisible();
    await expect(page.getByText(/R\$\s*109,90/)).toBeVisible();
  });

  test.fixme('CT-031 não permite passar de 5 unidades', async ({ page }) => {
    await page.goto('/');
    // TODO: adicionar o mesmo produto 6 vezes e verificar que a quantidade fica em 5
  });
});
