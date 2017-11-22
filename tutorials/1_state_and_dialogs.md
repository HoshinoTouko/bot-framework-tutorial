# State and Dialogs

## Save state

### Overview

针对不同的用户或是同一个用户的不同对话场景，我们很多时候需要保存一些用户数据。例如用户的名字，用户交流时的上下文信息。Bot-Framework 被设计为"无状态"的，所以它可以非常自如地应对多重对话的情景。它提供了一个用于存储数据的容器，用来应对用户 (User) 、公共会话中 (Conversation) 、私有会话中 (privateConversation) 与对话中 (Dialog) 可能出现的需要进行数据存储的情况。  

### Storage containers

在 Bot-Framework 中，bot 使用 session 对象提供以下四种数据容器。

| Property | Scoped | Description |
| :--- | :--- | :--- |
| userData | User | 包括了在特定 Channel 针对特定用户存放的数据。这部分数据将会被长期保存。 |
| privateConversationData | Conversation | 包括了在特定 Channel 、特定用户、特定会话中存放的数据。这部分数据仅针对特定用户有效，并且只会在该会话中保存。这部分数据将会在会话结束或者调用 endConversation 后被清除。 |
| conversationData | Conversation | 类似 privateConversationData ，包括保存的时间、清除的条件。不同的是这部分数据将与所有用户共享。 |
| dialogData | Dialog | 包括了仅当前对话保存的数据，每个对话仅维护一份各自的数据副本。当当前对话从"对话栈"中清除，该部分数据副本也被清空。 |

这四种属性分别对应四种数据容器。针对不同的应用场景，我们可以使用不同类型的容器来提高程序开发的效率。  

### Different containers examples

举例。  

当用户表现出对体育新闻的喜好时，bot 可以将用户的喜好存储于userData中。在之后的对话中，bot 可以针对该喜好进行一些特定内容的推送和筛选。  
当用户询问天气时，bot 可以将询问天气的行为记录在 PrivateConversationData 下。如果用户在之后的对话询问"明天呢？"，bot 就可以明白用户询问的是明天的天气，而非明天的其他信息。

## Dialogs

### Overview

Dialogs 是 Bot-Framework 的一个重要模块，它允许用户模块化地维护对话。bot 与用户的每次交流称作"会话"，每次会话由多个对话组成，每次的对话又可以用"对话流"来进行构建。可以将会话理解为对话的父结构。理解对话与会话的关系和相互之间的作用，可以极大方便我们开发聊天机器人，提高聊天机器人的代码可读性和组织结构。

### Conversations through dialogs

> 通过对话构建会话

Bot-Framework 使用会话作为使用者和 bot 之间的交流。会话由多个对话组成。会话由用户定义，是一个可以重复使用的模块。在这里，我们定义一个 `askName` 的模块作为示例。

#### 样例代码

##### 对话本体

```
bot.dialog('askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What\'s your name?');
    },
    function (session, results) {
        session.userData.userName = results.response;
        session.endDialog(`Hello ${session.userData.userName}!`);
    }
]);
```

##### 根会话中的跳转指令

```
if (!session.userData.name){
    session.beginDialog('askName');
    return;
}
```

#### 执行

执行 bot 程序，发送任意指令。此时 bot 并不知道你的名字，所以会将 `askName` 进栈。此时 bot 开始执行询问名字的对话。当对话执行 `session.endDialog()` 方法，`askName` 对话出栈并结束，重新回到根会话。这样就完成了一段询问名字的对话。同理，我们可以将每个单独的动作封装成单独的对话并统一管理。例如询问天气的对话，就可以单独封装起来，方便后期维护。

###### 注

在没有手动结束的情况下，会话和对话是重复执行的。

