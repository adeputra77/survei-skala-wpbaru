/**
 * Penampung jawaban survei skala — RCT WP Baru.
 *
 * Halaman survei (GitHub Pages) mengirim satu jawaban per POST ke web app ini,
 * dan web app menambahkannya sebagai satu baris pada Google Sheet.
 *
 * Pasang sekali:
 *   1. Buat Google Sheet baru. Salin ID-nya dari URL:
 *      https://docs.google.com/spreadsheets/d/<ID ADA DI SINI>/edit
 *   2. Extensions > Apps Script, hapus isi Code.gs, tempel berkas ini.
 *   3. Isi SHEET_ID dan SHARED_KEY di bawah.
 *   4. Deploy > New deployment > Web app:
 *        Execute as          : Me
 *        Who has access      : Anyone
 *      Salin "Web app URL" yang berakhiran /exec.
 *   5. Buka URL itu di peramban. Jika muncul {"ok":true,...}, web app siap.
 *
 * Catatan keamanan: halaman survei bersifat publik, jadi URL dan kunci diberikan
 * lewat tautan kepada pewawancara, bukan ditanam di dalam halaman. Kunci hanya
 * menyaring kiriman iseng; jangan menaruh data rahasia di sini.
 */

const SHEET_ID   = 'GANTI_DENGAN_ID_SHEET';
const SHEET_NAME = 'respon';
const SHARED_KEY = 'GANTI_DENGAN_KUNCI_ACAK';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);                    // cegah dua kiriman menimpa baris yang sama

    const body = JSON.parse(e.postData.contents);
    if (body.key !== SHARED_KEY) {
      return reply({ ok: false, error: 'kunci tidak cocok' });
    }
    const columns = body.columns || [];
    const row     = body.row || {};
    if (!columns.length) return reply({ ok: false, error: 'kolom kosong' });

    const sheet = getSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns);
      sheet.setFrozenRows(1);
    }
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // kolom baru yang belum ada di sheet ditambahkan di ujung kanan
    const missing = columns.filter(function (c) { return header.indexOf(c) === -1; });
    if (missing.length) {
      sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]);
    }
    const full = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    const line = full.map(function (c) {
      const v = row[c];
      return (v === undefined || v === null) ? '' : v;
    });
    sheet.appendRow(line);

    return reply({ ok: true, row: sheet.getLastRow(), resp_id: row.resp_id || '' });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/** Dibuka di peramban untuk memastikan web app hidup. */
function doGet() {
  let rows = -1;
  try { rows = getSheet().getLastRow(); } catch (err) {}
  return reply({ ok: true, service: 'survei skala WP baru', baris_terisi: Math.max(rows - 1, 0) });
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function reply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
