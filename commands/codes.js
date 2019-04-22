const { command } = require('../utils')

module.exports = class Codes extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['code']
    }
    async run ({message}, t) {
        let user = message.mentions.users.first() ? message.mentions.users.first() : message.author
        if(user.bot) return message.channel.send(t('comandos:codes.mentionBot'))
        let userDB = await this.client.database.Users.findOne({'_id': user.id})
        if(userDB) {
            let codes = parseInt(userDB.economy.get('lastDecode')) === 0 ? userDB.economy.get('decoders') * 1000 : (parseInt((Date.now() - userDB.economy.get('lastDecode'))/1800000) * (userDB.economy.get('decoders') * 1000))
            if(codes >= (userDB.economy.get('decoders') * 25000)) {
                codes = userDB.economy.get('decoders') * 25000
            }
            let embed = new this.client.Discord.RichEmbed()
                .setTitle(`${user.username}:`)
                .setDescription(t('comandos:codes.desc', { codes: Number(userDB.economy.get('codes')).toLocaleString(), decoders: Number(userDB.economy.get('decoders')).toLocaleString(), toCollect: Number(codes).toLocaleString(), total: Number(userDB.economy.get('decoders') * 25000).toLocaleString() }))
                .setTimestamp(new Date())
                .setFooter(message.author.username, message.author.displayAvatarURL)
                .setColor(5289)
            message.channel.send(embed)
        } else {
            message.channel.send(t('comandos:codes.noUserDB'))
            this.client.newDocDB({
                id: user.id,
                type: 1,
                content: user
            })
        }
    }
}