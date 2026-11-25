import sys, json, openpyxl, datetime as dt, collections, warnings
from openpyxl.styles import Font, PatternFill, Alignment
warnings.filterwarnings("ignore")
S=sys.argv[1]; HOJE=dt.date.today()
cx=json.load(open(f"{S}/caixa/caixa.json"))
fin=openpyxl.load_workbook(f"{S}/fin/financeiro.xlsx", data_only=True)
pt=openpyxl.load_workbook(f"{S}/ponto/ponto.xlsx", data_only=True).worksheets[0]
CODE={"cod 46":"Jhennifer","cod 47":"Wanessa","cod 6":"Cód. 6"}
wb=openpyxl.Workbook(); wb.remove(wb.active)
HDR=Font(bold=True,color="FFFFFF"); FILL=PatternFill("solid",fgColor="5B2148")
def sheet(name, header, rows, widths=None):
    ws=wb.create_sheet(name); ws.append(header)
    for c in ws[1]: c.font=HDR; c.fill=FILL; c.alignment=Alignment(horizontal="center")
    for r in rows: ws.append(r)
    ws.freeze_panes="A2"
    for i,w in enumerate(widths or [14]*len(header)): ws.column_dimensions[openpyxl.utils.get_column_letter(i+1)].width=w
    return ws
d=lambda s: dt.datetime.strptime(s,"%Y-%m-%d").date()

# LEIA-ME
ws=wb.create_sheet("LEIA-ME")
for r in [["BASE GESTÃO 2026 · CUTELARIA JONAS"],[""],
 ["Esta planilha alimenta o Painel de Gestão. Cada aba é uma tabela simples (1 linha = 1 registro)."],[""],
 ["ABA","O QUE TEM","DE ONDE VEM","QUEM ATUALIZA"],
 ["CONFIG","Metas do mês, regra de compra, jornada","Definido pela Aline","Aline"],
 ["EQUIPE","Funcionárias, código no caixa, jornada","Aline","Aline"],
 ["VENDAS_DIA","Venda bruta por dia e vendedora","Planilhas de caixa mensais (Thay)","Claude, diário"],
 ["AFIACAO","Afiação de alicate e entregas por forma de pagamento","Planilhas de caixa mensais","Claude, diário"],
 ["RETIRADAS","Sangrias e retiradas do caixa","Planilhas de caixa mensais","Claude, diário"],
 ["RECEITAS","Entradas líquidas (dinheiro, cartão, Pix)","FINANCEIRO_2026 > RECEITAS","Claude, diário"],
 ["CONTAS","Contas a pagar e pagas, por vencimento","FINANCEIRO_2026 > CONTAS","Claude, diário"],
 ["DRE_MENSAL","Resultado mês a mês","FINANCEIRO_2026 > DRE2026","Claude, diário"],
 ["PONTO","Jornada por dia e funcionária: horas, atraso, saldo","Formulário de ponto LJ2","Claude, diário"],
 [""],["Regras do ponto: seg–sex 08:30–18:00 com 1h30 de almoço (8h); sábado 08:30–12:30 (4h)."],
 ["Tolerância CLT (art. 58 §1º): variações de até 10 min no dia não contam como atraso nem extra."],
 ["Lanche/descanso conta como tempo trabalhado. Almoço não conta."],
 ["Poder de compra = meta do mês × 45% − TODOS os boletos de fornecedor que vencem no mês (pagos ou não)."],
 [f"Base gerada em {HOJE.strftime('%d/%m/%Y')} a partir dos arquivos originais, que não foram alterados."]]:
    ws.append(r)
ws["A1"].font=Font(bold=True,size=14); ws.column_dimensions["A"].width=16; ws.column_dimensions["B"].width=52; ws.column_dimensions["C"].width=36; ws.column_dimensions["D"].width=18
for c in ws[5]: c.font=Font(bold=True)

# CONFIG + METAS
v=fin["VENDAS"]
metas=[]
for i,m in enumerate(range(5,17)):
    metas.append([f"2026-{i+1:02d}", v.cell(m,7).value or 0, v.cell(m,6).value or 0])
metas[10][1]=79000  # meta oficial de novembro (Aline, 24/11)
# Se a rotina baixou a aba METAS da base (editada pela Aline), ela manda.
import os
if os.path.exists(f"{S}/metas_base.json"):
    mb={r[0]:r for r in json.load(open(f"{S}/metas_base.json"))[1:] if r and r[0]}
    metas=[[m, float(str(mb[m][1]).replace(".","").replace(",",".")) if m in mb and mb[m][1] not in ("",None) else v, r25] for m,v,r25 in metas]
sheet("CONFIG",["chave","valor","descrição"],[
 ["regra_compra_pct",0.45,"Fornecedores que vencem no mês ≤ 45% da meta de receita"],
 ["jornada_semana_min",480,"Seg–sex: 08:30–18:00 com 1h30 de almoço"],
 ["jornada_sabado_min",240,"Sábado: 08:30–12:30"],
 ["entrada_padrao","08:30","Horário de chegada"],
 ["tolerancia_min",10,"Tolerância diária (CLT art. 58 §1º)"],
 ["pro_labore_plano",7000,"Pró-labore mensal planejado (DRE)"],
 ["atualizado_em",HOJE.isoformat(),"Data da última carga"]],[22,14,60])
sheet("METAS",["mes","meta_loja","vendas_2025"],metas,[10,14,14])

# META_DIA: meta oficial do mês (aba METAS) distribuída pelo peso que a Aline dá a cada dia no RESUMO do caixa
peso=collections.defaultdict(float)
for a,m in cx["metas"]: peso[a[:7]]+=m
mo={r[0]:r[1] for r in metas}
sheet("META_DIA",["data","meta_dia","peso_caixa"],[[d(a), round(mo.get(a[:7],0)*m/peso[a[:7]],2) if peso[a[:7]] else 0, m] for a,m in cx["metas"]],[12,12,12])

sheet("EQUIPE",["nome","cargo","codigo_caixa","ativa","jornada"],[
 ["Aline","Proprietária",4,"sim","—"],["Tainara","Líder / caixa (Thay)",36,"sim","44h"],
 ["Thayna","Vendedora",48,"sim","44h"],["Jhennifer","Ex-funcionária",46,"não","44h"],["Wanessa","Ex-funcionária",47,"não","44h"]],[12,22,14,8,10])

sheet("VENDAS_DIA",["data","vendedora","valor"],[[d(a),CODE.get(n,n),val] for a,n,val in cx["vendas"]],[12,14,12])
def cat(f):
    f=f.lower()
    if "entrega" in f: return "entrega", ("pix" if "pix" in f else "cartão" if "cart" in f else f)
    return "afiação", {"credito":"crédito","debito":"débito","sem forma":"sem forma","pix loja":"pix"}.get(f,f)
sheet("AFIACAO",["data","tipo","forma","valor"],[[d(a)]+list(cat(f))+[val] for a,f,val in cx["alicate"]],[12,10,12,10])
sheet("RETIRADAS",["data","tipo","valor","descrição"],[[d(a),k,val,desc] for a,k,val,desc in cx["retiradas"]],[12,10,10,30])

r=fin["RECEITAS"]; rows=[]
for i in range(6,697):
    a,f,j=r.cell(i,1).value,r.cell(i,6).value,r.cell(i,10).value
    if isinstance(a,dt.datetime) and isinstance(j,(int,float)) and j: rows.append([a.date(),str(f).strip().lower().replace("cartao","cartão").replace("credito","cartão"),round(j,2)])
sheet("RECEITAS",["data","forma","valor_liquido"],rows,[12,10,14])

ct=fin["CONTAS"]; rows=[]
TIPO={"FOR":"fornecedor","FIX":"fixo","PRL":"pró-labore","VAR":"variável","JON":"Jonas"}
for i in range(2,1375):
    a,b,c,dd,e,f,g,h=[ct.cell(i,k).value for k in range(1,9)]
    if not isinstance(b,dt.datetime) or not isinstance(g,(int,float)) or b.year<2026: continue
    t=TIPO.get((e or "").strip(), (e or "outro").strip().lower() or "outro")
    pago=h.date() if isinstance(h,dt.datetime) else None
    st="paga" if pago else ("vencida sem baixa" if b.date()<HOJE else "a pagar")
    rows.append([b.date(),str(f or "").strip(),str(int(c)) if isinstance(c,(int,float)) else str(c or ""),t,round(g,2),pago,st])
rows.sort(key=lambda x:x[0])
sheet("CONTAS",["vencimento","descricao","nota","tipo","valor","pago_em","status"],rows,[12,26,12,12,12,12,18])

dre=fin["DRE2026"]; rows=[]
for k,m in enumerate(range(6,18)):
    g=lambda row: round(dre.cell(row,m).value or 0,2)
    rows.append([f"2026-{k+1:02d}",g(5),g(15),g(16),g(17),g(6),g(7),g(8),g(9),g(12),g(34),g(20)])
sheet("DRE_MENSAL",["mes","receita","dinheiro","cartao","pix","cmv","impostos","custos_fixos","custos_variaveis","resultado","pro_labore","despesas_pessoal"],rows,[10]+[13]*11)

# PONTO
ev=collections.defaultdict(lambda: collections.defaultdict(list)); notas=collections.defaultdict(list)
for rr in pt.iter_rows(min_row=2, values_only=True):
    t=rr[0]
    if not isinstance(t,dt.datetime) or t<dt.datetime(2026,1,1): continue
    nome=str(rr[2] or "").strip().title(); e=str(rr[4] or "").strip().upper()
    if nome=="Jheniffer": nome="Jhennifer"
    ev[(t.date(),nome)][e].append(t)
    for x in (rr[1],rr[3]):
        if x not in (None,""): notas[(t.date(),nome)].append(x.strftime("%H:%M") if isinstance(x,(dt.time,dt.datetime)) else str(x))
# Batidas feitas no Mural da Equipe (a rotina salva a lista em ponto_mural.json: funcionaria, evento, data, hora)
if os.path.exists(f"{S}/ponto_mural.json"):
    for b in json.load(open(f"{S}/ponto_mural.json")):
        t=dt.datetime.strptime(f'{b["data"]} {b["hora"]}',"%Y-%m-%d %H:%M:%S")
        ev[(t.date(),b["funcionaria"].strip().title())][b["evento"].strip().upper()].append(t)
hm=lambda t: t.strftime("%H:%M") if t else ""
rows=[]
for (day,nome),k in sorted(ev.items()):
    ch=min(k["CHEGADA"]) if k["CHEGADA"] else None; sa=max(k["SAÍDA"]) if k["SAÍDA"] else None
    sal=min(k["SAÍDA PARA ALMOÇO"]) if k["SAÍDA PARA ALMOÇO"] else None; ra=max(k["RETORNO DO ALMOÇO"]) if k["RETORNO DO ALMOÇO"] else None
    jor=240 if day.weekday()==5 else (0 if day.weekday()==6 else 480)
    status="ok"; trab=None; atraso=None; saldo=None
    if ch and sa:
        trab=(sa-ch).seconds//60
        if sal and ra: trab-=(ra-sal).seconds//60
        elif jor==480: status="incompleto (sem almoço)"
        ent=dt.datetime.combine(day,dt.time(8,30)); atraso=max(0,int((ch-ent).total_seconds()//60))
        s=trab-jor; saldo=0 if abs(s)<=10 else s
    else: status="incompleto"
    rows.append([day,nome,day.strftime("%a").replace("Mon","seg").replace("Tue","ter").replace("Wed","qua").replace("Thu","qui").replace("Fri","sex").replace("Sat","sáb").replace("Sun","dom"),
        hm(ch),hm(sal),hm(ra),hm(sa),trab if trab is not None else "",jor,atraso if atraso is not None else "",saldo if saldo is not None else "",status,"; ".join(notas[(day,nome)])])
sheet("PONTO",["data","funcionaria","dia","chegada","saida_almoco","retorno_almoco","saida","min_trabalhados","jornada_min","atraso_min","saldo_min","status","anotacao"],rows,[12,12,6,9,12,14,9,16,12,11,10,22,30])
for ws in wb.worksheets:
    for row in ws.iter_rows(min_row=2):
        for c in row:
            if isinstance(c.value,dt.date): c.number_format="DD/MM/YYYY"
wb.save(f"{S}/BASE_GESTAO_2026.xlsx")
for ws in wb.worksheets: print(ws.title, ws.max_row-1)
