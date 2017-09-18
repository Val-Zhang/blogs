# webpack从入门到工程实践

> 本文较长，为了节省你的阅读时间，在文前列写作思路如下：
> 
> 1. 什么是`webpack`，它要解决的是什么问题？
> 2. 对`webpack`的主要配置项进行分析，虽然不会涉及太多细节，但是期待在本节能让我们知晓如果我们有什么需求，我们该从哪些配置项着手修改？
> 3. 分析`create-react-app`的基础配置文件
> 4. 分享一些自己工作中对`webpack`的实践
  
本文的初衷是和你一起理清`webpack`的使用逻辑，以便能更加容易的编写及拓展自己项目所需的配置文件。不过也得提前说明本文可能并不是一篇好的可以跟着操作的教程（想跟着一步步做的童鞋可以看[官方示例](https://webpack.js.org/guides/)和[webpack入门，看这篇就够了](http://www.jianshu.com/p/42e11515c10f)。

## 换个角度看待`webpack`

近年来，前端技术蓬勃发展，我们想在`js`更方便的实现`html` , 社区就出现了`jsx`,我们觉得原生的`css`不够好用，社区就提出了`scss`,`less`，针对前端项目越来越强的模块化开发需求，社区出现了`AMD`,`CommonJS`,`ES2015 import`等等方案。遗憾的是，这些方案大多并不直接被浏览器支持，往往伴随这些方案而生的还有另外一些，让这些新技术应用于浏览器的方案，我们用[`babel`](https://babeljs.io/)来转换下一代的`js`，转换`jsx`;我们用各种工具转换`scss`,`less`为`css`；我们发现项目越来越复杂，代码体积越来越大，又要开始寻找各种优化，压缩，分割方案。前端工程化这个过程，真是让我们大费精力。我们也大多是在寻找前端模块化解决方案的过程中知晓了`webpack`。

的确，`webpack`的流行得益于野性生长的前端，其本质是一种前端模块化打包解决方案，但是更重要的是它又是一个可以融合运用各种前端新技术的平台，明白`webpack`的使用哲学后，只需要简单的配置,我们就可以随心所欲的在`webpack`项目中使用`jsx/ts`,使用`babel/postcss`等平台提供的众多其它功能，只需通过一条命令由源码构建最终可用文件。可以不夸张的说`webpack`为前端的工程化开发提供了一套相对容易和完整的解决方案。一些知名的脚手架工具，也大多基于`webpack`(比如`create-react-app`)。

`webpack`好难！我第一次复制别人的配置文件到我的项目中，发现以自己仅有的JS知识完全看不懂时，也有这种感觉。后来发现有这种感觉其实是因为自己看待`webpack`的角度错了，对大多数前端开发者而言，以往我们接触的各种库，要么类似`jQuery`,通过`$`符在前端项目中直接运行，所做的事情只在前端生效，要么类似`express.js`,在`node.js`项目中直接`require`后就可以使用，所做的事情只在后端生效。`webpack`的不同之处就在于，虽然我们的配置文件位于前端项目中，但实际上它却运行于`node.js`，之后的处理结果又供前端使用（也可能供node使用）。所以学习之前，我们转变一下思维，从`node.js`的角度来看`webpack`，很多事情就会简单起来。

我们对下图一定不陌生，假设现在我们手中有一系列相互关联的文件`js`,`jsx`,`css`,`less`,`jpg`，我们一步步的看看为了把它们转换为项目最终需要的，浏览器可识别的文件，`webpack`都做了什么。

![webpack做了什么](http://images.gitbook.cn/974636d0-8c46-11e7-a6d5-cdf15ad8429c)


## 对`webpack`主要配置项的分析

如果不去考究细节，我们大可把`webpack`简化理解为一个函数，配置文件则是其参数，传入合理的参数后，运行函数就能得到我们想要的结果。

`webpack`也只是一个打包工具，它可不是什么智能`ai`，我们该从哪儿输入文件，我们想把输出结果放哪里，输出结果应该长什么样，它都不知道。而我们目前和`webpack`函数交互的唯一方法就是通过参数，这就涉及到`webpack`配置对象中两个重要概念`entry`和`output`了，因此，我们的配置对象至少具备以下结构：

```javascript
// 第一阶段
{
	entry:{},
	output:{}
}
```

### 入口配置`entry`

理想状态是，我们把所有自己编写的文件都交给`webpack`,让它找明里面的关系，进过一定处理后，给出最终我们想要的结果。遗憾的是，`webpack`也不会机械学习，我们手头的一堆文件之间的关系是自己确定的，一般我们的项目都会存在一个或几个主文件，其它的所有的文件（模块）都直接或间接的链接到了这些文件。我们在`entry`项中需要填写的就是这些主文件的信息。

不过我们也不要嫌弃`webpack`笨，通过我们给的主文件路径，通过分析它能构建最合适的依赖关系，这意味着只有用过的代码才会被打包，比如我们在一个文件中写了五个模块，但是实际只用了其中一个，打包后的代码只会包含引用过的模块。

`webpack`中很多地方的配置都有多种写法，这也是其让人疑惑的地方之一，很遗憾，我们的第一个配置对象`entry`就是如此。

**`entry`可以是三种值：**

1. 字符串:如`entry:'./src/index.js'`，字符串也可以是函数的返回值，如`entry: () => './demo'`，单一入口占位符`[name]`值为`main`（关于占位符，稍后详述）；
2. 数组形式，如`[react,react-dom]`，可以把数组中的多个文件打包转换为一个`chunk`；
3. 对象形式，如果我们需要配置的是多页应用，或者我们要抽离出指定的模块做为公共代码，就需要采用这种形式了，属性名是占位符`[name]`的值，属性值可以是上面的字符串和数组，如下:

```js
// 值得注意的是入口文件有几个就会生成几个独立的依赖图谱。
entry:{
	main:'./src/index.js',
	second:'./src/index2.js',
	vendor: ['react','react-dom']
}
```

好吧，千辛万苦，我们在一堆各种类型的文件中找到了入口文件，这里我们假设为`./src/index.js`，此时我们的配置对象如下;

```js
// 第二阶段
{
	entry:{
		main:'./src/index.js'
	},
	output:{}
}
```

> `webpack`依据入口文件来构建依赖体系，每个入口文件在打包完成后都具备其独立的依赖图谱，在此我们暂时称这些由主入口配置生成的文件为主`js`文件。

### 输出配置`output`

`output`配置项作用于打包文件的输出阶段，其作用在于告知`webpack`以何种方式输出打包文件，关于`output`，`webpack`提供了[众多的可配置选项](https://webpack.js.org/configuration/output/)，我们简单介绍下最常用的选项：

#### `output`基本配置项

我们都另存过文件，当我们另存一个文件时，我们需要确定另存的文件名和另存的路径，`webpack`将打包后的结果导出的过程就类似于此，此过程由`output`配置项控制，其最基本配置包括`filename`和`path`两项。这两项用以决定上述主`js`文件的存储行为。

不过我们程序的首页往往不需用到某个主`js`文件的所有代码，实际开发中，我们常常使用一定方法对代码进行分割，方便按需加载，提升体验。这类不具备独立依赖的文件，我们称之为`chunkfile`。`chunkfile`的命名，在`output`中对应`chunkFilename`项；

此外`output`的`publicPath`项，用于控制打包文件的相对或者绝对引用路径，配置不当往往造成在运行时找不到文件。

我们补充配置对象中`output`的配置，如下：

```javascript
// 第三阶段
{
	entry:{
		main:'./src/index.js'
	},
	output:{
		path: path.join(__dirname,'./dist'),
		name:'js/bundle-[name]-[hash].js',
		chunkFilename:'js/[name].chunk.js',
		publicPath:'/dist/'
	}
}
```

> 上述代码中用到了占位符`[name]`，我们对占位符做统一解释：
> 
> `webpack`中常见的占位符有多种，常见的如下：
> 
> - `[name]`:代表打包后文件的名称，在`entry`或代码中(之后会看到)确定；
> - `[id]`:`webpack`给块分配的内部`chunk id`，如果你没有隐藏，你能在打包后的命令行中看到；
> - `[hash]`：每次构建过程中，生成的唯一 hash 值;
> - `[chunkhash]`: 依据于打包生成文件内容的 hash 值,内容不变，值不变；
> - `[ext]`: 资源扩展名,如`js`,`jsx`,`png`等等;

#### `output`其它配置

`output`配置项生效于保存这个过程，除了上面的基本配置，如果你想对这个阶段的打包文件进行更改，都可在此配置项中进行相关设置。

比如`output`提供了众多关于`hash`的属性，让我们对`[hash]`占位符的值有更加精细的控制，如生成方式，使用的算法，预设的长度等等；如`chunkLoadTimeout`属性则允许我们设置`chunk`文件的请求超时时间。

工具都是依赖于需求来使用的，如果你此阶段有别的需求，可点击[更多配置](https://webpack.js.org/configuration/output/)寻找解决方案。

我们已经知道了`webpack`中基本的输入和输出配置，但是`webpack`对各模块的处理过程，目前为止，对我们还是一个谜。考虑到`webpack`执行于`node.js`环境，其本身只能理解`js`文件，而我们输入的却是一大堆不同格式的文件，毫无疑问,要做的第一件事情是对各类模块进行处理，这就涉及到`webpack`中第三个重要配置对象了---`module`。

### 对模块的处理：`module`的配置

使用`webpack`时，我们常常听说，对`webpack`而言，所有的文件都是模块，前文中我也常常混用模块和文件，不过本质上模块和文件还是不同的，`webpack`里，文件可以当做模块，而模块却不一定是一个独立的文件。我们先看看`webpack`内置支持的模块类型：

- `ES2015 import`；（`webpack2`开始内置支持）
- CommonJS `require`;
- AMD `define`和`require`语句；
- css/less/sass 中的`@import`;
- 样式中的`url(...)`和html文件中的`<img src="..."/>;`

我们知道`webpack`只能处理`js`文件，我们的浏览器也可能不支持一些最新的js语法，基于此，我们需要对传入的模块进行一定的预处理，这就涉及到`webpack`的又一核心概念 --- `loader`，使用`loader`，`webpack`允许我们打包任何JS之外的静态资源。

#### `loader`的作用和基本用法

`webpack`中，`loader`的配置主要在`module.rules`中进行，`module.rules`是一个数组，我们可以把每一项看做一个`Rule`，每个`Rule`主要做了以下两件事：

- 识别文件类型，以确定具体处理该数据的`loader`，（`Rule.test`属性）;
- 使用相关`loader`对文件进行相应的操作转换，（`Rule.use`属性）；

还记得前面我们说过，我们手头的文件类型有`js`,`jsx`,`css`,`less`,`jpg`吗？我们看看在`webpack`中该如何处理和转换它们。

> 注：以下`loader`使用前需通过`npm/cnpm/yarn`安装:

```js
module: {
   rules: [{
       test: /(\.jsx|\.js)$/,
       use: {
           loader: "babel-loader",
           options: {
               presets: ["es2015", "react"]
           }
       },
       exclude: /node_modules/
   }, {
       test: /\.css$/,
       use: ["style-loader", "css-loader"]
   }, {
       test: /\.less$/,
       use: ["style-loader", "css-loader", "less-loader"]
   }]
},
```

这就是`webpack`中`loader`的基本用法了，在`module.rules`数组中进行配置即可，`module.rules `是一个数组，里面每一项（一个`Rule`）表示以一定的规则匹配和处理某种或某几种类型的文件。具体说来:

- `Rule.test`:表示匹配规则，它是一个正则表达式；
- `Rule.use`:表示针对匹配的文件将使用的处理`loader`，其值可以是字符串，数组和对象，当是对象形式时，我们可以使用`options`等命令进行进一步的配置；
- `Rule`中的其它一些规则也大多围绕匹配条件和应用结果展开，如`Rule.exclude`和`Rule.include`表示应该匹配或不应该匹配某资源；`Rule.oneOf`表示对该资源只应用第一个匹配的`loader`；`Rule.enforce`则用于指定`loader`的种类；

#### `loader`可以做什么

> `webpack`的强大之处在于，可以轻松在其中应用其它平台提供的功能，比如说`babel`,`postcss`本身都是独立的平台。在`webpack`中只需要添加`babel-loader`和`postcss-loader`就可以使用。这两个平台本身也提供众多的配置项，默认分别可在[.babelrc](https://babeljs.io/docs/usage/babelrc/) 和[postcss.config.js](http://api.postcss.org/)中完成，`webpack`并不影响这些配置文件的使用。不过需要说明的可能很多童鞋是在学习`webpack`时才接触这两个平台，导致在这两个平台上遇到的问题误以为是`webpack`的问题。

除了上述的转换编译，通过`loader`，`webpack`还允许我们实现以下功能：

- 转换编译：`script-loader/babel-loader/ts-loader/coffee-loader`等；
- 处理样式：`style-loader/css-loader/less-loader/sass-loader/postcss-loader`等；
- 处理文件：`raw-loader/url-loader/file-loader/`等；
- 处理数据：`csv-loader/xml-loader`等；
- 处理模板语言：`html-loader/pug-loader/jade-loader/markdown-loader`等；
- 清理和测试：`mocha-loader/eslint-loader`等；

关于各个loader更详细的介绍，可点击[loaders](https://webpack.js.org/loaders)查看。


#### `module.noParse`

关于`module`，另一个常用的配置项为`module.noParse`，通过它，我们在构建过程中可以忽略大型的 library 以提高构建效率。

我们来整理一下此阶段，我们的配置对象代码，如下：

```javascript
// 第四阶段
{
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        name: 'js/bundle-[name].js',
        chunkFilename: 'js/[name].chunk.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["es2015", "react"]
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        }]
    }
}
```

进过这一阶段的处理，我们的代码其实已经可以输出使用了。不过这样的输出可能还不能让人满意，我们想要抽离公共代码；我们想统一修改所有代码中的某些值；我们还想对代码进行压缩，去除所有的`console`… , 总之这一阶段的代码还是存在很大的改进空间的，这就是`plugin`的用武之地了。


### `plugins`的配置

`webpack`称`plugins`为其`backbone`,一切`loader`不能做的处理都可由`plugins`来做。此评价足见其重要性。

鉴于插件如此重要，`webpack`内置了众多的常用的`plugins`，无需额外安装就可直接使用。我们先看看`plugins`的基本配置方法，然后再分类介绍一下常用的`plugins`。

#### `plugins`的使用方法

`plugins`是一个数组，数组中的每一项都是某一个`plugin`的实例，`plugins`数组甚至可以存在一个插件的多个实例。

下面代码中，分别展示了`webpack`内置插件和第三方插件的使用方法：

```javascript
// 第三方插件需要在安装后引入
const CleanWebpackPlugin = require("clean-webpack-plugin");

{
	...
	plugins:[
	  new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
	  new CleanWebpackPlugin(["js"], {
        root: __dirname + "/stu/",
        verbose: true,
        dry: false
    })
	]
}
```

一种插件其实就是一种函数，通过传入不同的参数，插件可按我们的需求实现不同的功能。不过插件数量众多，我们甚至还可以自己来写插件，每个插件还有自己特定的配置规则，这也是`webpack`让人觉得难学的地方之一，不过好在作为一个工具，对于我们大多数人最需要掌握的`plugins`并不是那么多，其它的待真的有相关需求再边查边学也不迟，`webpack`的插件列表可参看[这里](https://webpack.js.org/plugins/)

#### 常用`plugins`的介绍

`plugins`功能众多，但是大多数`plugin`的功能主要集中在两方面：

1. 对前一阶段打包后的代码进行处理，如添加替换一些内容，分割代码为多块，添加一些全局设置等；
2. 辅助输出，如自动生成带有链接的`index.html`，对生成文件存储文件夹做一定的清理等；

**对代码进行处理**

- `BannerPlugin`:给代码添加版权信息，如在`plugins`数组中添加`new BannerPlugin(‘GitChat’)`后能在打包生成的所有文件前添加注释`GitChat`[详见](https://webpack.js.org/plugins/banner-plugin/);
- `CommonsChunkPlugin`，用于抽离代码，具有多种用途 详情查看[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin)；:
	- 抽离不同文件的共享代码，减少chunk间的重复代码，有效利用缓存；
	- 抽离可能整个项目都在使用的第三方模块，比如`react react-dom`；
	- 将多个子chunk中的共用代码打包进父chunk或使用异步加载的单独chunk；
	- 抽离`Manifest`这类每次打包都会变化的内容，减轻打包时候的压力，提升构建速度；
- `CompressionWebpackPlugin`:使用配置的算法（如`gzip`）压缩打包生成的文件，[详见](https://webpack.js.org/plugins/compression-webpack-plugin)；
- `DefinePlugin`:创建一个在编译时可配置的全局常量,如果你自定义了一个全局变量`PRODUCTION`,可在此设置其值来区分开发还是生产环境[详见](https://webpack.js.org/plugins/define-plugin/)；
- `EnvironmentPlugin`:实际上是`DefinePlugin`插件中对`process.env`进行设置的简写形式，如`new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG'])`将设置`process.env.NODE_ENV='DEBUG'`,[EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/);
- `ExtractTextWebpackPlugin`:抽离`css`文件为单独的`css`文件，[详见](https://webpack.js.org/plugins/extract-text-webpack-plugin);
- `ProvidePlugin`：全局自动加载模块，如添加`new webpack.ProvidePlugin({$: 'jquery',  jQuery: 'jquery'})`后,则全局不用在导入`jquery`就可以直接使用`$`;[ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/)
- `UglifyjsWebpackPlugin`:使用前需要先安装，基于`UglifyJS`压缩代码，支持其所有配置[UglifyjsWebpackPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/);

**辅助输出打包后的代码：**

- `HtmlWebpackPlugin`:使用前需要先安装，为你自动生成一个`html`文件，该文件将自动依据`entry`的配置引入依赖，如果你的文件名中添加了`[hash]`等占位符，这将非常有用, [详见](https://webpack.js.org/plugins/html-webpack-plugin/)；
- `CleanWebpackPlugin`:使用前需要先安装，此插件允许你在配置以后，每次打包时，清空所配置的文件夹，如果你每次打包的文件名不同，这将非常有用 [GitHub - clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)；

通过上述对不同插件的描述，你一定大致明白了，插件可以做什么，之后在开发的过程中，如果你遇到的什么需要在此阶段解决的问题，大可搜索看看是否有相关的插件，推荐查阅[awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins)；

学习了插件以后，现在我们的配置对象是如下这样：

```javascript
// 第5阶段
{
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        name: 'js/bundle-[name].js',
        chunkFilename: 'js/[name].chunk.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["es2015", "react"]
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        }]
    },
    plugins: [
        new webpack
        .optimize
        .CommonsChunkPlugin({
            name: 'vendor',
            filename: "js/[name]-[chunkhash].js"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            Promise: "exports-loader?global.Promise!es6-promise",
            fetch: "exports-loader?self.fetch!whatwg-fetch"
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "app/index.html",
            inject: "body"
        }),
        new CleanWebpackPlugin(["js"], {
            root: __dirname + "/stu/",
            verbose: true,
            dry: false
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
}
```

至此，从输入`entry`->处理`loaders/plugins`->输出`output`，我们讲解了`webpack`的核心功能，不过`webpack`还提供其它的一些配置项，这些配置项大多从两方面起作用，辅助开发、对构建过程中的一些细节做调整。对这些属性，下面只做简单的介绍。

### 其它的一些配置

#### 辅助开发的相关属性

- `devtool`:
> 打包后的代码和原始的代码往往存在较大的差异，此选项控制是否生成，以及如何生成 source map，用以帮助你进行调试，详情可查看[Devtool](https://webpack.js.org/configuration/devtool/)

- `devServer`：
> 通过配置`devServer`选项，你可以开启一个本地服务器，`webpack`为此本地服务器提供了非常多的配置选项，点击查看[dev-server](https://webpack.js.org/configuration/dev-server/)，你会发现通过合适的配置，你可以拥有所有本地服务器可提供的功能；

- `watch`:
> 启用 Watch 模式后，`webpack` 将持续监听任何已解析文件的更改，重新构建文件，Watch 模式默认关闭，在开发时候如果开启会很方便;

- `watchOptions`:
> 一组用来定制 Watch 模式的选项： 详见 [watch](https://webpack.js.org/configuration/watch/)

- `performance`:
> 本配置让你设置打包后命令行中该如何展示性能提示，比如是否开启提示，资源如果超过某个大小时该警告还是报错，详见[performance](https://webpack.js.org/configuration/performance/);

- `stats`:
> 本选项让你配置打包过程中输出的内容，如没有输出`none`，标准输出`normal`，全部输出`verbose`，只输出错误`errors-only`等等。

#### 精细配置相关属性

- `content`:设置基础路径，默认使用当前目录;
- `resolve`:
> 确定模块如何被解析，`webpack`已经提供了合理的默认值，不过通过你的自定义配置，可以对模块解析实现更加精细的控制,如对某些常用模块可以通过设置别名以更容易引用，也可在此处设置可被忽略的后缀名，详见 [resolve](https://webpack.js.org/configuration/resolve/);

- `target`:
> 告知 `webpack` 需要打包的代码执行的环境，针对 node 和 web 打包过程会有所不同，详见[Target](https://webpack.js.org/configuration/target/)；

- `externals`:
> 让打包生成的代码中不添加某依赖项，而让这些依赖项直接从用户环境中获取,在进行库的开发时非常有用；

- `node`:
> 是一个对象，其中每个属性都是 Node.js 全局变量或模块的名称,每一项的设置值都可以是（`true/mock/empty/false`）中的一种，以确定这些node中的对象在其它环境中是否可用;

- 此外`webpack`还具备其它一些用的比较少的配置对象，详见  [Other Options](https://webpack.js.org/configuration/other-options/);


至此，我们了解了`webpack`常用的配置项及其意义。为了检测我们的学习成果，我们一起分析一个中等项目中的`webpack`配置文件。配置文件来自于[`create-react-app`](https://github.com/facebookincubator/create-react-app),使用`create-react-app`新建项目后，执行`npm run eject`可看到多个配置文件，这里我们选择`webpack.dev.js`。

## 分析`create-react-app`中`webpack`的配置

```javascript
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    require.resolve('react-error-overlay'),
    'src/index.js'
  ],
  output: {
    path: '/build/',
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin('/src'),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [{
      test: /\.(js|jsx)$/,
      enforce: 'pre',
      use: [{
        options: {
          formatter: eslintFormatter,
        },
        loader: require.resolve('eslint-loader'),
      }, ],
      include: 'src',
    }, {
      exclude: [/\.html$/,/\.(js|jsx)$/,/\.css$/,/\.json$/,/\.bmp$/,/\.gif$/,/\.jpe?g$/,/\.png$/],
      loader: require.resolve('file-loader'),
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }, {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }, {
      test: /\.(js|jsx)$/,
      include: 'src',
      loader: require.resolve('babel-loader'),
      options: {
        cacheDirectory: true,
      },
    }, {
      test: /\.css$/,
      use: [
        require.resolve('style-loader'), {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        }, {
          loader: require.resolve('postcss-loader'),
          options: {
					...
          },
        },
      ],
    }, ],
  },
  plugins: [
    new InterpolateHtmlPlugin({
      NODE_ENV:'development',
      PUBLIC_URL:''
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV:"development",
        PUBLIC_URL:'" "'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false,
  },
};
```

> **对可能和你看到的`webpack.config.dev.js`有所不同的说明：**：
> 
> 1. `npm run reject`之前，对`create-react-app`的一些设置会影响这里看到的配置文件；
> 2. 原始的`webpack.config.dev.js`中，部分值由外部函数生成，相关值，在上述代码中直接改为了确定的结果，如`env.raw`在上述代码中被替换为：
``` javascript
{
      NODE_ENV:'development',
      PUBLIC_URL:''
    }
```
> 3. `create-react-app`在开发环境并不生成真实的文件到硬盘，上述代码中的部分路径可能有误，见谅。

推荐在看下面的分析前，花三分钟看看上述文件，如果都能看得懂，那么恭喜你，你已经明白`webpack`的运作方式了，快去自己的项目中实践吧，如果还有疑惑，也不要紧，我们一起来分析。

### `webpack.config.dev.js`执行于node环境

首先，我们应该明确`webpack.config.dev.js`执行于`node`环境,目的在于返回`webpack`需要的配置对象，因此其中可以使用node提供的一些特殊变量和语法，比如`__dirname`，又如引入模块时采用`CommonJS`模式。

此文件的开头，首先通过`require`语句引入了`path`,`webpack`和一系列`webpack`插件，除了`HtmlWebpackPlugin`在前文中我们见过，其它的我们都未曾见过，其实这些大多是`create-react-app`针对`webpack`已有的插件改进或新开发的插件，所以不熟悉也正常，随后我们将一个个的弄清楚它们是干嘛的。

### 对`module.exports`的分析

#### `devtool`
此处的配置值为`cheap-module-source-map`,代表不带列映射的 `SourceMap`，将加载的 `Source Map` 简化为每行单独映射。

#### `entry`
此处的`entry`是一个数组，代表着四项的代码都会添加到打包结果之中。

- `webpackHotDevClient`可以被看做具有更好体验的`WebpackDevServer`；
- `./ployfill.js`用以在浏览器中支持`promise/fetch/object-assign`；
- `react-error-overlay`在开发环境中使用，强制显示错误页面； 
- `./src/index.js`则是我们的`app`的主入口。

#### `output`

> 在实际使用`create-react-app`的过程中，我们并看不见开发环境的打包结果，因此此处的说明仅供参考。

- `path`指定，打包后文件存放的位置为`/build/`；
- `pathinfo`为`true`，在打包文件后，在其中所包含引用模块的信息，这在开发环境中有利于调试；
- `filename`指定了打包的名字和基本的引用路径`static/js/bundle.js`；
- `chunkFilename`:指定了非入口文件的名称`static/js/[name].chunk.js`；
- `publicPath`:指定服务器读取时的路径，此处设置为` `；
- `devtoolModuleFilenameTemplate`:这里是一个函数，指定了`map`位于磁盘的位置；

#### `resolve`

- `modules`:指定了模块的搜索的位置，这里设置为`node_modules`;
- `extensions`:指明在引用模块时哪些后缀名可以忽略，这里忽略的文件名包括`.js/.jsx/.web.js/.web.jsx等`;
- `alias`:创建 import 或 require 的别名，使得部分模块的引用变得简单，安装上文的设置，现在我们可以直接引用`react-native`和`react-native-web`了；
- `plugins`:此处使用了`ModuleScopePlugin`的实例，用以限制自己编写的模块只能从`src`目录中引入；

#### `modules`
- `strictExportPresence`:这里设置为`true`,表明文件中如果缺少`exports`时会直接报错而不是警告;
- `rules`：
	- Rule1：对`js/jsx`文件前置使用`eslintFormatter`，设置`formatter`格式为`eslintFormatter`;
	- Rule2：对`exclude`中的众多文件类型不使用`file-loader`,并设置其它文件打包后的名称按`'static/media/[name].[hash:8].[ext]'`格式设置；
	- Rule3: 对`js/jsx`文件调用`babel-loader`处理转换；
	- Rule4: 对`css`文件，按顺序调用`style-loader`,`css-loader`,`postcss-loader`进行处理；

#### `plugins`
这里的一些插件，有的可能我们还比较陌生，我们一一介绍

- `InterpolateHtmlPlugin`:和`HtmlWebpackPlugin`串行使用，允许在`index.html`中添加变量;
- `HtmlWebpackPlugin`:自动生成带有入口文件引用的`index.html`；
- `NamedModulesPlugin`:当开启 `HMR` 的时候使用该插件会显示模块的相对路径，建议用于开发环境;
- `DefinePlugin`:这里我们设置了`process.env.NODE_ENV`的值为`development`;
- `HotModuleReplacementPlugin`:启用模块热替换;
- `CaseSensitivePathsPlugin`:如果路径有误则直接报错；
- `WatchMissingNodeModulesPlugin`:此插件允许你安装库后自动重新构建打包文件；
- `new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)`:忽略所匹配的`moment.js`;

#### `node`
- 设置`node`的`dgram/fs/let/tls`模块的的值，如果在其它环境中使用时值为`empty`

#### `performance`
- `hints: false`:不提示测试环境的打包结果；

上文一直讨论的是，`webpack`各设置项的基本意义，目的在于让你在有相关需求时，能知道该从哪一项下手查询。不过看到这里，如果你之前从未上手操作过`webpack`可能依旧不知道该如何使用，下面我分析一下，我在自己的项目中是如何使用的。

## 一些工程实践建议

官方文档的[guides](https://doc.webpack-china.org/guides/)部分已经就如何实践提出了较多的建议，建议阅读以下内容前先行阅读。

### 结合`npm`使用

`webpack`在安装后有多种调用方法，

- 在命令行中直接传入参数使用（这个实际我用的比较少）；
- 自定义 `webpack.config.js`文件,在其中完成配置，然后在命令行中执行`webpack --config webpack.config.js`来使用，配置文件可以是任何其它名称（如果是`webpack.config.js`,我们直接使用`webpack`命令）；
- 结合`npm`使用，在`package.json`文件中的`scripts`对象中添加相关命令使用，之后通过`npm run`使用，如下：

```js
"scripts": {
    "build:prod": "webpack --progress --colors --watch --config webpack.prod.js",
    "build:dev": "webpack --progress --colors --watch --config webpack.dev.js"
}
```

上面我们分别构建了`webpack.prod.js`和`webpack.dev.js`来分别生成开发环境和生产环境的代码，在命令行中执行`npm run build:prod`和`npm run build:dev`即可生成对应代码。

### 为生产环境指定合理的缓存

关于缓存，官方文档中有一节讲解的非常详细，请参见[缓存](https://doc.webpack-china.org/guides/caching)。

### 合理分割代码

`webpack`提供了三种分割代码的方法，分别是通过`entry`,通过`CommonsChunkPlugin`插件和通过动态`import`（在`webpack1.x`中时也常常使用`require.ensure`来依据路由分割代码）。

`entry`的配置常用于多页应用，`CommonsChunkPlugin`的使用前文已做简要叙述，下面简单叙述下代码分割原则及我实际工作中是如何使用动态`import`来分割代码的。

#### 分割原则

目前工作中主要依据两个原则来分隔代码：

- 前端路由：依据路由对应的页面进行分割，这种分割之后的体验类似于小程序中每次打开新页加载对应页面的js文件；
- 针对逻辑交互比较复杂的页面，如果某个较复杂的组件需被某操作触发后才呈现，也会把该组件分割出来；

#### 分割方法

我们知道动态`import`返回值其实是一个`Promise`,基于此，对应于我用的React，我常采用以下函数辅助加载。

```js
// lib.js 定义懒加载函数
module.exports.withLazyLoading = function withLazyLoading(getComponent,Spinner = null) {
    return class LazyLoadingWrapper extends React.Component {
        constructor(props) {
            super(props);
            this.state = ({
                Component: null,
            })
        }

        componentWillMount() {
            const {onLoadingStart, onLoadingEnd, onError} = this.props;
			  onLoadingStart();
            getComponent()
                .then(esModule => {
                    this.setState({Component: esModule.default})
                })
                .catch(err => {
                    onError(err, this.props)
                })
        }

        render() {
            const {Component} = this.state;
            if (!Component) return Spinner;
            return <Component {...this.props} />
        }
    }
};
```

对代码的分割方法如下：

```js
// 在需要的地方调用懒加载函数
import {withLazyLoading} from "lib";
// 
import {Loading} from 'Loadings';

export default withLazyLoading(
    () => {
        return import (/* webpackChunkName: "ConCard" */ "../../containers/ConCard.js")
    }, Loading());
```

简要的说明一下上述代码的意义，懒加载函数`withLazyLoading`接受动态`import`的组件和一个加载动画作为参数，动态`import`的组件加载成功前显示加载动画组件，成功后显示`import`的组件，通过自定义各种各样的`Spinner`加载动画，我们可以实现优雅的`js`文件加载过程。

### 观察打包后文件的结构，合理进行优化

使用`webpack --json > stats.json`命令可以生成一个包含依赖关系的`json`文件。`webpack`提供了多种可视化工具帮我们分析这个文件，我最喜欢的工具插件是`BundleAnalyzerPlugin`，可通过下述方法引入该插件：

```js
new BundleAnalyzerPlugin({
    analyzerMode: 'static'
})
```

添加此插件，再次构建完成时，浏览器中将自动打开一个类似下面这样的网页：

![BundleAnalyzerPlugin](http://images.gitbook.cn/3a159150-8c4a-11e7-a6d5-cdf15ad8429c)

这样我们可以轻易分析我们的代码分割是否合理，比如

- 分割后文件过大的主要原因是在于引入了那些模块
- 分析大多后的多文件中存不存在对某些比较大的模块的重复引用，方便我们进一步修正自己的配置文件。

上图是我之前项目中的一张截图，第一次见到这张图时还是给了我很多后期优化的思路的，引用`chat.js`的同时引入了`moment.js`,而实际上该页面只有一张图表，这让我考虑另寻图表解决方案，`lodash`,`velocity`在最初的项目中使用过，后逐步去除，属于遗留代码，现在还存在说明在局部可能还是用到了，这都是之后编码的改进方向。


## 后记

总觉得技术类的文章也是该有生命力的，花了好久写完本文，回头看发现有的内容还是没有表达或交待清楚。所以有任何建议，请随意提出，我们在Chat中继续讨论，我也将对本文做长期持续的修改。

针对`webpack3.5.5`官网文档，使用`mindNode`制作了一个思维导图的草稿，此思维导图还需完善，之后将持续修改，点击[此处](https://github.com/zhangwang1990/blogs/tree/master/sources/mindMaps)可查看，该思维导图示例如下。

![思维导图局部示例](http://images.gitbook.cn/4cbdcdc0-8c4c-11e7-a6d5-cdf15ad8429c)

另外，关于`webpack1`和`webapck2`的区别，官方文档中有一部分做了[详细的讲解](https://webpack.js.org/guides/migrating/)，所以本文中不做赘述，看完以后如果还有疑问，之后我们再详细讨论。


