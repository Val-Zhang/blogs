年初的时候给自己定目标希望做的每一件事情都能有一个结论。这次花了 22 天读完了 [Eloquent-JavaScript](https://eloquentjavascript.net/)，以下是一些感触（收获？）。

细想来读完这本书还真是花了不少时间，22 天这个数字太虚，细算一下，工作日每天提前到的一小时（公司并不打卡，这一小时按照大家普遍到的时间算）以及睡前的一些时间都花在了读这本书上面，累计可能也有二十多个小时。

## 为什么决定读这本书
在两三年前我就听说过《Eloquent JavaScript 》这本书，大概在年前，在我订阅的某一封邮件中，又有人推荐到这本书，大致浏览了一下目录，感觉还是挺系统的，去 github 上大致查了一下，发现有 2k+ star，而作者是 [CodeMirror](https://github.com/codemirror/CodeMirror) 的主要维护者，CodeMirror 是我做第一个正规前端项目时用到的主要的库之一，感觉还真是有缘，就将其加入到了我那很长的待读清单中。

## 为什么要再系统的学一次 JS
上次系统的去学 JS 还是一年半以前参加图灵社区的活动，领读《JavaScript 高级程序设计（第3版）》，《高程》非常经典，那次领读下来自己也是收获满满，不过毕竟是 12 年出版的书，六七年来 JS 变化太大了，我确实需要再系统的阅读一本更新一点的讲解 JS 的书，辅助自己将大脑中零散的概念整合起来。

我一直相信重复是在某方面变得更专业的很好的途径。还好，阅读本书确实还是有不少收获。有的收获是弥补了自己的知识盲点，有的收获则是突然想明白，原来某个东西还可以这么理解，有的收获则是还可以通过这种方式讲解一个枯燥的概念。

## 阅读本书有哪些收获
实际上，在读本书的过程中，我有过好几次，「哇，还可以这样写！」/「哇，还可以这样用！」的惊喜。以下是一些惊喜片段：

### 惊喜1: 可以这样介绍数据结构

> Every now and then, usually between 8 p.m. and 10 p.m., Jacques finds himself transforming into a small furry rodent with a bushy tail.
> 
> On one hand, Jacques is quite glad that he doesn’t have classic lycanthropy. Turning into a squirrel does cause fewer problems than turning into a wolf. Instead of having to worry about accidentally eating the neighbor (that would be awkward), he worries about being eaten by the neighbor’s cat. After two occasions where he woke up on a precariously thin branch in the crown of an oak, naked and disoriented, he has taken to locking the doors and windows of his room at night and putting a few walnuts on the floor to keep himself busy. 
> 
> That takes care of the cat and tree problems. But Jacques would prefer toget rid of his condition entirely. The irregular occurrences of the transformation make him suspect that they might be triggered by something. For a while, he believed that it happened only on days when he had been near oak trees. But avoiding oak trees did not stop the problem.
> 
> Switching to a more scientific approach, Jacques has started keeping a daily log of everything he does on a given day and whether he changed form. With this data he hopes to narrow down the conditions that trigger the transformations.
> 
> The first thing he needs is a data structure to store this information.

上文是[第 4 章 Data Structures: Objects and Arrays](http://eloquentjavascript.net/04_data.html) 的前言部分，大意是 Jacques 这个人时不时会在晚上八点到十点变成一只松鼠，但是他不清楚究竟是什么行为触发了变形，最后他决定用一定的数据结构记录下自己的行为，并通过进一步的分析来找到自己变形的原因。

随着这个故事的进展，作者不断的引入了 `Object` 和 `Array` 的多种属性，方法等的含义，用法，最终通过实例运用 phi 相关系数 (φ) 找到了变形的原因在于不健康的生活习惯。

通过故事的形式来讲解一个枯燥的概念本身并不新奇，不过本书作者脑洞之大还真的让我感到惊喜，本书故事性和实践性十足，读起来还是挺开心的。

### 惊喜2: DOM 树

> Using cryptic numeric codes to represent node types is not a very JavaScript-like thing to do. Later in this chapter, we’ll see that other parts of the DOM interface also feel cumbersome and alien. The reason for this is that the DOM wasn’t designed for just JavaScript.

在阅读 [第 14 章 The Document Object Model](https://eloquentjavascript.net/14_dom.html) 过程中，我又回顾了一次文档对象模型，实际上由于在工作中很少再去直接操作 DOM ，导致很久没有再好好的思考过 DOM，只是在回看这些熟悉又不熟悉的 DOM 相关 api 的过程中，突然想到「DOM树，DOM 树，DOM 提供的所有 api 不都是在方便我们操作这棵树嘛！」

我肯定是知道 DOM 是树形结构的，但是之前却一直没有深入的去想 DOM 为什么要是树形结构，树除了可以方便的表示递归的结构外，比起数组查找和替换也会高效很多。如果我最初学习 DOM 时，能有更好的算法基础，学习起来肯定会不一样，不会再想着去记住 DOM 提供的 api，而是会换个角度想到，方便的操作树，理应有哪些 api。或许了解了计算机相关的一些更本质的知识后，再去学习其它内容都会快很多吧。

> 当前目前自己在算法方面的基础也依旧不好，之后还是得想办法好好的补一补。

### 惊喜3: 如何创造一门语言

> The most immediately visible part of a programming language is its syntax, or notation. A parser is a program that reads a piece of text and produces a data structure that reflects the structure of the program contained in that text.

[第 12 章 Project: A Programming Language](https://eloquentjavascript.net/12_language.html)，也是让我倍感惊喜的一章。
知乎上存在一些类似[如何写一个简单的编译器？ ](https://www.zhihu.com/question/36756224/answer/122676534) 这样的问题，本章单拿出来，一定可以成为一个高赞回答。
在我看来，本章内容完全可以和另外一篇非常出名的关于编译的文章  [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) 媲美。

当然这一章内容能写的这么好也有其必然性，作者维护的 [CodeMirror](https://github.com/codemirror/CodeMirror) 也算是最好的浏览器内的代码编辑器之一了。

这也是本书的另一个特点了，总是想方设法的让你把刚刚学会的东西用起来。在每一章的结尾都会有一些习题，每个大一些的主题后都会有一个大一些的项目，比如在学完数据结构后，写个寻路机器人，在学完 DOM 操作/ Canvas 后，写个小游戏啥的，跟着做收获会不小。

### 惊喜4: 编程行话
 
> The phrase “big ball of mud” is often used for such large, structureless programs. Everything sticks together, and when you try to pick out a piece, the whole thing comes apart, and your hands get dirty.

在[第 10 章 Modules](https://eloquentjavascript.net/10_modules.html) 引入 module 这个概念时，文中提到「big ball of mud」这个概念，非常形象生动。实际上，就算你仅仅只看了前言部分，你也能感受到作者并没有为了讲 JS 而讲 JS，作者讲 JS 中的一切都是已软件工程为背景，把 JS 当作利用计算机进行编程的范例来讲解，有的事情，一旦有了背景就变得顺理成章多了。可能在国内很少有非常多年行业经验的人转来主要写 JS，这导致前端在软件工程文化方面存在着一定的断层，着实可惜。


### 惊喜5: 被遗忘的 api

这个其实不能算是惊喜了，阅读之前就知道读完肯定能帮我补上不少知识。
目前印象比较深刻的地方，有如下一些：

**关于模块的定义**

> 通过模块，系统变得如乐高积木一般，块与块之间通过良好的接头连接。

定义一个模块需要满足以下条件：
* 模块需有有自己的命名空间（private scope）；
* 模块应当声明自己的依赖

按照上述思路，作者从闭包讲到 CommonJS，再讲到 ES modules，逐步对比其异同，优缺，比如 CommonJS 不能在本地文件中直接访问 `exports` 导除的值，`require` 其实就是普通的函数调用，只有在运行时才能获知其依赖关系。

```js
// 简化后的 CommonJS 用到的 require 函数，可谓很简洁易理解了
require.cache = Object.create(null);

function require(name) {

    if (!(name in require.cache)) {
        let code = readFile(name);
        let module = { exports: {} };
        require.cache[name] = module;
        let wrapper = Function("require, exports, module", code);
        wrapper(require, module.exports, module);
    }
    return require.cache[name].exports;

}
```

**关于正则**

[第 9 章 Regular Expressions](https://eloquentjavascript.net/09_regexp.html) 除了详细的讲解 JS 中正则的用法外，还提到了下面这个例子。

```js
let stock = "1 lemon, 2 cabbages, and 101 eggs";

function minusOne(match, amount, unit) {
    amount = Number(amount) - 1;
    if (amount == 1) { // only one left, remove the 's'
        unit = unit.slice(0, unit.length - 1);
    } else if (amount == 0) {
        amount = "no";
    }
    return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne)); // → no lemon, 1 cabbage, and 100 eggs
```

在看到上面这个例子时，感觉自己之前像是用了一个假的 `str.replace()`

还有一些比较小的点，比如 `fetch` api 返回的 `response` 中的 `headers` 大小写是不敏感的，DOM 元素中能被 `focus` 的基本上都是表单元素（这也是 form 表单的特殊性和历史有关）等等等等。

## 我是否推荐本书
虽然，这本书在 Github 上的的 Star 比起网红书籍 [You-Dont-Know-JS ](https://github.com/getify/You-Dont-Know-JS) 是差太多了。虽然地方没有 YDKJ 讲解那么深，但是也是少见的能把 JS 讲解的清晰和明白的书籍之一了。如果感兴趣，真的推荐读一读。

* [Eloquent JavaScript — online](https://eloquentjavascript.net/index.html)  在线看，所有的示例都能直接运行
* [Eloquent JavaScript — pdf](https://eloquentjavascript.net/Eloquent_JavaScript.pdf) pdf 则方便做笔记
* EPUB 和 Mobi 格式可以在上述 online 连接最底部找到
