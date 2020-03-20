import {designPatternConsole, hasOwnProperty} from '../utils';

export default class EventEmitter {
    // rollup cannot support class's static property;
    // static defaultMaxListeners = 100;
    // static defaultMaxEvents = 100;

    constructor(isOnOfflineStack = false) {
        this.events = {};
        this.listenersLength = 0;
        this._maxListeners = EventEmitter.defaultMaxListeners;
        this._maxEvents = EventEmitter.defaultMaxEvents;

        // offlineStack
        this.isOnOfflineStack = isOnOfflineStack;
        this.offlineStack = {};
    }
    async addEventListener(...args) {
        return await this.on.apply(this, args);
    }
    setMaxListeners(n) {
        n = n !== n ? 1 : n;
        n = typeof n === 'number' ? n : 1;
        this._maxListeners = n || 1;
    }
    setMaxEvents(n) {
        n = n !== n ? 1 : n;
        n = typeof n === 'number' ? n : 1;
        this._maxEvents = n || 1;
    }

    async emit(event, ...args) {
        let evts = this.events[event]
        if(evts && evts.length > 0) {
            
            for (const fn of evts) {
                if(typeof fn === 'function') {
                    await fn.apply(this, args);
                }
            }

            return true;
        } else {
            if(this.isOnOfflineStack) {
                this.offlineStack[event] = this.offlineStack[event] || [];
                this.offlineStack[event].push(args);
            }
            return false;
        }
    }

    eventNames() {
        let ret = [];
        for(let val of this.events) {
            ret.push(val);
        }
        return ret;
    }
    listenerCount(eventName) {
        return this.events[eventName] ? this.events[eventName].length : 0;
    }
    listeners(eventName) {
        return this.events[eventName] ? this.events[eventName].slice(0) : [];
    }
    off(event, fn) {
        if(!hasOwnProperty(this.events, event)) return false;
        if(typeof fn === 'function') {
            let index = this.events[event].indexOf(fn);

            if(index !== -1) {
                this.events[event].splice(index, 1);
                return true;
            } else {
                return false;
            }
        }

        if(typeof fn === 'undefined') {
            this.events[event] = [];
        }
    }

    // if event fn is a async function?
    // how to make sure fns sync emit?
    async on(event, fn) {
        event = String(event);
        if(hasOwnProperty(this.events, event)) {
            if(this.listenersLength >= this._maxListeners) {
                designPatternConsole('error', '超出监听数量限制');
                return false;
            }
        } else {
            this.events[event] = [];
            this.listenersLength++;
        }
        if(this.events[event].length >= this._maxEvents) {
            designPatternConsole('error', '超出监听事件数量限制');

            return false;
        }

        this.events[event].push(fn);
        // when each finish, data is empty at the same time;
        await this.callOfflineStackEvents(event, fn);
        return true;
    }

    async callOfflineStackEvents(event, emitWayFn) {
        if(this.isOnOfflineStack && this.offlineStack[event]) {
            for (const args of this.offlineStack[event]) {
                await emitWayFn.apply(this, args);
            }
            this.offlineStack[event] = [];
        }
    }

    async once(event, fn) {
        event = String(event);
        if(hasOwnProperty(this.events, event)) {
            if(this.listenersLength >= this._maxListeners) {
                designPatternConsole('error', '超出监听数量限制');
                return false;
            }
        } else {
            this.events[event] = [];
            this.listenersLength++;
        }
        if(this.events[event].length >= this._maxEvents) {
            designPatternConsole('error', '超出监听事件数量限制');
            return false;
        }

        let onceFn = function(...args) {
            if(fn) {
                let ret = fn.apply(this, args);
                fn = null;
                return ret;
            }
        }

        this.events[event].push(onceFn);
        // 没有意义去做onceFn，离线的
        this.callOfflineStackEvents(event, fn);

    }
    removeListener(...args){
        return this.off.apply(this, args);
    }
    removeAllListeners(...args) {
        return this.off.apply(this, args[0]);        
    }
}

EventEmitter.defaultMaxListeners = 100;
EventEmitter.defaultMaxEvents = 100;
