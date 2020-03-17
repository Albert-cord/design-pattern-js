

// go to command-pattern
// combind pattern
// and all commands no matter it is macroCommand or Command
// all commands has similar interface to do the same operation (but some will cause a error)
// and command can't has bidirectional mapping(it's difficult to manage, so move to mediator);
// it can combind the dutyChains's pattern to do;
// refer a parent object;
// can avoid if else;
class Command {
    constructor(receiver, isNeedExecute = true, isNeedUndo = true) {
        this.receiver = receiver;
        this.isNeedExecute = isNeedExecute;
        this.isNeedUndo = isNeedUndo;
        this.parent = null;
    }

    // combind-patten
    add() {
        throw new Error('leaf is cannot add command');
    }

    remove() {
        if(!this.parent) {
            throw new Error('root cannot be removed');
        }
        this.parent.remove(this);
    }

    execute() {
        // how it great verbose!
        if (!this.isNeedExecute) return;
        // how know receiver's execute func ?
        // if it is must know receiver's inner construction
        // how it great invalid
        // this.receiver.start()
        // so this a spec interface for runtime error;
        throw new Error('must realize the execute method');
    }

    undo() {
        // how it great verbose!
        if (!this.isNeedUndo) return;

        throw new Error('must realize the undo method');
    }
}

// macroCommand
class macroCommand {
    constructor(...commandList) {
        this.commandList = commandList || [];
        this.parent = null;
    }
    add(command) {
        command.parent = this;
        this.commandList.push(command);
    }
    execute() {
        this.commandList.forEach(command => {
            command.execute && command.execute();
        })
    }
    undo() {
        this.commandList.forEach(command => {
            command.undo && command.undo();
        })
    }
    remove(command) {
        let idx = this.commandList.indexOf(command);
        if (idx !== -1) {
            this.commandList.splice(idx, 1);
        } else {
            this.commandList = [];
        }
    }
}