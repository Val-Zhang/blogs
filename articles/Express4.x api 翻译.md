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


