
// operator-user  -->command-generator --> be used operator
// not to know others, decoup program, just konw command object
// but it is just add coupling to command-generator and be used operator
// so it is just pass complex to the another side, adn command-generator is stable;
// eg: client-side to server-side, execute-action-side to provide-action-side
// for another side can be convenient(+,but can control),
// of course the other will be convenient also(-)
// so the Command interface is the two-side accepted.

// Object-Oriented

// two-side
class Command {
    constructor(receiver) {
        this.receiver = receiver;
    }

    execute() {
        // how it great verbose!
        // constructor
        // this.isNeedExecute = isNeedExecute;
        // in execute: if(!this.isNeedExecute) return;
        // so convert controller to the subclass
        if(!this.isNeedExecute()) return;
        // how know receiver's execute func ?
        // if it is must know receiver's inner construction
        // how it great invalid
        // this.receiver.start()
        // so this a spec interface for runtime error;
        throw new Error('must realize the execute method');
    }
    isNeedExecute() {
        return true;
    }

    undo() {
        // how it great verbose!
        if (!this.isNeedUndo) return;

        throw new Error('must realize the undo method');
    }
    isNeedUndo(){
        return true;
    }
}
//

// difficult-side
var MenuBar = {
    refresh: function () {
        console.log('刷新菜单目录');
    }
}; 

class RefreshMenuBarCommand extends Command {
    constructor(...args) {
        super(args);

    }

    execute() {
        // will know how it work;
        this.receiver.refresh();
    }; 

    undo() {
        // will know how it work;
        this.receiver.unrefresh();
    }
}

// this variable:refreshMenuBarCommand, easy-side will be stable, 
// it's name cannot be change
var refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar); 

//

// easy-side
// if change, just,change another or interface

function setCommand(user, realizeCommand) {
    // it is fixed
    // eg:onClick, this action
    user.onClick = function() {
        realizeCommand.execute();
    };

    user.undo = function() {
        realizeCommand.undo();
    }
}

setCommand(button1, refreshMenuBarCommand); 


// Function-Oriented

// difficult-side

var MenuBar = {
    refresh: function () {
        console.log('刷新菜单界面');
    }
};
var RefreshMenuBarCommand = function (receiver) {
    return {
        execute() {
            return receiver.refresh();
        },
        undo() {
            return receiver.unrefresh();
        }
    }
};
// mediator
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar); // command-generator

// easy-side
var setCommand = function (button, realizeCommand) {
    button.onclick = function () {
        realizeCommand.execute();
    }
    button.undo = function() {
        // but cannot spec
        realizeCommand.undo();
    }
};

setCommand(button1, refreshMenuBarCommand); 


// macroCommand

class macroCommand {
    constructor(...commandList) {
        this.commandList = commandList || [];
    }
    add(command) {
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
        if(idx !== -1) {
            this.commandList.splice(idx, 1);
        } else {
            this.commandList = [];
        }
    }
}