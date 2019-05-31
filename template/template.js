
// base on inheritance


// Object-Orient

class Beverage {
    constructor() {

    }

    boilWater(){
        console.log('把水煮沸'); 
    }

    brew() {
        throw new Error('子类必须重写 brew 方法'); 
    }

    pourInCup() {
        throw new Error('子类必须重写 pourInCup 方法'); 
    }

    addCondiments() {
        throw new Error('子类必须重写 addCondiments 方法'); 
    }
    customerWantsCondiments() {
        return true;
    }

    // template-pattern's core-method;
    // core-process and core-algorithm;   
    init() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        if (this.customerWantsCondiments()) { // 如果挂钩返回 true，则需要调料
            this.addCondiments();
        }
    }; 
}

class Coffee extends Beverage {
    constructor() {
        super()
    }

    brew() {
        console.log('用沸水冲泡咖啡'); 
    }

    pourInCup() {
        console.log('把咖啡倒进杯子'); 
    }

    addCondiments() {
        console.log('加糖和牛奶'); 
    }

    customerWantsCondiments() {
        return window.confirm('请问需要调料吗？'); 
    }
} 


var coffee = new Coffee();
coffee.init(); 


// Function-orientation

var Beverage = function (param) {
    var boilWater = function () {
        console.log('把水煮沸');
    };
    var brew = param.brew || function () {
        throw new Error('必须传递 brew 方法');
    };
    var pourInCup = param.pourInCup || function () {
        throw new Error('必须传递 pourInCup 方法');
    };
    var addCondiments = param.addCondiments || function () {
        throw new Error('必须传递 addCondiments 方法');
    };

    var customerWantsCondiments = param.customerWantsCondiments || function() {
        return true;
    }
    var F = function () { };
    F.prototype.init = function () {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    };
    return F;
};
var Coffee = Beverage({
    brew: function () {
        console.log('用沸水冲泡咖啡');
    },
    pourInCup: function () {
        console.log('把咖啡倒进杯子');
    },
    addCondiments: function () {
        console.log('加糖和牛奶');
    },
    customerWantsCondiments() {
        return window.confirm('请问需要调料吗？');
    }
}); 

var coffee = new Coffee();
coffee.init(); 