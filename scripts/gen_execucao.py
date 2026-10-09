import re, glob
rows = []
for f in sorted(glob.glob("features/*.feature")):
    tags = []
    for line in open(f, encoding="utf-8"):
        s = line.strip()
        if s.startswith("@CT-"):
            tags = s.split()
        elif tags and (s.startswith("Cenário:") or s.startswith("Esquema do Cenário:")):
            title = s.split(":", 1)[1].strip()
            ct = next(t for t in tags if t.startswith("@CT-"))[1:]
            ca = ",".join(t[1:] for t in tags if re.match(r"@CA\d+", t)) or "-"
            pr = next((t[1:] for t in tags if t in ("@P1","@P2","@P3")), "-")
            tipo = "/".join(t[1:].upper() for t in tags if t in ("@ui","@api"))
            rows.append((ct, title, ca, pr, tipo, f.split("/")[-1]))
out = ["# Execução dos testes", "",
"> **Preencher durante a execução.** Status: ✅ Passou · ❌ Falhou · ⚠️ Passou com ressalva · ⏭️ Não executado.",
"> Em cada falha, referencie o bug em `03-bugs.md` e a evidência em `04-evidencias.md`.", "",
"- **Data/hora da execução:** ",
"- **Navegador/versão:** ",
"- **Sistema operacional:** ",
"- **Viewport:** ",
"- **Versão testada:** VZS-142 v2.3.0", "",
"## Resumo", "", "| Total | ✅ | ❌ | ⚠️ | ⏭️ |", "|---|---|---|---|---|", f"| {len(rows)} |  |  |  |  |", "",
"## Cenários", "",
"| ID | Cenário | CA | Prio | Tipo | Resultado obtido | Status | Bug | Evidência |",
"|----|---------|----|------|------|------------------|--------|-----|-----------|"]
for ct,t,ca,pr,tipo,f in rows:
    out.append(f"| {ct} | {t} | {ca} | {pr} | {tipo} |  | ⏭️ |  |  |")
out += ["", "## Testes exploratórios (sessões com tempo limitado)", "",
"Para cada sessão: missão, tempo, o que foi observado, bugs/dúvidas.", "",
"| ID | Missão (charter) | Tempo | Notas / achados | Bug |",
"|----|------------------|-------|-----------------|-----|",
"| EX-01 | Explorar o fluxo completo de compra (listar → carrinho → cupom → confirmar) como cliente real | 30 min |  |  |",
"| EX-02 | Explorar alterações no carrinho com cupom aplicado (quantidade, remover, adicionar, recarregar, voltar) | 30 min |  |  |",
"| EX-03 | Explorar entradas estranhas nos campos (cupom, nome, e-mail, CEP): espaços, acentos, emojis, textos longos, colar texto | 20 min |  |  |",
"| EX-04 | Explorar responsividade (360px, 768px, desktop) e navegação por teclado (Tab/Enter/Esc) | 20 min |  |  |",
"| EX-05 | Explorar consistência UI × API (valor mostrado na tela vs resposta de `/api/carrinho/calcular`) em 5 carrinhos aleatórios | 20 min |  |  |",
"| EX-06 | Explorar textos: ortografia, acentuação, mensagens de erro, formato de moeda e plural/singular | 15 min |  |  |", ""]
open("docs/02-execucao.md","w",encoding="utf-8").write("\n".join(out))
print(len(rows))
