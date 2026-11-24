import sys, openpyxl, collections, json, os, warnings
warnings.filterwarnings("ignore")
d=sys.argv[1]; names={4:"Aline",36:"Tainara",48:"Thayna"}
vendas=[]; alic=[]; ret=[]; metas=[]
for m in range(1,13):
    fp=os.path.join(d,f"{m:02d}.xlsx")
    if not os.path.exists(fp): continue
    wb=openpyxl.load_workbook(fp, data_only=True)
    tv=0; ta=0; other=collections.Counter()
    for day in range(1,32):
        if str(day) not in wb.sheetnames: continue
        ws=wb[str(day)]; meta=ws["G4"].value
        dayv=0
        for r in range(14,265):
            a,b,c,dd,e,f,g,o=[ws.cell(r,k).value for k in (1,2,3,4,5,6,7,15)]
            if isinstance(a,(int,float)) and isinstance(c,(int,float)) and c:
                n=names.get(int(a),f"cod {int(a)}"); other[n]+=0
                vendas.append([f"2026-{m:02d}-{day:02d}",n,round(c,2)]); tv+=c; dayv+=c
            if str(b).strip().lower()=="a" and isinstance(c,(int,float)) and c:
                alic.append([f"2026-{m:02d}-{day:02d}","dinheiro",round(c,2)]); ta+=c
            if isinstance(g,(int,float)) and g:
                fo=str(o or "").strip().lower()
                alic.append([f"2026-{m:02d}-{day:02d}",fo or "sem forma",round(g,2)]); ta+=g
            for val,kind in ((dd,"sangria"),(e,"retirada")):
                if isinstance(val,(int,float)) and val: ret.append([f"2026-{m:02d}-{day:02d}",kind,round(val,2),str(f or "")])
        if isinstance(meta,(int,float)) and (meta or dayv): metas.append([f"2026-{m:02d}-{day:02d}",meta])
    print(m, "vendas",round(tv),"alicate",round(ta), "vendedoras", sorted(set(v[1] for v in vendas if v[0][5:7]==f"{m:02d}")))
json.dump(dict(vendas=vendas,alicate=alic,retiradas=ret,metas=metas),open(os.path.join(d,"caixa.json"),"w"))
