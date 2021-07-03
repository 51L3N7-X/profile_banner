const { Client, MessageAttachment } = require('discord.js');
const client = new Client();
const { createCanvas } = require('canvas');
const fetch = require('node-fetch');
const { getColor } = require('./color-thief-node');
const config = require('./config')
const prefix = config.prefix
const { writeFile } = require('fs');
client.on('ready', () =>
    client.user.setActivity(
        `${prefix}banner`
    )
)
    .on('message', async message => {
        if (
            message.author.bot ||
            (
                !message.content.startsWith(prefix))
        )
            return;
        const [command, ...args] = message.content.slice(prefix.length).split(/ +/);
        if (
            !['banner'].includes(
                command.toLowerCase()
            )
        )
            return;
        switch (command.toLowerCase()) {
            case 'banner':
                if (message.mentions.users.first()) {
                    let check = await fetchUser(message.mentions.users.first().id);
                    if (check.status === 200) {
                        let user = await check.json();
                        if (!user.user.banner)
                            return send_color(
                                message,
                                `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar
                                }.png?size=1024`
                            );
                        let format = user?.user.banner.startsWith('a_') ? 'gif' : 'png';
                        let bannerURL = `https://cdn.discordapp.com/banners/${user.user.id}/${user.user.banner
                            }.${format}?size=1024`;
                        return message.channel.send(bannerURL);
                    }
                    else return message.channel.send(
                        `\`\`\`Error 404: I can't find this User\`\`\``
                    );
                } else if (args[0]) {
                    let check = await fetchUser(args[0]);
                    if (check.status === 200) {
                        let user = await check.json();
                        if (!user.user.banner)
                            return send_color(
                                message,
                                `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar
                                }.png?size=1024`
                            );
                        let format = user?.user.banner.startsWith('a_') ? 'gif' : 'png';
                        let bannerURL = `https://cdn.discordapp.com/banners/${user.user.id}/${user.user.banner
                            }.${format}?size=1024`;
                        return message.channel.send(bannerURL);
                    }
                    else return message.channel.send(
                        `\`\`\`Error 404: I can't find this User\`\`\``
                    );
                }
                let check = await fetchUser(message.author.id);
                if (check.status === 200) {
                    let user = await check.json();
                    if (!user.user.banner)
                        return send_color(
                            message,
                            `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar
                            }.png?size=1024`
                        );
                    let format = user?.user.banner.startsWith('a_') ? 'gif' : 'png';
                    let bannerURL = `https://cdn.discordapp.com/banners/${user.user.id}/${user.user.banner
                        }.${format}?size=1024`;
                    return message.channel.send(bannerURL);
                }
                else return message.channel.send(
                    `\`\`\`Error 404: I can't find this User\`\`\``
                );
                break;
        }
    }).login(config.bot_token);
async function send_color(message, url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    await writeFile(`./temp_img.png`, buffer, () =>
        console.log('finished downloading image!')
    );
    const color = await getColor('./temp_img.png');
    const canvas = createCanvas(2048, 1024);
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(0, 0, 2048, 1024);
    ctx.fillStyle = `rgb(${color[0]} , ${color[1]} , ${color[2]})`;
    ctx.fill();
    const attachment = new MessageAttachment(canvas.toBuffer());
    return await message.channel.send(attachment);
}
async function fetchUser(id) {
    const response = await fetch(
        `https://discord.com/api/v9/users/${id}/profile?with_mutual_guilds=false`,
        {
            headers: {
                Authorization:
                    config.user_token
            }
        }
    );
    return response;
}