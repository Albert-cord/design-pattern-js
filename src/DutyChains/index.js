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
        this.name = fn.name;
        this.next = null;
        this.indexInChains = idx;
    }

    setNext(chain) {
        return this.next = chain;
    }

    setIndex(index) {
        return this.indexInChains = index;
    }

    passToNext(nextKey, args, ret, context) {
        designPatternConsole(nextKey, args, ret, this.next);
        args.unshift(nextKey, context);
        // not easy deepEqual
        // ret === nextKey -> _.deepEqual
        // _ is so big;
        if (isEqual(ret, nextKey)) return this.next && this.next.passRequest.apply(this.next, args);
        return ret;
    }

    passRequest(nextKey, context, ...args) {
        let ret = this.fn.apply(context, args);
        // nextKey is a serialeable string
        return this.passToNext(nextKey, args, ret, context)
    }    

    async passRequestAsync(nextKey, context, ...args) {
        // is need to convert a context for fn's apply ?
        // or for user to bind a custom context ? to bind
        let ret = await this.fn.apply(context, args);
        // nextKey is a serialeable string
        return this.passToNext(nextKey, args, ret, context);
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

    // Api分离吧

    async startAsync(...args) {
        return await this.startUseContextAsync({context: null, args});
    }

    start(...args) {
        return this.startUseContext({context: null, args});
    }

    async startUseContextAsync({context = null, args}) {
        args.unshift(this.nextKey, context);
        let tailNode = this.hashChainMap.get(this.fns[this.length - 1]);
        if(tailNode.next !== null) {
            tailNode.setNext(null);
        }
        if(this.length !== 0)
            return await this.head.passRequestAsync.apply(this.head, args);
    }

    startUseContext({context = null, args}) {
        args.unshift(this.nextKey, context);
        // 考虑闭环链的可能
        let tailNode = this.hashChainMap.get(this.fns[this.length - 1].name);
        if(tailNode && tailNode.next !== null) {
            tailNode.setNext(null);
        }
        if(this.length !== 0)
            return this.head.passRequest.apply(this.head, args);
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

    // @param {Number} chainNum 负数正数皆可
    // how to use ? calculate chains position ?
    // Done

    // use

    // dc.insert(0, insertFn)
    // dc.instead(0)
    // dc.instead(0, insteadOfFn)
    // if insertFn is exsit?
    // reset? TODO
    // dc.insert('fn', insteadOfFn)

    // TODO
    // 防止闭环的可能
    setChainsByNumber(chainNum, fns, isSplice = false) {
        // TODO
        // [{name: 'funcName', fn: Function}]
        // let isObjectMode = false, fnsNames = [];
        // if(isType(fns, 'array') && isType(fns[0], 'object')) {
        //     isObjectMode = true;
        //     fnsNames = []
        // }
        console.log(chainNum, fns, isSplice)
        let node = this.head;
        if (!node) {
            console.log('no position to insert so convert to initial;');
            if(fns) this.intChains(fns);
            return true;
        }

        let length = this.length ? this.length - 1 : 0;
        chainNum = chainNum >= 0 ? Math.min(chainNum, length) : Math.max(length + chainNum + 1, 0);
        console.log(chainNum);
        let index;
        let isSteadOf = false;
        if(isSplice && chainNum === 0) {
            this.head = this.head.next;
            let node = this.head;
            while(node) {
                node.indexInChains--;
                node = node.next;
            }

        } else {
            for(let i = 0; i < chainNum - 1; i++) {
                if(!node) return false;
                node = node.next;
            }
            // when node is null, set zero?
            // if(!node)
            index = node ? node.indexInChains : 0;
            let tmpNode = node && node.next;
            // 单向链表
            // 找到已有的fn是跳过还是将已有的去除并连接新的Fn？
            // 连接，单向怎么连接前？

            if(fns) {
                let l = fns.length;
                for(let j = 0; j < l; j++) {
                    let fn = fns[j];
                    if(!fn) continue;
                    if(this.hashChainMap.has(fn.name)) {
                        let tmpNode = this.hashChainMap.get(fn.name);
                        // for of get tmpNode.parent? iterator fn
                        // setter parent is double linkedlist
                        // consider, now iterator
                        let tmpIdx = this.fns.findIndex((f) => {return fn.name === f.name});
                        // 如果是之前的。。。那之前的还要替换
                        if(tmpIdx === chainNum) {
                            // 这里下标还是要加一。。。
                            // 增加一个标志位
                            isSteadOf = true;
    
                        } else if(tmpIdx === 0) {
                            this.head = new Chain(fn, 0);
                            this.head.setNext(this.hashChainMap.get(this.fns[(0+1)]));
                            this.hashChainMap.set(fn.name, this.head);
                            fns.splice(fns.indexOf(fn), 1);
                        } else {
                            let curNode = new Chain(fn, tmpIdx);
                            this.hashChainMap.get(this.fns[tmpIdx - 1]).next = curNode;
                            curNode.setNext(tmpNode.next);
                            tmpNode.next = null;
                            this.hashChainMap.set(fn.name, curNode);
                            tmpNode = null;
                            fns.splice(fns.indexOf(fn), 1);
                        }

                    } else {

                    }
                }
                fns && fns.forEach(fn => {
                    node = node.setNext(new Chain(fn, ++index));
                    this.hashChainMap.set(fn.name, node);
                });
            }


            // 如果需要的话，跳过一个链环节则相当于删除了
            if(isSplice || isSteadOf) {
                if(tmpNode)
                    tmpNode = tmpNode.next;
                // 已经到最后的链节点了
                if(!tmpNode) {
                    node && node.setNext(null);
                }
            }
            let fnsLength =  fns ? (!isSplice ? fns.length : Math.max(fns.length - 1, 0)) : (!isSplice ? 0 : -1)
            while(tmpNode) {
                node.setNext(tmpNode);
                tmpNode.indexInChains += fnsLength;
                tmpNode = tmpNode.next;
            }
        }
        // leaveFns.forEach(fn => {
        //     node = node.setNext(new Chain(fn, ++index));
        // })
        if(isSplice && !isSteadOf) {
            this.hashChainMap.delete(this.fns[chainNum].name);
        }
        if(fns && fns.length > 0)
            this.fns.splice(!isSplice ? chainNum + 1 : chainNum, !isSplice ? 0 : 1, ...fns);
        else 
            this.fns.splice(!isSplice ? chainNum + 1 : chainNum, !isSplice ? 0 : 1);
        this.length = this.fns.length;

        return true;
    }

    insert(chainNum, ...fns) {
        return this.insertByPosition(chainNum, fns, false);
    }

    getIndexByNumOrKey(numOrKey) {
        if(isType(numOrKey, 'number')) {
            return numOrKey;
        } else {
            let node = this.hashChainMap.get(numOrKey);
            if(!node) return false;
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

    toString() {
        let ret = '';
        let idx = '';
        let node = this.head;
        while(node) {
            ret += ret.length === 0 ? node.name : `->${node.name}`;
            idx += idx.length === 0 ? node.indexInChains : `->${node.indexInChains}`;
            node = node.next;
        }
        if(!ret.length) return '';
        return `${ret}::${idx}`;
    }

    insteadOfPosition(chainNum, fns) {
        if(!fns || fns.length === 0) {
            return this.setChainsByNumber(chainNum, undefined, true);
        }
        return this.insertByPosition(chainNum, fns, true);
    }

    instead(chainNum, ...fns) {
        return this.insteadOfPosition(chainNum, fns);
    }
}