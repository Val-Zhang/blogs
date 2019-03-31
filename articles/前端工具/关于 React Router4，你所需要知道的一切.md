# 关于 React Router4，你所需要知道的一切
#翻译/JS 

>  其实 React Router4 推出了好久了，不过一直没有刻意去使用它，直到最近重构某个项目才开始使用，也遇到过一些坑，在学习过程中读到这篇文章 [All About React Router 4](https://link.zhihu.com/?target=https%3A//css-tricks.com/react-router-4/)，觉得比较好，翻译如下。  

[原文链接](https://css-tricks.com/react-router-4/)

我是在 2016 年的 React Rally 上第一次遇到的  [Michael Jackson ](https://twitter.com/mjackson)，之后不久就写了一篇关于 [React Router3 的文章](https://css-tricks.com/learning-react-router/) ，Michael 和 [Ryan Florence.](https://twitter.com/ryanflorence) 是 React Router 的主要开发者。我个人非常喜欢 React Router，见到这个工具的开发者让我非常激动，不过随后当 Michael 对我说「让我向你展示一下 React Router4，它和之前的版本非常不同」时，我感到非常震惊。讲真，我当时真的不理解新的方向，也不理解为什么需要如此大的变更。路由对一个应用的架构来说非常重要，这么大的改变必将改变以前我喜欢的一些模式。React Router 4的变化让我焦虑，考虑到社区凝聚力以及 React Router 在众多 React 应用中扮演的重要角色，我不清楚在正式发布后，社区针对这些改变会做何反应。

几个月后，[React Router4](https://reacttraining.com/react-router/) 发布了，我从 Twitter 上的讨论中就能感受到这么大的重写给大家带来的纠结。这让我回想起 React Router 的第一版就有其先进的理念。某种程度上来说，早期版本的 React Router 践行了传统上我们对路由的理解，那就是所有的路由应该放置在一个位置。不过当时嵌套的 JSX 路由并未被每个人接受，不过随着 JSX 本身的发展，很多人开始相信嵌套的 JSX 路由确实很酷。

后来，我开始学习 React Router4 了。诚然，首次使用还真是让人难受。让人难受的点不在于它的 API，而在于使用它需要新的模式及策略。当时我使用 React Router 3 的思维还没能很好的迁移到 v4 上。这需要我改变对路由及布局组件的看法。不过好在，最终我适应了新的模式，并开始喜欢上 v4 提供的新方向。使用 v4 不仅让我可以做任何我在 v3 中做的事情，还可以让我实现一些以前很难实现的效果，现在回想起来，最初是我把 v4 的使用想的过于复杂了。现在在我理解了这种新的模式时，我感觉 v4 的思路真的很棒。

我这篇文章的目的不在于去赘述[官方文档](https://reacttraining.com/react-router/)，在本文中，我会涉及到最常用的 API，不过重点还是会集中在 v4 的新思想上。

为了更好的阅读此文，你需要先熟悉以下 JS 概念：

- [React 函数组件](https://reactjs.org/docs/components-and-props.html)
- [ES 2015 箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [ES 2015 解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [ES 2015 模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

如果你喜欢边看边做的人，也可以查看[这个DEMO](https://codepen.io/bradwestfall/project/editor/XWNWge?preview_height=50&open_file=src/app.js)

## 新的 API 和新的心智模型
早期版本的 React Router 会把路由规则放置在一个位置，它们会放置在布局组件之外。当然，路由可以被分割写在多个文件中，不过从概念上来讲它们还是属于同一个单元，最常见的用法其实也是把它们写做一个配置文件。

我们用 v3 和 v4 各写一个简单的两页应用来对比它们二者 ，下面例子中的两个路由分别指代 home 页 和 user 页：

以下是 v3 版本：

```js
import { Router, Route, IndexRoute } from 'react-router'

const PrimaryLayout = props => (
  <div className="primary-layout">
    <header>
      Our React Router 3 App
    </header>
    <main>
      {props.children}
    </main>
  </div>
)

const HomePage = () => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <Router history={browserHistory}>
    <Route path="/" component={PrimaryLayout}>
      <IndexRoute component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </Route>
  </Router>
)

render(<App />, document.getElementById('root'))
```

以下 v3 中的概念在 v4 中不再完全准确了：
* 路由集中在一处；
* 布局和页面的层叠由层叠的 `<Route>` 组件控制；
* 布局和页面组件是路由的一部分；

React Router 4 不再提倡中心化路由。取之的是路由存在于布局和 UI 之间。以下是在 v4 中的实现：

```js
import { BrowserRouter, Route } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
    </header>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

render(<App />, document.getElementById('root'))
```


> 新的 API 概念：我们的 App 是给浏览器使用的，我们需要把它们包裹在 v4 提供的`<BrowserRouter>`中，值得注意的是，我们需要从 `react-router-dom` 中引入它（其实我们安装的也是`react-router-dom`，而非 `react-router`）。v4 中之所以要用 `react-router-dom`，是因为还存在着一个[客户端版本](https://reacttraining.com/react-router/native/guides/philosophy)。  

在 v4 版本的代码中，我们找不到 `Router` 了。在 v3 中 `Router` 算是最重要的内容之一了，我们会直接把它渲染到 DOM 中用以控制 App。现在，除了`<BrowserRouter>` ，我们首先注入到 DOM 中的是我们的应用本身。

v3 和 v4 的另一个主要的差别在于 v4 不需要再在嵌套组件中使用 `{props.children}` ，这是因为在 v4 中，无论 `<Route>` 组件在哪里书写，只有匹配，次组件就会在哪里渲染。

## 包含路由
在前面的示例中，你可能已经注意到了 `exact` 属性，这是什么呢？ V3 中的路由是排他性的，这意味着只有一个路由可以匹配，V4 中的路由则是包含性的，这意味着一个地址可用匹配多个`<Route>`并同时渲染。

在前面的示例中，我们尝试依据路由渲染 `HomePage` 或者 `UsersPage`。如果 `exact` 被移除了，当匹配到路由 `/users` 时，`HomePage` 和 `Userspage` 会同时渲染。

> 想要更好的理解 V4 的路由逻辑，可以查看 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp)，v4 是基于这个库做的路由匹配判断。  

为了展示包含性的路由的一些用途，我们在 Header 中添加 `UserMenu`组件，并使其在匹配 `/users` 时渲染

```js
const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
      <Route path="/users" component={UsersMenu} />
    </header>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </main>
  </div>
)
```

现在，当用户访问 `/users` 时，两个组件都会被渲染，通过一些模式在 v3 中也可以达到这种效果，但是实现起来会麻烦很多，多亏了 v4 的包含性路由，现在实现这个效果简单多了。

## 排它性的路由
如果你只想匹配一组路由中的一个，可以使用 `<Switch>` 来使用排它性的路由：

```js
const PrimaryLayout = () => (
  <div className="primary-layout">
    <PrimaryHeader />
    <main>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/users/add" component={UserAddPage} />
        <Route path="/users" component={UsersPage} />
        <Redirect to="/" />
      </Switch>
    </main>
  </div>
)
```

`<Switch>` 中只有一个路由会被匹配到，如果我们想把 `HomePage` 放置在第一位，我们还是需要添加 `exact` 属性，否则 `/` 会被 `/users` 或者 `/users/add` 匹配到。实际上，路由的放置顺序非常重要，这里我们把 `/users/add` 放置在 `/users` 之前来确保能匹配正确。 `/users/add` 能匹配 `/users` 和 `/users/add`，因此把 `/users/add` 放在前面更好。

当然，如果我们在每个路由上都添加 `exact` 那么它们的顺序可以随意调整，这是另一种选择。

`<Redirect>` 组件会让浏览器重定向，在`<Switch>` 中，其它的路由没有匹配时，才会渲染重定向组件。在下面的  Authorized Route 部分，我们还将看到 `<Redirect>` 在非 `Switch` 环境中该如何使用。

## Index Routes 以及 Not Found
尽管在 v4 中没有了 `<IndexRoute>` ，使用 `<Route exact>` 可以达到类似的效果。在没有路由匹配时，配合使用 `<Switch>` 和 `<Redirect>` 可用重定向到某默认页（上面代码中的 `HomePage` 就是默认页），当然你也可以单独做一个未匹配页。

## 层叠布局
您可能已经开始思考如何通过嵌套实现各种子布局。起初我也觉得这没什么难的，不过我确实还是遇到了一些坑。React Router v4 让我们有了更多的选择，这使得它非常强大，不过可选性强往往意味着我们的选择并非最理想的。表面上看，层叠的组件没有那么重要，不过你不当的选择也会给你带来困境。

为了展示这一点，假设现在我们想要拓展我们的用户组件，现在我们需要`user`浏览页 和 `user profile` 页。我们还想给我们的产品也添加类似的页面，这种情况下 Users 和 products 需要各自独特的次级布局。他们可能都需要有自己独特的导航栏，解决这个问题的方案有很多，它们有好有坏，下面的第一种方案不是很好，这里展示给你，是为了防止你掉到这种坑中，第二种方案则会好很多。

首先，我们修改 `PrimaryLayout` 来为 `user` 和 `product` 分别适配浏览页和 profile 页。

```js
const PrimaryLayout = props => {
  return (
    <div className="primary-layout">
      <PrimaryHeader />
      <main>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/users" exact component={BrowseUsersPage} />
          <Route path="/users/:userId" component={UserProfilePage} />
          <Route path="/products" exact component={BrowseProductsPage} />
          <Route path="/products/:productId" component={ProductProfilePage} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  )
}
```

上述代码是可用的，不过如果我们仔细观察 `BrowseUsersPage` 和 `UserProfilePage` 就会发现一些问题。

```js
const BrowseUsersPage = () => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <BrowseUserTable />
    </div>
  </div>
)

const UserProfilePage = props => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <UserProfile userId={props.match.params.userId} />
    </div>
  </div>
)
```

> 新 API 概念：`props.match` 会传递给任何通过 `<Route>` 渲染的组件，如你所见 `userId` 由`props.match.params` 提供。关于这一点可以在 [v4 文档中](https://reacttraining.com/react-router/web/example/url-params)了解更多。此外，如果其它非通过`<Route>`渲染的组件需要使用 `props.match` ，可以使用 [`withRouter()`](https://reacttraining.com/react-router/web/api/withRouter) 高阶组件传入。  

上面这种情况下，每个用户浏览页都不仅要渲染它本身的内容，还需要渲染`UserNav`。这个例子很简单看起来好像没有什么要紧，不过重复的代码在真实的项目中真的会成为一个大问题。而且，每次 `BrowseUsersPage` 或者 `UserProfilePage` 渲染的时候都会创建 `UserNav` 的一个实例，这意味着所有的生命周期函数都会重新执行，渲染导航栏最初是需要网络请求的，这导致了不必要的请求，如果我们换一种路由组织方式则完全可以避免这些。

下面是一种更好的实现方案：

```js
const PrimaryLayout = props => {
  return (
    <div className="primary-layout">
      <PrimaryHeader />
      <main>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/users" component={UserSubLayout} />
          <Route path="/products" component={ProductSubLayout} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  )
}
```

这里我们只匹配了两个路由用以表示两部分的布局。

> 上面的代码中，我们没有再使用 `exact` 属性了，因为这里我们想用 `users` 匹配到所有 以`/users` 开头的路由，关于 `/products` 也一样。  

使用这种策略，次级路由的渲染就可以在次级布局中完成了，`UserSubLayout` 是下面这样的：

```js
const UserSubLayout = () => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <Switch>
        <Route path="/users" exact component={BrowseUsersPage} />
        <Route path="/users/:userId" component={UserProfilePage} />
      </Switch>
    </div>
  </div>
)
```

这种策略最明显的优势是公用布局不再在所有用户页中重复了，这也避免了第一种方案中的生命周期问题。

值得注意的是，尽管路由存在于深嵌的布局中，路由依旧需要完整的地址来匹配。如果不想多打字，（当时也是为了更好的可维护性），我们可以使用 `props.match.path` 代替前面的地址：

```js
const UserSubLayout = props => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <Switch>
        <Route path={props.match.path} exact component={BrowseUsersPage} />
        <Route path={`${props.match.path}/:userId`} component={UserProfilePage} />
      </Switch>
    </div>
  </div>
)
```


## Match
正如上面我们看到的，我们可以通过`props.match` 获知要渲染的个人页的 `userId` 这在书写我们的路由时非常有用。`match` 对象还为我们提供一些其它的属性，包括`match.params`,`match.path`,`match.url`和[其它一些属性](https://reacttraining.com/react-router/web/api/match)。

### `match.path` 对比 `match.url`

初看起来，这两者的关系是非常不清晰的，而且它们打印出来常常会得到相同的值，这就让人更加疑惑了。比如访问地址 `/users` 时，二者会打印出相同的值。

```js
const UserSubLayout = ({ match }) => {
  console.log(match.url)   // output: "/users"
  console.log(match.path)  // output: "/users"
  return (
    <div className="user-sub-layout">
      <aside>
        <UserNav />
      </aside>
      <div className="primary-content">
        <Switch>
          <Route path={match.path} exact component={BrowseUsersPage} />
          <Route path={`${match.path}/:userId`} component={UserProfilePage} />
        </Switch>
      </div>
    </div>
  )
}
```

> ES2015 概念，`match` 已经在组件函数的参数级别被解构，这意味着我们可以直接使用 `match.path` 而不用 `props.match.path`  

尽管我们还看不到区别，`match.url` 实际上表示的是浏览器的真实 URL，而 `match.path` 则表示的是写给路由看的地址，这就是为什么到现在为止它们还是一样的。当我们访问`UserProfilePage` 时就能看到它们的区别, 在浏览器中浏览 `users/5` ，`match.url` 的值将会是 `/users/5` ,而 `match.path` 的值将会是 `/user/:userId`。

### 选用那个呢？

如果你想构建你自己的路由地址，我推荐你使用 `match.path`，使用 `match.url` 来构建路由地址往往会出现一些问题。我就踩过下面这个坑，在组件 `UserProfilePage` 内（这个组件在用户查看自己的个人页时渲染），我按照下述方法渲染了次组件：

```js
const UserComments = ({ match }) => (
  <div>UserId: {match.params.userId}</div>
)

const UserSettings = ({ match }) => (
  <div>UserId: {match.params.userId}</div>
)

const UserProfilePage = ({ match }) => (
  <div>
    User Profile:
    <Route path={`${match.url}/comments`} component={UserComments} />
    <Route path={`${match.path}/settings`} component={UserSettings} />
  </div>
)
```

为了演示问题，我通过 `match.url` 和 `match.path` 各渲染一个组件。当在浏览器中访问这些页面时会出现以下问题：

* 访问 `/users/5/comments` 时候会渲染 `UserId: undefined`;
* 访问 `/users/5/settings` 时则会渲染 `UserId:5`;

所以为什么 `match.path` 有效而 `match.url` 无效呢？这是因为 `{${match.url}/comments}` 实际上会硬编码为 `{'/users/5/comments'}`，这样会导致次级组件无法正确匹配 `match.params`,因为在路径中并不存在参数，只有硬编码 `5`。

当我看到[官方文档的这一部分的](https://reacttraining.com/react-router/core/api/match)时候我才意识到这有多么重要：

> match:  
> * path-(string)：用于匹配的路径模式，在构建层叠的 `<Route>` 时非常有用；  
> * url-(string): 用于匹配 URL 的一部分，在构建层叠的 `<Link>` 时候非常有用；  

## 避免路由冲突
假设我们要做的 app 是一个仪表盘，我们希望通过访问 `/users/add` 和 `/users/5/edit` 能用来新增和编辑用户。不过在前一个例子中，`users/:userId` 已经指向 `UserProfilePage` 了，这时候我们该怎么避免冲突呢？

```js
const UserSubLayout = ({ match }) => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <Switch>
        <Route exact path={props.match.path} component={BrowseUsersPage} />
        <Route path={`${match.path}/add`} component={AddUserPage} />
        <Route path={`${match.path}/:userId/edit`} component={EditUserPage} />
        <Route path={`${match.path}/:userId`} component={UserProfilePage} />
      </Switch>
    </div>
  </div>
)
```

注意，添加和编辑路由位于 profile 路由之前用以保证正确的匹配，如果把 profile 页的路由放置在前面，会导致访问`users/add` 时匹配到 profile 页（`add` 和 `:userId` 是匹配的）。

如果我们一定想要把 profile 页的路由放在前面，也是有办法的，我们也可以这样来设置 `${match.path}/:userId(\\d+)`，这能确保 `:userId` 必须是一个数值，这样访问 `users/add` 的时候就不会造成冲突了。我是在 [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp#custom-match-parameters) 的文档中学到这一点的。


## 授权路由
在应用中，依据用户的登录状态来限制用户访问某些页面的能力是很常见的需求。对于未登录用户和登录用户会呈现不同的界面外观（比如是否展示「登录」，「忘记密码」）。为了应对这种需求，可以这样做：

```js
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/auth" component={UnauthorizedLayout} />
            <AuthorizedRoute path="/app" component={PrimaryLayout} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
```

> 在 React Router 4 中使用 react-redux 和以前类似，用`<Provider>` 包裹 `BrowserRouter` 即可。  

上述代码中，首先我们基于用户所处状态选择两种布局中的一种，访问`/auth/login` 或者 `/auth/forgot-password` 会使用 `UnauthorizedLayout`。当用户登录后，我们确保所有的路径拥有一个 `/app` 前缀，我们可以用 `AuthorizedRoute ` 来判断用户是否已经登录。如果用户试图访问以 `/app` 开头的页面，而它们又没有登录，将会被重定向到登录页。

`AuthorizedRoute` 并非 v4 的一部分，它是我基于 [v4 文档](https://reacttraining.com/react-router/web/example/auth-workflow)自己构建的。这是 v4 提供的一个让人非常激动的功能，使用者可以基于自己的需求创建属于自己的路由。在 `<Route>` 中传入 `render` 而非 `component` 即可。

```js
class AuthorizedRoute extends React.Component {
  componentWillMount() {
    getLoggedUser()
  }

  render() {
    const { component: Component, pending, logged, ...rest } = this.props
    return (
      <Route {...rest} render={props => {
        if (pending) return <div>Loading...</div>
        return logged
          ? <Component {...this.props} />
          : <Redirect to="/auth/login" />
      }} />
    )
  }
}

const stateToProps = ({ loggedUserState }) => ({
  pending: loggedUserState.pending,
  logged: loggedUserState.logged
})

export default connect(stateToProps)(AuthorizedRoute)
```

你的登录策略可能会和我的有所不同，我使用网络请求 `getLoggedUser()` 来在 Redux store 中注入 `pending` 或者 `logged` 状态。`pending` 意味着请求还处于路由中。

[点击此处可看到完整示例](https://codepen.io/bradwestfall/project/editor/XWNWge?preview_height=50&open_file=src/app.js)

## 其它值得注意的地方
关于 React Router v4 还有其它一些非常酷的地方，我们在这里讲述其中一些：

### `<Link>` vs `NavLink`

在 v4 中有两种办法在 router 中使用链接，[`<Link>`](https://reacttraining.com/react-router/web/api/Link) 和 [`<NavLink>`](https://reacttraining.com/react-router/web/api/NavLink)。

`<NavLink>` 和 `<Link>` 类似，不过在 `<NavLink>` 匹配当前路由器地址时，可以呈现不同的样式，比如说在[这个示例中](https://codepen.io/bradwestfall/project/editor/XWNWge)，`<PrimaryHeader>` 的代码如下：

```js
const PrimaryHeader = () => (
  <header className="primary-header">
    <h1>Welcome to our app!</h1>
    <nav>
      <NavLink to="/app" exact activeClassName="active">Home</NavLink>
      <NavLink to="/app/users" activeClassName="active">Users</NavLink>
      <NavLink to="/app/products" activeClassName="active">Products</NavLink>
    </nav>
  </header>
)
```

使用 `<NavLink>` 允许我们设置 `active` 类，当某个链接处于匹配状态时会激活。在 `<Link>` 上我们还可以设置 `extra`。如果没有 `extra`, 当我们访问 `/app/users` 时，由于 React Router v4 的包含性策略，`Home` 页也将处于活跃状态。拥有 `extra` 属性的 `<NavLink>` 比 v3 中相对的 `<Link>` 要稳定得多。

### 使用 `Query` 字符串

在 v4 中不再能直接获取到 query 的值了。在[这个issue中提到](https://github.com/ReactTraining/react-router/issues/4410)，由于没有处理复杂 query 字符串的标准。所以 v4 决定把 query 字符串的处理权留给开发者，这样其实也挺好的。

就我个人来说，我比较喜欢使用 sindresorhus 创建的 [`query-string`](https://www.npmjs.com/package/query-string)。

### 动态路由

v4 中最重要的一点是 几乎所有的内容（包括 `<Route>`）都是一个 React 组件。Routes 不再是什么黑魔法了，我们可以按照条件在需要的时候渲染它。想象一下，你可以让你的应用在满足某些条件时跳转某个路由，不满足某个条件时跳转另外一个路由了。这样我们可以做一些非常有意思的事情了。

React Router4 很容易，因为它们真的[只是组件](https://www.youtube.com/watch?v=Mf0Fy8iHp8k&feature=youtu.be&t=3m22s)