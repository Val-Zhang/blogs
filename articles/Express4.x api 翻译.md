# Express4.x api 翻译

> 用了一年多的`Express`了，其实会用的功能也能基本满足业务的需求，但是总是感觉自己对其更深的掌握还是缺少一层系统性。因此翻译其api，以求更深的认识。
> 

## `express()`

用以生成一个`Express`应用，`express()`函数是由`express`模块导出的顶级函数。

```js
var express = require('express');
var app = express();
```

### 方法

#### `express.json()`

> 此方法支持Express4.16.0及更新的版本，用于取代`body-parser`

这是Express提供的一个内置中间件，它基于[body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)解析传入的请求为JSON格式。

返回只解析JSON的中间件,而且只查看`Content-Type header`与类型选项匹配的请求。这个解析器接收任何编码格式的`body`,支持自动的解压`gzip`和压缩编码。

进过此中间件处理后，会返回一个新的包含解析数据的`body`对象（如`req.body`）,如果没有`body`可供解析或`Content-Type`不匹配或发生了错误则会返回一个空对象`({})`。

下表描述了可选的`options`对象的属性：

|属性  |描述  |类型  | 默认值|
| --- | --- | --- | --- |
|`inflate` |是否允许处理压缩的请求体，当设置为`false`时，压缩请求体的请求会被拒绝  | Boolean  | `true` |
|`limit`| 控制请求体的大小，如果是一个数值，为指定的字节数，如果是一个字符串，该值会被传给[bytes](https://www.npmjs.com/package/bytes)库进行解析 | Mixed |"100kb"|
|`reviver`| `reviver`选项会直接传递给`JSON.parse`做为第二个参数，可以在[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Example.3A_Using_the_reviver_parameter)上查看更多信息 |Function|null|
|`strict`|是否只接收数组或对象，当设置为false时能接收任何`JSON.parse`可处理的类型|Boolean|`true`|
|`type`|用于确定中间件将处理那种媒体类型，其值可以是一个字符串，字符串构成的数组或者一个函数，如果不是一个函数，该值会被直接传输给[`type-is`](https://www.npmjs.org/package/type-is#readme)库，值可以是一个拓展名（如`json`）,`mime type`(如`application/json`)或者包含通配符的 ` mime type` （如`*/*` 或者 `*/json`），如果是一个函数，`type`类型将通过`fn(req)`调用并且如果返回一个真值请求会被解析|Mixed| "application/json"|
|`verify `|如果这个选项被支持，将以`verify(req, res, buf, encoding)`形式被调用，其中`buf`是由原始请求体构成的`Buffer`,`encoding`是请求的编码，解析可以通过抛出错误而放弃|Function|`undefined`|




