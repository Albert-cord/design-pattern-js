import {designPatternConsole} from '../utils';

export default class EventEmitter {
    // rollup cannot support class's static property;
    // static defaultMaxListeners = 100;
    // static defaultMaxEvents = 100;

    constructor(isOnOfflineStack = false) {
        this.events = {};
        this.listenersLength = 0;
        this.maxListeners = EventEmitter.defaultMaxListeners;
        this.maxEvents = EventEmitter.defaultMaxEvents;

        // offlineStack
        this.isOnOfflineStack = isOnOfflineStack;
        this.offlineStack = {};
    }
    addEventListener(...args) {
        return this.on.apply(this, args);
    }
    setMaxListeners(n) {
        n = n !== n ? 1 : n;
        n = typeof n === number ? n : 1;
        this.maxListeners = n || 1;
    }
    async emit(event, ...args) {
        let evts = this.events[event]
        if(evts && evts.length > 0) {
            
            for (const fn of evts) {
                if(typeof fn === 'function') {
                    await fn.apply(this, args);
                }
            }

            // return true;
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
        if(!Object.prototype.hasOwnProperty.call(this.events, event)) return false;
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
    on(event, fn) {
        event = String(event);
        if(Object.prototype.hasOwnProperty.call(this.events, event)) {
            if(this.listenersLength >= this.maxListeners) {
                designPatternConsole('error', '超出监听数量限制');
                return;
            }
        } else {
            this.events[event] = [];
            this.listenersLength++;
        }
        if(this.events[event].length >= this.maxEvents) {
            designPatternConsole('error', '超出监听事件数量限制');

            return;
        }

        this.events[event].push(fn);
        // when each finish, data is empty at the same time;
        if(this.isOnOfflineStack && this.offlineStack[event]) {
            this.offlineStack[event].forEach(args => {
                fn.apply(this, args);
            })
            this.offlineStack[event] = [];
        }
    }
    once(event, fn) {
        event = String(event);
        if(Object.prototype.hasOwnProperty.call(this.events, event)) {
            if(this.listenersLength >= this.maxListeners) {
                designPatternConsole('error', '超出监听数量限制');
                return;
            }
        } else {
            this.events[event] = [];
            this.listenersLength++;
        }
        if(this.events[event].length >= this.maxEvents) {
            designPatternConsole('error', '超出监听事件数量限制');
            return;
        }

        let onceFn = function(...args) {
            if(fn) {
                let ret = fn.apply(this, args);
                fn = null;
                return ret;
            }
        }

        this.events[event].push(onceFn);

        if(this.isOnOfflineStack && this.offlineStack[event]) {
            this.offlineStack[event].forEach(args => {
                onceFn.apply(this, args);
            })
            this.offlineStack[event] = [];
        }
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
