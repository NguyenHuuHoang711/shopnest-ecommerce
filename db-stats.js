const db = require('./db');
const fs = require('fs');
const path = require('path');

console.log('\n===============================================================');
console.log('            SHOPNEST DATABASE SUMMARY & STATS');
console.log('===============================================================\n');

// 1. Database File Info
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'shopnest.db');

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`📁 Đường dẫn DB: ${dbPath}`);
  console.log(`📦 Dung lượng file: ${(stats.size / 1024).toFixed(2)} KB`);
  const journalMode = db.pragma('journal_mode', { simple: true });
  console.log(`⚙️  Journal Mode: ${journalMode.toUpperCase()}`);
} else {
  console.log(`⚠️  File DB chưa tồn tại tại: ${dbPath}`);
}

console.log('\n---------------------------------------------------------------');
console.log('1. THỐNG KÊ TỔNG QUAN TẤT CẢ CÁC BẢNG (TABLES & ROW COUNTS)');
console.log('---------------------------------------------------------------');

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all();

const summary = tables.map((t, idx) => {
  const count = db.prepare(`SELECT count(*) as total FROM "${t.name}"`).get().total;
  const cols = db.prepare(`PRAGMA table_info("${t.name}")`).all().map(c => c.name).join(', ');
  return {
    'STT': idx + 1,
    'Tên Bảng (Table)': t.name,
    'Số Dòng (Rows)': count,
    'Danh Sách Cột (Columns)': cols
  };
});

console.table(summary);

console.log('\n---------------------------------------------------------------');
console.log('2. DỮ LIỆU MẪU CHI TIẾT TỪNG BẢNG (SAMPLE PREVIEWS)');
console.log('---------------------------------------------------------------');

for (const t of tables) {
  const rows = db.prepare(`SELECT * FROM "${t.name}" LIMIT 3`).all();
  console.log(`\n📌 Bảng: [ ${t.name} ] (${rows.length > 0 ? 'Dữ liệu mẫu' : 'Bảng trống'}):`);
  if (rows.length > 0) {
    console.table(rows);
  } else {
    console.log('   (Chưa có bản ghi nào)');
  }
}

console.log('\n======================= HOÀN TẤT =============================\n');
