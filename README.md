# Survei Skala — Komunikasi Pajak untuk Wajib Pajak Baru

Instrumen survei untuk uji coba materi komunikasi perpajakan: menanyakan jenis pesan,
saluran, gaya, dan frekuensi mana yang paling memengaruhi kemauan melapor dan membayar
pajak. Dipakai bersama panduan wawancara terbuka; bagian skala diisi lebih dahulu.

**Buka di:** https://adeputra77.github.io/survei-skala-wpbaru/

## Catatan

- Satu berkas HTML, tanpa pustaka luar dan tanpa server. Halaman ini **tidak** mengirim
  jawaban ke mana pun: jawaban disimpan di peramban dan ditulis ke berkas CSV yang dipilih
  sendiri oleh pewawancara, atau diunduh satu berkas per responden bila peramban tidak
  mendukung penulisan berkas.
- Tidak ada nama, NPWP, nomor telepon, atau alamat yang diminta. Responden hanya diberi kode.
- Dua bahasa: Indonesia (bawaan) dan Inggris, lewat tombol di kanan atas.
- Menulis langsung ke berkas hanya berjalan di Edge atau Chrome pada komputer. Di ponsel,
  setiap jawaban diunduh sebagai CSV.

## Mengirim jawaban ke Google Sheet (opsional)

Halaman ini dapat mengirim setiap jawaban ke sebuah Google Sheet lewat Apps Script,
sementara berkas CSV lokal tetap berjalan sebagai cadangan.

1. Buat Google Sheet baru, salin ID-nya dari URL.
2. Extensions > Apps Script, tempel `apps_script/Code.gs`, isi `SHEET_ID` dan `SHARED_KEY`.
3. Deploy > New deployment > Web app, *Execute as* **Me**, *Who has access* **Anyone**.
   Salin Web app URL yang berakhiran `/exec`.
4. Berikan tautan berikut kepada pewawancara, satu kali per perangkat:

   `https://adeputra77.github.io/survei-skala-wpbaru/?e=<URL web app>&k=<kunci>`

   Alamat dan kunci tersimpan di peramban perangkat itu lalu dihapus dari address bar.
   Halaman publik ini tidak memuat keduanya.

Jika pengiriman gagal, misalnya sinyal mati, jawaban tetap tersimpan di perangkat,
ditandai belum terkirim, dan dicoba lagi otomatis saat halaman dibuka atau lewat tombol
**Kirim ulang**. Setiap jawaban memiliki `resp_id` agar baris ganda mudah dibuang.

## Isi

| Berkas | Keterangan |
|---|---|
| `index.html` | instrumen survei |
| `apps_script/Code.gs` | penampung jawaban untuk Google Apps Script |

Dokumentasi item, konstruk, dan sumber pustakanya ada pada codebook yang disimpan terpisah
di luar repositori ini.
