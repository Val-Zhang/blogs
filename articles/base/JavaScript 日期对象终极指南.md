# JavaScript Dates 终极指南

原文地址：[The definitive guide to JavaScript Dates](https://flaviocopes.com/javascript-dates/)

> 在 JavaScript 中处理日期可能会很复杂，我们一起学习 Dates 所有的怪癖并掌握如何使用它。

## 简介
在 JavaScript 中处理日期可能会很复杂，无论开发者技术如何，往往都会感到痛苦。

![](https://flaviocopes.com/javascript-dates/Screen%20Shot%202018-07-06%20at%2007.20.58.png)

JavaScript 通过一个强大的`Date`对象对我们提供了日期处理功能。

## DATE 对象
`Date` 对象实例表示单个时间点.

尽管名为 `Date`, 它同样被用来处理时间。

## 初始化 Date 对象
我们通过下述代码初始化一个 Date 对象：

```js
new Date()
```

上述代码创建了一个表征当前时刻的日期对象。

在内部, 日期表示自 1970年1月1日 (UTC) 起到现在的毫秒数 。这个时间很重要, 因为就计算机而言, 这是其起始之时。

您可能熟悉 UNIX 时间戳: 这表示自该著名日期以来过去的秒数。

> 注意 UNIX 时间戳 以秒为单位，JavaScript 日期以 毫秒为单位

如果我们有一个 UNIX 时间戳，我们可以通过下述方法初始化一个 JavaScript 日期对象：

```js
const timestamp = 1530826365
new Date(timestamp * 1000)
```

如果我们传入的是0，我们将会获得表示 Jan 1st 1970 (UTC) 这个时间点的日期。

```js
new Date(0)
```

如果我们传入的是一个字符串而非一个数值，那么 Date 对象会使用 `parse` 方法来判明你传入的究竟是哪个日期，如：

```js
new Date('2018-07-22')
new Date('2018-07') //July 1st 2018, 00:00:00
new Date('2018') //Jan 1st 2018, 00:00:00
new Date('07/22/2018')
new Date('2018/07/22')
new Date('2018/7/22')
new Date('July 22, 2018')
new Date('July 22, 2018 07:22:13')
new Date('2018-07-22 07:22:13')
new Date('2018-07-22T07:22:13')
new Date('25 March 2018')
new Date('25 Mar 2018')
new Date('25 March, 2018')
new Date('March 25, 2018')
new Date('March 25 2018')
new Date('March 2018') //Mar 1st 2018, 00:00:00
new Date('2018 March') //Mar 1st 2018, 00:00:00
new Date('2018 MARCH') //Mar 1st 2018, 00:00:00
new Date('2018 march') //Mar 1st 2018, 00:00:00
```

这里很灵活。您可以在月份或天数内添加或省略前导零. 

需要注意 月/日 的位置，否则可能会把月份解析为日期。

使用 `Date.parse` 也可以处理字符串：

```js
Date.parse('2018-07-22')
Date.parse('2018-07') //July 1st 2018, 00:00:00
Date.parse('2018') //Jan 1st 2018, 00:00:00
Date.parse('07/22/2018')
Date.parse('2018/07/22')
Date.parse('2018/7/22')
Date.parse('July 22, 2018')
Date.parse('July 22, 2018 07:22:13')
Date.parse('2018-07-22 07:22:13')
Date.parse('2018-07-22T07:22:13')
```

`Date.parse` 会返回毫秒表示的时间戳而非一个 Date 对象

你还可以按照顺序传入值来表示日期的每一部分，参数顺序如下：年份，月份（从0开始），日期，小时，分钟，秒，毫秒

```js
new Date(2018, 6, 22, 7, 22, 13, 0)
new Date(2018, 6, 22)
```

最少需要传入三个参数，不过大多 JavaScript 引擎也可以解析少于 三个参数的情况

```js
new Date(2018, 6) //Sun Jul 01 2018 00:00:00 GMT+0200 (Central European Summer Time)
new Date(2018) //Thu Jan 01 1970 01:00:02 GMT+0100 (Central European Standard Time)
```

上述代码的最终结果是依赖于你的电脑的时区的相对值。这意味着传入相同的参数在不同电脑上可能会有不同的结果。

JavaScript 在没有任何有关时区的信息的情况下, 会将日期视为 UTC, 结果会自动针对当前的计算机时区进行转换。

总结一下，有四种方法可以让你创建一个新的 Date 对象：
* 不传参数，会基于当前时间创建 Date 对象；
* 传入代表自 1 Jan 1970 00:00 GMT 过去的毫秒数的数值；
* 传入代表日期的字符串；
* 传入一系列分别代表各项的参数；

## 时区
初始化日期时, 您也可以传入时区, 此时日期不假定为 UTC, 然后转换为本地时区。

可以通过 +HPURS 格式 或者添加时区名称的方式传入时区。

```js
new Date('July 22, 2018 07:22:13 +0700')
new Date('July 22, 2018 07:22:13 (CET)')
```

如果在解析时传入了错误的时区名称，JavaScript 会默认使用 UTC 并不会报错。

如果传入了错误格式的数值，JavaScript会报 `Invaild Date` 错误。

## 日期转换和格式化
对于一个给定的日期对象，存在很多方法可以基于该日期生产字符串

```js
const date = new Date('July 22, 2018 07:22:13')

date.toString() // "Sun Jul 22 2018 07:22:13 GMT+0200 (Central European Summer Time)"
date.toTimeString() //"07:22:13 GMT+0200 (Central European Summer Time)"
date.toUTCString() //"Sun, 22 Jul 2018 05:22:13 GMT"
date.toDateString() //"Sun Jul 22 2018"
date.toISOString() //"2018-07-22T05:22:13.000Z" (ISO 8601 format)
date.toLocaleString() //"22/07/2018, 07:22:13"
date.toLocaleTimeString()	//"07:22:13"
date.getTime() //1532236933000
date.getTime() //1532236933000
```


## Date 对象的 GETTER 方法
Date 对象提供了几种检查其值的方法。这些方法的结果都都取决于计算机的当前时区

```js
const date = new Date('July 22, 2018 07:22:13')

date.getDate() //22
date.getDay() //0 (0 means sunday, 1 means monday..)
date.getFullYear() //2018
date.getMonth() //6 (starts from 0)
date.getHours() //7
date.getMinutes() //22
date.getSeconds() //13
date.getMilliseconds() //0 (not specified)
date.getTime() //1532236933000
date.getTimezoneOffset() //-120 (will vary depending on where you are and when you check - this is CET during the summer). Returns the timezone difference expressed in minutes
```

上述方法存在对应的获取 UTC 时间的版本：

```js
date.getUTCDate() //22
date.getUTCDay() //0 (0 means sunday, 1 means monday..)
date.getUTCFullYear() //2018
date.getUTCMonth() //6 (starts from 0)
date.getUTCHours() //5 (not 7 like above)
date.getUTCMinutes() //22
date.getUTCSeconds() //13
date.getUTCMilliseconds() //0 (not specified)
```

## 编辑 Date 对象
Date 对象提供了若干编辑日期值得方法

```js
const date = new Date('July 22, 2018 07:22:13')

date.setDate(newValue)
date.setDay(newValue)
date.setFullYear(newValue) //note: avoid setYear(), it's deprecated
date.setMonth(newValue)
date.setHours(newValue)
date.setMinutes(newValue)
date.setSeconds(newValue)
date.setMilliseconds(newValue)
date.setTime(newValue)
date.setTimezoneOffset(newValue)
```

> `setDay` 和 `setMonth` 都从数值 0 开始 处理，比如三月应该为数值 2

这里有一个冷知识: 这些方法会 “重叠”, 所以比如说如果你使用了 `date.setHours (48)`, 结果会影响到天。

还有一个冷知识，你可以为 `setHours()` 方法传入多个参数，用以设置分钟，秒，毫秒，如`setHours(0, 0, 0, 0)`, `setMinutes` 和 `setSeconds` 存在类似的情况。

类似于众多获取日期的方法一样，设置日期的方法也存在对于的 UTC 版本：

```js
const date = new Date('July 22, 2018 07:22:13')

date.setUTCDate(newalue)
date.setUTCDay(newValue)
date.setUTCFullYear(newValue)
date.setUTCMonth(newValue)
date.setUTCHours(newValue)
date.setUTCMinutes(newValue)
date.setUTCSeconds(newValue)
date.setUTCMilliseconds(newValue)
```

## 获取当前的时间戳
如果你想获取以毫秒为单位的当前时间戳，推荐使用下述方法：

```js
Date.now()
```

而不是

```js
new Date().getTime()
```

## JavaScript 始终尝试获取最准确的结果
上面已经提到过，你传入的天数会影响到总的日期，这不会报错，会直接更新月份

```js
new Date(2018, 6, 40) //Thu Aug 09 2018 00:00:00 GMT+0200 (Central European Summer Time)
```

上述现象在日期，小时，分钟，秒以及毫秒同样生效

## 依据本地情况格式化日期
Internationalization API 在现代浏览器中有[很好的支持](https://caniuse.com/#feat=internationalization)(除了 UC浏览器)，允许你转换日期。

本地化方法通过，通过 `Int1` 对象暴露，这个对象还可以用来帮助本地化数值，字符串以及货币。

这里我们用到的是 `Intl.DateTimeFormat()`

我们可以通过下述方法来依据电脑的本地情况格式化一个日期：

```js
const date = new Date('July 22, 2018 07:22:13')
new Intl.DateTimeFormat().format(date) //"22/07/2018" in my locale
```

也可以依据不同的时区格式化日期：

```js
new Intl.DateTimeFormat('en-US').format(date) //"7/22/2018"
```

`Intl.DateTimeFormat` 方法还接收一个可选的参数用以自定义输出格式，可以用来展示 小时，分钟和秒

```js
const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}

new Intl.DateTimeFormat('en-US', options).format(date) //"7/22/2018, 7:22:13 AM"
new Intl.DateTimeFormat('it-IT', options2).format(date) //"22/7/2018, 07:22:13"
```

[点击这个链接可以查看所有可以用到的属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

## 两个日期的对比
可以通过 `Date.getTime()` 获取两个日期之间的差别

```js
const date1 = new Date('July 10, 2018 07:22:13')
const date2 = new Date('July 22, 2018 07:22:13')
const diff = date2.getTime() - date1.getTime() //difference in milliseconds
```

同样也可以通过这个方法检测两个日期是否相同：

```const date1 = new Date('July 10, 2018 07:22:13')
const date2 = new Date('July 10, 2018 07:22:13')
if (date2.getTime() === date1.getTime()) {
  //dates are equal
}
```

需要注意的是，`getTime()` 方法比较的是毫秒，所以 `July 10, 2018 07:22:13` 和 `July 10, 2018` 并不相等。不过你可以通过 `setHours(0, 0, 0, 0)` 来重置时间。