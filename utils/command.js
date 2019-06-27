module.exports = class command {
    constructor(name, pathCommands,client) {
        this.name = name;
        this.client = client;
        this.aliases = [];
        this.pathCommands = pathCommands
    }
    process({message, args, argsAlt, prefix, usuario, servidor}, t, setFixedT) {
        return this.run({message, args, argsAlt, prefix, usuario, servidor}, t, setFixedT);
    }
    run () {}
}
