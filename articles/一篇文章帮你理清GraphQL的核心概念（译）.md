
> 一年多以前就听说了`GraphQL`,前段时间接触了一个海归团队(创始人就来自Facebook)，技术栈使用`Graphql+Apollo+React`，在他们的指导下试用了一下觉得真心酷。遂花了半个多月了解了`GraphQL`的主要思想和基本用法，碰巧看到[一篇文章]((https://blog.pusher.com/getting-up-and-running-with-graphql/))把GraphQL的核心概念讲的比较清晰易懂，依据该文，大致翻译如下，如果你也对`GraphQL`感兴趣，欢迎一起来讨论。

**什么是GraphQL：**

> 给API设计的一种查询语言，一个依据已有数据执行查询的运行时，为你的API中的数据提供一种完全且容易理解的描述，使得API能够更容易的随着时间而演变，还支持强大的开发者工具。

虽然名字叫做GraphQL 但是和数据库本身并没有直接关系。

**GraphQL的特征：**

- 可描述性的：使用GraphQL，你获取的都是你想要的数据，不多也不会少；
- 分级性的：GraphQL天然遵循对象间的关系，通过一个简单的请求，我们可以获取到一个对象及其相关的对象，比如说，通过一个简单的请求，我们可以获取一个作者和他创建的所有文章，然后可以获取文章的所有评论；
- 强类型的：使用GraphQL的类型系统，我们可以描述能够被服务器查询的可能的数据，然后确保从服务器获取到的数据和我们查询的一致；
- 不做语言限制：并不绑定于某一特定的语言，实际上现在已经有一些不同的语言有了实践；
- 兼容于任何后台：GraphQL不限于某一特定数据库，可以使用已经存在的数据，代码，甚至可以连接第三方的APIs.
- 好反省的：GraphQL服务器能够查询架构的细节。

GraphQL的核心包括`Query`,`Mutation`,`Schemas`等等，每个概念下又有一些子概念,下面分别做简单的介绍：

## Query
Queries用做读操作，也就是从服务器获取数据。Queries定义了我们对模式执行的行为。下面是一个简单的查询及相应的结果：

```js
    // Basic GraphQL Query

    {
      author {
        name
        posts {
          title
        }
      }
    }
```

```js
    // Basic GraphQL Query Response

    {
      "data": {
        "author": {
          "name": "Chimezie Enyinnaya",
          "posts": [
            {
              "title": "How to build a collaborative note app using Laravel"
            },
            {
              "title": "Event-Driven Laravel Applications"
            }
          ]
        }
      }
    }
```

查询和响应具备相同的结构。

### 对query结果的解释

如果一个操作没有`type`，GraphQL默认会把这些操作看做`query`。`query`还可以拥有名字，虽然是可选的，但是可以帮助识别某个query是做什么的。

query也可以拥有注释，注释以`#`开头。

#### Field

Field是我们想从服务器获取的对象的基本组成部分。上述代码中`name`就是`author`对象的一个`Field`.

#### Argument

和普通的函数一样，`query`可以拥有参数，参数是可选的或需求的。参数使用方法如下：

```
{
  author(id: 5) {
    name
  }
}
```

需要注意的是，GraphQL中的字符串需要包装在双引号中。

#### Variables
除了参数，query还允许你使用变量来让参数可动态变化，变量以`$`开头书写，使用方式如下：

```js
    query GetAuthor($authorID: Int!) {
      author(id: $authorID) {
        name
      }
    }
```

参数可以拥有默认值：

```js
    query GetAuthor($authorID: Int! = 5) {
      author(id: $authorID) {
        name
      }
    }
```

参数也可以是可选的或必须的，比如上述的`$authorID`变量是必须的，它的定义中包含了`!`。详细信息可见`schema`中。

#### Allases

别名，比如说，我们想分别获取ID5和7，我们可以用下面的方法：

```js
    {
      author(id: 5) {
        name
      }
      author(id: 7) {
        name
      }
    }
```

由于存在相同的`name`，上述代码会报错，要解决这个问题就要用到别名了`Allases`。

```js
    {
      chimezie: author(id: 5) {
        name
      }
      neo: author(id: 7) {
        name
      }
    }
```

获取的结果如下：

```js
    # Response

    {
      "data": {
        "chimezie": {
          "name": "Chimezie Enyinnaya"
        },
        "neo": {
          "name": "Neo Ighodaro"
        }
      }
    }
```

#### Fragments

`Fragments`是一套在`queries`中可复用的`fields`。比如说我们想获取`twitterHandle`field，我们可以按下面这样做：

```js
    {
      chimezie: author(id: 5) {
        name
        twitterHandle
      }
      neo: author(id: 7) {
        name
        twitterHandle
      }
    }
```

但是如果`fields`过多，就会显得重复和冗余。Fragments在此时就可以起作用了。以下是使用`Fragments`的语法：

```js
    {
      chimezie: author(id: 5) {
        ...authorDetails
      }
      neo: author(id: 7) {
        ...authorDetails
      }
    }

    fragment authorDetails on Author {
      name
      twitterHandle
    }
```

#### Directives
`Directives`提供了一种动态使用变量改变我们的`queries`的方法。如本例，我们会用到以下两个`directive`:

- `@include`:只有当`if`中的参数为`true`时，才会包含对应`fragment`或`field`；
- `@skip`:当`if`中的参数为`true`时,会跳过对应`fragment`或`field`；

这两个`directive`都接受一个布尔值作为参数；

**实例如下：**

```js
    query GetAuthor($authorID: Int!, $notOnTwitter: Boolean!, $hasPosts: Post) {
      author(id: $authorID) {
        name
        twitterHandle @skip(if: $notOnTwitter)
        posts @include(if: $hasPosts) {
          title
        }
      }
    }
```


## Mutation
传统的API使用场景中，我们会有需要修改服务器上数据的场景，`mutations`就是应这种场景而生。`mutations`被用以执行写操作，通过`mutations`我们会给服务器发送请求来修改和更新数据，并且会接收到包含更新数据的反馈。`mutations`和`queries`具有类似的语法，仅有些许的差别。

```js
    mutation UpdateAuthorDetails($authorID: Int!, $twitterHandle: String!) {
      updateAuthor(id: $authorID, twitterHandle: $twitterHandle) {
        twitterHandle
      }
    }
```

我们在`mutation`中以数据为载物发送，比如上面的例子中，我们发送了下面的数据：

```js
    # Update data

    {
     "authorID": 5,
     "twitterHandle": "ammezie"
    }
```

更新完成后，我们将从服务器获取以下内容作为反馈。

```js
    # Response after update

    {
      "data": {
        "id": 5,
        "twitterHandle": "ammezie"
      }
    }
```
我们可以看出，反馈数据中包含我们更新的数据

和`queries`类似，`mutations`也能够接受，多重`fields`,不过`queries`和`mutations`的一个重大不同之处在于，为了保证数据的完整性`mutations`是串形执行，而`queries`可以并行执行。

## Schemas

Schemas 描述了 数据的组织形态 以及服务器上的那些数据能够被查询，Schemas提供了你数据中可用的数据的对象类型，GraphQL中的对象是强类型的，因此schema中定义的所有的对象必须具备类型。类型允许GraphQL服务器确定查询是否有效或者是否在运行时。Schemas可用是两种类型`Query`和`Mutation`。

`Schemas`用GraphQL schemas语言构建，它和我们前面已经学过的query非常类似，下面是一个示例：

```js
    type Author {
      name: String!
      posts: [Post]
    }
```

上面的`schemas`定义了一个`Author`对象，它包含两个`fields`(`name`和`posts`),这意味着当我们操作（读取）`Author`时，我们只能使用`name`和`fields`,每个`field`都可以是必须的或者可选的,比如上面的`name`field是必须的，因为其后有符号`!`,而`posts`是可选的。


### Arguments

Schemas中的Fields 也可以接收参数，这些参数可以是可选的或者必须的，必须的参数通过`!`识别。

```js
    type Post {
      allowComments(comments: Boolean!)
    }
```

### 标量类型
顺便提一下，`GraphQL`支持以下标量类型：

- Int: 带符号的32位整数
- Float: 带符号的双精度浮点数
- String: UTF-8 字符串
- Boolean: true or false
- ID: 唯一标识符


由上述类型定义的fields 不能 再拥有自己的 fields，我们可以使用`scalar`关键字，自定义标量类型，比如我们可以定义一个`Date`类型：

```js
    scalar Date
```

#### 枚举类型

又称`Enums`,这是一种特殊的标量类型，通过此类型，我们可以限制值为一组特殊的值，比如，我们可以：

- 保证此类型的任何参数都是允许值之一；
- 通过类型系统进行通信，该字段始终是有限值集之一。


`Enums`通过关键字`enum`进行定义：

```js
    enum Media {
      Image
      Video
    }
```

#### 输入类型

input类型对mutations来说非常重要，在 GraphQL schema 语言中，它看起来和常规的对象类型非常类似，但是我们使用关键字`input`而非`type`,`input`类型按如下定义：

```js
    # Input Type

    input CommentInput {
      body: String!
    }
```


## 开始实践

我们将使用`node.js`建设一个简单的任务管理`GraphQL serve`,这个例子非常简单，但是足以用到我们学过的大部分概念，巩固我们的学习成果。

### 构建`Node.js`服务器

我们使用`Express`做为我们的`node.js`框架，首先我们需要初始化一个`node.js`项目，使用以下命令：

```bash
mkdir graphql-tasks-server
cd graphql-tasks-server
npm init -y
npm install express body-parser apollo-server-express graphql graphql-tools lodash --save
```


### 创建如下文件及目录

- `/src/`
- `/src/data/`
- `/src/data/data.js`:
- `/src/schema/`
- `/src/schema/index.js`
- `/src/schema/resolvers.js`
- `/src/server.js`

```js
// src/server.js

    const express = require('express');
    const bodyParser = require('body-parser');
    const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
    const schema = require('./schema/index');

    const PORT = 3000;

    const app = express();

    // Graphql 用以构建Graph服务器
    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

    // Graphiql 用以展示查询客户端
    app.use('/graphiql', graphiqlExpress({ endpointURL: 'graphql' }));

    app.listen(PORT, () => console.log(`GraphiQL is running on http://localhost:${PORT}/graphiql`));
```


### 构建Schemas

```js
// src/schema/index.js

    const { makeExecutableSchema } = require('graphql-tools');
    const resolvers = require('./resolvers');

    const typeDefs = `
        type Project {
            id: Int!
            name: String!
            tasks: [Task]
        }
        type Task {
            id: Int!
            title: String!
            project: Project
            completed: Boolean!
        }
        type Query {
            projectByName(name: String!): Project
            fetchTasks: [Task]
            getTask(id: Int!): Task
        }
        type Mutation {
            markAsCompleted(taskID: Int!): Task
        }
    `;

    module.exports = makeExecutableSchema({ typeDefs, resolvers });
```

我们为我们的app定义了`schema`,我们定义了两种类型，`projects`和`tasks`,type task中包含我们要完成的任务，而type Project中包含三项`id`,`name`和`tasks`，`id`和`name`是必备`fields`,`tasks`则是一系列`Task`类型的组合，`task` type包含4项，`id`, `title`, `project` 和 `completed`，`id`和`title`是必须的，`project`指明了属于那个项目，而`completed`表明了其完成情况。

一个项目可以包含多个任务，而一个任务必属于一个项目。

接下来，我们定义了一系列查询，
- `projectByName`:用以通过传入的`name`参数来返回对应的`Project`;
- `fetchTasks`:用以获取所有的任务并返回；
- `getTasks`:依据传入的`id`返回特定的任务；

我们也定义了一些`Mutation`:
- `markAsCompleted`:接受一个id做为参数，并返回修改完成状态后的Task

### Writing Resolvers

`resolver`是决定`schemas`中的`field`该如何执行的函数。

> Tip: GraphQL resolvers 可以返回Promises

```js
// src/schema/resolvers.js

    const _ = require('lodash');

    // Sample data
    const { projects, tasks } = require('./../data/data');

    const resolvers = {
        Query: {
            // Get a project by name
            projectByName: (root, { name }) => _.find(projects, { name: name }),

            // Fetch all tasks
            fetchTasks: () => tasks,

            // Get a task by ID
            getTask: (root, { id }) => _.find(tasks, { id: id }),

        },
        Mutation: {
            // Mark a task as completed
            markAsCompleted: (root, { taskID }) => {
                const task = _.find(tasks, { id: taskID });

                // Throw error if the task doesn't exist
                if (!task) {
                    throw new Error(`Couldn't find the task with id ${taskID}`);
                }

                // Throw error if task is already completed
                if (task.completed === true) {
                    throw new Error(`Task with id ${taskID} is already completed`);
                }

                task.completed = true;

                return task;
            }
        },
        Project: {
            tasks: (project) => _.filter(tasks, { projectID: project.id })
        },
        Task: {
            project: (task) => _.find(projects, { id: task.projectID })
        }
    };

    module.exports = resolvers;
```

我们对Schemas中定义的各项添加了处理函数。


### 添加数据

```js
    // src/data/data.js

    const projects = [
        { id: 1, name: 'Learn React Native' },
        { id: 2, name: 'Workout' },
    ];

    const tasks = [
        { id: 1, title: 'Install Node', completed: true, projectID: 1 },
        { id: 2, title: 'Install React Native CLI:', completed: false, projectID: 1 },
        { id: 3, title: 'Install Xcode', completed: false, projectID: 1 },
        { id: 4, title: 'Morning Jog', completed: true, projectID: 2 },
        { id: 5, title: 'Visit the gym', completed: false, projectID: 2 }
    ];

    module.exports = { projects, tasks };
```

### 启动服务器并测试

```bash
    node src/server.js
```


在浏览器中打开，http://localhost:3000/graphiql，输入查询即可看到结果。

![IMAGE](https://github.com/zhangwang1990/blogs/blob/master/articles/imgs/graphql-tool-demo.jpg?raw=true)


## 一些有用的链接

- [《Getting up and running with GraphQL》](https://blog.pusher.com/getting-up-and-running-with-graphql/)
- [howtographql](https://www.howtographql.com)
- [译文在Github上的链接](https://github.com/zhangwang1990/blogs/blob/master/articles/%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%E5%B8%AE%E4%BD%A0%E7%90%86%E6%B8%85GraphQL%E7%9A%84%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5%EF%BC%88%E8%AF%91%EF%BC%89.md)

