const { Client, GatewayIntentBits } = require('discord.js');
const db = require('./db');  // ← 여기 추가

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

function parseTime(input) {
    let total = 0;

    const hourMatch = input.match(/(\d+)시간/);
    const minMatch = input.match(/(\d+)분/);

    if (hourMatch) {
        total += parseInt(hourMatch[1], 10) * 3600000;
    }

    if (minMatch) {
        total += parseInt(minMatch[1], 10) * 60000;
    }

    return total;
}

client.once('ready', () => {
    console.log(`로그인됨: ${client.user.tag}`);
});

// 여기서부터 "일정 시간 후 알림" 코드를 추가합니다!
setInterval(() => {
    const now = Date.now();

    db.all(`SELECT * FROM commissions`, [], (err, rows) => {
        if (err) {
            console.error('커미션 조회 실패:', err);
            return;
        }

        rows.forEach(c => {
            const duration = c.duration || 0;

            if (duration > 0 && now - c.time > duration) {

                client.users.fetch(c.user).then(user => {
                    user.send(`🔔 ${c.type} 끌올 가능!`);
                }).catch(console.error);

                // DB에서 삭제
                db.run(`DELETE FROM commissions WHERE id = ?`, [c.id]);

                console.log(`알림 전송 & 삭제: ${c.user} ${c.type}`);
            }
        });
    });

}, 5000);

// 간단한 명령어 예시
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === '핑') {
        await interaction.reply('퐁!');
    }

    // 2. 기존의 '등록' 부분을 지우고 아래 코드로 교체합니다.
    if (interaction.commandName === '등록') {
        const type = interaction.options.getString('타입');
        const timeInput = interaction.options.getString('시간');
        const duration = parseTime(timeInput);

        if (duration <= 0) {
            return interaction.reply('시간 형식 오류! (예: 1시간30분 / 45분 / 2시간)');
        }

        db.run(
            `INSERT INTO commissions (user, type, time, duration) VALUES (?, ?, ?, ?)`,
            [interaction.user.id, type, Date.now(), duration],
            err => {
                if (err) {
                    console.error('등록 실패:', err);
                    return;
                }
            }
        );

        await interaction.reply(`${type} 등록 완료! (${timeInput} 후 알림)`);
    }

    if (interaction.commandName === '남은시간') {
        const userId = interaction.user.id;

        db.all(
            `SELECT * FROM commissions WHERE user = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    console.error('남은시간 조회 실패:', err);
                    return interaction.reply('조회 중 오류가 발생했습니다.');
                }

                if (rows.length === 0) {
                    return interaction.reply('등록 없음');
                }

                let msg = '';

                rows.forEach(c => {
                    const remaining = c.duration - (Date.now() - c.time);

                    if (remaining <= 0) {
                        msg += `🔔${c.type}: 끌올 가능\n`;
                    } else {
                        const sec = Math.ceil(remaining / 1000);
                        msg += `${c.type}: ${sec}초 남음\n`;
                    }
                });

                interaction.reply(msg);
            }
        );
    }
});

client.login('');

