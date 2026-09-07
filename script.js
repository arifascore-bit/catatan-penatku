let data = JSON.parse(localStorage.getItem('dompetImut')) || [];
let kategoriList = JSON.parse(localStorage.getItem('kategoriList')) || ['🍜 Makanan','🚌 Transport','🏥 Kesehatan','🐷 Tabungan','🎁 Hadiah','📱 Pulsa','🛍️ Lainnya'];
let chart;
document.getElementById('tanggal').valueAsDate = new Date();
function gantiTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[onclick="gantiTab('${tab}')"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');
  if(tab === 'grafik') buatGrafik();
}
function loadKategori() {
  let select = document.getElementById('kategori'); select.innerHTML = '';
  kategoriList.forEach(k => { select.innerHTML += `<option>${k}</option>` });
}
function tambahKategori() {
  let nama = prompt('Nama kategori baru apa?'); 
  if(nama && !kategoriList.includes(nama)) {
    kategoriList.push(nama); localStorage.setItem('kategoriList', JSON.stringify(kategoriList)); loadKategori();
  }
}
function tampilkanData() {
  let saldo = 0; let html = '';
  data.slice().reverse().forEach((t) => {
    saldo += t.jenis === 'pemasukan' ? t.jumlah : -t.jumlah;
    html += `<div class="item"><div class="item-header"><div><b>${t.keterangan}</b> <span class="kategori">${t.kategori}</span></div><div><span class="${t.jenis}">Rp ${t.jumlah.toLocaleString()}</span> <button onclick="hapusData(${t.id})">🗑️</button></div></div><div style="font-size:12px;color:#999;">📅 ${new Date(t.tanggal).toLocaleDateString('id-ID')}</div></div>`;
  });
  document.getElementById('riwayat').innerHTML = html || '<p style="text-align:center;">Belum ada transaksi 🥺</p>';
  document.getElementById('totalSaldo').innerText = saldo.toLocaleString();
}
function tambahData() {
  let t = { id: Date.now(), tanggal: document.getElementById('tanggal').value, keterangan: document.getElementById('keterangan').value, 
            jumlah: parseInt(document.getElementById('jumlah').value), jenis: document.getElementById('jenis').value, kategori: document.getElementById('kategori').value };
  if(!t.keterangan || !t.jumlah) return alert('Lengkapi dulu yaa 🥺');
  data.push(t); localStorage.setItem('dompetImut', JSON.stringify(data));
  document.getElementById('keterangan').value = ''; document.getElementById('jumlah').value = '';
  tampilkanData();
}
function hapusData(id) { data = data.filter(t => t.id !== id); localStorage.setItem('dompetImut', JSON.stringify(data)); tampilkanData(); }
function buatGrafik() {
  let pengeluaran = data.filter(t => t.jenis === 'pengeluaran'); let kategori = {};
  pengeluaran.forEach(t => { kategori[t.kategori] = (kategori[t.kategori] || 0) + t.jumlah; });
  const ctx = document.getElementById('chartKategori').getContext('2d'); if(chart) chart.destroy();
  chart = new Chart(ctx, { type: 'pie', data: { labels: Object.keys(kategori), datasets: [{ data: Object.values(kategori), backgroundColor: ['#FF9A9E','#FECFEF','#A1EAF1','#FFD3A0','#B4E7CE','#D0B3FF'] }] } });
}
loadKategori(); tampilkanData();
