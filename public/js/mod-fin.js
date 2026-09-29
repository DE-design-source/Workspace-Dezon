/* Dezon Workspace — Tài chính & dòng tiền (ngân sách, hoá đơn, dòng tiền, báo cáo, thuế). Tiền lưu bằng đồng. */

/* ================= dữ liệu mẫu ================= */
SEEDS.push(s => {
  const T = 1e6, B = (g, name, b, sp) => ({id:uid(), g, name, b:b * T, s:sp * T});
  const W = rows => rows.map(([a, b]) => [a * T, b * T]);
  s.finp = {
    riverside:{cash:4200 * T, contract:8500 * T, got0:3600 * T,
      budget:[B('Nhân công','Móng & kết cấu',1000,720), B('Nhân công','Hoàn thiện',1800,680), B('Vật tư','Thép & xi măng',1600,1550), B('Vật tư','Vật tư hoàn thiện (sơn, gạch)',1200,950), B('Thầu phụ','Cơ điện (MEP)',900,950), B('Thầu phụ','Kết cấu thép',600,580), B('Thiết bị & quản lý','Thiết bị thi công',700,250), B('Thiết bị & quản lý','Thiết bị nội thất & vệ sinh',300,100), B('Thiết bị & quản lý','Chi phí quản lý dự án',400,180)],
      fc:W([[950,620],[1100,700],[800,640],[950,600],[1050,680],[900,650],[1150,720],[980,690]])},
    b12:{cash:640 * T, contract:4200 * T, got0:1800 * T,
      budget:[B('Nhân công','Nhân công phần thô',1000,520), B('Vật tư','Vật tư phần thô',1500,820), B('Thầu phụ','Điện nước',700,380), B('Thiết bị & quản lý','Quản lý & phát sinh',400,130)],
      fc:W([[630,160],[0,140],[0,180],[420,150],[0,120],[0,170],[420,190],[0,160]])},
    thaodien:{cash:1100 * T, contract:12000 * T, got0:2300 * T,
      budget:[B('Nhân công','Nhân công thi công',3000,800), B('Vật tư','Vật tư chính',3800,1100), B('Thầu phụ','Thầu phụ MEP',2000,300), B('Thiết bị & quản lý','Quản lý & phát sinh',1000,200)],
      fc:W([[0,220],[800,240],[0,260],[0,210],[900,250],[0,230],[0,240],[700,260]])},
    q3:{cash:1500 * T, contract:6000 * T, got0:4200 * T,
      budget:[B('Nhân công','Nhân công thi công',1400,1400), B('Vật tư','Vật tư chính',1700,1720), B('Thầu phụ','Thầu phụ MEP',900,880), B('Thiết bị & quản lý','Quản lý & bảo hành',500,500)],
      fc:W([[0,40],[0,30],[0,30],[0,20],[0,20],[0,20],[0,20],[0,20]])}
  };
  const I = (pid, code, partner, kind, amt, date, due, task, paid) => ({id:uid(), pid, code, partner, kind, amount:amt * T, date:md(date), due:md(due), task, note:'', status:paid ? 'paid' : 'pending', paidAt:paid ? md(paid) : '', line:'', po:''});
  s.finInv = [
    I('riverside','INV-0142','Khách hàng ABC','in',620,'2026-08-15','2026-09-14','Thu đợt 2 hợp đồng'),
    I('riverside','INV-0143','Khách hàng ABC','in',480,'2026-09-15','2026-09-30','Nghiệm thu phần móng'),
    I('riverside','BILL-0087','Thầu phụ Nam Á','out',310,'2026-09-02','2026-10-02','Đổ bê tông sàn tầng 4'),
    I('riverside','INV-0144','Khách hàng XYZ','in',700,'2026-08-08','2026-09-08','Hợp đồng riêng — Khu B','2026-09-08'),
    I('riverside','BILL-0088','Vật tư Hòa Phát','out',195,'2026-08-06','2026-09-05','Thép & xi măng','2026-09-05'),
    I('riverside','BILL-0089','Cơ điện MEP Sài Gòn','out',420,'2026-09-20','2026-10-20','Lắp đặt điện nước (MEP thô)'),
    I('riverside','INV-0131','BQL Riverside','in',2500,'2026-07-10','2026-07-25','Thu đợt 1 hợp đồng','2026-07-24'),
    I('riverside','BILL-0080','Vật tư Hòa Phát','out',1100,'2026-07-05','2026-07-20','Thép & xi măng đợt 1','2026-07-19'),
    I('riverside','BILL-0083','Thầu phụ Nam Á','out',900,'2026-08-01','2026-08-20','Kết cấu sàn tầng 1–3','2026-08-18'),
    I('b12','INV-0151','Anh Quang Huy','in',630,'2026-09-10','2026-09-25','Thu đợt 2 — xong móng'),
    I('b12','INV-0140','Anh Quang Huy','in',300,'2026-08-01','2026-08-10','Tạm ứng hợp đồng','2026-08-09'),
    I('b12','BILL-0092','Vật tư Kiến Phát','out',120,'2026-08-28','2026-09-12','Vật tư móng','2026-09-11'),
    I('thaodien','INV-0138','Chị Minh Thư','in',1200,'2026-08-05','2026-08-20','Thu đợt 1 hợp đồng','2026-08-19'),
    I('q3','INV-0136','Cty TNHH ABC Logistics','in',1800,'2026-07-20','2026-08-05','Thu đợt cuối — bàn giao','2026-08-04'),
    I('q3','BILL-0085','Vật tư Minh Long','out',800,'2026-08-10','2026-08-25','Vật tư hoàn thiện','2026-08-25')
  ];
  const X = (type, period, amt, due, paid) => ({id:uid(), type, period, amount:amt * T, due:md(due), paid:!!paid, paidAt:paid ? md(paid) : ''});
  s.finTax = [X('Thuế GTGT','Quý 3/2026',184,'2026-10-20'), X('Thuế TNDN tạm tính','Quý 3/2026',224,'2026-10-30'), X('Thuế GTGT','Quý 2/2026',156,'2026-07-20','2026-07-18'), X('Thuế môn bài','Năm 2026',3,'2026-01-30','2026-01-26'), X('Thuế TNDN tạm tính','Quý 2/2026',198,'2026-07-30','2026-07-28')];
  const C = (cat, group, name, amt, date, type = '') => ({id:uid(), cat, group, name, amount:Math.round(amt * T), date:md(date), type, note:''});
  const cost = [];
  ['04','05','06','07','08','09'].forEach((m, i) => {
    cost.push(C('admin','Thuê mặt bằng & văn phòng','Tiền thuê văn phòng T' + (+m), 120, `2026-${m}-05`));
    cost.push(C('admin','Điện, nước, internet','Điện nước, internet T' + (+m), [26,27,29,30,27,28][i], `2026-${m}-10`));
    cost.push(C('admin','Văn phòng phẩm & khác','Văn phòng phẩm T' + (+m), [12,14,13,16,14,15][i], `2026-${m}-15`));
  });
  [['Đội thi công',720],['Quản lý dự án & kỹ thuật',380],['Kinh doanh & Marketing',210],['Hành chính & kế toán',110]].forEach(([d, v]) => cost.push(C('hr', d, 'Lương T9 — ' + d, v, '2026-09-05', 'luong')));
  cost.push(C('hr','Hành chính & kế toán','BHXH, BHYT, BHTN T9',186,'2026-09-06','bh'), C('hr','Đội thi công','Thưởng hiệu suất Q3',64,'2026-09-18','thuong'));
  cost.push(C('sales','Hoa hồng','Hoa hồng bán hàng T9',92,'2026-09-20'));
  cost.push(C('mkt','Facebook Ads','Facebook Ads — mở bán Riverside GĐ2',168,'2026-09-12'), C('mkt','Google Ads','Google Ads — từ khoá căn hộ',98,'2026-09-14'), C('mkt','Sự kiện mở bán','Sự kiện mở bán Riverside GĐ2',40,'2026-09-19'));
  s.finCost = cost;
  s.finSet = {mktBudget:450 * T, mktNote:'Chiến dịch mở bán Riverside GĐ2'};
});
syncCol('fin_v2', 'map', () => S.finp, v => S.finp = v, {read:['fin'], write:['fin', 'projects'], empty:() => ({})});
syncCol('fin_invoices', 'array', () => S.finInv, v => S.finInv = v, {read:['fin','po'], write:['fin','po'], empty:() => []});
syncCol('fin_taxes', 'array', () => S.finTax, v => S.finTax = v, {read:['fin'], write:['fin'], empty:() => []});
syncCol('fin_costs', 'array', () => S.finCost, v => S.finCost = v, {read:['fin'], write:['fin'], empty:() => []});
syncCol('fin_settings', 'single', () => S.finSet, v => S.finSet = v || {}, {read:['fin'], write:['fin'], empty:() => ({mktBudget:0, mktNote:''})});

/* ================= tiện ích ================= */
const FIN_M = v => trd((+v || 0) / 1e6);                       // đồng → "620tr" / "1,24 tỷ"
const FIN_TR = v => Math.round((+v || 0) * 1e6);                // ô nhập (triệu) → đồng
const FIN_IN_TR = v => +((+v || 0) / 1e6).toFixed(3);           // đồng → ô nhập (triệu)
const FIN_GROUPS = ['Nhân công','Vật tư','Thầu phụ','Thiết bị & quản lý'];
const FIN_CATS = [['admin','Hành chính'],['hr','Nhân sự'],['project','Dự án'],['sales','Kinh doanh'],['mkt','Marketing']];
const FIN_TABS = [['overview','Tổng quan'],['budget','Ngân sách'],['invoices','Hoá đơn'],['cash','Dòng tiền'],['reports','Báo cáo'],['tax','Thuế']];
const FIN_RANGES = [['week','Tuần'],['month','Tháng'],['3m','3 tháng'],['6m','6 tháng'],['1y','1 năm']];
const FIN_WON = ['chot-hd','thiet-ke','thi-cong'], FIN_OPEN = ['tiep-can','tu-van','bao-gia','dam-phan'];
const finEd = () => perm('fin') === 'edit';
const finPName = id => { const p = (S.projects || []).find(x => x.id === id); return p ? p.name : (id ? id : 'Không gắn dự án'); };
const finPBudget = p => { const x = p && typeof proj === 'function' ? proj(p.id) || p : p || {}; const v = +x.budget || 0; return v && v < 1e6 ? v * 1e6 : v; };   // đồng (dữ liệu cũ: triệu)
const finPct = (a, b) => b ? Math.round(a / b * 100) : 0;
const finSign = v => (v >= 0 ? '+' : '') + FIN_M(v);
const finInput = (val, attrs) => `<input type="number" step="any" value="${val}" ${attrs} style="width:96px;text-align:right;border:1px solid var(--line);border-radius:8px;height:30px;padding:0 8px;background:var(--card);color:var(--ink)">`;
function finRange(){
  const r = ui.finR || (ui.finR = {k:'month'});
  if (r.k === 'custom') return r;
  const t = today0(), y = t.getFullYear(), m = t.getMonth();
  if (r.k === 'week'){ const mon = addDays(todayISO(), -((t.getDay() + 6) % 7)); return {k:'week', from:mon, to:addDays(mon, 6)}; }
  const n = {month:1, '3m':3, '6m':6, '1y':12}[r.k] || 1;
  return {k:r.k, from:iso(new Date(y, m - n + 1, 1)), to:iso(new Date(y, m + 1, 0))};
}
const finIn = (d, R) => !!d && d >= R.from && d <= R.to;
const finPrev = R => { const n = diffDays(R.from, R.to) + 1; return {from:addDays(R.from, -n), to:addDays(R.from, -1)}; };
const finRLabel = R => fmtFull(R.from) + ' – ' + fmtFull(R.to);
const finMonths = R => Math.max(1, Math.round((diffDays(R.from, R.to) + 1) / 30.4));
function finSel(){
  if (ui.finPid === undefined) ui.finPid = S.finp[S.pid] ? S.pid : 'all';
  if (ui.finPid !== 'all' && !S.finp[ui.finPid]) ui.finPid = 'all';
  return ui.finPid;
}
function finAgg(sel){
  const pids = sel === 'all' ? Object.keys(S.finp) : [sel];
  const fs = pids.map(id => S.finp[id]).filter(Boolean), lines = fs.flatMap(f => f.budget);
  const inv = sel === 'all' ? S.finInv : S.finInv.filter(i => i.pid === sel);
  const fc = Array.from({length:8}, (_, i) => [sum(fs, f => (f.fc[i] || [0, 0])[0]), sum(fs, f => (f.fc[i] || [0, 0])[1])]);
  return {pids, fs, lines, inv, fc, cash:sum(fs, f => f.cash), contract:sum(fs, f => f.contract),
    got:sum(fs, f => f.got0) + sum(inv.filter(i => i.kind === 'in' && i.status === 'paid' && pids.includes(i.pid)), i => i.amount),
    budget:sum(lines, b => b.b), spent:sum(lines, b => b.s)};
}
const finOver = i => i.status !== 'paid' && !!i.due && daysLeft(i.due) < 0;
function finInvState(i){
  if (i.status === 'paid') return [i.kind === 'in' ? 'Đã thu' : 'Đã thanh toán', 'green'];
  if (finOver(i)) return ['Quá hạn ' + (-daysLeft(i.due)) + ' ngày', 'red'];
  return i.kind === 'in' ? ['Chờ thu', 'blue'] : ['Chờ thanh toán', 'yellow'];
}
function finBudState(b){
  const p = b.b ? b.s / b.b * 100 : (b.s ? 101 : 0);
  return p > 100 ? ['Vượt NS', 'red'] : p >= 75 ? ['Sắp hết', 'yellow'] : ['Trong NS', 'green'];
}
const finBudColor = b => ({red:'var(--red)', yellow:'var(--yellow)', green:'var(--blue)'})[finBudState(b)[1]];
function finNextCode(kind){
  const pre = kind === 'out' ? 'BILL-' : 'INV-';
  const n = Math.max(0, ...S.finInv.filter(x => String(x.code).startsWith(pre)).map(x => +String(x.code).split('-')[1] || 0)) + 1;
  return pre + String(n).padStart(4, '0');
}
// Đổi trạng thái đã tất toán, cập nhật tồn quỹ dự án và "Đã chi" của hạng mục ngân sách gắn kèm (hai chiều).
function finSetPaid(i, paid){
  if ((i.status === 'paid') === !!paid) return;
  const f = S.finp[i.pid], k = paid ? 1 : -1;
  i.status = paid ? 'paid' : 'pending'; i.paidAt = paid ? todayISO() : '';
  if (!f) return;
  f.cash += k * (i.kind === 'in' ? i.amount : -i.amount);
  if (i.kind === 'out'){ const b = f.budget.find(x => x.id === i.line); if (b) b.s = Math.max(0, b.s + k * i.amount); }
}
function finPL(R, sel){
  const inv = (sel === 'all' ? S.finInv : S.finInv.filter(i => i.pid === sel)).filter(i => finIn(i.date, R));
  const rev = sum(inv.filter(i => i.kind === 'in'), i => i.amount), direct = sum(inv.filter(i => i.kind === 'out'), i => i.amount);
  const costs = sel === 'all' ? S.finCost.filter(c => finIn(c.date, R)) : [];
  const ops = sum(costs, c => c.amount), opex = direct + ops, gross = rev - opex, cit = Math.round(Math.max(0, gross) * .2);
  return {rev, direct, ops, costs, opex, gross, cit, net:gross - cit, margin:finPct(gross, rev)};
}
function finQuarter(){ const t = today0(), q = Math.floor(t.getMonth() / 3); return {from:iso(new Date(t.getFullYear(), q * 3, 1)), to:iso(new Date(t.getFullYear(), q * 3 + 3, 0)), label:'Quý ' + (q + 1) + '/' + t.getFullYear()}; }
function finTasks(pid){
  try {
    const phases = (S.gantt && S.gantt[pid]) || [];                                 // mod-pm: [{name, tasks:[{name, ms, …}]}]
    return phases.flatMap(ph => (ph && ph.tasks) || []).filter(t => t && !t.ms).map(t => t.name).filter(Boolean);
  } catch (e) { return []; }
}
const finTSV = rows => rows.map(r => r.map(c => String(c ?? '').replace(/\s+/g, ' ')).join('\t')).join('\n');

/* ================= tích hợp cho module khác ================= */
function finStats(pid){
  const f = S.finp && S.finp[pid], inv = (S.finInv || []).filter(i => i.pid === pid);
  const overdue = inv.filter(finOver), recv = sum(inv.filter(i => i.kind === 'in' && i.status !== 'paid'), i => i.amount);
  if (!f){ const p = (S.projects || []).find(x => x.id === pid) || {}; return {budget:finPBudget(p), spent:0, cash:0, fc:[], net4:0, overdue, recv}; }
  return {budget:sum(f.budget, b => b.b), spent:sum(f.budget, b => b.s), cash:f.cash, fc:f.fc, net4:sum(f.fc.slice(0, 4), x => x[0] - x[1]), overdue, recv};
}
function finInitProject(p){
  if (!p || !p.id || S.finp[p.id]) return S.finp[p && p.id];
  const b = finPBudget(p) || 1e9, split = [['Nhân công','Nhân công thi công',.3],['Vật tư','Vật tư chính',.35],['Thầu phụ','Thầu phụ MEP',.2],['Thiết bị & quản lý','Quản lý & phát sinh',.15]];
  S.finp[p.id] = {cash:0, contract:0, got0:0, budget:split.map(([g, name, r]) => ({id:uid(), g, name, b:Math.round(b * r), s:0})), fc:Array.from({length:8}, () => [0, 0])};
  return S.finp[p.id];
}
// Tạo hoá đơn (vd Mua hàng tạo hoá đơn chi khi nhận hàng). amount: đồng. group: nhóm ngân sách để gắn hạng mục (tuỳ chọn).
function finAddInvoice(pid, o = {}){
  const kind = o.kind === 'out' ? 'out' : 'in', f = S.finp[pid];
  const line = o.line || (f && o.group ? (f.budget.find(b => b.g === o.group) || {}).id : '') || '';
  const i = {id:uid(), pid:pid || '', code:finNextCode(kind), partner:o.partner || '', kind, amount:Math.round(+o.amount || 0), date:todayISO(), due:o.due || dayISO(30), task:o.task || '', note:o.note || '', status:'pending', paidAt:'', line, po:o.po || ''};
  S.finInv.push(i);
  log(`Tạo hoá đơn ${i.code} · ${i.partner} · ${FIN_M(i.amount)}`, 'yellow');
  return i;
}

/* ================= trang ================= */
MOD.fin = () => {
  const cur = sub('fin', 'overview'), sel = finSel(), R = finRange();
  const nOver = S.finInv.filter(finOver).length;
  const tabs = subtabs('fin', FIN_TABS.map(([k, l]) => [k, l, k === 'invoices' ? nOver : k === 'tax' ? S.finTax.filter(t => !t.paid && daysLeft(t.due) < 0).length : 0]), 'overview');
  const projOpts = [['all', 'Tất cả dự án'], ...Object.keys(S.finp).map(id => [id, finPName(id)])];
  const noFin = (S.projects || []).filter(p => !S.finp[p.id] && p.status !== 'draft');
  const filter = `<div class="card pad row" style="flex-wrap:wrap;gap:10px 16px;padding:12px 16px">
    <label class="row small muted" style="gap:6px">Dự án:<select data-change="fin-pid" aria-label="Chọn dự án" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);padding:0 8px">${opt(projOpts, sel)}</select></label>
    <div class="seg">${FIN_RANGES.map(([k, l]) => `<button class="${R.k === k ? 'on' : ''}" data-act="fin-range" data-k="${k}">${l}</button>`).join('')}</div>
    <label class="row small muted" style="gap:6px">Tuỳ chọn:<input type="date" value="${R.from}" data-change="fin-from" aria-label="Từ ngày" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);padding:0 8px">→<input type="date" value="${R.to}" data-change="fin-to" aria-label="Đến ngày" style="height:34px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);padding:0 8px"></label>
    ${noFin.length && finEd() ? `<button class="btn line sm" data-act="fin-init" style="margin-left:auto">${ic('plus', 14)}Lập ngân sách cho ${noFin.length} dự án mới</button>` : ''}
  </div>`;
  const body = {overview:finOverview, budget:finBudgetTab, invoices:finInvTab, cash:finCashTab, reports:finReportTab, tax:finTaxTab}[cur] || finOverview;
  return head('Tài chính & dòng tiền', 'Ngân sách, hoá đơn, công nợ, dòng tiền, báo cáo và thuế — tính trực tiếp từ dữ liệu.') + tabs + filter + body(sel, R);
};
const finNeedProject = () => emptyBox('Chưa có dữ liệu tài chính dự án', (S.projects || []).length ? 'Lập ngân sách cho dự án để theo dõi chi phí, hoá đơn và dòng tiền.' : 'Tạo dự án trong Quản lý dự án trước, sau đó lập ngân sách tại đây.', (S.projects || []).length && finEd() ? `<button class="btn" data-act="fin-init">${ic('plus', 15)}Lập ngân sách</button>` : '');

/* ---------- Tổng quan ---------- */
function finOverview(sel, R){
  const cat = ui.finCat || 'project';
  const pills = `<div class="toolbar">${FIN_CATS.map(([k, l]) => `<button class="fchip ${cat === k ? 'on' : ''}" data-act="fin-cat" data-k="${k}">${l}</button>`).join('')}</div>`;
  return pills + ({admin:finCatAdmin, hr:finCatHr, sales:finCatSales, mkt:finCatMkt}[cat] || finCatProject)(sel, R);
}
function finCatProject(sel){
  if (!Object.keys(S.finp).length) return finNeedProject();
  const A = finAgg(sel), end = A.cash + sum(A.fc, x => x[0] - x[1]);
  const recvAll = A.inv.filter(i => i.kind === 'in'), recvPaid = sum(recvAll.filter(i => i.status === 'paid'), i => i.amount), recvTot = sum(recvAll, i => i.amount);
  const unpaidIn = recvAll.filter(i => i.status !== 'paid'), overIn = sum(unpaidIn.filter(finOver), i => i.amount);
  const sp = finPct(A.spent, A.budget);
  const groups = FIN_GROUPS.concat([...new Set(A.lines.map(b => b.g))].filter(g => !FIN_GROUPS.includes(g))).map(g => { const ls = A.lines.filter(b => b.g === g); return {g, b:sum(ls, x => x.b), s:sum(ls, x => x.s), n:ls.length}; }).filter(x => x.n);
  const rows = Object.keys(S.finp).map(id => { const X = finAgg(id); return {id, duThu:X.contract, thucThu:X.got, duChi:X.budget, thucChi:X.spent}; });
  const tot = k => sum(rows, r => r[k]);
  const invList = [...A.inv].sort((a, b) => (a.status === 'paid') - (b.status === 'paid') || String(a.due).localeCompare(String(b.due))).slice(0, 5);
  return `<div class="grid-3-2">
    <div class="card pad"><h2 class="sec-title">Dự báo dòng tiền — 8 tuần tới ${legend([['var(--green)','Thu'],['var(--orange)','Chi']])}</h2>${finFcChart(A, false)}
      <div class="small muted">Đơn vị: đồng / tuần. Tồn quỹ dự kiến cuối kỳ: <b style="color:var(--ink)">${FIN_M(end)}</b> — hiện tại ${FIN_M(A.cash)} ${pill(finSign(end - A.cash), end >= A.cash ? 'green' : 'red')}</div></div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Ngân sách theo hạng mục <button class="link" data-act="sub" data-view="fin" data-k="budget">Chi tiết ›</button></h2>
      ${groups.map(x => `<div><div class="kpi-row"><span>${esc(x.g)}</span><span>${FIN_M(x.s)} / ${FIN_M(x.b)}</span></div>${bar(finPct(x.s, x.b), finBudColor(x), 'thick')}${x.s > x.b ? `<div class="kpi-note late">Vượt ngân sách ${FIN_M(x.s - x.b)}</div>` : ''}</div>`).join('') || '<div class="empty">Chưa có hạng mục</div>'}
    </div>
  </div>
  <div class="stats">
    ${stat('Tổng ngân sách', FIN_M(A.budget), sel === 'all' ? A.pids.length + ' dự án' : esc(finPName(sel)))}
    ${stat('Đã chi thực tế', FIN_M(A.spent), sp + '% ngân sách', sp > 100 ? 'bad' : '')}
    ${stat('Còn lại', FIN_M(A.budget - A.spent), (100 - sp) + '% ngân sách', A.budget - A.spent < 0 ? 'bad' : '')}
    ${stat('Công nợ phải thu', FIN_M(sum(unpaidIn, i => i.amount)), overIn ? FIN_M(overIn) + ' quá hạn' : 'Không có quá hạn', overIn ? 'bad' : 'good')}
  </div>
  <div class="grid2">
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Các khoản phải thu</h2>
      <div class="kpi-row"><span>Tổng phải thu <b>${FIN_M(recvTot)}</b></span><span>Đã thu <b>${FIN_M(recvPaid)}</b></span></div>${bar(finPct(recvPaid, recvTot), 'var(--green)', 'thick')}
      <div class="small muted">Đã thu ${finPct(recvPaid, recvTot)}% — còn ${FIN_M(recvTot - recvPaid)} chưa thu${overIn ? `, trong đó <span class="late">${FIN_M(overIn)} quá hạn</span>` : ''}</div></div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Các khoản dự chi</h2>
      <div class="kpi-row"><span>Tổng dự chi <b>${FIN_M(A.budget)}</b></span><span>Thực chi <b>${FIN_M(A.spent)}</b></span></div>${bar(sp, sp > 100 ? 'var(--red)' : 'var(--yellow)', 'thick')}
      <div class="small muted">Đã chi ${sp}% ngân sách dự kiến — ${A.budget >= A.spent ? 'còn ' + FIN_M(A.budget - A.spent) : '<span class="late">vượt ' + FIN_M(A.spent - A.budget) + '</span>'}</div></div>
  </div>
  <div class="grid-3-2">
    <div class="card pad"><h2 class="sec-title">Thu chi theo dự án</h2><div class="table-wrap"><table style="min-width:520px"><thead><tr><th>Dự án</th><th class="r">Dự thu</th><th class="r">Thực thu</th><th class="r">Dự chi</th><th class="r">Thực chi</th></tr></thead><tbody>
      ${rows.map(r => `<tr class="click" data-act="fin-pick" data-id="${esc(r.id)}" tabindex="0"><td class="b">${esc(finPName(r.id))}</td><td class="r">${FIN_M(r.duThu)}</td><td class="r">${FIN_M(r.thucThu)}</td><td class="r">${FIN_M(r.duChi)}</td><td class="r ${r.thucChi > r.duChi ? 'late' : ''}">${FIN_M(r.thucChi)}</td></tr>`).join('')}
      <tr class="grp"><td>Tổng</td><td class="r">${FIN_M(tot('duThu'))}</td><td class="r">${FIN_M(tot('thucThu'))}</td><td class="r">${FIN_M(tot('duChi'))}</td><td class="r">${FIN_M(tot('thucChi'))}</td></tr>
    </tbody></table></div>${sel !== 'all' && finEd() ? `<button class="link" data-act="fin-proj" data-id="${esc(sel)}">Sửa giá trị hợp đồng / tồn quỹ của dự án đang chọn ›</button>` : ''}</div>
    <div class="card list-card"><h2 class="sec-title">Hoá đơn & công nợ <button class="link" data-act="sub" data-view="fin" data-k="invoices">Tất cả ›</button></h2>
      ${invList.map(i => { const s2 = finInvState(i), c = i.kind === 'in' ? 'green' : 'orange'; return `<button class="li" data-act="fin-inv" data-id="${i.id}"><span class="sq" style="--c:${cv(c)};--t:${ct(c)}">${ic('file', 16)}</span><span class="ell"><b>${esc(i.code)} · ${esc(i.partner)}</b><small>${esc(i.task || '—')} · hạn ${fmtDate(i.due)}</small></span><span class="end"><b class="num">${FIN_M(i.amount)}</b><div>${pill(...s2)}</div></span></button>`; }).join('') || '<div class="empty">Chưa có hoá đơn</div>'}
    </div>
  </div>`;
}
function finFcChart(A, withLine, h = 240){
  let bal = A.cash; const bals = A.fc.map(x => bal += x[0] - x[1]);
  return barChart({labels:A.fc.map((_, i) => 'T' + (i + 1)), h,
    series:[{name:'Thu', c:'var(--green)', values:A.fc.map(x => x[0])}, {name:'Chi', c:'var(--orange)', values:A.fc.map(x => x[1])}],
    fmt:v => v >= 1e9 ? dec(v / 1e9, 1) + ' tỷ' : Math.round(v / 1e6) + 'tr',
    line:withLine ? {name:'Tồn quỹ', c:'var(--purple)', values:bals} : null, lineFmt:FIN_M});
}
function finCostList(list, cat){
  return `<div class="table-wrap"><table style="min-width:520px"><thead><tr><th>Ngày</th><th>Khoản chi</th><th>${cat === 'hr' ? 'Bộ phận' : cat === 'mkt' ? 'Kênh' : 'Nhóm'}</th><th class="r">Số tiền</th></tr></thead><tbody>
    ${[...list].sort((a, b) => b.date.localeCompare(a.date)).map(c => `<tr class="click" data-act="fin-cost" data-id="${c.id}" tabindex="0"><td class="num">${fmtDate(c.date)}</td><td>${esc(c.name)}</td><td>${esc(c.group)}</td><td class="r b">${FIN_M(c.amount)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Chưa có khoản chi trong kỳ</td></tr>'}
  </tbody></table></div>`;
}
const finCostBtn = (cat, label = 'Thêm khoản chi') => finEd() ? `<button class="btn sm" data-act="fin-cost-new" data-cat="${cat}">${ic('plus', 14)}${label}</button>` : '';
const finByGroup = list => { const m = {}; list.forEach(c => m[c.group] = (m[c.group] || 0) + c.amount); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
function finCatAdmin(sel, R){
  const list = S.finCost.filter(c => c.cat === 'admin'), inR = list.filter(c => finIn(c.date, R)), g = finByGroup(inR);
  const t = today0(), months = Array.from({length:6}, (_, i) => new Date(t.getFullYear(), t.getMonth() - 5 + i, 1));
  const mv = months.map(d => sum(list.filter(c => c.date.slice(0, 7) === iso(d).slice(0, 7)), c => c.amount));
  const avg = sum(mv) / 6;
  return `<div class="stats">${g.map(([k, v]) => stat(esc(k), FIN_M(v), finRLabel(R))).join('') || stat('Chi phí hành chính', FIN_M(0), finRLabel(R))}</div>
    <div class="card pad"><h2 class="sec-title">Chi phí hành chính — 6 tháng gần nhất</h2>${barChart({labels:months.map(d => 'T' + (d.getMonth() + 1)), series:[{name:'Hành chính', c:'var(--purple)', values:mv}], fmt:v => Math.round(v / 1e6) + 'tr', h:200})}
      <div class="small muted">Tổng chi phí vận hành văn phòng trung bình <b style="color:var(--ink)">${FIN_M(avg)}/tháng</b> trong 6 tháng gần nhất.</div></div>
    <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Khoản chi trong kỳ · ${FIN_M(sum(inR, c => c.amount))}</h2>${finCostBtn('admin')}</div>${finCostList(inR, 'admin')}</div>`;
}
function finCatHr(sel, R){
  const inR = S.finCost.filter(c => c.cat === 'hr' && finIn(c.date, R));
  const sal = inR.filter(c => (c.type || 'luong') === 'luong'), bh = inR.filter(c => c.type === 'bh'), th = inR.filter(c => c.type === 'thuong');
  const head_ = typeof hrStaff === 'function' ? (hrStaff() || []).length : (S.people || []).length;
  const g = finByGroup(sal), tot = sum(sal, c => c.amount);
  return `<div class="stats">
      ${stat('Tổng quỹ lương', FIN_M(tot), head_ + ' nhân sự · ' + finRLabel(R))}
      ${stat('Đã chi trả', FIN_M(sum(sal.filter(c => c.date <= todayISO()), c => c.amount)), 'Các kỳ lương đã đến ngày trả')}
      ${stat('Bảo hiểm & phúc lợi', FIN_M(sum(bh, c => c.amount)), 'BHXH, BHYT, BHTN')}
      ${stat('Thưởng & phụ cấp', FIN_M(sum(th, c => c.amount)), th.length + ' khoản')}
    </div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Quỹ lương theo bộ phận</h2>
      ${g.map(([k, v]) => `<div><div class="kpi-row"><span>${esc(k)}</span><span>${FIN_M(v)}</span></div>${bar(finPct(v, tot), 'var(--blue)')}</div>`).join('') || '<div class="empty">Chưa có dữ liệu lương trong kỳ</div>'}
      ${g.length ? `<div class="kpi-row" style="margin:0;border-top:1px solid var(--line);padding-top:10px"><b>Tổng</b><b>${FIN_M(tot)}</b></div>` : ''}</div>
    <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Khoản chi nhân sự trong kỳ</h2>${finCostBtn('hr')}</div>${finCostList(inR, 'hr')}</div>`;
}
function finCatSales(sel, R){
  const leads = Array.isArray(S.leads) ? S.leads : [], val = l => { const v = +l.value || 0; return v < 1e5 ? v * 1e9 : v; };
  const won = leads.filter(l => FIN_WON.includes(l.stage)), open = leads.filter(l => FIN_OPEN.includes(l.stage));
  const wonR = won.filter(l => !l.updated || !/^\d{4}-/.test(l.updated) || finIn(l.updated, R));
  const top = [...open].sort((a, b) => val(b) - val(a))[0];
  const com = S.finCost.filter(c => c.cat === 'sales' && finIn(c.date, R));
  return `<div class="stats">
      ${stat('Doanh thu ký mới', FIN_M(sum(wonR, val)), wonR.length + ' hợp đồng đã chốt')}
      ${stat('Giá trị pipeline', FIN_M(sum(open, val)), open.length + ' cơ hội đang mở')}
      ${stat('Hoa hồng bán hàng', FIN_M(sum(com, c => c.amount)), 'Đã trích trong kỳ')}
      ${stat('Tỷ lệ chốt đơn', finPct(won.length, leads.length) + '%', won.length + '/' + leads.length + ' khách hàng')}
    </div>
    <div class="card pad"><h2 class="sec-title">Cơ hội giá trị lớn đang chờ chốt</h2>${top ? `<div class="li"><span class="sq" style="--c:var(--blue);--t:var(--blue-t)">${ic('briefcase', 16)}</span><span class="ell"><b>${esc(top.name)}${top.proj ? ' — ' + esc(top.proj) : ''}</b><small>${esc(typeof leadStageLabel === 'function' ? leadStageLabel(top.stage) : top.stage)}</small></span><span class="end"><b class="num">${FIN_M(val(top))}</b><div><button class="link" data-act="nav" data-v="sales">Mở Kinh doanh ›</button></div></span></div>` : '<div class="empty">Chưa có cơ hội đang mở</div>'}</div>
    <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Hoa hồng & chi phí bán hàng trong kỳ</h2>${finCostBtn('sales')}</div>${finCostList(com, 'sales')}</div>`;
}
function finCatMkt(sel, R){
  const inR = S.finCost.filter(c => c.cat === 'mkt' && finIn(c.date, R)), g = finByGroup(inR);
  const budget = (+S.finSet.mktBudget || 0) * finMonths(R), spent = sum(inR, c => c.amount), p = finPct(spent, budget);
  return `<div class="stats">
      ${stat('Ngân sách marketing', FIN_M(budget), esc(S.finSet.mktNote || '') + (finEd() ? ` <button class="link" data-act="fin-mkt-budget">Sửa</button>` : ''))}
      ${stat('Đã chi', FIN_M(spent), p + '% ngân sách', p > 100 ? 'bad' : '')}
      ${stat('Còn lại', FIN_M(budget - spent), (100 - p) + '% ngân sách', budget - spent < 0 ? 'bad' : '')}
    </div>
    <div class="card pad stack"><h2 class="sec-title" style="margin:0">Hiệu quả chi phí theo kênh</h2>
      ${g.map(([k, v]) => { const note = inR.find(c => c.group === k && c.note); return `<div><div class="kpi-row"><span>${esc(k)}</span><span>${FIN_M(v)}${note ? ' · ' + esc(note.note) : ''}</span></div>${bar(finPct(v, spent), 'var(--pink)')}</div>`; }).join('') || '<div class="empty">Chưa có chi phí marketing trong kỳ</div>'}</div>
    <div class="card pad stack"><div class="row between"><h2 class="sec-title" style="margin:0">Khoản chi marketing trong kỳ</h2>${finCostBtn('mkt')}</div>${finCostList(inR, 'mkt')}</div>`;
}

/* ---------- Ngân sách ---------- */
function finBudgetTab(sel){
  if (!Object.keys(S.finp).length) return finNeedProject();
  const A = finAgg(sel), over = A.lines.filter(b => finBudState(b)[0] === 'Vượt NS'), p = finPct(A.spent, A.budget);
  const groups = FIN_GROUPS.concat([...new Set(A.lines.map(b => b.g))].filter(g => !FIN_GROUPS.includes(g)));
  const pidOf = b => A.pids.find(id => S.finp[id].budget.includes(b));
  return `<div class="stats">
      ${stat('Tổng ngân sách', FIN_M(A.budget), A.lines.length + ' hạng mục chi phí')}
      ${stat('Đã chi / cam kết', FIN_M(A.spent), p + '% ngân sách', p > 100 ? 'bad' : '')}
      ${stat('Còn lại', FIN_M(A.budget - A.spent), (100 - p) + '% ngân sách', A.budget < A.spent ? 'bad' : '')}
      ${stat('Hạng mục vượt NS', over.length, over.map(b => esc(b.name)).join(' · ') || 'Không có', over.length ? 'bad' : 'good')}
    </div>
    <div class="row between"><h2 class="sec-title" style="margin:0">Ngân sách theo hạng mục chi phí</h2>${finEd() ? `<button class="btn sm" data-act="fin-bud-new">${ic('plus', 14)}Thêm hạng mục</button>` : ''}</div>
    <div class="table-wrap"><table><thead><tr><th>Hạng mục</th>${sel === 'all' ? '<th>Dự án</th>' : ''}<th class="r">Ngân sách</th><th class="r">Đã chi</th><th class="r">Còn lại</th><th style="width:170px">% sử dụng</th><th>Trạng thái</th></tr></thead><tbody>
      ${groups.map(g => { const items = A.lines.filter(b => b.g === g); return items.length ? `<tr class="grp"><td colspan="${sel === 'all' ? 7 : 6}">${esc(g)} · ${FIN_M(sum(items, x => x.s))} / ${FIN_M(sum(items, x => x.b))}</td></tr>` + items.map(b => { const r = finPct(b.s, b.b), s2 = finBudState(b); return `<tr class="click" data-act="fin-bud" data-id="${b.id}" tabindex="0"><td>${esc(b.name)}</td>${sel === 'all' ? `<td class="small">${esc(finPName(pidOf(b)))}</td>` : ''}<td class="r">${FIN_M(b.b)}</td><td class="r">${FIN_M(b.s)}</td><td class="r ${b.b - b.s < 0 ? 'late' : ''}">${FIN_M(b.b - b.s)}</td><td><div class="row"><div style="flex:1">${bar(r, finBudColor(b))}</div><span class="small num">${r}%</span></div></td><td>${pill(...s2)}</td></tr>`; }).join('') : ''; }).join('') || `<tr><td colspan="7" class="empty">Chưa có hạng mục</td></tr>`}
    </tbody></table></div>
    <div class="small muted">Quy tắc: Trong NS dưới 75% · Sắp hết từ 75% · Vượt NS khi đã chi quá 100% ngân sách. Hoá đơn chi gắn hạng mục sẽ cộng vào “Đã chi” khi được thanh toán.</div>`;
}

/* ---------- Hoá đơn ---------- */
function finInvTab(sel, R){
  const A = finAgg(sel), ff = ui.finInvF || 'all';
  const unIn = A.inv.filter(i => i.kind === 'in' && i.status !== 'paid'), unOut = A.inv.filter(i => i.kind === 'out' && i.status !== 'paid');
  const over = A.inv.filter(finOver), paidR = A.inv.filter(i => i.status === 'paid' && finIn(i.paidAt || i.due, R));
  const inScope = A.inv.filter(i => i.status !== 'paid' || finIn(i.paidAt || i.due, R));
  const rows = inScope.filter(i => ff === 'all' || (ff === 'in' ? i.kind === 'in' : ff === 'out' ? i.kind === 'out' : ff === 'late' ? finOver(i) : i.status === 'paid'))
    .sort((a, b) => (a.status === 'paid') - (b.status === 'paid') || String(a.due).localeCompare(String(b.due)));
  const all = sel === 'all';
  return `<div class="stats">
      ${stat('Phải thu (khách hàng)', FIN_M(sum(unIn, i => i.amount)), unIn.length + ' hoá đơn chưa thu')}
      ${stat('Phải trả (NCC/thầu phụ)', FIN_M(sum(unOut, i => i.amount)), unOut.length + ' hoá đơn chờ thanh toán')}
      ${stat('Quá hạn', FIN_M(sum(over, i => i.amount)), over.length + ' hoá đơn', over.length ? 'bad' : 'good')}
      ${stat('Đã tất toán trong kỳ', FIN_M(sum(paidR, i => i.amount)), FIN_M(sum(paidR.filter(i => i.kind === 'in'), i => i.amount)) + ' thu · ' + FIN_M(sum(paidR.filter(i => i.kind === 'out'), i => i.amount)) + ' chi')}
    </div>
    <div class="row between" style="flex-wrap:wrap;gap:8px"><div class="toolbar">${[['all','Tất cả'],['in','Phải thu'],['out','Phải trả'],['late','Quá hạn'],['paid','Đã tất toán']].map(([k, l]) => `<button class="fchip ${ff === k ? 'on' : ''}" data-act="fin-inv-f" data-f="${k}">${l}</button>`).join('')}</div>${finEd() ? `<button class="btn sm" data-act="fin-inv-new">${ic('plus', 14)}Tạo hoá đơn</button>` : ''}</div>
    <div class="table-wrap"><table><thead><tr><th>Mã</th>${all ? '<th>Dự án</th>' : ''}<th>Đối tác</th><th>Loại</th><th class="r">Số tiền</th><th>Hạn</th><th>Gắn với công việc</th><th>Trạng thái</th><th></th></tr></thead><tbody>
      ${rows.map(i => `<tr class="click" data-act="fin-inv" data-id="${i.id}" tabindex="0"><td class="b num">${esc(i.code)}</td>${all ? `<td class="small">${esc(finPName(i.pid))}</td>` : ''}<td>${esc(i.partner)}</td><td>${pill(i.kind === 'in' ? 'Thu' : 'Chi', i.kind === 'in' ? 'green' : 'orange')}</td><td class="r b">${FIN_M(i.amount)}</td><td class="num">${fmtDate(i.due)}</td><td>${i.task ? `<button class="link" data-act="nav" data-v="pm" data-sub="gantt" title="Mở tiến độ">${esc(i.task)}</button>` : '—'}</td><td>${pill(...finInvState(i))}</td><td class="r">${i.status !== 'paid' && finEd() ? `<button class="btn line sm" data-act="fin-inv-pay" data-id="${i.id}">${i.kind === 'in' ? 'Đã thu' : 'Đã trả'}</button>` : ''}</td></tr>`).join('') || `<tr><td colspan="9" class="empty">Không có hoá đơn</td></tr>`}
    </tbody></table></div>
    <div class="small muted">Hoá đơn chưa tất toán luôn hiển thị; hoá đơn đã tất toán lọc theo kỳ ${finRLabel(R)}.</div>`;
}

/* ---------- Dòng tiền ---------- */
function finCashTab(sel){
  if (!Object.keys(S.finp).length) return finNeedProject();
  const A = finAgg(sel), one = sel !== 'all' && finEd();
  let bal = A.cash; const weeks = A.fc.map(x => { bal += x[0] - x[1]; return [x[0], x[1], bal]; });
  const monday = addDays(todayISO(), -((today0().getDay() + 6) % 7));
  const tIn = sum(A.fc, x => x[0]), tOut = sum(A.fc, x => x[1]);
  return `<div class="stats">
      ${stat('Tồn quỹ hiện tại', FIN_M(A.cash), one ? `${finInput(FIN_IN_TR(A.cash), `data-change="fin-cash" aria-label="Tồn quỹ hiện tại (triệu)"`)} triệu` : 'Cập nhật hôm nay')}
      ${stat('Dự kiến cuối kỳ (8 tuần)', FIN_M(bal), finSign(bal - A.cash), bal >= A.cash ? 'good' : 'bad')}
      ${stat('Tổng thu dự kiến', FIN_M(tIn), '8 tuần tới')}
      ${stat('Tổng chi dự kiến', FIN_M(tOut), '8 tuần tới')}
    </div>
    <div class="card pad"><h2 class="sec-title">Dự báo dòng tiền chi tiết — 8 tuần tới ${legend([['var(--green)','Thu'],['var(--orange)','Chi'],['var(--purple)','Tồn quỹ','line']])}</h2>${finFcChart(A, true, 260)}
      <div class="small muted">Đường tồn quỹ vẽ trên thang riêng để thấy rõ xu hướng. ${one ? 'Sửa ô Thu / Chi (triệu đồng) trong bảng để cập nhật dự báo.' : sel === 'all' ? 'Chọn một dự án để sửa dự báo.' : ''}</div></div>
    <div class="table-wrap"><table><thead><tr><th>Tuần</th><th class="r">Thu</th><th class="r">Chi</th><th class="r">Ròng</th><th class="r">Tồn quỹ cuối tuần</th></tr></thead><tbody>
      ${weeks.map((w, i) => `<tr><td>Tuần ${i + 1} <span class="small muted">(${fmtDate(addDays(monday, i * 7))})</span></td>
        <td class="r">${one ? finInput(FIN_IN_TR(w[0]), `data-change="fin-fc" data-i="${i}" data-k="0" aria-label="Thu tuần ${i + 1} (triệu)"`) : FIN_M(w[0])}</td>
        <td class="r">${one ? finInput(FIN_IN_TR(w[1]), `data-change="fin-fc" data-i="${i}" data-k="1" aria-label="Chi tuần ${i + 1} (triệu)"`) : FIN_M(w[1])}</td>
        <td class="r" style="color:${w[0] - w[1] >= 0 ? 'var(--green-ink)' : 'var(--red)'}">${finSign(w[0] - w[1])}</td><td class="r b">${FIN_M(w[2])}</td></tr>`).join('')}
      <tr class="grp"><td>Tổng 8 tuần</td><td class="r">${FIN_M(tIn)}</td><td class="r">${FIN_M(tOut)}</td><td class="r">${finSign(tIn - tOut)}</td><td class="r">${FIN_M(bal)}</td></tr>
    </tbody></table></div>`;
}

/* ---------- Báo cáo ---------- */
function finReports(sel, R){
  const P = finPL(R, sel), A = finAgg(sel), tag = (sel === 'all' ? 'Toàn công ty' : finPName(sel)) + ' · ' + finRLabel(R);
  let bal = A.cash;
  return [
    {name:'Báo cáo lãi lỗ (P&L)', icon:'coin', rows:() => [['Báo cáo lãi lỗ — ' + tag], ['Khoản mục','Số tiền (đồng)'], ['Doanh thu', P.rev], ['Chi phí dự án (hoá đơn chi)', -P.direct], ...finByGroup(P.costs).map(([g, v]) => ['Chi phí vận hành — ' + g, -v]), ['Lợi nhuận trước thuế', P.gross], ['Thuế TNDN tạm tính (20%)', -P.cit], ['Lợi nhuận ròng', P.net]]},
    {name:'Báo cáo công nợ tổng hợp', icon:'file', rows:() => [['Công nợ — ' + tag], ['Mã','Dự án','Đối tác','Loại','Số tiền (đồng)','Hạn','Trạng thái'], ...A.inv.filter(i => i.status !== 'paid').map(i => [i.code, finPName(i.pid), i.partner, i.kind === 'in' ? 'Phải thu' : 'Phải trả', i.amount, fmtFull(i.due), finInvState(i)[0]])]},
    {name:'Báo cáo dòng tiền — 8 tuần tới', icon:'wallet', rows:() => [['Dòng tiền — ' + tag], ['Tuần','Thu','Chi','Ròng','Tồn quỹ'], ['Đầu kỳ','','','', A.cash], ...A.fc.map((x, i) => ['Tuần ' + (i + 1), x[0], x[1], x[0] - x[1], bal += x[0] - x[1]])]},
    {name:'Báo cáo ngân sách theo hạng mục', icon:'target', rows:() => [['Ngân sách — ' + tag], ['Nhóm','Hạng mục','Ngân sách','Đã chi','Còn lại','% sử dụng','Trạng thái'], ...A.lines.map(b => [b.g, b.name, b.b, b.s, b.b - b.s, finPct(b.s, b.b) + '%', finBudState(b)[0]])]}
  ];
}
function finReportTab(sel, R){
  const P = finPL(R, sel), Q = finPL(finPrev(R), sel), d = Q.rev ? Math.round((P.rev - Q.rev) / Q.rev * 100) : null;
  return `<div class="stats">
      ${stat('Doanh thu', FIN_M(P.rev), d == null ? 'Kỳ trước chưa có doanh thu' : (d >= 0 ? '+' : '') + d + '% so với kỳ trước', d != null && d < 0 ? 'bad' : 'good')}
      ${stat('Lợi nhuận gộp', FIN_M(P.gross), 'Biên lợi nhuận ' + P.margin + '%', P.gross < 0 ? 'bad' : '')}
      ${stat('Chi phí vận hành', FIN_M(P.opex), sel === 'all' ? 'Hoá đơn chi + chi phí hành chính, nhân sự, KD, MKT' : 'Hoá đơn chi của dự án')}
      ${stat('Lợi nhuận ròng', FIN_M(P.net), 'Sau thuế TNDN tạm tính 20%', P.net < 0 ? 'bad' : '')}
    </div>
    <div class="grid-3-2">
      <div class="card pad"><h2 class="sec-title">Kết quả kinh doanh · ${finRLabel(R)}</h2><div class="table-wrap"><table style="min-width:420px"><tbody>
        <tr><td>Doanh thu (hoá đơn thu phát hành trong kỳ)</td><td class="r b">${FIN_M(P.rev)}</td></tr>
        <tr><td>Chi phí dự án (hoá đơn chi)</td><td class="r">−${FIN_M(P.direct)}</td></tr>
        ${finByGroup(P.costs).map(([g, v]) => `<tr><td class="small muted">Chi phí vận hành — ${esc(g)}</td><td class="r">−${FIN_M(v)}</td></tr>`).join('')}
        <tr class="grp"><td>Lợi nhuận trước thuế</td><td class="r">${FIN_M(P.gross)}</td></tr>
        <tr><td>Thuế TNDN tạm tính (20%)</td><td class="r">−${FIN_M(P.cit)}</td></tr>
        <tr class="grp"><td>Lợi nhuận ròng</td><td class="r">${FIN_M(P.net)}</td></tr>
      </tbody></table></div></div>
      <div class="card list-card"><h2 class="sec-title">Báo cáo & biểu mẫu</h2><div class="small muted" style="padding:0 12px 8px">Xuất báo cáo theo kỳ để gửi ban giám đốc, kế toán hoặc cơ quan thuế — bấm để sao chép, dán vào Excel.</div>
        ${finReports(sel, R).map((r, i) => `<button class="li" data-act="fin-report" data-i="${i}"><span class="sq" style="--c:var(--blue);--t:var(--blue-t)">${ic(r.icon, 16)}</span><span class="ell"><b>${esc(r.name)}</b><small>Cập nhật ${fmtFull(todayISO())} · ${finRLabel(R)}</small></span><span class="end small muted">Tải xuống ›</span></button>`).join('')}
      </div>
    </div>`;
}

/* ---------- Thuế ---------- */
function finTaxState(t, nearest){
  if (t.paid) return ['Đã nộp', 'green'];
  const n = daysLeft(t.due);
  if (n < 0) return ['Quá hạn ' + (-n) + ' ngày', 'red'];
  return t === nearest || n <= 30 ? ['Sắp đến hạn', 'red'] : ['Chưa nộp', 'blue'];
}
function finTaxTab(){
  const unpaid = S.finTax.filter(t => !t.paid).sort((a, b) => a.due.localeCompare(b.due)), nearest = unpaid[0];
  const vat = unpaid.filter(t => /GTGT/i.test(t.type)), Qr = finQuarter(), cit = finPL(Qr, 'all').cit, y = String(today0().getFullYear());
  const paidY = S.finTax.filter(t => t.paid && String(t.paidAt || t.due).startsWith(y));
  return `<div class="stats">
      ${stat('Thuế GTGT phải nộp', FIN_M(sum(vat, t => t.amount)), vat.map(t => esc(t.period)).join(', ') || 'Không có kỳ chưa nộp')}
      ${stat('Thuế TNDN tạm tính', FIN_M(cit), '20% lợi nhuận trước thuế ' + Qr.label)}
      ${stat('Hạn nộp gần nhất', nearest ? fmtDate(nearest.due) : '—', nearest ? (daysLeft(nearest.due) >= 0 ? 'Còn ' + daysLeft(nearest.due) + ' ngày · ' : 'Quá hạn ' + (-daysLeft(nearest.due)) + ' ngày · ') + esc(nearest.type) : 'Đã nộp đủ', nearest && daysLeft(nearest.due) <= 30 ? 'bad' : 'good')}
      ${stat('Đã nộp trong năm ' + y, FIN_M(sum(paidY, t => t.amount)), [...new Set(paidY.map(t => t.type.replace('Thuế ', '').replace(' tạm tính', '')))].join(' + ') || '—')}
    </div>
    <div class="row between"><h2 class="sec-title" style="margin:0">Nghĩa vụ thuế theo kỳ</h2>${finEd() ? `<button class="btn sm" data-act="fin-tax-new">${ic('plus', 14)}Thêm nghĩa vụ thuế</button>` : ''}</div>
    <div class="table-wrap"><table><thead><tr><th>Loại thuế</th><th>Kỳ</th><th class="r">Số tiền</th><th>Hạn nộp</th><th>Trạng thái</th><th></th></tr></thead><tbody>
      ${[...S.finTax].sort((a, b) => a.paid - b.paid || (a.paid ? b.due.localeCompare(a.due) : a.due.localeCompare(b.due))).map(t => `<tr class="click" data-act="fin-tax" data-id="${t.id}" tabindex="0"><td class="b">${esc(t.type)}</td><td>${esc(t.period)}</td><td class="r b">${FIN_M(t.amount)}</td><td class="num">${fmtFull(t.due)}</td><td>${pill(...finTaxState(t, nearest))}</td><td class="r">${!t.paid && finEd() ? `<button class="btn line sm" data-act="fin-tax-pay" data-id="${t.id}">Đã nộp</button>` : t.paidAt ? `<span class="small muted">nộp ${fmtDate(t.paidAt)}</span>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Chưa có nghĩa vụ thuế</td></tr>'}
    </tbody></table></div>
    <div class="small muted">TNDN tạm tính = 20% × lợi nhuận trước thuế của quý hiện tại (doanh thu − hoá đơn chi − chi phí vận hành), xem tab Báo cáo.</div>`;
}

/* ================= sự kiện ================= */
CHG['fin-pid'] = el => { ui.finPid = el.value; render(); };
ACT['fin-pick'] = (el, d) => { ui.finPid = d.id; ui.finCat = 'project'; render(); };
ACT['fin-cat'] = (el, d) => { ui.finCat = d.k; render(); };
ACT['fin-range'] = (el, d) => { ui.finR = {k:d.k}; render(); };
CHG['fin-from'] = el => { const R = finRange(); if (!el.value) return; ui.finR = {k:'custom', from:el.value, to:el.value > R.to ? el.value : R.to}; render(); };
CHG['fin-to'] = el => { const R = finRange(); if (!el.value) return; ui.finR = {k:'custom', from:el.value < R.from ? el.value : R.from, to:el.value}; render(); };
ACT['fin-inv-f'] = (el, d) => { ui.finInvF = d.f; render(); };
ACT['fin-init'] = () => {
  const list = (S.projects || []).filter(p => !S.finp[p.id] && p.status !== 'draft');
  if (!list.length) return toast('Chưa có dự án để lập ngân sách');
  list.forEach(finInitProject); ui.finPid = list[0].id;
  log('Lập ngân sách cho ' + list.length + ' dự án', 'yellow'); render(); toast('Đã lập ngân sách mẫu theo ngân sách dự án — chỉnh ở tab Ngân sách');
};
CHG['fin-fc'] = el => { const f = S.finp[finSel()]; if (!f || !finEd()) return; f.fc[+el.dataset.i][+el.dataset.k] = Math.max(0, FIN_TR(el.value)); render(); };
CHG['fin-cash'] = el => { const f = S.finp[finSel()]; if (!f || !finEd()) return; f.cash = FIN_TR(el.value); render(); };
ACT['fin-report'] = (el, d) => { const r = finReports(finSel(), finRange())[+d.i]; copyText(finTSV(r.rows()), 'Đã sao chép “' + r.name + '” — dán vào Excel'); };

/* thông số dự án */
ACT['fin-proj'] = (el, d) => {
  const f = S.finp[d.id]; if (!f) return;
  showModal(`<form class="modal" data-form="fin-proj" data-id="${esc(d.id)}"><h3>${esc(finPName(d.id))}${closeBtn()}</h3>
    <div class="sub">Số liệu đầu kỳ của dự án (triệu đồng). Thực thu = đã thu trước + hoá đơn thu đã tất toán.</div>
    <label class="field">Giá trị hợp đồng (dự thu)<input id="fp-contract" name="contract" type="number" step="any" min="0" value="${FIN_IN_TR(f.contract)}"></label>
    <div class="row2"><label class="field">Đã thu trước khi theo dõi hoá đơn<input id="fp-got0" name="got0" type="number" step="any" min="0" value="${FIN_IN_TR(f.got0)}"></label>
      <label class="field">Tồn quỹ hiện tại<input id="fp-cash" name="cash" type="number" step="any" value="${FIN_IN_TR(f.cash)}"></label></div>
    <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
};
FORM['fin-proj'] = (v, fm) => { const f = S.finp[fm.dataset.id]; if (!f) return; Object.assign(f, {contract:FIN_TR(v.contract), got0:FIN_TR(v.got0), cash:FIN_TR(v.cash)}); closeModal(); render(); toast('Đã lưu thông số dự án'); };

/* hoá đơn */
const finInvById = id => S.finInv.find(x => x.id === id);
ACT['fin-inv'] = (el, d) => finInvModal(finInvById(d.id));
ACT['fin-inv-new'] = () => finInvModal(null);
ACT['fin-inv-pay'] = (el, d) => {
  const i = finInvById(d.id); if (!i || !finEd()) return;
  finSetPaid(i, true);
  log(`${i.code}: ${i.kind === 'in' ? 'đã thu' : 'đã thanh toán'} ${FIN_M(i.amount)}`, 'yellow');
  render(); toast(`${i.code} — ${i.kind === 'in' ? 'đã thu' : 'đã thanh toán'} ${FIN_M(i.amount)}`);
};
const finLineOpts = (pid, sel) => opt([['', '— Không gắn hạng mục —'], ...((S.finp[pid] || {}).budget || []).map(b => [b.id, b.g + ' · ' + b.name])], sel);
function finInvModal(i){
  const ed = finEd(), sel = finSel();
  i = i || {id:'', code:finNextCode('in'), pid:sel === 'all' ? (Object.keys(S.finp)[0] || '') : sel, partner:'', kind:'in', amount:0, date:todayISO(), due:dayISO(14), task:'', note:'', status:'pending', line:''};
  const tasks = [...new Set(finTasks(i.pid).concat(((S.finp[i.pid] || {}).budget || []).map(b => b.name)))];
  const dis = ed ? '' : 'disabled';
  showModal(`<form class="modal" data-form="fin-inv" data-id="${i.id}">
    <h3>${i.id ? 'Hoá đơn ' + esc(i.code) + ' ' + pill(...finInvState(i)) : 'Tạo hoá đơn'}${closeBtn()}</h3>
    ${i.po ? `<div class="sub">Tạo từ đơn mua hàng ${esc(i.po)}</div>` : ''}
    <div class="row2"><label class="field">Loại<select id="iv-kind" name="kind" data-change="fin-iv-kind" ${dis}>${opt([['in','Thu — khách hàng'],['out','Chi — NCC / thầu phụ']], i.kind)}</select></label><label class="field">Mã<input id="iv-code" name="code" required value="${esc(i.code)}" ${dis}></label></div>
    <div class="row2"><label class="field">Dự án<select id="iv-pid" name="pid" data-change="fin-iv-pid" ${dis}>${opt([['', '— Không gắn dự án —'], ...Object.keys(S.finp).map(id => [id, finPName(id)])], i.pid)}</select></label><label class="field">Đối tác<input id="iv-partner" name="partner" required value="${esc(i.partner)}" ${dis}></label></div>
    <div class="row3"><label class="field">Số tiền (triệu đồng)<input id="iv-amount" type="number" step="any" min="0" name="amount" required value="${FIN_IN_TR(i.amount)}" ${dis}></label><label class="field">Ngày phát hành<input id="iv-date" type="date" name="date" required value="${i.date || todayISO()}" ${dis}></label><label class="field">Hạn thanh toán<input id="iv-due" type="date" name="due" required value="${i.due}" ${dis}></label></div>
    <label class="field">Gắn với công việc<input id="iv-task" name="task" list="iv-tasks" value="${esc(i.task)}" ${dis}></label>
    <datalist id="iv-tasks">${tasks.map(t => `<option value="${esc(t)}">`).join('')}</datalist>
    <label class="field" id="iv-line-f" ${i.kind === 'in' ? 'hidden' : ''}>Hạng mục ngân sách (cộng vào “Đã chi” khi thanh toán)<select id="iv-line" name="line" ${dis}>${finLineOpts(i.pid, i.line)}</select></label>
    <div class="row2"><label class="field">Trạng thái<select id="iv-status" name="status" ${dis}>${opt([['pending','Chưa tất toán'],['paid','Đã tất toán']], i.status)}</select></label><label class="field">Ghi chú<input id="iv-note" name="note" value="${esc(i.note || '')}" ${dis}></label></div>
    <div class="m-actions">${i.id && ed ? delBtn('fin-inv') : ''}<button type="button" class="btn ghost" data-act="modal-close">${ed ? 'Huỷ' : 'Đóng'}</button>${ed ? `<button class="btn" type="submit">${i.id ? 'Lưu' : 'Tạo hoá đơn'}</button>` : ''}</div>
  </form>`);
}
CHG['fin-iv-pid'] = el => { const s = $('#iv-line'); if (s) s.innerHTML = finLineOpts(el.value, ''); };
CHG['fin-iv-kind'] = el => {
  const f = $('#iv-line-f'); if (f) f.hidden = el.value === 'in';
  const c = $('#iv-code'), form = el.closest('form');
  if (c && !form.dataset.id) c.value = finNextCode(el.value);
};
FORM['fin-inv'] = (v, fm) => {
  if (!finEd()) return;
  let i = finInvById(fm.dataset.id);
  const data = {code:v.code.trim(), pid:v.pid || '', partner:v.partner.trim(), kind:v.kind, amount:FIN_TR(v.amount), date:v.date, due:v.due, task:(v.task || '').trim(), note:(v.note || '').trim(), line:v.kind === 'out' ? v.line || '' : ''};
  if (S.finInv.some(x => x.code === data.code && x.id !== fm.dataset.id)) return toast('Mã hoá đơn đã tồn tại');
  if (i){ finSetPaid(i, false); Object.assign(i, data); }
  else { i = {id:uid(), status:'pending', paidAt:'', po:'', ...data}; S.finInv.push(i); log('Tạo hoá đơn ' + i.code, 'yellow'); }
  finSetPaid(i, v.status === 'paid');
  closeModal(); render(); toast('Đã lưu hoá đơn ' + i.code);
};
DEL['fin-inv'] = id => { const i = finInvById(id); if (i) finSetPaid(i, false); S.finInv = S.finInv.filter(x => x.id !== id); };

/* ngân sách */
function finLineById(id){ for (const [pid, f] of Object.entries(S.finp)){ const b = f.budget.find(x => x.id === id); if (b) return {b, pid}; } return {}; }
ACT['fin-bud'] = (el, d) => { const {b, pid} = finLineById(d.id); if (b) finBudModal(b, pid); };
ACT['fin-bud-new'] = () => finBudModal(null, finSel() === 'all' ? Object.keys(S.finp)[0] : finSel());
function finBudModal(b, pid){
  const ed = finEd(), dis = ed ? '' : 'disabled';
  b = b || {id:'', g:'Vật tư', name:'', b:0, s:0};
  showModal(`<form class="modal" data-form="fin-bud" data-id="${b.id}"><h3>${b.id ? esc(b.name) : 'Thêm hạng mục chi phí'}${closeBtn()}</h3>
    <label class="field">Dự án<select id="bd-pid" name="pid" ${b.id ? 'disabled' : dis}>${opt(Object.keys(S.finp).map(id => [id, finPName(id)]), pid)}</select></label>
    <div class="row2"><label class="field">Nhóm<input id="bd-g" name="g" list="bd-groups" required value="${esc(b.g)}" ${dis}></label><label class="field">Tên hạng mục<input id="bd-name" name="name" required value="${esc(b.name)}" ${dis}></label></div>
    <datalist id="bd-groups">${FIN_GROUPS.map(g => `<option value="${g}">`).join('')}</datalist>
    <div class="row2"><label class="field">Ngân sách (triệu đồng)<input id="bd-b" type="number" step="any" min="0" name="b" required value="${FIN_IN_TR(b.b)}" ${dis}></label><label class="field">Đã chi (triệu đồng)<input id="bd-s" type="number" step="any" min="0" name="s" value="${FIN_IN_TR(b.s)}" ${dis}></label></div>
    <input type="hidden" name="opid" value="${esc(pid || '')}">
    <div class="m-actions">${b.id && ed ? delBtn('fin-bud') : ''}<button type="button" class="btn ghost" data-act="modal-close">${ed ? 'Huỷ' : 'Đóng'}</button>${ed ? '<button class="btn" type="submit">Lưu</button>' : ''}</div></form>`);
}
FORM['fin-bud'] = (v, fm) => {
  if (!finEd()) return;
  const {b} = finLineById(fm.dataset.id), f = S.finp[v.pid || v.opid];
  const data = {g:v.g.trim() || 'Khác', name:v.name.trim(), b:FIN_TR(v.b), s:FIN_TR(v.s)};
  if (b) Object.assign(b, data); else if (f) f.budget.push({id:uid(), ...data}); else return toast('Chọn dự án');
  if (data.s > data.b && typeof botPost === 'function') botPost('Vượt ngân sách', `Hạng mục “${data.name}” đã chi ${FIN_M(data.s)} / ${FIN_M(data.b)}.`, 'red', 'Module Tài chính', 'fin', 'budget');
  closeModal(); render(); toast('Đã lưu ngân sách');
};
DEL['fin-bud'] = id => { Object.values(S.finp).forEach(f => f.budget = f.budget.filter(x => x.id !== id)); };

/* khoản chi công ty (hành chính / nhân sự / kinh doanh / marketing) */
const FIN_COST_GROUPS = {admin:['Thuê mặt bằng & văn phòng','Điện, nước, internet','Văn phòng phẩm & khác'], hr:['Đội thi công','Quản lý dự án & kỹ thuật','Kinh doanh & Marketing','Hành chính & kế toán'], sales:['Hoa hồng','Tiếp khách','Hồ sơ thầu'], mkt:['Facebook Ads','Google Ads','Sự kiện mở bán']};
ACT['fin-cost'] = (el, d) => finCostModal(S.finCost.find(c => c.id === d.id));
ACT['fin-cost-new'] = (el, d) => finCostModal(null, d.cat);
function finCostModal(c, cat){
  const ed = finEd(), dis = ed ? '' : 'disabled';
  c = c || {id:'', cat, group:'', name:'', amount:0, date:todayISO(), type:cat === 'hr' ? 'luong' : '', note:''};
  showModal(`<form class="modal" data-form="fin-cost" data-id="${c.id}"><h3>${c.id ? esc(c.name) : 'Thêm khoản chi — ' + (FIN_CATS.find(x => x[0] === c.cat) || [, ''])[1]}${closeBtn()}</h3>
    <input type="hidden" name="cat" value="${c.cat}">
    <label class="field">Nội dung<input id="fc-name" name="name" required value="${esc(c.name)}" ${dis}></label>
    <div class="row2"><label class="field">${c.cat === 'hr' ? 'Bộ phận' : c.cat === 'mkt' ? 'Kênh' : 'Nhóm'}<input id="fc-group" name="group" list="fc-groups" required value="${esc(c.group)}" ${dis}></label>
      ${c.cat === 'hr' ? `<label class="field">Loại<select id="fc-type" name="type" ${dis}>${opt([['luong','Lương'],['bh','Bảo hiểm & phúc lợi'],['thuong','Thưởng & phụ cấp']], c.type || 'luong')}</select></label>` : `<label class="field">Ghi chú<input id="fc-note" name="note" value="${esc(c.note || '')}" ${dis}></label>`}</div>
    <datalist id="fc-groups">${(FIN_COST_GROUPS[c.cat] || []).map(g => `<option value="${g}">`).join('')}</datalist>
    <div class="row2"><label class="field">Số tiền (triệu đồng)<input id="fc-amount" type="number" step="any" min="0" name="amount" required value="${FIN_IN_TR(c.amount)}" ${dis}></label><label class="field">Ngày chi<input id="fc-date" type="date" name="date" required value="${c.date}" ${dis}></label></div>
    <div class="m-actions">${c.id && ed ? delBtn('fin-cost') : ''}<button type="button" class="btn ghost" data-act="modal-close">${ed ? 'Huỷ' : 'Đóng'}</button>${ed ? '<button class="btn" type="submit">Lưu</button>' : ''}</div></form>`);
}
FORM['fin-cost'] = (v, fm) => {
  if (!finEd()) return;
  const c = S.finCost.find(x => x.id === fm.dataset.id);
  const data = {cat:v.cat, name:v.name.trim(), group:v.group.trim(), amount:FIN_TR(v.amount), date:v.date, type:v.type || '', note:(v.note || '').trim()};
  if (c) Object.assign(c, data); else S.finCost.push({id:uid(), ...data});
  closeModal(); render(); toast('Đã lưu khoản chi');
};
DEL['fin-cost'] = id => { S.finCost = S.finCost.filter(x => x.id !== id); };
ACT['fin-mkt-budget'] = () => showModal(`<form class="modal" data-form="fin-mkt"><h3>Ngân sách marketing${closeBtn()}</h3>
  <label class="field">Ngân sách mỗi tháng (triệu đồng)<input id="fm-b" name="b" type="number" step="any" min="0" value="${FIN_IN_TR(S.finSet.mktBudget)}"></label>
  <label class="field">Chiến dịch / ghi chú<input id="fm-n" name="n" value="${esc(S.finSet.mktNote || '')}"></label>
  <div class="m-actions"><button type="button" class="btn ghost" data-act="modal-close">Huỷ</button><button class="btn" type="submit">Lưu</button></div></form>`);
FORM['fin-mkt'] = v => { if (!finEd()) return; S.finSet.mktBudget = FIN_TR(v.b); S.finSet.mktNote = v.n.trim(); closeModal(); render(); };

/* thuế */
ACT['fin-tax'] = (el, d) => finTaxModal(S.finTax.find(t => t.id === d.id));
ACT['fin-tax-new'] = () => finTaxModal(null);
ACT['fin-tax-pay'] = (el, d) => { const t = S.finTax.find(x => x.id === d.id); if (!t || !finEd()) return; t.paid = true; t.paidAt = todayISO(); log(`Đã nộp ${t.type} ${t.period}: ${FIN_M(t.amount)}`, 'yellow'); render(); toast('Đã ghi nhận nộp ' + t.type); };
ACT['fin-tax-cit'] = () => { const Q = finQuarter(), a = $('#tx-amount'), p = $('#tx-period'), ty_ = $('#tx-type'); if (a) a.value = FIN_IN_TR(finPL(Q, 'all').cit); if (p) p.value = Q.label; if (ty_) ty_.value = 'Thuế TNDN tạm tính'; };
function finTaxModal(t){
  const ed = finEd(), dis = ed ? '' : 'disabled';
  t = t || {id:'', type:'Thuế GTGT', period:finQuarter().label, amount:0, due:dayISO(30), paid:false, paidAt:''};
  showModal(`<form class="modal" data-form="fin-tax" data-id="${t.id}"><h3>${t.id ? esc(t.type) + ' · ' + esc(t.period) : 'Thêm nghĩa vụ thuế'}${closeBtn()}</h3>
    <div class="row2"><label class="field">Loại thuế<input id="tx-type" name="type" list="tx-types" required value="${esc(t.type)}" ${dis}></label><label class="field">Kỳ<input id="tx-period" name="period" required value="${esc(t.period)}" ${dis}></label></div>
    <datalist id="tx-types">${['Thuế GTGT','Thuế TNDN tạm tính','Thuế TNCN','Thuế môn bài'].map(x => `<option value="${x}">`).join('')}</datalist>
    <div class="row2"><label class="field">Số tiền (triệu đồng)<input id="tx-amount" name="amount" type="number" step="any" min="0" required value="${FIN_IN_TR(t.amount)}" ${dis}></label><label class="field">Hạn nộp<input id="tx-due" name="due" type="date" required value="${t.due}" ${dis}></label></div>
    ${ed ? `<button type="button" class="link" data-act="fin-tax-cit" style="align-self:flex-start">Tính TNDN tạm tính = 20% lợi nhuận trước thuế ${finQuarter().label}</button>` : ''}
    <label class="field">Trạng thái<select id="tx-paid" name="paid" ${dis}>${opt([['0','Chưa nộp'],['1','Đã nộp']], t.paid ? '1' : '0')}</select></label>
    <div class="m-actions">${t.id && ed ? delBtn('fin-tax') : ''}<button type="button" class="btn ghost" data-act="modal-close">${ed ? 'Huỷ' : 'Đóng'}</button>${ed ? '<button class="btn" type="submit">Lưu</button>' : ''}</div></form>`);
}
FORM['fin-tax'] = (v, fm) => {
  if (!finEd()) return;
  const t = S.finTax.find(x => x.id === fm.dataset.id), paid = v.paid === '1';
  const data = {type:v.type.trim(), period:v.period.trim(), amount:FIN_TR(v.amount), due:v.due, paid, paidAt:paid ? ((t && t.paidAt) || todayISO()) : ''};
  if (t) Object.assign(t, data); else S.finTax.push({id:uid(), ...data});
  closeModal(); render(); toast('Đã lưu nghĩa vụ thuế');
};
DEL['fin-tax'] = id => { S.finTax = S.finTax.filter(x => x.id !== id); };

/* ================= tìm nhanh & trợ lý ================= */
SEARCH.push(hit => (S.finInv || []).filter(i => hit(i.code + ' ' + i.partner + ' ' + i.task)).slice(0, 6).map(i => ({icon:'file', label:i.code + ' · ' + i.partner, sub:'Hoá đơn · ' + FIN_M(i.amount) + ' · ' + finInvState(i)[0], run:() => { nav('fin', 'invoices'); finInvModal(i); }})));
const finGo = (sub_, label) => `<button class="link" data-act="nav" data-v="fin" data-sub="${sub_}">${label}</button>`;
AI.push({re:/quá hạn|công nợ|hoá đơn|hóa đơn|phải thu|phải trả/, fn:() => {
  if (!S.finInv) return '';
  const over = S.finInv.filter(finOver), unIn = S.finInv.filter(i => i.kind === 'in' && i.status !== 'paid'), unOut = S.finInv.filter(i => i.kind === 'out' && i.status !== 'paid');
  const soon = unOut.filter(i => daysLeft(i.due) >= 0 && daysLeft(i.due) <= 7);
  return `Công nợ phải thu <b>${FIN_M(sum(unIn, i => i.amount))}</b> (${unIn.length} hoá đơn), phải trả <b>${FIN_M(sum(unOut, i => i.amount))}</b> (${unOut.length}). ${soon.length ? soon.length + ' hoá đơn chi đến hạn trong 7 ngày. ' : ''}`
    + (over.length ? `<b>${over.length} hoá đơn quá hạn</b>:` + list(over.map(i => `${esc(i.code)} · ${esc(i.partner)} · ${FIN_M(i.amount)} — quá hạn ${-daysLeft(i.due)} ngày`)) : 'Không có hoá đơn quá hạn. ') + finGo('invoices', 'Mở Hoá đơn ›');
}});
AI.push({re:/dòng tiền|tồn quỹ|thu chi|dự báo/, fn:() => {
  if (!S.finp || !Object.keys(S.finp).length) return '';
  const A = finAgg('all'), w = A.fc[0] || [0, 0], n4 = A.fc.slice(0, 4), end = A.cash + sum(A.fc, x => x[0] - x[1]);
  return `Tuần này dự kiến thu <b>${FIN_M(w[0])}</b>, chi <b>${FIN_M(w[1])}</b> (${finSign(w[0] - w[1])}). 4 tuần tới ròng ${finSign(sum(n4, x => x[0] - x[1]))}. Tồn quỹ hiện tại ${FIN_M(A.cash)} → dự kiến ${FIN_M(end)} sau 8 tuần. ` + finGo('cash', 'Xem dòng tiền ›');
}});
AI.push({re:/ngân sách|vượt ns|vượt ngân sách/, fn:() => {
  if (!S.finp || !Object.keys(S.finp).length) return '';
  const A = finAgg('all'), over = A.lines.filter(b => b.s > b.b), warn = A.lines.filter(b => finBudState(b)[0] === 'Sắp hết');
  return `Đã chi ${FIN_M(A.spent)} / ${FIN_M(A.budget)} (${finPct(A.spent, A.budget)}%). ${over.length ? 'Vượt ngân sách:' + list(over.map(b => `${esc(b.name)} — vượt ${FIN_M(b.s - b.b)}`)) : 'Không có hạng mục vượt ngân sách. '}${warn.length ? warn.length + ' hạng mục sắp hết (≥75%). ' : ''}` + finGo('budget', 'Mở Ngân sách ›');
}});
AI.push({re:/thuế|gtgt|tndn/, fn:() => {
  if (!S.finTax) return '';
  const un = S.finTax.filter(t => !t.paid).sort((a, b) => a.due.localeCompare(b.due));
  return un.length ? `Còn ${un.length} nghĩa vụ thuế chưa nộp, gần nhất: <b>${esc(un[0].type)} ${esc(un[0].period)}</b> ${FIN_M(un[0].amount)}, hạn ${fmtFull(un[0].due)} (${daysLeft(un[0].due) >= 0 ? 'còn ' + daysLeft(un[0].due) + ' ngày' : 'quá hạn'}). ` + finGo('tax', 'Mở Thuế ›') : 'Đã nộp đủ các nghĩa vụ thuế.';
}});
