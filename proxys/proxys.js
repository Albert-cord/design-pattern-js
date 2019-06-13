
// 伪保护代理
// 虚拟代理
var myImage = (function(){
    var imgNode = document.createElement( 'img' );
    document.body.appendChild( imgNode );
    return {
        setSrc: function( src ){
            imgNode.src = src;
        }
    }
})();
var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        myImage.setSrc( this.src );
    }
    return {
        setSrc: function( src ){
            myImage.setSrc( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
            img.src = src;
        }
    }
})();
proxyImage.setSrc( 'http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );


// 虚拟代理
//接下来，给这些checkbox 绑定点击事件，并且在点击的同时往另一台服务器同步文件：
var synchronousFile = function( id ){
    console.log( '开始同步文件，id 为: ' + id );
};
var checkbox = document.getElementsByTagName( 'input' );
for ( var i = 0, c; c = checkbox[ i++ ]; ){
    c.onclick = function(){
        if ( this.checked === true ){
            synchronousFile( this.id );
        }
    }
};

var synchronousFile = function( id ){
    console.log( '开始同步文件，id 为: ' + id );
};

var proxySynchronousFile = (function(){
    var cache = [], // 保存一段时间内需要同步的ID
    timer; // 定时器
    return function( id ){
        cache.push( id );
        if ( timer ){ // 保证不会覆盖已经启动的定时器
            return;
        }
        timer = setTimeout(function(){
        synchronousFile( cache.join( ',' ) ); // 2 秒后向本体发送需要同步的ID 集合
        clearTimeout( timer ); // 清空定时器
        timer = null;
        cache.length = 0; // 清空ID 集合
    }, 2000 );
    }
})();

var checkbox = document.getElementsByTagName( 'input' );
for ( var i = 0, c; c = checkbox[ i++ ]; ){
    c.onclick = function(){
        if ( this.checked === true ){
            proxySynchronousFile( this.id );
        }
    }
};

// 缓存代理
var createProxyFactory = function( fn ){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call( arguments, ',' );
        if ( args in cache ){
            return cache[ args ];
        }
        return cache[ args ] = fn.apply( this, arguments );
    }
};
