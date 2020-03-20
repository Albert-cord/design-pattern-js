import {hasOwnProperty, designPatternConsole} from '../utils';
// chain1 -> chain2 -> chain3 -> chain4 -> default
// not if else, just pass the request to next chain to done;
// to do: add support to Promise;

class Chain {
    constructor(fn) {
        if(typeof fn !== 'function') {
            throw new Error('fn must be a function');            
        }
        this.fn = fn;
        this.next = null;
    }

    setNext(chain) {
        return this.next = chain;
    }

    passRequest(...args) {
        // is need to convert a context for fn's apply ?
        // or for user to bind a custom context ? to bind
        let nextKey = args[0];
        let ret = this.fn.apply(null, args.slice(1));
        // nextKey is a serialeable string
        designPatternConsole(nextKey, args, ret, this.next);
        if (ret === nextKey) return this.next && this.next.passRequest.apply(this.next, args);
        return ret;
    }
}

export default class DutyChains {
    constructor(nextKey, ...fns) {
        this.nextKey = nextKey;
        this.head = null;
        this.fns = Array.isArray(fns) ? fns : [fns];
        this.initChains(this.fns.slice());
        this.length = fns.length;
    }

    initChains(fns) {
        this.head = new Chain(fns.shift());
        let node = this.head;
        fns.forEach((fn, i, fns) => {
            node = node.setNext(new Chain(fn));
        });
    }

    start(...args) {
        args.unshift(this.nextKey);

        if(this.length !== 0)
            return this.head.passRequest.apply(this.head, args);
    }

    clear() {
        this.head = null;
        this.length = 0;
        this.fns = [];
    }

    set(chainNum, fns) {
        fns = Array.isArray(fns) ? fns : [fns];
        let node = this.head;
        if (!node) return false;

        let length = this.length ? this.length - 1 : 0;
        length = chainNum > 0 ? Math.min(chainNum + 1, length) : Math.max(length + chainNum + 1, 0);
        let leaveFns = this.fns.slice(length, fns.length);
        for(let i = 0; i < length; i++) {
            if(!node) return false;
            node = node.next;
        }
        fns.forEach(fn => {
            node = node.setNext(new Chain(fn));
        })
        leaveFns.forEach(fn => {
            node = node.setNext(new Chain(fn));
        })
        this.fns.splice(length, 0, ...fns);
        return true;
    }
}