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


#### `express.static(root,[options])`

这也是Express内置中间件之一，它基于[serve-static](http://expressjs.com/en/resources/middleware/serve-static.html)构建，用于提供静态文件。

> Note: 使用反向代理缓存可以提高静态文件服务器的效率

`root`参数指定提供静态文件的根目录。服务器将拼合`req.url`和所提供的根目录来查找静态文件。如果没有找到对应的文件，服务器不会返回404，而将调用`next()`以执行下一个中间件，允许堆叠和回退。

下表描述了可选的`options`对象中可配置的属性：

|属性|描述|类型|默认值|
| --- | --- | --- | --- |
|`dotfiles`|决定该如何处理以点开头的文件|String|"ignore"|
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

可选参数`option`的对象描述如下

| 属性  | 描述  | 默认值  | 兼容性 |
| ---- | --- | ---- | ---- |
|`caseSensitive`| 是否qiys 大小写敏感 | 默认不启用，意味着`/Foo`和`foo`是一样的||
|`mergeParams`|是否保存父路由中的`req.params`值，如果相互冲突，取子路由中的值|`false`|4.5.0+|
|`strict`|启用应该匹配|默认禁止，`/foo`和`/foo/`的响应一致||

你可以像对待`express`应用一样，给router添加中间件和各种方法。

#### `express.urlencoded([options])`

> 此中间件适用于Express v4.16.0及更新的方法

这是Express提供的一个内置中间件，它基于[body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)解析传入的请求为`urlencoded`格式。

返回只解析urlencoded的中间件,而且只查看`Content-Type header`与类型选项匹配的请求。这个解析器只接收 `UTF-8`编码的`body`,支持自动的解压`gzip`和压缩编码。

进过此中间件处理后，会返回一个新的包含解析数据的`body`对象（如`req.body`）,如果没有`body`可供解析或`Content-Type`不匹配或发生了错误则会返回一个空对象`({})`。对象可以包含键值对，值可以是字符串或者数组（当extended为false时），或者其它任意类型（当extended为true时）。

下表描述了可选的`options`对象中可配置的属性：

|属性  |描述  |类型 | 默认值|
| --- | --- | --- | --- |
|`extended`|此选项用以决定使用`querystring`库（`false`时）还是`qs`库（`true`时）来解析`URL-encoded`数据。“extended”语法允许将对象和数组编码为URL格式，从而达到使用URL编码的类似获得类似JSON的体验。查看[qs](https://www.npmjs.com/package/qs#readme)了解更多信息|Boolean|true|
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

- 为 http 请求提供可选择的路由，比如说可以查看[`app.METHOD`](http://expressjs.com/en/4x/api.html#app.METHOD)和[`app.param`](http://expressjs.com/en/4x/api.html#app.param);
- 配置中间件，见[app.route](http://expressjs.com/en/4x/api.html#app.route);
- 渲染html视图，见[app.render](http://expressjs.com/en/4x/api.html#app.render)
- 注册目标引擎，见[app.engine](http://expressjs.com/en/4x/api.html#app.engine)

app对象还提供一些其它的影响应用行为的配置，可以查看[Application settings](http://expressjs.com/en/4x/api.html#app.settings.table)了解更多信息。

> Express appliaction 对象可以分别以 `req.app` 和 `res.app` 引用自 `request对象` 和 `response对象`。

### 属性

#### `app.locals`

`app.locals`对象以应用内部变量做为属性

```js
app.locals.title
// => 'My App'

app.locals.email
// => 'me@myapp.com'
```

一旦设置，`app.locals`属性将在整个应用的生命周期内有效，相比而言`res.locals`的属性值则只在请求的生命周期内有效。

你可以在应用渲染的模板中访问本地变量。这在提供模板的辅助函数及应用级别的数据时非常有用，本地变量在中间件中可以通过`req.app.locals`访问（详见[`req.app`](http://expressjs.com/en/4x/api.html#req.app)）

```js
app.locals.title = 'My App';
app.locals.strftime = require('strftime');
app.locals.email = 'me@myapp.com';
```

#### `app.mountpath`

`app.mountpath`属性包含一个或者多个关于那个sub-app将被加载的路径模式。

> sub-app指的是用于处理对路由的请求的`express`的实例。

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

如果一个sub-app以多种路径模式加载，`app.mountpath`将返回一个模式的列表

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

> 次级app还可以再拥有次级app，如果如此，那次级app和router的区别在哪儿呢？

### Events

#### `app.on('mount',callback(parent))`

`mount`事件在`sub-app`挂载（mount）到父app时触发，父app会被参数传入回调函数中。

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

此方法类似标准的[`app.MEYHOD()`](http://expressjs.com/zh-cn/4x/api.html#app.METHOD)方法，不同的地方在于它将匹配所有的`http`请求。

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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
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

下面还有另外一个非常好用的全局函数示例，这个例子和上面那个类似，但是严格限制路径以`/api`开头

```js
app.all('/api/*', requireAuthentication);
```

#### `app.delete(path, callback [, callback ...])`

绑定针对某特定路径的HTTP DELETE请求到特定的回调函数上。更多信息可查看[路由指南](http://expressjs.com/guide/routing.html)。

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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)


##### 示例

```js
app.delete('/', function (req, res) {
  res.send('DELETE request to homepage');
});
```

#### `app.disable(name)`

设置setting中的布尔值属性`name`值为`false`，`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。调用`app.set('foo',false)`和调用`app.disable('foo')`的效果一致：

如：

```js
app.disable('trust proxy');
app.get('trust proxy');
// => false
```

#### `app.disabled(name)`

如果`setting`中的设置项`name`的值为`false`则返回`true`,`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。

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

如果`setting`中的设置项`name`的值为`true`则返回`true`,`name`是[app settings表](http://expressjs.com/zh-cn/4x/api.html#app.settings.table)中的值为布尔型的项。

```js
app.enabled('trust proxy');
// => false

app.enable('trust proxy');
app.enabled('trust proxy');
// => true
```

#### `app.engine(ext,callback)`

注册给定的模板引擎的回调函数为`ext`。

默认情况下，Express将会基于拓展名`require()`引擎，比如说，如果你渲染文件`foo.pug`,Express将在内部触发以下代码，并会为接下来的请求缓存`require()`以提高性能。

```js
app.engine('pug', require('pug').__express);
```

对不提供直接可用的`.__express`的引擎，或者你想把不同的后缀映射到当前引擎可以使用下述方法，

比如说，你想使用EJS引擎来渲染`.html`文件

```js
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

返回app setting 中相关的`name`的值，如：

```js
app.get('title');
// => undefined

app.set('title', 'My Site');
app.get('title');
// => "My Site"
```

#### `app.get(path,callback[,callback])`

使用特定的回调函数处理特定路径的HTTP GET请求

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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
> 
> 可在[此处参考示例](http://expressjs.com/zh-cn/4x/api.html#middleware-callback-function-examples)

更多信息可参考[routing 指南](http://expressjs.com/guide/routing.html)


#### `app.listen(path,[callback])`

启动UNIX套接字并侦听给定路径上的连接。此方法等同于Node的[`http.Server.listen()`](https://nodejs.org/api/http.html#http_server_listen_path_callback)方法.

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

由`express()`方法返回的`app`实际上是一个JavaScript `Function`,它被设计为传递给Node的HTTP servers作为回调函数来处理请求。由于 app 并没有什么继承，这使得可以非常方便使用同一套代码提供`http`或`https`版本的app。

```js
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
```

`app.listen()`方法返回一个`http.Server`对象，对于`http`来说，它可以像下面这样非常容易使用

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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
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

> 如果没有在`app.get()`前指定`HTTP HEAD`对应的方法，将会调用`app.get()`响应`HEAD`请求。

`app.all`并不对应某个特定的HTTP方法，而是会响应针对某个特定路径的所有请求，详细可[参看](http://expressjs.com/zh-cn/4x/api.html#app.all)。

更多信息可参考[routing 指南](http://expressjs.com/guide/routing.html)

#### `app.param([name],callback)`

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

对于那些特别复杂加载了特别多`app`的程序，此行为会变得很复杂，通常情况下使用`req.baseUrl`来获取app规范路径更好。

#### `app.post(path,callback[,callback])`

绑定针对某特定路径的HTTP POST请求到特定的回调函数上。更多信息可查看[路由指南](http://expressjs.com/guide/routing.html)。


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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
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
> 由于[`router`](http://expressjs.com/zh-cn/4x/api.html#router)和[`app`](http://expressjs.com/zh-cn/4x/api.html#application)都实现了中间件接口，因此你可以像使用其他中间件功能一样使用它们。
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

返回单一路由的实例，你可以使用不同的可选中间件来处理不同类型的请求。使用`app.route()`可以避免重复的写路由名及由此造成的输入错误。

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

设置属性`name` 为 `value`,你可以保存任何你想用的值，不过一些特定名称被用来配置浏览器的行为。

前面已经提到过，调用`app.set('foo',true)`设置布尔值为`true`与使用`app.enable('foo')`相同，类似的，调用`app.set('foo',false)`与`app.disable('foo')`相同。

使用`app.get`可以获取设定的值。

```js
app.set('title', 'My Site');
app.get('title'); // "My Site"
```

##### 应用设定

下表列出了应用设定

请注意`sub-app`具有以下特征：

- 不会继承具有默认值的`settings`的值，其值必须在`sub-app`中设置；
- 会继承没有默认值的值，这些会在下表中明确提到。

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
|`view cache`| Boolean | 启用视图模板汇编缓存，**注：**Sub-apps不会鸡翅此值在生产环境中的设置(当`NODE_ENV`设置为`producetion`时)。|生产环境上默认为`true`，否则为`undefined`|
|`view engine`| String | 省略时使用默认的引擎拓展 **注：**Sub-app将继承此值的设置|`N/A(undefined)`|
|`x-powered-by`|Boolean|启用`X-Powered-By:Express` HTTP 头部| `true`|

##### `trust proxy`的可用设置值











