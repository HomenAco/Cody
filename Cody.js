const { Client, Collection } = require('discord.js')
const { readdirSync, statSync } = require('fs')
module.exports = class Cody extends Client {
    constructor (options = {}) {
        super (options)
        this.fs = require('fs')
        this.commands = new Collection()
        this.Discord = require('discord.js')
        this.DBL = require("dblapi.js");
        this.dbl = new this.DBL(process.env.dbl, this);
        this.database = require('./database.js')
        this.config = require('./global.json')
        this.i18next = require('i18next')
        this.translationBackend = require('i18next-node-fs-backend')
        this.fetch = require('node-fetch')
        this.moment = require('moment')
        require('moment-duration-format')
        this.ms = require('ms')
        this.setGameTime = Date.now()
        this.regionsLang = {
            'sydney': 'en-US',
            'us-south': 'en-US',
            'us-west': 'en-US',
            'us-central': 'en-US',
            'us-east': 'en-US',
            'brazil': 'pt-BR'
        }
        this.totalVotes = 0
        this.dataStaff = new Map()
            .set('owner', [])
            .set('subowner', [])
            .set('operator', [])
            .set('developer', [])
            .set('supervisor', [])
            .set('designer', [])
            .set('lastUpdate', Date.now())
        this.dataRanks = new Map()
            .set('codes', [])
            .set('decoders', [])
            .set('lastUpdate', Date.now())
        this.initializeEvents('./events')
        this.initializeCommands('./commands')
    }
    async shardsValue (req) {
        if(!req) return 'Warn: set value to require';
        let value = await this.shard.fetchClientValues(req);
        return value.reduce((a, b) => a + b, 0);
    };
    async setVotes () {
        if(this.user.id !== this.config.codyID) return this.totalVotes = 0;
        let dblJson = await this.dbl.getBot(this.user.id)
        let bpdJson = await this.fetch(`https://api.botsparadiscord.xyz/bots/${this.user.id}/info`, { 
            method: 'GET',
            headers: {'Authorization': process.env.bpd}
        }).then(res => res.json())
        this.totalVotes = dblJson.points + bpdJson.votes
    };
    async shardLog (cnt) {
        cnt = `Shard ${this.shard.id + 1}: ${cnt}`
        console.log(cnt)
        return cnt;
    };
    async firstUpperLetter (str) {
        if(!str) return 'no string';
        return str[0].toUpperCase() + str.slice(1);
    };
    async docDB (doc) {
        switch (doc.type) {
            case 1:
                if (doc.content.bot) return;
                const userCheck = await this.database.Users.findOne({'_id': doc.content.id})
                if (userCheck) return userCheck;
                const usuario = new this.database.Users({
                    _id: doc.content.id,
                    economy: { codes: 0, decoders: 1, lastDecode: '0000000000000', capacitors: 1, warned: true, warns: false, damaged: { on: false, time: '0000000000000', lastDamaged: '0000000000000' } },
                    setup: { buyed: false, internet: { buyed: false, lastPayment: '0000000000000' } },
                    altBought: [],
                    banned: { ban: false, tempban: false, time: 0 },
                    cargos: { owner: false, subowner: false, operator: false, developer: false, supervisor: false, designer: false },
                    vip: { on: false, time: '0000000000000', date: '0000000000000', votePoints: 0, warned: true, warns: true, verify: { day: 0, given: false, dbl: 0, bpd: 0, mbl: false } }
                }); await usuario.save(); return usuario;
                break;
            case 2:
                const guildCheck = await this.database.Guilds.findOne({'_id': doc.content.id})
                if (guildCheck) return guildCheck;
                const servidor = new this.database.Guilds({
                    _id: doc.content.id,
                    lang: this.regionsLang[doc.content.region] ? this.regionsLang[doc.content.region] : 'pt-BR',
                    prefix: this.user.id === this.config.canaryID ? 'c.' : 'c!',
                    concierge: { welcome: { on: false, message: 'None', channel: 'None' }, byebye: { on: false, message: 'None', channel: 'None' } },
                    autorole: { on: false, idRoles: [] },
                    sugest: { on: false, channel: 'None', coldown: 0, type: 0 },
                    config: { vipMessages: true, level: false },
                    muteds: [],
                    lockedChannels: [],
                    allowedChannels: [],
                    votePoints: 0,
                    vipBought: []
                }); await servidor.save(); return servidor;
                break;
            case 3:
                const cmdCheck = await this.database.Commands.findOne({'_id': doc.id})
                if (cmdCheck) return cmdCheck;
                const comando = new this.database.Commands({
                    _id: doc.id,
                    maintenance: false
                }); await comando.save(); return comando;
                break;
            case 4:
                const formCheck = await this.database.Forms.findOne({'_id': doc.id})
                if (formCheck) return formCheck;
                const formulario = new this.database.Forms({
                    _id: doc.id,
                    user: doc.user,
                    role: doc.role,
                    reason: doc.reason,
                    date: Date.now()
                }); await formulario.save(); return formulario;
                break;
        };
    };
    async setGame(content) {
        if ((Date.now() - this.setGameTime) <= 240000 && !content.force) return;
        this.setGameTime = Date.now();
        if (!content.random) {
            if (!content.url) return this.user.setPresence({ game: { name: content.txt, type: content.type } });
            this.user.setPresence({ game: { name: content.txt, type: content.type, url: content.url } });
            return;
        };
        const playing = ['Minecraft', 'GTA V', 'Dead Cells', 'https://discord.gg/5Xt3uHF', 'Vote em mim e adquira vários benefícios: https://botsparadiscord.xyz/bots/507292506942210048/votar'],
            streaming = [`Cody - ${await this.shardsValue('users.size')} usuários em ${await this.shardsValue('guilds.size')} servidores com ${await this.shardsValue('channels.size')} canais.`],
            listening = ['Spotify.', `${await this.shardsValue('users.size')} usuários fazerem suas coisas.`],
            watching = ['animes.', 'Netflix.'],
            randomGames = [{
                content: playing[Math.round(Math.random() * (playing.length - 1))],
                type: 0,
                url: 'https://www.twitch.tv/zmarciogod'
            }, {
                content: streaming[Math.round(Math.random() * (streaming.length - 1))],
                type: 1,
                url: false
            }, {
                content: listening[Math.round(Math.random() * (listening.length - 1))],
                type: 2,
                url: false
            }, {
                content: watching[Math.round(Math.random() * (watching.length - 1))],
                type: 3,
                url: false
            }]
        if (this.user.presence.game && randomGames.find(game => game.content === this.user.presence.game.name)) {
            for (let i = 0; i < randomGames.length - 1; i++) {
                if (randomGames[i].content !== this.user.presence.game.name) return;
                randomGames.splice(i, 1);
            };
        }
        const random = randomGames[Math.round(Math.random() * (randomGames.length - 1))];
        if (!random.url) return this.user.setPresence({ game: { name: random.content, type: random.type } });
        this.user.setPresence({ game: { name: random.content, type: random.type, url: random.url } });
    };
    async verPerm (prm, userDC, userDB) {
        if(userDB._id === this.config.ownerID || userDC.id === this.config.ownerID) return true;
        let dcPerms = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'READ_MESSAGES', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES_OR_PERMISSIONS', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']
        if(!prm) return false;
        if(!userDB && !userDC) return false;
        let possui = false
        prm.forEach(perm => {
            if(possui) return;
            if(!dcPerms.includes(perm)) {
                if(!userDB) return;
                if(userDB.cargos.get(perm)) { possui = true }
            } else {
                if(!userDC) return;
                if(userDC.hasPermission([perm])) { possui = true }
            }
        })
        return possui;
    };
    initializeCommands (path) {
        readdirSync(path).forEach(file => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    const Command = require(filePath)
                    const commandName = file.replace(/.js/g,'').toLowerCase()
                    const command = new Command(commandName,filePath+commandName+'.js', this)
                    this.commands.set(commandName, command)
                } else if (statSync(filePath).isDirectory()) {
                    this.initializeCommands(filePath)
                }
            } catch (error) {
                console.log(error)
            }
        })
    };
    initializeEvents (path) {
        readdirSync(path).forEach(file => {
            try {
                let filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    let Listener = require(filePath)
                    this.on(file.replace(/.js/g, ''), Listener)
                } else if (statSync(filePath).isDirectory()) {
                    this.initializeEvents(filePath)
                }
            } catch (error) {
                console.log(error)
            }
        })
    };
}
