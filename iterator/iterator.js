
// inner iterator

const each = function(arr, callback) {
    let i;

    if(Array.isArray(arr)) {
        for(;i < arr.length; i++) {
            callback(arr[i], i, arr);
        }
    } else {
        if(Object.prototype.toString.call(arr) !== '[object Object]') return;
        for(let prop in arr) {
            if(Object.prototype.hasOwnProperty.call(prop, arr)) {
                callback(prop, arr[prop], arr);
            }
        }
    }
}

// outter iterator
const Iterator = function( obj ){
    let current = 0;    
    return {
    next: function(){
        current += 1;
    },
    isDone: function(){
        return current >= obj.length;
    },
    getCurrItem: function(){
        return obj[ current ];
    }
    }
   }; 