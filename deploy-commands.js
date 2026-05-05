const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('핑')
        .setDescription('핑 테스트'),
    new SlashCommandBuilder()
        .setName('등록')
        .setDescription('커미션 등록')
        .addStringOption(option =>
            option
                .setName('타입')
                .setDescription('등록할 타입을 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '커미션 타입1', value: '타입1' },
                    { name: '커미션 타입2', value: '타입2' },
                    { name: '커미션 타입3', value: '타입3' },
                    { name: '커미션 타입4', value: '타입4' },
                    { name: '커미션 타입5', value: '타입5' },
                    { name: '커미션 타입6', value: '타입6' },
                    { name: '커미션 타입7', value: '타입7' },
                    { name: '커미션 타입8', value: '타입8' },
                    { name: '커미션 타입9', value: '타입9' },
                    { name: '커미션 타입10', value: '타입10' },
                    { name: '커미션 타입11', value: '타입11' },
                    { name: '커미션 타입12', value: '타입12' }
                )
        )
        .addStringOption(option =>
            option
                .setName('시간')
                .setDescription('예: 1시간30분 / 45분 / 2시간')
                .setRequired(true)
        )
    ,new SlashCommandBuilder()
        .setName('남은시간')
        .setDescription('커미션 끌올의 남은 시간을 확인합니다')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken('');

rest.put(
    Routes.applicationCommands(''),
    { body: commands }
)
    .then(() => console.log('명령어 등록 완료'))
    .catch(console.error);