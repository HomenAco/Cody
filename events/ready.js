module.exports = async function () {
    setTimeout(async () => {
        this.shardLog(`${this.user.tag} iniciado`)
        this.setGame({random: true, force: true})
        if(this.user.id === '507292506942210048') {
            this.dbl.postStats(this.guilds.size, this.shard.id, this.shard.count);
            setInterval(() => {
                this.dbl.postStats(this.guilds.size, this.shard.id, this.shard.count);
            }, 1800000);
        }
        setInterval(async () => {
            this.setGame({random: true, force: false})
        }, 5 * 1000 * 60)
        this.setDataStaff()
        setInterval(() => {
            this.setDataStaff()
        }, 15 * 1000 * 60)
    },10 * 1000)
}