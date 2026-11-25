"""Exporta cada aba de BASE_GESTAO_2026.xlsx para JSON (lista de linhas, com cabeçalho),
pronto para gravar na planilha Google com update_values em blocos.
Uso: python3 03_exportar_abas.py <BASE_GESTAO_2026.xlsx> <pasta_saida>"""
import sys, os, json, datetime as dt, openpyxl
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
wb = openpyxl.load_workbook(src)
for ws in wb.worksheets:
    if ws.title in ("LEIA-ME", "ROTINA", "CONFIG", "METAS", "EQUIPE"):  # abas verdes: a Aline edita direto na planilha
        continue
    rows = []
    for r in ws.iter_rows(values_only=True):
        rows.append([v.strftime("%d/%m/%Y") if isinstance(v, (dt.date, dt.datetime)) else ("" if v is None else v) for v in r])
    json.dump(rows, open(os.path.join(out, f"{ws.title}.json"), "w"), ensure_ascii=False)
    print(ws.title, len(rows) - 1, "linhas")
