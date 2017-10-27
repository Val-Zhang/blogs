# 浅析`redux-thunk`中间件源码

大多`redux`的初学者都会使用`redux-thunk`中间件来处理异步请求，其理解简单使用方便（具体使用可参考[官方文档](https://github.com/gaearon/redux-thunk)）。我自己其实也一直在用，最近偶然发现其源码只有一个函数，考虑到其在Github上至今有6747个赞，因此比较好奇它究竟给出了一个怎么样的函数。

## 什么是`thunk`?
在看具体的源码之前，我们先看一个词`thunk`,理解这个词有助于我们理解源码。

> A thunk is a function that wraps an expression to delay its evaluation.
> 维基百科中是这样解释`thunk`的:`thunk`是一种包裹一些稍后执行的表达式的函数。

## `redux-thunk`源码

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

`redux-thunk`的源码非常简洁，出去空格一共只有**11行**，这11行中如果不算上`}`,则只有8行。最后三行模块的导出方法很好理解，

```js
// thunk的内容如下
({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  }

// thunk.withExtraArgument的结果如下
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}
```

`thunk.withExtraArgument`允许给返回的函数传入额外的参数，它比较难理解的部分和`thunk`一样，如下：

```js
({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  }
```

上述代码使用函数参数的解构加上连用三个箭头函数，显得非常简洁，单同时也带来了理解的困难（这也是箭头函数的缺点之一）。把上述代码在[babel REPL](https://babeljs.io/repl/)中转译为ES5语法后，我们看到以下结果：

```js
"use strict";

function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }
        return next();
      };
    };
  };
}
```

这下，代码一下子我们能看懂了，不过稍等这里的`dispatch`,`getState`，`next`还有`action`又是什么？

我们先看看，在`reudx`中我们如何使用中间件：

```js
let store = createStore(
    reducer,
    applyMiddleware(thunk)
);
```

看来，要解开`dispatch`,`getState`,`next`,`action`从哪里来，我们还需要再看看`applyMiddleware`的源码，如下：

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

可以看出其中`middleware`执行时传入的参数对象`middlewareAPI`中确实包含`getState`和`dispatch`两项，`next`则来自`dispatch = compose(...chain)(store.dispatch)`这一句中的`store.dispatch`,而`action`在`dispatch`某个`action`时传入。

一般来说一个有效携带数据的`action`是如下这样的：

```js
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

加入`redux-thunk`后，`action`可以是函数了，依据`redux-thunk`的源码，我们可以看出如果传入的`action`是函数，则返回这个函数的调用，如果本身传入的函数是一个异步函数，我们完全可以在函数调用结束后，获取必要的数据再次触发`dispatch`由此实现异步效果。

## 小结

`redux-thunk`的源码总的来说还是很简单的，理解这个函数本身并不难，但是在彻底弄懂每一项却需要对`reudx`的部分源码有所了解。react官方文档中的[Middleware](http://cn.redux.js.org/docs/advanced/Middleware.html)一节讲解的非常好，也确实帮我理解了中间件的工作原理，非常推荐阅读。之前一直使用`redux-thunk`做异步处理，这段时间尝试了一下`redux-saga`，它非常优雅，可用于处理更加复杂的异步action，之后有时间会再总结一下它的用法，如果可以，也愿意再分析下它的源码，欢迎关注。







