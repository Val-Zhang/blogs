# Express4.x api 翻译（draft）

> 用了一年多的`Express`了，其实会用的功能也能基本满足业务的需求，但是总是感觉自己对其的掌握还是缺少一种系统性。故翻译其api，以期自己在翻译过程中对其有更深的认识。

[API 原文地址](http://expressjs.com/en/4x/api.html)

> 翻译的内容还比较粗糙，欢迎[在此处](https://github.com/zhangwang1990/blogs/issues/8)提建议进行修改。

## `express()`

用以生成一个`Express`应用，`express()`函数是从`express`模块导出的顶级函数。

```js
var express = require('express');
var app = express();
```

### 方法

#### `express.json([options])`

> 此方法支持Express4.16.0及更新的版本，用于取代`body-parser`

这是Express提供的一个内置中间件函数，它基于[body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)用以解析传入的请求为JSON格式。

本函数返回只解析JSON的中间件,并且只作用于`Content-Type`请求头与`type`选项匹配的请求。此解析器可接收任何编码格式的`body`,支持自动解压`gzip`和压缩`deflate`编码。

在进过此中间件处理后，`request`对象中会添加`body`属性（如`req.body`），它是一个对象，其中包含解析而来的数据,如果请求中没有`body`可供解析或`Content-Type`不匹配抑或发生了错误，`body`则会是一个空对象`({})`。

下表描述了可选的`options`对象的属性：

|属性  |描述  |类型  | 默认值|
| --- | --- | --- | --- |
|`inflate` |是否允许处理压缩的请求体，当设置为`false`时，压缩请求体的请求会被拒绝  | Boolean  | `true` |
|`limit`| 控制请求体的大小，如果是一个数值，为指定的字节数，如果是一个字符串，该值会被传给[bytes](https://www.npmjs.com/package/bytes)库进行解析 | Mixed |"100kb"|
|`reviver`| `reviver`选项会直接传递给`JSON.parse`做为第二个参数，可以在[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Example.3A_Using_the_reviver_parameter)上查看更多信息 |Function|null|
|`strict`|是否只接收数组或对象，当设置为false时能接收任何`JSON.parse`可处理的类型|Boolean|`true`|
|`type`|用于确定中间件将处理那种媒体类型，其值可以是一个字符串，字符串构成的数组或者一个函数，当不是一个函数时，该值会被传输给[`type-is`](https://www.npmjs.org/package/type-is#readme)库进行处理，该值还可以是一个拓展名（如`json`）,`mime type`(如`application/json`)或者包含通配符的 ` mime type` （如`*/*` 或者 `*/json`），如果是一个函数，`type`类型将通过`fn(req)`调用，如果返回的是一个有效值，请求会被解析|Mixed| "application/json"|
|`verify `|如果这个选项被支持，将以`verify(req, res, buf, encoding)`形式被调用，其中`buf`是由原始请求体构成的`Buffer`,`encoding`是请求的编码，解析可以通过抛出错误而放弃|Function|`undefined`|


#### `express.static(root,[options])`

这也是Express内置中间件之一，它基于[serve-static](http://expressjs.com/en/resources/middleware/serve-static.html)构建，用于提供静态文件。

> Note: 使用反向代理缓存可以提高静态文件服务器的效率

`root`参数指定提供静态文件的根目录。服务器将拼合`req.url`和所提供的根目录来查找静态文件。如果没有找到对应的文件，服务器不会返回404，而将调用`next()`以执行下一个中间件，允许堆叠和回退。

> 何谓倒退

下表描述了可选的`options`对象中可配置的属性：

|属性|描述|类型|默认值|
| --- | --- | --- | --- |
|`dotfiles`|决定如何看待以点开头的文件|String|"ignore"|
|`etag`|是否生成`etag`,`express.static`始终生成弱校验Etags|Boolean|true|
|`extensions`|设置文件的备选拓展名，如果一个文件没有找到则依据此处的设置寻找是否有其它后缀的文件并将发送第一个找到的文件，如`['html','htm']`|Mixed|false|
|`fallthrough`|让客户端的错误作为未处理的请求，否则转发客户端错误,详见下文|Boolean|true|
|`immutable`|在`Cache-Control`响应头中启用或禁用不可变的指令。如果启用，还应指定maxAge选项以启用缓存。不可变的指令将阻止受支持的客户端在maxAge有效期间发出检查文件是否已更改的条件请求。|Boolean|false|
|`index`|发送指定的目录索引文件。设置为false以禁用目录索引|Mixed|"index.html"|
|`lastModified`|将`Last-Modified`头部信息设置为文件在该系统上的最后修改日期|Boolean|true|
|`maxAge`|以毫秒为单位设置`Cache-Control`头部信息的`max-age`属性，或以ms格式设置字符串|Number|0|
|`redirect`|当路径名是一个目录时，自动在后面加上“/”| Boolean|true|
|`setHeaders`|用于设置HTTP头文件的函数|Function||

更多信息可查看[Serving static files in Express](http://expressjs.com/starter/static-files.html)和[Using middleware - Built-in middleware](http://expressjs.com/en/guide/using-middleware.html#middleware.built-in).


> ETag是HTTP协议提供的若干机制中的一种Web缓存验证机制，并且允许客户端进行缓存协商。这就使得缓存变得更加高效，而且节省带宽。如果资源的内容没有发生改变，Web服务器就不需要发送一个完整的响应。ETag也可用于乐观并发控制[1]，作为一种防止资源同步更新而相互覆盖的方法。
> 
> 强校验的ETag匹配要求两个资源内容的每个字节需完全相同，包括所有其他实体字段（如Content-Language）不发生变化。强ETag允许重新装配和缓存部分响应，以及字节范围请求。 弱校验的ETag匹配要求两个资源在语义上相等，这意味着在实际情况下它们可以互换，而且缓存副本也可以使用。不过这些资源不需要每个字节相同，因此弱ETag不适合字节范围请求。当Web服务器无法生成强ETag不切实际的时候，比如动态生成的内容，弱ETag就可能发挥作用了。


##### dotfiles

此选项的可选值有以下几个：

- `allow`:不会特别对待以点开头的文件；
- `deny`:拒绝返回以点开头的文件，会返回403错误并调用`next()`
- `ignore`:忽略对以点开头的文件的请求，返回404错误并调用`next()`

> Note: 使用默认值，不会忽略文件夹中的以点开头的文件

##### fallthrough

当此选项设置为`true`,诸如无效请求或请求不存在的文件时将引起中间件调用`next()`,使得下一个中间件位于栈中。设置为`false`时，这些错误将触发`next(err)`。

将此选项设置为`true`，可以让你映射多个物理目录到相同的Web地址或者调用路由来充填不存在的文件。

如果你想让某路径严格限制在某文件系统中则可以使用`false`,通过`404`短路可以减小服务器压力，
如果您将此中间件安装在严格意义上为单个文件系统目录的路径上，则可以使用false，这样可以使404短路，从而减少开销，这个中间件对所有的请求方法生效。

##### setHeaders

此选项用于指定一个函数用以自定义相应头，必须使用同步方法修改头部内容。函数签名如下：
```js
fn(res, path, stat)
```

各选项意义如下：

- `res`,[响应对象](http://expressjs.com/en/4x/api.html#res)
- `path`,发送的文件的路径
- `stat`,发送的文件的`stat`对象

##### `express.static`使用示例

```js
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options))
```

#### `express.Router([options])`

创建一个新的[router](http://expressjs.com/en/4x/api.html#router)对象

```js
var router = express.Router([options]);
```

可选参数`option`对象中的属性如下

| 属性  | 描述  | 默认值  | 兼容性 |
| ---- | --- | ---- | ---- |
|`caseSensitive`| 是否启用大小写敏感 | 默认不启用，这意味着`/Foo`和`foo`是一样的||
|`mergeParams`|是否保存父路由中的`req.params`值，如果相互冲突，取子路由中的值|`false`|4.5.0+|
|`strict`|是否启用严格匹配|默认禁止，`/foo`和`/foo/`的响应一致||

你可以像对待`express`应用一样，给router添加中间件和各种方法。

#### `express.urlencoded([options])`

> 此中间件适用于Express v4.16.0及更新的方法

这是Express提供的一个内置中间件，它基于[body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)解析传入的请求为`urlencoded`格式。

返回只解析urlencoded的中间件,而且只解析请求头的`Content-Type`与`type`匹配的请求。此解析器只接收 `UTF-8`编码格式的`body`,支持自动解压`gzip`和压缩编码。

进过此中间件处理后，会返回`response`对象中将包含`body`对象（如`req.body`）其中包含解析所得数据,如果没有`body`可供解析或`Content-Type`不匹配或发生错误则会返回一个空对象`({})`。对象的值可以是字符串或者数组（当extended为false时），或者其它任意类型（当extended为true时）。

下表描述了可选的`options`对象中可配置的属性：

|属性  |描述  |类型 | 默认值|
| --- | --- | --- | --- |
|`extended`|此选项将决定会使用`querystring`库（`false`时）还是`qs`库（`true`时）来解析`URL-encoded`数据。“extended”语法允许将对象和数组编码为URL格式，从而达到使用URL编码的类似获得类似JSON的体验。查看[qs](https://www.npmjs.com/package/qs#readme)了解更多信息|Boolean|true|
|`inflate`|是否允许处理压缩的请求体，当设置为false时，压缩请求体的请求会被拒绝|Boolean|true|
|`limit`| 控制请求体的大小，如果是一个数值，为指定的字节数，如果是一个字符串，该值会被传给[bytes](https://www.npmjs.com/package/bytes)库进行解析 | Mixed |"100kb"|
|`parameterLimit`|该选项控制URL编码数据中允许的最大参数数量。如果一个请求包含比这个值更多的参数，将会引发一个错误。|Bumber|1000|
|`type`|用于确定中间件将处理那种媒体类型，其值可以是一个字符串，字符串构成的数组或者一个函数，如果不是一个函数，该值会被直接传输给[`type-is`](https://www.npmjs.org/package/type-is#readme)库，值可以是一个拓展名（如`urlencoded`）,`mime type`(如`	"application/x-www-form-urlencoded"`)或者包含通配符的 ` mime type` （如`*/*` 或者 `*/json`），如果是一个函数，`type`类型将通过`fn(req)`调用并且如果返回一个真值请求会被解析|Mixed| "application/x-www-form-urlencoded"|
|`verify `|如果这个选项被支持，将以`verify(req, res, buf, encoding)`形式被调用，其中`buf`是由原始请求体构成的`Buffer`,`encoding`是请求的编码，解析可以通过抛出错误而放弃|Function|`undefined`|


## Application

`app`对象常被用来表示Express应用，它通过调用Express模块提供的顶级函数`express()`生成

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
```

`app`对象具备以下方法：

- 依据`http`请求路径注册处理函数，可查看[`app.METHOD`](http://expressjs.com/en/4x/api.html#app.METHOD)和[`app.param`](http://expressjs.com/en/4x/api.html#app.param);
- 配置中间件，见[app.route](http://expressjs.com/en/4x/api.html#app.route);
- 渲染html视图，见[app.render](http://expressjs.com/en/4x/api.html#app.render)
- 设置模板渲染引擎，见[app.engine](http://expressjs.com/en/4x/api.html#app.engine)

app对象还提供一些其它的影响应用行为的配置，可以查看[Application settings](http://expressjs.com/en/4x/api.html#app.settings.table)了解更多信息。

> Express appliaction 对象可以分别以 `req.app` 和 `res.app` 指向 `request对象` 和 `response对象`。

### 属性

#### `app.locals`

`app.locals`是一个对象，其以app内部的各变量为属性

```js
app.locals.title
// => 'My App'

app.locals.email
// => 'me@myapp.com'
```

一旦设置，`app.locals`属性将在整个应用的生命周期内有效，相比而言`res.locals`的属性值则只在某请求的生命周期内有效。

你可以在app渲染的模板的过程中访问本地变量。这样就可以为模板提供辅助函数及app级别的数据，app本地变量在中间件中可以通过`req.app.locals`访问（详见[`req.app`](http://expressjs.com/en/4x/api.html#req.app)）

```js
app.locals.title = 'My App';
app.locals.strftime = require('strftime');
app.locals.email = 'me@myapp.com';
```

#### `app.mountpath`

`app.mountpath`属性用以表示某`sub-app`所匹配的一个或多个路径模式。

> `sub-app`指的是用于处理对路由的请求的`express`的实例。

```js
var express = require('express');

var app = express(); // the main app
var admin = express(); // the sub app

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // /admin
  res.send('Admin Homepage');
});

app.use('/admin', admin); // mount the sub app
```

它和`req`对象提供的[`baseUrl`](http://expressjs.com/en/4x/api.html#req.baseUrl)功能类似，不同之处在于`req.baseUrl`返回的是匹配的URL路径而非匹配模式。

如果一个`sub-app`有多种路径匹配模式，`sub-app.mountpath`将返回一个模式的列表

```js
var admin = express();

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
  res.send('Admin Homepage');
});

var secret = express();
secret.get('/', function (req, res) {
  console.log(secret.mountpath); // /secr*t
  res.send('Admin Secret');
});

admin.use('/secr*t', secret); // load the 'secret' router on '/secr*t', on the 'admin' sub app
app.use(['/adm*n', '/manager'], admin); // load the 'admin' router on '/adm*n' and '/manager', on the parent app
```

> 次级app还可以再拥有次级app，如果如此，那次级`app`和`router`的区别在哪儿呢？
> `router`其实只具备部分功能，`sub-app`具备全部功能

### Events

#### `app.on('mount',callback(parent))`

`mount`事件在`sub-app`挂载（mount）到父app时触发，父app会当做参数传入回调函数中。

> **Note:**
> Sub-app将：
> 
> 	- 不继承`settings`中的默认值，在sub-app中需要重新设置；
> 	- 将继承没有默认值的`settings`中的值

```js
var admin = express();

admin.on('mount', function (parent) {
  console.log('Admin Mounted');
  console.log(parent); // refers to the parent app
});

admin.get('/', function (req, res) {
  res.send('Admin Homepage');
});

app.use('/admin', admin);
```

### Methods

#### `app.all(path,callback[,callback])`

此方法类似标准的[`app.MEYHOD()`](http://expressjs.com/zh-cn/4x/api.html#app.METHOD)方法，不同的地方在于它将匹配所有类型的`http`请求。

##### 参数

**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 中间件被触发的路径，可以是以下值中的一种：
> 
> 	- 用字符串表达的路径
> 	- 匹配路径的正则表达式
> 	- 路径模式
> 	- 上述值组成的数组
> 可以点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)查看实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 您可以提供多个回调函数，其行为与中间件类似，只不过这些回调可以调用next（'route'）来绕过剩余的路由回调。你可以使用此机制来决定应该使用哪个路由，如果没有继续使用当前路由的理由，则可以调到下一个路由。
> 
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你也可以把它们当做中间件使用。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)

##### 示例

以下回调将响应`GET`，`POST`，`PUT`，`DELETE`或任何其他HTTP请求方法对路由`/secret`的请求：

```js
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
});
```

`app.all()`方法在处理对某特定的前缀或匹配的特殊路径的所有类型的请求时特别有用。比如说如果你把下述代码放在所有其它路径的定义之前，就会让从此代码之后的所有路由都需要身份验证，并自动加载一个user。这些回调也不必做为终点，`loadUser`可以用来执行某个任务，然后调用`next()`来继续匹配之后的路由。

```js
app.all('*', requireAuthentication, loadUser);
```

上述代码也等同于

```js
app.all('*', requireAuthentication);
app.all('*', loadUser);
```

下面还有另外一个非常有用的`app.all`使用示例，此例和上面的例子类似，但是严格限制路径以`/api`开头

```js
app.all('/api/*', requireAuthentication);
```

#### `app.delete(path, callback [, callback ...])`

为某路径的`HTTP DELETE`请求绑定特定的回调函数。更多信息可查看[路由指南](http://expressjs.com/guide/routing.html)。

##### 参数


**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 路径模式可以是以下类型中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 通配符
> 	- 上述类型值组成的数组
> 点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)可查看更多实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下类型中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用中间件一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)


##### 示例

```js
app.delete('/', function (req, res) {
  res.send('DELETE request to homepage');
});
```

#### `app.disable(name)`

设置`setting`中的布尔值属性`name`的值为`false`，`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。调用`app.set('foo',false)`和调用`app.disable('foo')`的效果一致：

如：

```js
app.disable('trust proxy');
app.get('trust proxy');
// => false
```

#### `app.disabled(name)`

判断`setting`中的设置项`name`的值是否为`false`,如果`setting`中的设置项`name`的值为`false`则返回`true`,`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。

```js
app.disabled('trust proxy');
// => true

app.enable('trust proxy');
app.disabled('trust proxy');
// => false
```

#### `app.enable(name)`

设置`setting`中的布尔值设置项`name`为`true`,调用`app.enable('foo')`和调用`app.set('foo',true)`效果相同。

```js
app.enable('trust proxy');
app.get('trust proxy');
// => true
```

#### `app.enabled(name)`

判断`setting`中的设置项`name`的值是否为`true`,如果`setting`中的设置项`name`的值为`true`则返回`true`,`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。

```js
app.enabled('trust proxy');
// => false

app.enable('trust proxy');
app.enabled('trust proxy');
// => true
```

#### `app.engine(ext,callback)`

注册`ext`格式的模板的回调函数为`callback`。

默认情况下，Express会基于拓展名`require()`引擎，比如说，如果你渲染文件`foo.pug`,Express将在内部触发以下代码，并会为接下来的请求缓存`require()`以提高性能。

```js
app.engine('pug', require('pug').__express);
```

对不提供直接可用的`.__express`的引擎，或者你想把不同的后缀映射到当前引擎可以使用下述方法，

```js
// 使用EJS引擎来渲染`.html`文件
app.engine('html', require('ejs').renderFile);
```

在上面的例子中，`renderFile()`方法提供了`Express`想要的相同的签名（`path`,`options`,`callback`）,不过请注意这个方法会自动在内部调用`ejx.__express)`所以如果你想要渲染的文件的后缀是`.ejx`,则不需要调用做别的事情。

也有一些模板引擎不遵循这个约定，[consolidate.js](https://github.com/tj/consolidate.js)库可以映射 Node 模板引擎为准守这种规律，所以他们可以和Express无缝链接使用。

```js
var engines = require('consolidate');
app.engine('haml', engines.haml);
app.engine('html', engines.hogan);
```

#### `app.get(name)`

返回app setting 中相关属性`name`的值，如：

```js
app.get('title');
// => undefined

app.set('title', 'My Site');
app.get('title');
// => "My Site"
```

#### `app.get(path,callback[,callback])`

使用特定的回调函数处理特定路径的`HTTP GET`请求

##### 参数


**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 中间件被触发的路径，可以是以下值中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 路径模式
> 	- 上述值组成的数组
> 可以点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)查看实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下中的一种：
> 
> 	- 中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用其他中间件功能一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)

更多信息可参考[routing 指南](http://expressjs.com/guide/routing.html)


#### `app.listen(path,[callback])`

启动UNIX套接字并侦听指定路径上的连接。此方法等同于Node的[`http.Server.listen()`](https://nodejs.org/api/http.html#http_server_listen_path_callback)方法.

```js
var express = require('express');
var app = express();
app.listen('/tmp/sock');
```

#### `app.listen(port,[hostname],[backlog],[callback])`

绑定并监听对指定的host和端口的连接。此方法和Node的[`http.Server.listen()`](https://nodejs.org/api/http.html#http_server_listen_path_callback)方法一致。

```js
var express = require('express');
var app = express();
app.listen(3000);
```

由`express()`方法返回的`app`实际上是一个JavaScript `Function`,它实际上被设计为传递给Node的`HTTP servers`作为回调函数来处理请求。由于 `app` 并没有什么继承，这使得可以非常方便使用同一套代码提供`http`或`https`版本的app。

```js
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
```

`app.listen()`方法返回一个`http.Server`对象，对于`http`来说，它可以像下面这样使用

```js
app.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```

#### `app.METHOD(path,callback[,callback])`

依据请求的类型处理http请求，请求类型可以是`GET,PUT,POST`等等的小写模式。因此，实际的方法是`app.get()`,`app.post()`,`app.put()`等等。[点击这里](http://expressjs.com/zh-cn/4x/api.html#routing-methods)可以查看详细的路由方法清单。

##### 参数


**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 路径模式可以是以下类型中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 通配符
> 	- 上述类型值组成的数组
> 点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)可查看更多实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下类型中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用中间件一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)


##### 路由方法

Express下述路由方法，它们和对应的HTTP方法具有相同的名称

- checkout
- copy
- delete
- get
- head
- lock
- merge
- mkactivity
- mkcol
- move
- m-search
- notify
- options
- patch
- post
- purge
- put
- report
- search
- subscribe
- trace
- unlock
- unsubscribe

本`API`文档中只对常用的HTTP方法进行了描述，如`app.get()`,`app.post()`,`app.put()`以及`app.delete()`。不过上面列出的其它方法使用方法也是类似的

对于无效的JavaScript变量名类型，可以使用中括号来调用，比如`app['m-search']('/', function ....`

> 如果没有在`app.get()`前指定`HTTP HEAD`对应的方法，将会调用`app.get()`来响应`HEAD`请求。

`app.all`会响应针对某个特定路径的所有请求，详细可[参看](http://expressjs.com/zh-cn/4x/api.html#app.all)。

更多信息可参考[routing 指南](http://expressjs.com/guide/routing.html)

#### `app.param([name],callback)`

为路由的参数添加回调函数，其中`name`是参数名或由参数组成的数组，`callback`是回调函数。回调函数的参数依次是请求对象(request)，响应对象(response),下一个中间件，参数值及参数名。

如果`name`是一个数组，回调函数会按照它们声明的顺序，依次注册到回调函数，此时除了此数据中的最后一项，回调函数中的`next`将会触发下一个注册参数的回调函数，而对于最后一个参数，`next`则会调用处理当前路由的下一个中间件，此时的处理逻辑和`name`只是一个字符串一样。

下面的例子实现了当`:user`存在于路由的路径中时，在`req`对象中添加了`req.user`以供后期路由使用：

```js
app.param('user', function(req, res, next, id) {

  // try to get the user details from the User model and attach it to the request object
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});
```

处理`Param`的回调函数对于包含它们的路由来说是本地的。因此不会被`app`或者其它的路由继承。

`Param`回调函数会在在任何匹配了该路由的处理函数前触发，并且一个请求响应周期内只会被触发一次，即使参数匹配了多个路由也是如此。

```js
app.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

app.get('/user/:id', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

对于请求`GET /user/42`将打印以下语句：

```bash
CALLED ONLY ONCE
although this matches
and this matches too
```

```js
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});

app.get('/user/:id/:page', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

对于请求 `GET /user/42/3`,下面语句将被打印

```bash
CALLED ONLY ONCE with 42
CALLED ONLY ONCE with 3
although this matches
and this matches too
```

> 源文档中此处有一段已经自Express4.10弃用，此处不再做翻译

#### `app.path`

返回应用程序的规范路径其是一个字符串。

```js
var app = express()
  , blog = express()
  , blogAdmin = express();

app.use('/blog', blog);
blog.use('/admin', blogAdmin);

console.log(app.path()); // ''
console.log(blog.path()); // '/blog'
console.log(blogAdmin.path()); // '/blog/admin'
```

对于那些特别复杂加载了特别多`app`的程序，`app.path`的行为会变得很复杂，这种情况下使用`req.baseUrl`来获取路径更好。

#### `app.post(path,callback[,callback])`

绑定针对某特定路径的`HTTP POST`请求到特定的回调函数上。更多信息可查看[路由指南](http://expressjs.com/guide/routing.html)。


##### 参数


**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 路径模式可以是以下类型中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 通配符
> 	- 上述类型值组成的数组
> 点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)可查看更多实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下类型中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用中间件一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)


##### 示例

```js
app.post('/', function (req, res) {
  res.send('POST request to homepage');
});
```

#### `app.put(path,callback[,callback])`

绑定针对某特定路径的HTTP POST请求到特定的回调函数上。更多信息可查看[路由指南](http://expressjs.com/guide/routing.html)。


##### 参数


**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 路径模式可以是以下类型中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 通配符
> 	- 上述类型值组成的数组
> 点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)可查看更多实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下类型中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用中间件一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)


##### 示例

```js
app.put('/', function (req, res) {
  res.send('PUT request to homepage');
});
```

#### `app.render(view,[locals],callback)`

通过回调函数返回某个视图对应渲染出的`HTML`，它接收一个可选的参数，这个参数是一个对象用以像视图传送本地变量。`app.render()`很像`res.render()`区别在于它本身不能发送渲染后的视图给客户端。

> 可以把`app.render()`看做用于生成视图字符串的实用函数。事实上，`res.render()`在内部会使用`app.render()`来渲染视图。

> 本地变量`cache`被用来设置启用视图缓存，如果你想要在开发过程中启用，你需要将其设置为`true`，视图缓存在生产环境中默认被启用。

```js
app.render('email', function(err, html){
  // ...
});

app.render('email', { name: 'Tobi' }, function(err, html){
  // ...
});
```

#### `app.route(path)`

返回单一路由的实例，可以链式的为不同的请求绑定不同的中间件处理函数。使用`app.route()`可以避免重复的写路由名及由此造成的输入错误。

```js
var app = express();

app.route('/events')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
})
.get(function(req, res, next) {
  res.json(...);
})
.post(function(req, res, next) {
  // maybe add a new event...
});
```

#### `app.set(name,value)`

设置`setting`中的属性`name`的值为`value`。

前面已经提到过，调用`app.set('foo',true)`设置布尔值为`true`与使用`app.enable('foo')`相同，类似的，调用`app.set('foo',false)`与`app.disable('foo')`相同。

使用`app.get`可以获取设定的值。

```js
app.set('title', 'My Site');
app.get('title'); // "My Site"
```

##### 应用设定

下表列出了`app setting`的可选项

注意`sub-app`具有以下特征：

- 不会继承具有默认值的`settings`的值，其值必须在`sub-app`中设置；
- 会继承没有默认值的值，具体细节可见下表。

例外： 

> Sub-apps将继承`trust proxy`的值，尽管它有默认值，这样做是出于向后兼容的目的；Sub-apps 在生产环境中不会继承`view cache`的值(当 `NODE_ENV` 设置为 `production`)。

| 属性 | 类型 | 描述 | 默认值 | 
| --- | ----| -----| ------|
|`case sensitive routing`| Boolean| 启用大小写敏感，当启用时，`/Foo`和`/foo`是不同的路由，当禁用时，`/Foo`和`/foo`将被看做一样的，**注意：**Sub-app将继承此值| `N/A(undefined)`|
|`env`| String | 设置环境模式，请务必在生产环境中设置为`production`;详见[ Production best practices: performance and reliability.](http://expressjs.com/advanced/best-practice-performance.html#env)|`process.env.NODE_ENV`(Node_ENV环境变量)或如果`NODE_ENV`没有设置则为`development`|
|`etag`| Varied | 设置`Etag`响应头。可选值可参考[options table](http://expressjs.com/zh-cn/4x/api.html#etag.options.table)，更多关于Etag可以参考 [维基百科--Etag](http://en.wikipedia.org/wiki/HTTP_ETag) | weak|
|`jsonp callback name`|String|指定默认的JSONP的回调名称|"callback"|
|`json escape`| Boolean | 对来自`res.josn`,`res.josnp`以及`res.send`的JSON响应启用转义，会转义JSON中的`<`,`>`,`&`为Unicode。此设置的目的在于当响应来自HTML的响应时协助[缓解某些类型的持续XSS攻击](https://blog.mozilla.org/security/2017/07/18/web-service-audits-firefox-accounts/)。**注意：**sub-app将继承此值的设置|`N/A(undefined)`|
|`josn replacer`| Varied | 指定`JSON.stringly`使用的`replacer`参数 **注意：**Sub-app将继承此值在setting中的设置|`N/A(undefined)`|
|`json spaces`| Varied | 指定`JSON.stringly`使用的`space`参数，此值被用来设置用于美化缩进的空格数量，**注意：**`Sub-app`将继承此值|`N/A(undefined)`|
|`query parser`| Varied | 设置该值为`false`将禁用`query`解析，也可以设置其值为`simple`或`extended` 或者一个自定义的查询字符串解析函数。 最简单的query parser是基于Node的原生query parser[`querystring`](http://nodejs.org/api/querystring.html) ，拓展的query parser基于`qs`。 自定义的查询字符串解析函数将接收完整的查询字符串，并且必须返回一个有查询名和它们的值组成的对象|"extended"|
|`strict routing`| Boolean | 启用严格路由模式，当启用时，路由将视`/foo`和`/foo/`为不同的路由。否则设为相同的路由 **注意：** Sub-app将继承此设置|`N/A (undefined)`|
|`subdomain offset`| Number | 为了获取子域名需要移除的由点隔开的部分|2|
| `trust proxy` | Varied | 只是应用程序位于前置代理之后，使用`X-Forwarded-*`请求头来确定客户端的IP地址及连接，**注**：`X-Forwarded- *`标头容易伪造，检测到的IP地址不可靠。 启用后，Express会尝试确定通过前置代理或一系列代理连接的客户端的IP地址，`req.ips`属性将包含连接的客户端的IP地址组成的数组。要启用它，可以查看[trust proxy options table](http://expressjs.com/zh-cn/4x/api.html#trust.proxy.options.table);`trust proxy`的设置使用了[proxy-addr](https://www.npmjs.org/package/proxy-addr)包，可以查看其文档了解更多内容。 **注：** 尽管包含默认值，sub-apps会继承其值|`false(disabled)`|
|`views`|String/Array| 供程序视图使用的一个或一组文件夹，如果是一个文件夹，将按照数组值的顺序查找 | `process.ced() + '/views'`|
|`view cache`| Boolean | 启用视图模板汇编缓存，**注：**Sub-apps不会继承此值在生产环境中的设置(当`NODE_ENV`设置为`producetion`时为生产环节)。|生产环境上默认为`true`，否则为`undefined`|
|`view engine`| String | 默认的视图处理引擎 **注：**Sub-app将继承此值的设置|`N/A(undefined)`|
|`x-powered-by`|Boolean|启用`X-Powered-By:Express` HTTP 头部| `true`|

##### `trust proxy`的可用设置值

参考[Express behind proxies](http://expressjs.com/guide/behind-proxies.html)可获取更多的信息。

|类型|值|
|---|---|
|`Boolean`|如果设置为`true`,客户端的IP地址将被认为是`X-Forwarded- *`头中最左边的条目，如果设置为`false`,后端应用被认为直接与互联网连接，并入客户端的`IP`地址可以从`req.connection.remoteAddress`中获取，这也是默认的设置。|
|字符串/逗号分隔的字符串/字符串构成的数组|一个IP地址，`subnet`或者一组IP地址和一组可信任的子网的组合，下面展示了预配置的子网名称： `loopback - 127.0.0.1/8, ::1/128`,`linklocal - 169.254.0.0/16, fe80::/10`,`uniquelocal - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7`,你可以用下列方法设置IP地址,指定单一的子网 `app.set('trust proxy', 'loopback') `,指定一个子网及地址`app.set('trust proxy', 'loopback, 123.123.123.123') `,指定多个子网为CSV,`app.set('trust proxy', 'loopback, linklocal, uniquelocal') `,通过数组格式指定多个子网`app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])`,指定时，将从地址确定过程中排除IP地址或子网，并将离应用程序服务器最近的不可信IP地址确定为客户端的IP地址。|
|`Number`| 信任从前置代理服务器作为客户端的第nth hop。|
|`Function`| 自定义代理实现，只有当你知道你在做啥的时候才应该做这一步,实例如下|

```js
app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true; // trusted IPs
  else return false;
});
```

#### `etag`选项的配置

> **注意:** 这些设置只适用于动态生成的文件而不适用于静态文件，`express.static`中间件将忽略这些设置。
> 
> ETag功能是使用`etag`库实现的。有关更多信息，可参阅其[文档](https://www.npmjs.org/package/etag)。

|类型|值|
|---|---|
|`Boolean`|设置为`true`将允许`weak Etag`,这是默认的设置，设置为`false`将禁用`Etag`|
|`String` |设置为`strong`,将允许`strong Etag`,设置为`weak`,将允许`weak Etag`|
|`Function`|自定义代理实现，只有当你知道你在做啥的时候才应该做这一步,实例如下|

```js
app.set('etag', function (body, encoding) {
  return generateHash(body, encoding); // consider the function is defined
});
```

### `app.use([path],callback[,callback])`

为指定的路径指定中间件函数，当请求的路径与之匹配时，中间件函数将会被执行。

**参数**

**参数1：** `path`   **默认值：** `/`(root path)

**描述：**

> 路径模式可以是以下类型中的一种：
> 
> 	- 路径字符串
> 	- 匹配路径的正则表达式
> 	- 通配符
> 	- 上述类型值组成的数组
> 点击[Path examples](http://expressjs.com/zh-cn/4x/api.html#path-examples)可查看更多实际的例子

**参数2：** `callback`   **默认值：** `None`

**描述：**

> 回调函数可以是如下类型中的一种：
> 
> 	- 一个中间件函数
> 	- 由逗号隔开的一系列中间件函数
> 	- 一个由中间件函数构成的数组
> 	- 上述情况的组合
> 
> 可以提供多个回调函数，多个回调函数的调用与多个中间件的调用类似，不同之处在于在回调函数中调用`next（'route'）`可绕过之后的回调函数。你可以基于此机制来觉得是否需要触发之后的回调函数
> 
> [`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，你可以像使用中间件一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)

**描述**

将会匹配任何当前路径的子路径，如`app.use('/apple',...)`将匹配`/apple`,`/apple/images`,`/apple/images/news`等等。

`path`默认的值是`/`，如果不设置路径，所用中间件将响应每一个请求。

比如说下述中间件函数将响应每一个请求

```js
app.use(function (req, res, next) {
  console.log('Time: %d', Date.now());
  next();
});
```

> 请注意sub-app具有以下特征：
> 
> - 不会继承具有默认值的settings的值，其值必须在sub-app中设置；
> - 会继承没有默认值的值，这些会在下表中明确提到。

中间件函数将会按照顺序执行，因此中间件的顺序非常重要。

```js
// 请求不会超出下面的中间件
app.use(function(req, res, next) {
  res.send('Hello World');
});

// 请求永远不会到达下面的路由
app.get('/', function (req, res) {
  res.send('Welcome');
});
```

#### 错误处理中间件

错误处理中间件需要接受四个参数，使用时必须传入四个参数以证明当前中间件时错误处理中间件。这四个参数中包含`next`,即使你用不上`next`,也需要在参数中包含它，这样才能满足错误处理中间件的函数签名。签名不对当前中间件会被当做普通的中间件使用而失去处理错误的能力。关于错误处理中间件的详细信息可以参考[这里](http://expressjs.com/en/guide/error-handling.html)。

除了必须接受四个参数，错误处理中间件的定义和普通中间件一样，其函数签名固定为`(err,req,res,next)`

```js
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### 路径写法示例

下表是一些有效的路径示例

**type:** `path`:
**示例：**

将匹配以`/abcd`开头的路径：

```js
app.use('/abcd', function (req, res, next) {
  next();
});
```

**type:** 路径通配符

```js
// 下述将匹配以'/abcd'和'/abd'开头的路径
app.use('/abc?d', function (req, res, next) {
  next();
});

// 下例将匹配以'/abcd','/abbcd','/abbbbbcd'等开头的路径
app.use('/ab+cd', function (req, res, next) {
  next();
});

// 下例将匹配以 '/abcd','/abxcd','/abFOOcd','/abbArcd'等开头的路径
app.use('/ab\*cd', function (req, res, next) {
  next();
});

// 下例将匹配 '/ab' 或 '/abcd'开头的路径

app.use('/a(bc)?d', function (req, res, next) {
  next();
});
```

**type:** 正则表达式

```js
// 下例将匹配以'/abc','/xyz'开头的路径
app.use(/\/abc|\/xyz/, function (req, res, next) {
  next();
});

```

**type:** 数组

```js
// 下例将匹配以'/abcd','/xyza','/lmn','/pqr'开头的路径
app.use(['/abcd', '/xyza', /\/lmn|\/pqr/], function (req, res, next) {
  next();
});
```

### 中间件回调函数示例

下面的示例展示了`app.use()`,`app.METHOD()`,`app.all()`中中间件函数的使用方法。

**单个中间件**

```js
// 可用直接写中间件函数
app.use(function (req, res, next) {
  next();
});

// router也是一个有效的中间件
var router = express.Router();
router.get('/', function (req, res, next) {
  next();
});
app.use(router);

// Express app也是一个有效的中间件
var subApp = express();
subApp.get('/', function (req, res, next) {
  next();
});
app.use(subApp);
```

**一系列的中间件**

```js
// 针对同一个路径可用指定多个中间件
var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use(r1, r2);
```

**数组**

```js
// 可传入一个中间件数组，如果中间件数组是第一个或者唯一的一个参数，则你必须指定中间件匹配的路径

var r1 = express.Router();
r1.get('/', function (req, res, next) {
  next();
});

var r2 = express.Router();
r2.get('/', function (req, res, next) {
  next();
});

app.use('/', [r1, r2]);
```

**组合**

```js
// 你可以组合使用上述所有的中间件
function mw1(req, res, next) { next(); }
function mw2(req, res, next) { next(); }

var r1 = express.Router();
r1.get('/', function (req, res, next) { next(); });

var r2 = express.Router();
r2.get('/', function (req, res, next) { next(); });

var subApp = express();
subApp.get('/', function (req, res, next) { next(); });

app.use(mw1, [mw2, r1, r2], subApp);
```

下面是一些在`Express App`中使用[express.static](http://expressjs.com/guide/using-middleware.html#middleware.built-in)中间件的示例。

```js
// 把应用目录下的`public`文件夹中的内容作为静态内容的方法
// GET /style.css etc
app.use(express.static(__dirname + '/public'));

// 匹配 以/static开头的路径以提供静态内容
app.use('/static', express.static(__dirname + '/public'));

// 通过把logger中间件放在静态中间件之后使得请求静态内容时不logging
app.use(express.static(__dirname + '/public'));
app.use(logger());

// 从多个目录中提供静态文件，不过优先使用`./public`中的内容
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));
```

## `Request`

`req`对象代表的是`http`请求，该对象中包含由请求而来的`query`,参数，`body`,`HTTP headers`等解析而来的属性。按照惯例（此文档也是如此）请求对象会记为`req`(`HTTP`响应对象记为`res`),不过这个名字具体是什么还是依据回调函数中的定义。

比如:

```js
app.get('/user/:id', function(req, res) {
  res.send('user ' + req.params.id);
});
```

同样，你也可以按照下面这样做：

```js
app.get('/user/:id', function(request, response) {
  response.send('user ' + request.params.id);
});
```

`req`对象是node本身的请求对象的增强版，并且支持[所有的内置字段和方法](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

### 属性

> 在Express4中，`req.files`默认不再存在于`req`对象中，你需要使用类似`busboy`,`multer`,`formidable`,`multiparty`,`connect-multiparty`,`pez`这样的多部件处理中间件来在通过`req.files`获取到上传文件的信息。

#### `req.app`

此属性指向使用当前中间件的Express application。

如果你遵照以下模式，在一个模块中导出一个中间件然后在主文件中`require()`这个中间件，则可以在中间件中通过`req.app`获取到当前的`Express`实例。

比如：

```js
//index.js
app.get('/viewdirectory', require('./mymiddleware.js'))

//mymiddleware.js
module.exports = function (req, res) {
  res.send('The views directory is ' + req.app.get('views'));
});
```

#### `req.baseUrl`

获取一个路由器实例所匹配的路径。

`req.baseUrl`属性和`app`对象的`mountpath`属性类似，不同的地方在于`app. mountpath`返回的是匹配的路径模式。

比如：

```js
var greet = express.Router();

greet.get('/jp', function (req, res) {
  console.log(req.baseUrl); // /greet
  res.send('Konichiwa!');
});

app.use('/greet', greet); // load the router on '/greet'
```

即使你使用的是路径通配符或者一组路径模式来匹配路由，`baseUrl`属性返回的也是匹配的字符串而非模式本身，如：

```js
app.use(['/gre+t', '/hel{2}o'], greet); // load the router on '/gre+t' and '/hel{2}o'
```

当请求的路径为`/greet/ip`时，`req.baseUrl`的值为`/greet`,当请求的路径为`/hello/jp`时，`req.baseUrl`为`/hello`。


#### `req.body`

包含从`request body`中提交而来的键值对形式的数据。默认情况下，`req.body`的值为`undefined`,你需要使用如`body-parser`或`multer`这类body解析中间件来为其填充内容。

下例展示了如何使用`body`解析中间件来扩充`req.body`中的内容：

```js
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/profile', upload.array(), function (req, res, next) {
  console.log(req.body);
  res.json(req.body);
});
```

#### `req.cookies`

当使用`cookie-parser`中间件时，此属性是一个由请求中的cookie信息构建的对象。如果请求中没有`cookie`，其值为`{}`。

```js
// Cookie: name=tj
req.cookies.name
// => "tj"
```

如果cookie有签名，则需要使用`req.signedCookies`.

可参照[cookie-parser](https://github.com/expressjs/cookie-parser)查看更多信息。


#### `req.fresh`

用以表征当前请求是否“新鲜”，与`req.stale`相反。

如果`cache-control`请求头不是`no-cache`并且下面的每一项的值都不是`true`,则它的值为`true`.

- `if-modified-since`请求头是指定的，并且`last-modified`请求头等于或者早于`modified`响应头
- `if-none-match`请求头为`*`;
- `if-none-match`请求头在被解析为指令后，不匹配`etag`响应头

```js
req.fresh
// => true
```

更多信息可查看[fresh](https://github.com/jshttp/fresh)

#### `req.hostname`

用以表征从`HTTP header`派生出来的主机名。

当`trust proxy` 不等于`false`时，此属性将使用`X-Forwarded-Host`header中的值，此值可以通过客户端或者代理设置。

```js
// Host: "example.com:3000"
req.hostname
// => "example.com"
```

#### `req.ip`

用以表征请求的远程`ip`。

当`trust proxy`不为`false`时，此值将取自`X-Forwarded-For header.`最左侧，此请求头可以被客户端或者代理设置。

```js
req.ip
// => "127.0.0.1"
```

#### `req.ips`

当`trust proxy` 不等于`false`时，此属性将使用`X-Forwarded-Host` header中指定的一组IP地址。或者将包含一个空数组，此请求头可以被客户端或者代理设置。

比如说，如果`X-Forwarded-For`为`client, proxy1, proxy2`,`req.ips`将会是`["client", "proxy1", "proxy2"]`，而proxy2是最下游的。

#### `req.method`

包含一个对应于当前请求方法的字符串，如`GET,POST,PUT`等等。

#### `req.originalUrl`

> `req.url`并非原生的Express属性，其继承自Node的http模块。

此属性非常类似于`req.url`，不同之处在于，它保留了原始请求URL，允许你为内部路由重写`req.url`。比如说，可以使用`app.use()`的`mounting`功能来重写`req.url`以去除挂载点。

```js
// GET /search?q=something
req.originalUrl
// => "/search?q=something"
```

在中间件函数中，`req.originalUrl`是`req.baseUrl`和`req.path`的组合，如下所示：

```js
app.use('/admin', function(req, res, next) {  // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
  next();
});
```

#### `req.params`

此属性是一个映射到命名路由参数的对象。比如你的路由为`/user/:name`,那么可以通过`req.params.name`获取到`name`属性的值，此对象默认值为`{}`。

```js
// GET /user/tj
req.params.name
// => "tj"
```

当你的路由定义使用的是正则表达式时，可以使用`req.params[n]`来获取捕获组的值，其中`n`是第`n`个捕获组,此规则也适用于未命名的通配符与字符串路由（如`/file/*`）的匹配：

```js
// GET /file/javascripts/jquery.js
req.params[0]
// => "javascripts/jquery.js"
```

如果你需要对`req.params`中的键做改变，可以使用`app.param`处理器，更改仅适用于已经在路径中定义的参数。

在中间件或路由处理函数中对`req.params`对象所做的任何更改都将被重置。

> **注：** Express会自动依据（`decodeURIComponent`）解码`req.params`中的值。

#### `req.path`

表示请求URL的路径部分。

```js
// example.com/users?sort=desc
req.path
// => "/users"
```

> 从中间件调用时，挂载点不包含在`req.path`中。有关更多详细信息，请参阅`app.use()`。

#### `req.protocol`

表征请求协议的字符串，可能是`http`或`https`。

当`trust proxy` 不等于`false`时，此属性将使用`X-Forwarded-Host`header中的值，此值可以通过客户端或者代理设置。

```js
req.protocol
// => "http"
```

#### `req.query`

此属性通过解析查询字符串而生产的对象。如果没有查询字符串，则为空对象`{}`。

```js
// GET /search?q=tobi+ferret
req.query.q
// => "tobi ferret"

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
req.query.order
// => "desc"

req.query.shoe.color
// => "blue"

req.query.shoe.type
// => "converse"
```

#### `req.route`

返回一个对象，表示当前匹配的路由，比如：

```js
app.get('/user/:id?', function userIdHandler(req, res) {
  console.log(req.route);
  res.send('GET');
});
```

上述代码片段的输出结果如下：

```js
{ path: '/user/:id?',
  stack:
   [ { handle: [Function: userIdHandler],
       name: 'userIdHandler',
       params: undefined,
       path: undefined,
       keys: [],
       regexp: /^\/?$/i,
       method: 'get' } ],
  methods: { get: true } }
```

#### `req.secure`

表征`TLS`连接是否建立的布尔值，等同于:

```js
'https' == req.protocol;
```

#### `req.signedCookies`

当使用了[cookie-parser](https://www.npmjs.com/package/cookie-parser)中间件时，此属性包含请求带来的签名`cookies`，普通的cookie可通过`req.cookie`访问，但是容易被伪造存在恶意攻击的风险，签名cookie实际上并不会使cookie被加密或者隐藏，但是会使得它难以被篡改（用于签名的`secret`是私密的）。

如果没有签名cookie，此属性的值为`{}`。

```js
// Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
req.signedCookies.user
// => "tobi"
```

更多信息可查看[cookie-parser](https://www.npmjs.com/package/cookie-parser)中间件。

#### `req.stale`

表征此请求是否是过时，此属性是`req.fresh`的对立面。更多信息可查看[req.fresh](http://expressjs.com/en/4x/api.html#req.fresh).

```js
req.stale
// => true
```

#### `req.subdomains`

表征请求域名的子域名构成的数组。

```js
// Host: "tobi.ferrets.example.com"
req.subdomains
// => ["ferrets", "tobi"]
```

app settings 中 `subdomain offset` 的默认值为2,此值可以用来确定子域名的起始位置。可通过`app.set()`来改变默认值。

#### `req.xhr`

是一个布尔值，如果请求头的`X-Requested-With`为`XMLHttpRequest`,则为`true`,表明该请求由一个类似`jQuery`的客户端库发起。

```js
req.xhr
// => true
```

### Methods

#### `req.accepts(types)`

检测指定的内容类型是否被接受，结果基于HTTP中的`Accept`请求头。此方法返回最佳匹配值，如果都不匹配则返回`false`,这种情况下，应用的状态码应该为406 `Not Acceptable`。

`type`的值可以是单个的`MIME`类型字符串（比如说`application/json`），可以是拓展名如`json`,可以是由逗号分隔的列表，或者一个数组。如果是列表或者数组，则返回最佳的匹配值。

```js
// Accept: text/html
req.accepts('html');
// => "html"

// Accept: text/*, application/json
req.accepts('html');
// => "html"
req.accepts('text/html');
// => "text/html"
req.accepts(['json', 'text']);
// => "json"
req.accepts('application/json');
// => "application/json"

// Accept: text/*, application/json
req.accepts('image/png');
req.accepts('png');
// => undefined

// Accept: text/*;q=.5, application/json
req.accepts(['html', 'json']);
// => "json"
```

查看[accepts](https://github.com/expressjs/accepts)可了解更多信息。

#### `req.acceptsCharsets(charset[,...])`

返回指定的字符集中第一个匹配的字符集，此结果基于`Accept-Charset`请求头，如果指定的字符集都不被认可则返回`false`.

查看[accepts](https://github.com/expressjs/accepts)可了解更多信息。

#### `req.acceptsEncodings(encoding [, ...])`

返回指定的编码集中的第一个匹配的编码，结果基于`Accept-Encoding`请求头，如果都不匹配则返回`false`.

查看[accepts](https://github.com/expressjs/accepts)可了解更多信息。

#### `req.acceptsLanguages(lang [, ...])`

返回匹配到的第一种语言，结果技术`Accept-Language`请求头。如果都不匹配则返回`false`.

查看[accepts](https://github.com/expressjs/accepts)可了解更多信息。

#### `req.get(field)`

获取请求头中对应项的值（大小写不敏感），`Referrer`和`Referer`是通用的。

```js
req.get('Content-Type');
// => "text/plain"

req.get('content-type');
// => "text/plain"

req.get('Something');
// => undefined
```

结果和`req.header(filed)`一致。

#### `req.is(type)`

如果传入请求的“Content-Type”HTTP头字段与type参数指定的MIME类型匹配，则返回匹配的内容类型。否则返回false。

```js
// With Content-Type: text/html; charset=utf-8
req.is('html');       // => 'html'
req.is('text/html');  // => 'text/html'
req.is('text/*');     // => 'text/*'

// When Content-Type is application/json
req.is('json');              // => 'json'
req.is('application/json');  // => 'application/json'
req.is('application/*');     // => 'application/*'

req.is('html');
// => false
```

可参看[type-is](https://github.com/expressjs/type-is)了解更多信息。

#### `req.param(name [, defaultValue])`

> 已弃用，请使用`req.params,req.body.req.query`。


#### `req.range(size[, options])`

> 此`api`还不算理解

规范 头解析器。

`size`参数表示资源的最大值。

`options`是一个可包含如下值得对象：

| 属性 | 类型 | 描述 |
|----|---|---|
|`combine` | 布尔值 | 指示重叠或者相邻的域是否该合并，默认为`false`,当设置为`true`时，域将被合并返回就类似本身他们在header中是这样表示的一样|

此方法会返回一个数组代表成功或者一个负数表示错误的解析

- -2 表示格式错误的头部字符串 
- -1 表示不满足范围

```js
// parse header from request
var range = req.range(1000)

// the type of the range
if (range.type === 'bytes') {
  // the ranges
  range.forEach(function (r) {
    // do something with r.start and r.end
  })
}
```

## `Response`

`res`对象代表的是当Express app 接收 HTTP 请求时 发送的 HTTP 响应。一般说来此对象会被命名为`res`(相应请求对象是`req`)，不过其命名实际上是由回调函数中的参数确定的。

比如说你可以这样做：

```js
app.get('/user/:id', function(req, res){
  res.send('user ' + req.params.id);
});
```

也可以这样做：

```js
app.get('/user/:id', function(request, response){
  response.send('user ' + request.params.id);
});
```

`res`对象是Node内置的`response`对象的加强版并且支持其所有的[内置方法](https://nodejs.org/api/http.html#http_class_http_serverresponse)。

### 属性

#### `res.app`

指向使用该中间件的`express`实例，在请求对象中 `req.app` 和 `res.app`一样。

#### `res.headersSent`

是一个布尔值，指示`app`是否为响应发送了`HTTP headers`。

```js
app.get('/', function (req, res) {
  console.log(res.headersSent); // false
  res.send('OK');
  console.log(res.headersSent); // true
});
```

#### `res.locals`

表示包含在请求生命周期内的本地变量。除了在请求/响应过程中视图渲染时可用，其余和 app.locals 功能一样。

这个属性在暴露请求层面的信息时非常有用，比如 路径名, 授权用户, 用户设置等等。

```js
app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.authenticated = ! req.user.anonymous;
  next();
});
```

### 方法

#### `res.append(field[,value])`

> 在Express4.11.0以上版本中被支持。

添加指定值到HTTP响应头中，如果`header`不存在，则依据指定的值创建该头，值可以是字符串或者数组。

注意：在`res.append()`后面调用`res.set()`将覆盖前面设置的值。

```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
res.append('Warning', '199 Miscellaneous warning');
```

#### `res.attachment([filename])`

设置HTTP响应头`Content-Disposition`为`attachment`,如果指定了`filename`,则会依据`filename`的后缀通过`res.type()`设置`Content-Type`,同时会设置`Content-Disposition “filename=”`部分：

```js
res.attachment();
// Content-Disposition: attachment

res.attachment('path/to/logo.png');
// Content-Disposition: attachment; filename="logo.png"
// Content-Type: image/png
```

#### `res.cookie(name, value [, options])`

设置cookie `name`的值为`value`。 value的值可以是一个字符串或者转换为`json`的对象。

`options` 参数是一个可以拥有以下属性的参数。

| Property | Type | Description |
| ------- | --- | ------------- |
| domain | String | 设置 cookie 的域名,默认为 app 的域名 |
| encode | Function | 用于编码 cookie 的函数，默认为`encodeURIComponent` |
| expires | Date	| GMT 格式的时间，用以表示cookie的过期时间. 如果没有指定，则生成一个session cookie |
| httpOnly | Boolean |	标记该cookie只能在服务器端可用 |
| maxAge | Number | 已ms格式设置的cookie过期时间 |
| path | String | cookie的路径，默认为`/` |
| secure | Boolean | 指示该cookie只有在https情况下可用 |
| signed | Boolean | 指示该cookie是否应该被签名 |
| sameSite |	Boolean or String |	“SameSite” Set-Cookie 熟悉. 更多信息可参考[这里](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.)

> `res.cookie()`做的事情其实就是设置了`Set-Cookie`头中对应的信息。

使用示例如下：

```js
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
```

`encode`值是一个函数，用于指定`cookie`的编码格式，不支持异步函数。

示例如下：

```js
//Default encoding
res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com',{domain:'example.com'});
// Result: 'some_cross_domain_cookie=http%3A%2F%2Fmysubdomain.example.com; Domain=example.com; Path=/'

//Custom encoding
res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com',{domain:'example.com', encode: String});
// Result: 'some_cross_domain_cookie=http://mysubdomain.example.com; Domain=example.com; Path=/;'
```

`maxAge`是一种更为方便的设置过期时间的方法，如下:

```js
res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true });
```

cookie的值也可以是一个对象，其之后会被`bodyParser()`序列化为JSON。

```js
res.cookie('cart', { items: [1,2,3] });
res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });
```

当使用`cookie-parser`中间件时，此方法同样支持签名cookie，只需要设置`signed`为`true`,`res.cookie()`就会利用传输给`cookieParser(secret)`的secret对该值进行签名。

```js
res.cookie('name', 'tobi', { signed: true });
```

之后你可以通过`req.signedCookie`读取签名的cookie值。

#### `res.clearCookie(name[,options])`

清除名称为`name`的cookie。

> 浏览器等客户端只会清除到达过期时间的cookie。

```js
res.cookie('name', 'tobi', { path: '/admin' });
res.clearCookie('name', { path: '/admin' });
```

#### `res.download(path [, filename] [, options] [, fn])`

> 此方法中的参数`options`只在`v4.16.0`之后的版本中可用。

已附件在路径中传输文件，一般说来，浏览器会提示用户下载文件，默认情况下 `Content-Disposition` header 中的 `filename=` 参数就是路径（此值一般会出现在浏览器的对话框中）。使用`filename`参数可用覆盖此值。传输出错或者下载完成会调用回调函数`fn`。此方法使用`res.sendFile()`来传送文件。

可选的options参数传递给底层的[`res.sendFile()`](http://expressjs.com/en/4x/api.html#res.sendFile)调用，并采用与其完全相同的参数。

```js
res.download('/report-12345.pdf');

res.download('/report-12345.pdf', 'report.pdf');

res.download('/report-12345.pdf', 'report.pdf', function(err){
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {
    // decrement a download credit, etc.
  }
});

```

#### `res.end([data] [, encoding])`

用于结束响应过程，此方法来自node核心，`http.ServerResponse` 模块中的 `response.end()`.用于不传输任何数据快速结束响应，如果你想要传输数据，请使用`res.send()`或者`res.json()`

```js
res.end();
res.status(404).end();
```

#### `res.format(object)`

如果请求对象中存在的`Accept` HTTP头，可触发内容协商，将使用`req.accepts()`值的权重为选择请求对应的处理器，如果请求的`Accept`请求头没有被指定，将触发第一个回调函数，当没有匹配值时，服务器会返回406 “Not Acceptable”，或者触发默认的回调函数。

当回调函数被选定时，响应头的`Content-Type`将会被自动设定，当然在回调函数中你也可以使用`res.set()` 或者 `res.type()`来更改此请求头的值。

下例中，当`Accept`头设置为“application/json” 或 “*/json” 时响应为`{ "message": "hey" }`,(如果`Accept`头设置为`*/*`,响应为`hey`)。

```js
res.format({
  'text/plain': function(){
    res.send('hey');
  },

  'text/html': function(){
    res.send('<p>hey</p>');
  },

  'application/json': function(){
    res.send({ message: 'hey' });
  },

  'default': function() {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable');
  }
});
```

除了指定规范化的 `MIME` 类型，还可以使用拓展名来映射，来简化上述语句:

```js
res.format({
  text: function(){
    res.send('hey');
  },

  html: function(){
    res.send('<p>hey</p>');
  },

  json: function(){
    res.send({ message: 'hey' });
  }
});
```

#### `res.get(field)`

依据指定的`field`,返回指定的`HTTP` 响应头对应的值，`field`大小写不敏感。

```js
res.get('Content-Type');
// => "text/plain"
```

#### `res.json([body])`

发送一个JSON响应，此方法将使用正常的内容类型发送响应，参数将通过`JSON.stringify()`转换为`JSON`字符串。

参数可以是任何JSON类型，包括对象，数组，字符串，布尔值，数值等等，你也可以使用它转换其它值为JSON，比如说`null`,`undefined`(虽然这些类型从技术上来讲不是有效的JSON)。

```js
res.json(null);
res.json({ user: 'tobi' });
res.status(500).json({ error: 'message' });
```

#### `res.jsonp([body])`

使用JSONP发送JSON响应，除了支持`JSONP`回调，此方法与`res.json()`相同。

```js
res.jsonp(null);
// => callback(null)

res.jsonp({ user: 'tobi' });
// => callback({ "user": "tobi" })

res.status(500).jsonp({ error: 'message' });
// => callback({ "error": "message" })
```

默认情况下，JSONP的回调函数名称为`callback`,可以通过设置[jsonp callback name](http://expressjs.com/en/4x/api.html#app.settings.table)来更换。

以下是JSONP的一些使用示例：

```js
// ?callback=foo
res.jsonp({ user: 'tobi' });
// => foo({ "user": "tobi" })

app.set('jsonp callback name', 'cb');

// ?cb=foo
res.status(500).jsonp({ error: 'message' });
// => foo({ "error": "message" })
```

#### `res.links(links)`

把参数添加到HTTP 响应头 `Link` 中。

如下例:

```js
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5'
});
```

将得到以下结果;

```js
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

#### `res.location(path)`

设置响应头`Location`为指定的值：

```js
res.location('/foo/bar');
res.location('http://example.com');
res.location('back');
```

值`back`具有特殊的含义，它指向请求头中的`Referer`头的值，如果请求头中`Referer`没有被指定，响应头中的`Location`将指向`/`。

> 如果没有编码，在进行编码后，Express将通过头`Location`传递指定的URL到浏览器中，这个过程不会有任何验证。
> 浏览器负责从当前URL或引用UR以及`location`中指定的URL获取预期的URL，并相应的进行重定向。

#### `res.redirect([status,] path)`

依据指定的路径和状态（一个对应于HTTP状态码的正整数）重定向URL，如果没有指定，默认值为`302 Found`。

```js
res.redirect('/foo/bar');
res.redirect('http://example.com');
res.redirect(301, 'http://example.com');
res.redirect('../login');
```

可以传入一个完整的站点信息重定向到其它的网站

```js
res.redirect('http://google.com');
```

重定向也可以相对域名所有的`root`发生，比如说，如果当前位置位于`http://example.com/admin/post/new`,下述代码将重定向至`http://example.com/admin`。

```js
res.redirect('/admin');
```

重定向也可以相对于当前的URL，比如下面的例子中将从`http://example.com/blog/admin/`重定向至`http://example.com/blog/admin/post/new`。

```js
res.redirect('post/new');
```

如果从`http://example.com/blog/admin`重定向至`post/new`将重定向至`http://example.com/blog/post/new.`

> 可以把`/`这个过程理解,这样能让你的思路更为清晰。

如果传入的值为`back`,将重定向至`referer`请求头,如果`referer`不存在则默认为`/`。

```js
res.redirect('back');
```

#### `res.render(view [, locals] [, callback])`

渲染视图并发送渲染得到的`html`字符串到客户端。可选参数如下：
- `locals`:一个定义了视图函数中可用的本地变量组成的对象；
- `callback`:一个回调函数。如果提供，该方法返回可能的错误和呈现的字符串，但不会执行自动响应。发生错误时，该方法会在内部调用`next(err)`。

`view`参数是一个字符串，指向视图文件的位置。此值可以是决定路径也可以是相对`views setting`的相对路径，如果该路径不包含拓展名则`view engine`的设置会决定其拓展名，如果包含拓展名将以指定的模板引擎渲染模块（使用`require`），并将触发对应模块的`__express`方法来进行渲染。更多信息可见[在Express中使用模板引擎](http://expressjs.com/guide/using-template-engines.html)。

> view参数执行文件系统操作，如从磁盘读取文件和评估Node.js模块，因此出于安全考虑，不应包含来自最终用户的输入。

```js
// send the rendered view to the client
res.render('index');

// if a callback is specified, the rendered HTML string has to be sent explicitly
res.render('index', function(err, html) {
  res.send(html);
});

// pass a local variable to the view
res.render('user', { name: 'Tobi' }, function(err, html) {
  // ...
});
```

#### `res.send([body])`

发送`Http`响应，

`body`参数可以是`Buffer object, a String, an object, or an Array.`

如：

```js
res.send(new Buffer('whoop'));
res.send({ some: 'json' });
res.send('<p>some html</p>');
res.status(404).send('Sorry, we cannot find that!');
res.status(500).send({ error: 'something blew up' });
```

此方法为非流式响应提供了一些自动操作，如自动添加`Content-Length`响应头，并且自动添加`HEAD`以及`HTTP`缓存。

当参数为`Buffer`对象时，此方法设置`Content-Type`响应头为`application/octet-stream`,除非像下面这样预先定义：

```js
res.set('Content-Type', 'text/html');
res.send(new Buffer('<p>some html</p>'));
```

当参数为`String`时，会自动设置`Content-Type`为“text/html”

```js
res.send('<p>some html</p>');
```

当响应为对象或者数组时，响应值为`JSON`表示：

```js
res.send({ user: 'tobi' });
res.send([1,2,3]);
```

#### `res.sendFile(path [, options] [, fn])`

> `res.sendFile(path [, options] [, fn])`在`Express4.8.0`之后的版本中被支持。

基于给定的路径传输文件，并依据文件的拓展名设置响应头的`Content-Type`.除非在`options`对象中设置了`root`,否者路径必须为绝对路径。

下表提供了`options`参数的详细信息

| Property |	Description |	Default |	Availability |
| -------- | ------------ | ------ | ------------| 
| maxAge | 以毫秒格式设置`Cache-Control`响应头中的`max-age`值，可以是数值或者数值格式的字符串 |	0 |  |
| root | 相对文件的Root路径 | | |
| lastModified |	设置`Last-Modified`响应头的值为该文件在系统中最后被修改的日期，设置为false 可以禁用它 | Enabled |	4.9.0+ |
| headers | 包含HTTP头文件的对象。| | |
| dotfiles | 是否提供点开头的文件. 可选值有 “allow”, “deny”, “ignore”. | “ignore” ||
| acceptRanges |	启用或禁用接受范围的请求。|	true | 4.14+ |
| cacheControl |	启用或者禁用设置 `Cache-Control` 响应头 | true | 4.14+ |
| immutable | 启用或者禁用响应头中的`Cache-Control` 的`immutable`指示，如果启用，`maxAge`应该指示为可用。此指示会在`maxAge`生命周期内组织客户端进行额外的请求|false |4.16+|

当传输完成或者出现错误时会触发回调函数`fn(err)`,如果指定了回调函数并且确实发生了错误，则回调函数必须处理响应过程，可中断响应也可传入控制到下一个`route`。

示例如下：

```js
app.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});
```

下面的例子展示了使用`res.sendFile`为服务文件提供精细的控制:

```js
app.get('/user/:uid/photos/:file', function(req, res){
  var uid = req.params.uid
    , file = req.params.file;

  req.user.mayViewFilesFrom(uid, function(yes){
    if (yes) {
      res.sendFile('/uploads/' + uid + '/' + file);
    } else {
      res.status(403).send("Sorry! You can't see that.");
    }
  });
});
```

更多信息可以查看[send](https://github.com/pillarjs/send)。

#### `res.sendStatus(statusCode)`

设置HTTP响应的状态码为`statusCode`,并且在响应`body`中添加它的字符串表示。

```js
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
```

如果指定了不受支持的状态码，该状态码依旧会被指定，响应信息会是该状态码的字符串表示。

```js
res.sendStatus(2000); // equivalent to res.status(2000).send('2000')
```

[关于状态码的更多信息](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

#### `res.set(field [, value])`

设置响应头对应的`field`为`value`,此方法也支持同时设置多个`field`为对应的值。

```js
res.set('Content-Type', 'text/plain');

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  'ETag': '12345'
});
```

此方法和`res.header(field [, value]).`功能一致。

#### `res.status(code)`

设置响应的HTTP状态码，它可以看做一个可链式调用的[response.statusCode](http://nodejs.org/api/http.html#http_response_statuscode)。

```js
res.status(403).end();
res.status(400).send('Bad Request');
res.status(404).sendFile('/absolute/path/to/404.png');
```

#### `res.type(type)`

设置`Content-Type`为对应的`MIME`类型，如果`type`中包含`/`,将会设置`Content-Type`为传入的`type`。

```js
res.type('.html');              // => 'text/html'
res.type('html');               // => 'text/html'
res.type('json');               // => 'application/json'
res.type('application/json');   // => 'application/json'
res.type('png');                // => image/png:
```

#### `res.vary(field)`

如果不存在添加该字段到`Vary`响应头中。

```js
res.vary('User-Agent').render('docs');
```


## Router

`router`对象是一个中间件或者路由的独立实例，你可以把它当做迷你程序，只能执行中间件和路由函数。每一个Express程序都有一个内置的`app`路由。

路由器的行为就像中间件本身一样，所以你可以用它作为`app.use()`的参数，或者作为另一个路由器的`use（）`方法的参数。

顶层的`express`对象拥有一个`Router()`方法可以用于创建一个`router`对象。

一旦创建了一个路由器对象，就可以像应用程序一样向其添加中间件和HTTP方法路由（例如`get`，`put`，`post`等）比如：

```js
// invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

// will handle any request that ends in /events
// depends on where the router is "use()'d"
router.get('/events', function(req, res, next) {
  // ..
});
```

你可以为特定的路径指定路由，从而把对不同路由的处理分隔到不同的文件中。

```js
// only requests to /calendar/* will be sent to our "router"
app.use('/calendar', router);
```

### 方法

#### `router.all(path, [callback, ...] callback)`


此方法类似标准的`router.MEYHOD()`方法，不同的地方在于它将匹配所有的`http`请求。

`app.all()`方法在处理对某特定的前缀或匹配的特殊路径的所有类型的请求时特别有用。比如说如果你把下述代码放在所有其它路径的定义之前，就会让从此代码之后的所有路由都需要身份验证，并自动加载一个user。这些回调也不必做为终点，`loadUser`可以用来执行某个任务，然后调用`next()`来继续匹配之后的路由。

```js
router.all('*', requireAuthentication, loadUser);
```

上述代码也等同于

```js
router.all('*', requireAuthentication);
router.all('*', loadUser);
```

下面还有另外一个非常好用的全局函数示例，这个例子和上面那个类似，但是严格限制路径以`/api`开头

```js
router.all('/api/*', requireAuthentication);
```

#### `router.METHOD(path, [callback, ...] callback)`

依据请求的类型处理http请求，请求类型可以是`GET,PUT,POST`等等的小写模式。因此，实际的方法是`app.get()`,`app.post()`,`app.put()`等等。[点击这里](http://expressjs.com/zh-cn/4x/api.html#routing-methods)可以查看详细的路由方法清单。

> 如果没有在`router.get()`前指定`HTTP HEAD`对应的方法，将会调用`router.get()`响应`HEAD`请求。

你也可以提供多个回调函数，他们会被同等的对待，并且像中间件一样行为，只不过这些回调可能会调用next（'route'）来绕过剩余的路由回调。您可以使用此机制在路由上执行预处理，并且在不再需要在继续处理时把控制权移交给下一个路由。

下面的例子展示了最简单的路由定义，Express会将路径字符串转换为正则表达式，用以匹配接收到的请求，匹配时不会考虑查询字符串，比如`GET /`将会匹配`GET /?name=tobi`,如下所示：

```js
router.get('/', function(req, res){
  res.send('hello world');
});
```

你同样可以使用正则表达式来进行匹配，这在你有特殊匹配时非常有用，比如说下面的路由将匹配`GET /commits/71dbb9c`和 `GET /commits/71dbb9c..4c084f9`

```js
router.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
  var from = req.params[0];
  var to = req.params[1] || 'HEAD';
  res.send('commit range ' + from + '..' + to);
});
```

#### `router.param(name, callback)`

为路由参数添加回调函数，其中`name`是参数名或参数组成的数组，`callback`是回调函数。回调函数的参数依次是请求对象(request)，响应对象(response),下一个中间件，参数值及参数名。

如果`name`是一个数组，回调函数会按照它们声明的顺序被注册到其中的每个值。此外除了最后一个声明的参数，回调函数中的`next`将会触发下一个注册参数的回调函数，而对于最后一个参数，`next`则会调用处理当前路由的下一个中间件，此时的处理就像`name`只是一个字符串一样。

比如说当`:user`存在于路由的路径中时，你可能想映射用户加载逻辑以自动提供`req.user`给路由或者对参数输入执行验证。

```js
app.param('user', function(req, res, next, id) {

  // try to get the user details from the User model and attach it to the request object
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});
```

Param 回调函数对于它们定义的路由来说是本地的。它们不会被载入的app及router继承。因此，定义在`app`上的参数回调只会被定义在`app`路由上的路由参数触发。

所有的参数回调将会在任何匹配该路由的处理函数前触发，并且在一个请求响应周期内只会被触发一次，即使参数匹配了多个路由也是如此。

```js
app.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

app.get('/user/:id', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

对于请求`GET /user/42`将打印以下语句：

```bash
CALLED ONLY ONCE
although this matches
and this matches too
```

```js
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});

app.get('/user/:id/:page', function (req, res, next) {
  console.log('although this matches');
  next();
});

app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

对于请求 `GET /user/42/3`,下面语句将被打印

```bash
CALLED ONLY ONCE with 42
CALLED ONLY ONCE with 3
although this matches
and this matches too
```

#### `router.route(path)`

返回单一路由的实例，你可以使用不同的可选中间件来处理不同类型的请求。使用`route.route()`可以避免重复的写路由名及由此造成的输入错误。

```js
var router = express.Router();

router.param('user_id', function(req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
  req.user = {
    id: id,
    name: 'TJ'
  };
  next();
});

router.route('/users/:user_id')
.all(function(req, res, next) {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
  next();
})
.get(function(req, res, next) {
  res.json(req.user);
})
.put(function(req, res, next) {
  // just an example of maybe updating the user
  req.user.name = req.params.name;
  // save user ... etc
  res.json(req.user);
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
});
```


这种方法为单一的路径`/users/:user_id`添加了不同的 HTTP 方法。

#### `router.use([path], [function, ...] function)`

为可选的`path`添加一系列的处理函数，`path`默认值为`/`。

此方法类似于`app.use()`,下面是一个简单的例子，可以查看[`app.use`](http://expressjs.com/en/4x/api.html#app.use)查看更多信息。

中间件就像水暖管一样，有请求时会从第一个匹配的中间件开始逐步往下到所有匹配到的中间件。

```js
var express = require('express');
var app = express();
var router = express.Router();

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// this will only be invoked if the path starts with /bar from the mount point
router.use('/bar', function(req, res, next) {
  // ... maybe some additional /bar logging ...
  next();
});

// always invoked
router.use(function(req, res, next) {
  res.send('Hello World');
});

app.use('/foo', router);

app.listen(3000);
```

匹配的路径被剥离并且对中间件函数不可见，此特性的意义在于一个匹配的中间件函数可以独立于路径执行。

使用`router.use()`定义的中间件函数非常重要，它们会依次被触发，比如说第一个中间件函数常常是`logger`,这样所有的请求都会被`log`.

```js
var logger = require('morgan');

router.use(logger());
router.use(express.static(__dirname + '/public'));
router.use(function(req, res){
  res.send('Hello');
});
```

假如现在你想忽略静态文件的`log`,但是对其它的请求还是想要有`log`,你只需把` express.static() `移动到`logger`中间件上面即可。

```js
router.use(express.static(__dirname + '/public'));
router.use(logger());
router.use(function(req, res){
  res.send('Hello');
});
```

静态服务器是另一个很好的例子，假如你想给`/public`更高的权重，你可以按照下面这样进行：

```js
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));
```

`router.use()`方法还支持命名参数，以便其他路由器的挂载点可以使用命名参数进行预加载。

注意：虽然这些中间件功能是通过一个特定的路由器添加的，但是当它们运行的​​时候是由它们所匹配的路径（而不是路由器）来定义的。因此，如果路由匹配，通过一个路由器添加的中间件可以运行其他路由器。例如，这段代码显示了两个不同的路由器匹配到了同一个路径

```js
var authRouter = express.Router();
var openRouter = express.Router();

authRouter.use(require('./authenticate').basic(usersdb));

authRouter.get('/:user_id/edit', function(req, res, next) { 
  // ... Edit user UI ...  
});
openRouter.get('/', function(req, res, next) { 
  // ... List users ... 
})
openRouter.get('/:user_id', function(req, res, next) { 
  // ... View user ... 
})

app.use('/users', authRouter);
app.use('/users', openRouter);
```

上面的例子中，虽然`authenticate`定义在了`authRouter`上，但是也会执行`openRouter`路由器关联的中间件，为了避免这种行为，最好不同的路由器不要匹配相同的路径。









