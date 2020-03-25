import {designPatternConsole, hasOwnProperty, isType} from '../utils';

export default class EventEmitter {
    // rollup cannot support class's static property;
    // static defaultMaxListeners = 100;
    // static defaultMaxEvents = 100;

    constructor(isOnOfflineStack = false) {
        this.events = {};
        this.eventsLength = 0;
        this._maxListeners = EventEmitter.defaultMaxListeners;
        this._maxEvents = EventEmitter.defaultMaxEvents;

        // offlineStack
        this.isOnOfflineStack = isOnOfflineStack;
        this.offlineStack = {};
    }

    addEventListener(...args) {
        return this.on.apply(this, args);
    }

    async addEventListenerAsync(...args) {
        return await this.onAsync.apply(this, args);
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

    _realEmit(event, ...args) {
        // 这里不备份，off不了
        let evts = this.events[event];
        if(evts && evts.length > 0) {
            evts = evts.slice(0);
            // 长度可能会动态改
            let evtLength = evts.length;
            for(let i = 0; i < evtLength; i++) {
                if(typeof evts[i] === 'function') {
                    // 这里不能return
                    evts[i].apply(this, args);
                }
            }
            evts = [];
            return true;
        } else {
            // 这里的if block是否应该返回true?
            if(this.isOnOfflineStack) {
                this.offlineStack[event] = this.offlineStack[event] || [];
                this.offlineStack[event].push(args);
            }
            return false;
        }
    }

    emit(event, ...args) {
        return this._realEmit(event, ...args);
    }

    async emitAsync(event, ...args) {
        return await this._realEmit(event, ...args);
    }

    eventNames() {
        let ret = [];
        for(let val of Object.keys(this.events)) {
            ret.push(val);
        }
        return ret;
    }
    listenerCount(eventName) {
        if(hasOwnProperty(this.events, eventName)) {
            return this.events[eventName].length;
        } else {
            return 0
        }
    }
    listeners(eventName) {
        if(hasOwnProperty(this.events, eventName)) {
            return this.events[eventName].slice(0);
        } else {
            return [];
        }
    }
    off(event, fn) {
        if(!hasOwnProperty(this.events, event)) return false;
        if(typeof fn === 'function') {
            let index = this.events[event].indexOf(fn);
            // console.log()
            designPatternConsole(index, this);
            if(index !== -1) {
                this.events[event].splice(index, 1);
                return true;
            } else {
                return false;
            }
        }

        if(typeof fn === 'undefined') {
            this.events[event] = [];
            delete this.events[event];
            this.eventsLength--;
            return true;
        }
    }

    // if event fn is a async function?
    // how to make sure fns sync emit?

    _realOn(event, fn) {
        event = String(event);
        if(hasOwnProperty(this.events, event)) {

            if(this.events[event].length >= this._maxListeners) {
                designPatternConsole('error', '超出监听事件数量限制');
    
                return false;
            }

        } else {
            if(this.eventsLength >= this._maxEvents) {
                designPatternConsole('error', '超出监听数量限制');
                return false;
            }
            this.events[event] = [];
            this.eventsLength++;
        }
        if(this.events[event].length > this._maxListeners) {
            designPatternConsole('error', '超出监听事件数量限制');

            return false;
        }

        this.events[event].push(fn);
        // when each finish, data is empty at the same time;
        
        return true;
    }

    async onAsync(event, fn) {
        this._realOn(event, fn);
        return await this.callOfflineStackEventsAsync(event, fn);
        // if(isType(ret, 'promise')) return true;
        // return ret;
    }

    on(event, fn) {
        let ret = this._realOn(event, fn);
        this.callOfflineStackEvents(event, fn);
        return ret;
    }

    callOfflineStackEvents(event, emitWayFn) {
        if(this.isOnOfflineStack && this.offlineStack[event]) {
            for (const args of this.offlineStack[event]) {
                emitWayFn.apply(this, args);
            }
            this.offlineStack[event] = [];
        }
    }

    async callOfflineStackEventsAsync(event, emitWayFn) {
        if(this.isOnOfflineStack && this.offlineStack[event]) {
            for (const args of this.offlineStack[event]) {
                await emitWayFn.apply(this, args);
            }
            this.offlineStack[event] = [];
        }
    }

    createOnceFn(event, fn) {
        let self = this;
        let onceFn = function (...args) {
            let ret = fn.apply(this, args);
            // 这里应该off 该方法return的函数
            self.off(event, onceFn);
            designPatternConsole(fn, onceFn);

            return ret;
        }

        return onceFn;
    } 

    once(event, fn) {
        
        let onceFn = this.createOnceFn(event, fn);

        this._realOn(event, onceFn);
        // 没有意义去做onceFn，离线的
        this.callOfflineStackEvents(event, fn);
    }

    async onceAsync(event, fn) {
        let onceFn = this.createOnceFn(event, fn);

        this._realOn(event, onceFn);
        // 没有意义去做onceFn，离线的
        await this.callOfflineStackEvents(event, fn);
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
