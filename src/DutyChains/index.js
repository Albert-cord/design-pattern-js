import {hasOwnProperty, designPatternConsole, throwDesignPatternError, isType} from '../utils';
// import _ from 'underscore-util-js';
// import {isDeepEqual} from 'underscore-util-js';
import isEqual from 'lodash/isEqual';

// const {isDeepEqual} = require('underscore-util-js');


// chain1 -> chain2 -> chain3 -> chain4 -> default
// not if else, just pass the request to next chain to done;
// to do: add support to Promise;

export class Chain {
    constructor(fn, idx) {
        if(!isType(fn, 'function')) {
            // throw new Error('fn must be a function');    
            throwDesignPatternError('fn must be a function', 'ChainsError');        
        }
        this.fn = fn;
        this.next = null;
        this.indexInChains = idx;
    }

    setNext(chain) {
        return this.next = chain;
    }

    setIndex(index) {
        return this.indexInChains = index;
    }

    async passRequest(nextKey, context, ...args) {
        // is need to convert a context for fn's apply ?
        // or for user to bind a custom context ? to bind
        let ret = await this.fn.apply(context, args);
        // nextKey is a serialeable string
        designPatternConsole(nextKey, args, ret, this.next);
        args.unshift(nextKey, context);
        // not easy deepEqual
        // ret === nextKey -> _.deepEqual
        // _ is so big;
        if (isEqual(ret, nextKey)) return this.next && this.next.passRequest.apply(this.next, args);
        return ret;
    }
}

export default class DutyChains {
    constructor(...args) {
        let fns;
        if(args.length === 1) {
            args = args[0]
            this.nextKey = args.nextKey;
            fns = args.fns;
        } else {
            this.nextKey = args[0];
            fns = args.slice(1);
        }
        this.head = null;
        this.fns = Array.isArray(fns) ? fns : [];
        if(this.fns.length === 0) throwDesignPatternError('DutyChains fns parameters must be function', 'DutuChainsError');
        this.length = fns.length;
        this.hashChainMap = new Map();
        this.initChains(this.fns.slice());
    }

    initChains(fns) {
        let headFn = fns.shift();
        this.head = new Chain(headFn, 0);
        this.hashChainMap.set(headFn.name, this.head);
        let node = this.head;
        fns.forEach((fn, i, arr) => {
            node = node.setNext(new Chain(fn, i + 1));
            this.hashChainMap.set(fn.name, node);
        });
    }

    async start(...args) {
        return await this.startUseContext({context: null, args});
    }

    async startUseContext({context = null, args}) {
        args.unshift(this.nextKey, context);

        if(this.length !== 0)
            return await this.head.passRequest.apply(this.head, args);
    }

    clear() {
        this.head = null;
        this.length = 0;
        this.fns = [];
        this.hashChainMap.clear();
    }

    setNextKey(nextKey) {
        this.nextKey = nextKey;
    }

    // @param {Number} chainNum
    // how to use ? calculate chains position ?
    // Done
    setChainsByNumber(chainNum, fns, isSplice = false) {
        fns = Array.isArray(fns) ? fns : [fns];
        if(fns.length === 1) fns = fns.filters(f => isType(f, 'function'));
        let node = this.head;
        if (!node) {
            // return false;
            console.log('no position to insert so convert to initial;');
            this.initChains(fns);
            return true;
        }

        let length = this.length ? this.length - 1 : 0;
        length = chainNum > 0 ? Math.min(chainNum + 1, length) : Math.max(length + chainNum + 1, 0);
        let leaveFns = this.fns.slice(length, fns.length);
        let index;
        for(let i = !isSplice ? 0 : 1; i < length; i++) {
            if(!node) return false;
            node = node.next;
        }
        index = node.indexInChains;
        fns.forEach(fn => {
            node = node.setNext(new Chain(fn, ++index));
        });
        leaveFns.forEach(fn => {
            node = node.setNext(new Chain(fn, ++index));
        })
        this.fns.splice(length, !isSplice ? 0 : 1, ...fns);
        return true;
    }

    insert(chainNum, fns, isSplice = false) {
        return this.insertByPosition(chainNum, fns, isSplice);
    }

    getIndexByNumOrKey(numOrKey) {
        if(isType(numOrKey, 'number')) {
            return this.setChainsByNumber(numOrKey, fns, isSplice);
        } else {
            let node = this.hashChainMap.get(numOrKey);
            if(!node || !isType(node, 'object')) return false;
            return node.indexInChains;
        }
    }

    insertByPosition(chainNum, fns, isSplice = false) {
        if(!isType(fns, 'array', 'function')) {
            throwDesignPatternError('insertByPosition second parameter must by arrayOf function or one function', 'DutuChainsError');
        }

        let index = this.getIndexByNumOrKey(chainNum);
        if(index === false) return false;
        return this.setChainsByNumber(index, fns, isSplice);
    }

    insteadOfPosition(chainNum, fns) {
        if(!fns) {
            return this.setChainsByNumber(chainNum, null, true);
        }
        return insertByPosition(chainNum, fns, true);
    }

    instead(chainNum, fns) {
        return this.insteadOfPosition(chainNum, fns);
    }
}