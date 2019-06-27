module.exports = class command {
    constructor(name,pathCommand, client) {
        this.name = name;
        this.client = client;
        this.aliases = [];
        this.pathCommand = pathCommand
    }
    process({message, args, argsAlt, prefix, usuario, servidor}, t, setFixedT) {
        return this.run({message, args, argsAlt, prefix, usuario, servidor}, t, setFixedT);
    }
    run () {}
}
