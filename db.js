const sqlite3 = require('sqlite3').verbose();

// commissions.db 파일 생성 (없으면 자동 생성)
const db = new sqlite3.Database('./commissions.db');

// 테이블 생성
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT,
      type TEXT,
      time INTEGER,
      duration INTEGER
    )
  `);

    db.all(`PRAGMA table_info(commissions)`, [], (err, rows) => {
        if (err) {
            console.error('테이블 정보 확인 실패:', err);
            return;
        }

        const hasDuration = rows.some(row => row.name === 'duration');

        if (!hasDuration) {
            db.run(`ALTER TABLE commissions ADD COLUMN duration INTEGER DEFAULT 0`);
        }
    });
});

module.exports = db;