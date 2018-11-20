# 初步
接入小程序SDK后，前端swan.js是集成在SDK中的，SDK接入的APP（以下简称“宿主”）默认无需关心SDK上swan.js的更新/运行，但是宿主需要扩展swan对于小程序开发者的API/组件时，则需要为js运行时编写特定逻辑。

# 扩展
## 扩展都能做什么
目前编写扩展，可以给宿主带来三种能力：

1. 扩展运行在当前宿主上的swan的API，运行在该宿主上的小程序开发者，可以在小程序运行在该宿主时，使用特定的API，如：`swan.tieba.publishThread()`

2. 扩展运行时在当前宿主上的组件，运行在该宿主上的小程序开发者，可以在小程序运行在该宿主时，使用特定的组件，如：`<bilibili-video></bilibili-video>`

3. 宿主可以将统计逻辑，添加在extension中

##扩展的内部下载机制

<img src="http://thyrsi.com/t6/405/1541134466x-1404817844.png" width="800"/>

## 扩展的编写
如果宿主需要在swan上扩展API或是扩展组件的话，则需要进行两步的操作：

1. 在客户端，需要实现`IAiAppExtentSchemeIoc`接口。

2. 在前端，需要编写一个extension扩展包，并上传到百度cdn

### extension目录结构
extension
	------service.js // 同时运行在master的逻辑层和slave的视图层，其中包含宿主扩展的API、端能力与统计逻辑。
	------view.js // 运行在slave的视图层，其中包含宿主扩展的组件。
	------view.css // 运行在slave的视图层，是为宿主提供独立的扩展样式表。
	
### extension包文件详解
swan-extension-demo下载：
http://cp01-swn.epc.baidu.com:8090/static/zip/20181106132866370/swan-extension.zip

###1. service.js
**作用**：
	用于定义宿主扩展的API、端能力和统计逻辑。

###宿主端能力的扩展方式【只为宿主开发者使用】：
`hostMethodDescriptions` 数组中的每一项，会在框架运行时以特定方式注册到`boxjs`中，成为boxjs的一个新方法。
使用方式如：
```javascript 
boxjs.publishThread({
     data:{
         title:'1234'
     }
 });
```


###api的扩展【为小程序开发者使用】：
`methods`对象中的所有字段，会在框架运行时自动被merge到以宿主名为命名空间的集合下，并在全局对象`swan`上提供给宿主的第三方小程序开发者，如：
```javascript 
swan.tieba.publishThread()
```
在methods中的方法里，可以使用hostMethodDescriptions中定义的给宿主开发者使用的端能力。如：
```javascript 
// 扩展API
methods: {
    testAPI:function(){
        alert('OK!');
        boxjs.publishThread({
            data:{
                title:'1234'
            }
        });
        console.log('Extension API Used');
    }
}
```


最终的生成的scheme参考：tiebaclient://v26/swan/publishThread?params=params

其中，协议的protocol为该宿主客户端私有的协议头（开发extension的人员可以和自己的客户端开发者协商），后面的`/v26/`均是协议体，无需更改，最后的`swan/publishThread`反射给三方的类的`ACTION_TYPE`，客户端代码详见：
```javascript
public class AiAppExtendSchemeDemo extends AiAppAction {
    // 协议中的action_type，客户端与前端进行沟通
	private static final String ACTION_TYPE = "/swan/publishThread";
	// ...
	@Override
	public boolean handle(Context context, UnitedSchemeEntity entity, CallbackHandler handler, AiApp aiapp) {
        // 客户端的扩展端能力部分逻辑
	}
}
```
协议中的`params`会被解析为`entity`传递给宿主客户端。
###统计逻辑的扩展方式：
框架运行时的内部在各个关键节点都派发了事件，宿主开发者可以在`customLog`方法中使用其参数的`swanEventFlow`对象来监听这些事件，编写自己的统计逻辑。
具体的事件列表参考[自定义日志](http://agroup.baidu.com/swandocuments/md/article/1269274#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97)

**文件的基础格式**：

```javascript { .theme-peacock }
define('swan-extension-service', ['swan','boxjs'], function (require, module, exports, define, swan, boxjs) {
    module.exports = {
        name: 'tieba',
        hostMethodDescriptions: [{
            name: 'publishThread',
            authority: 'v26/swan',
            path: 'publishThread'
        }],
        // 扩展API
        methods: {
            testAPI:function(){
                alert('OK!');
                boxjs.publishThread({
                    data:{
                        title:'1234'
                    }
                });
                console.log('Extension API Used');
            }
        },

        // 扩展私有的统计逻辑
        customLog(swanEventFlow) {
            // 监听page生命周期函数
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onReady') {
                    console.log(event.params)
                }
            });
            // 监听app生命周期函数
            swanEventFlow.onMessage('ApplifeCycle', event => {
                if (event.params.eventName === 'onShow') {
                    console.log(event.params)
                }
            });
            // 监听框架流程事件
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'masterActiveCreatePageFlowStart'){
                    console.log(event.params)
                }
            });
        }
    }
});


```


----------


###2.view.js
**作用**：用于定义宿主组件，给宿主第三方开发者使用

在view.js解析时，`components`对象中的所有字段，将会自动生成对应的组件，并注册以“宿主名-组件名”的组件信息，宿主第三方开发者的使用方式类似于 `<tieba-video>xxx</eba-video>`。

具体内部详细的组件定义、描述、生命周期等信息，请参考：https://baidu.github.io/san/tutorial/start/

**基础格式**：

```javascript { .theme-peacock }
define('swan-extension-view', ['swan','boxjs'], function (require, module, exports, define, swan, boxjs) {
    module.exports = {
        name: 'tieba',
        // 扩展组件
        components: {
            'video': {
                behaviors: ['userTouchEvents', 'animateEffect'],
                template: '<div class="tieba-video" on-click="testTap">{{content}}<slot></slot></div>',
                depandencies: ['swaninterface'],
                initData() {
                    return {
                        content: 'Extension Content'
                    }
                },
                testTap(){
                    console.log('Will Use Extension API');
                    swan.tieba.testAPI();
                },
                attached() {
                    console.log('Extension Component Attached');
                    swan.tieba.testAPI();
                }
            }
        }
    }
});

```

----------


###3.view.css的基本格式
**作用**：给宿主提供的扩展样式表，可以增加全局样式，也可为宿主定义的组件编写样式。
```javascript { .theme-peacock }
.tieba-video{
	backgroud:#ff0
}
```

### 给extension中提供的接口
在extension中，可能需要与宿主客户端进行交互，所以提供一些开发者所没有的特定接口，编写extension.js的开发人员可以使用这些API，编写特定的逻辑。
其中，extension中，为宿主开发者传入boxjs和swan 为提供扩展API和集合对象使用。
|API|描述|
|--|--|
|boxjs|小程序开发者无法访问的私有能力的接口集合|
|swan|为小程序开发者提供的全局的swan对象(对应的API列表，可以在官网上找到)|

### 自定义日志
在`extension/service`中，宿主开发者可以写一个名为`customLog`的函数。运行时框架会在启动时调用用宿主开发的`customLog`函数，并给开发者的扩展代码传入`swanEventFlow`事件流对象。

swanEventFlow支持接口如下：

|接口名称|作用|参数|
|--|--|--|
|onMessage|监听某一事件|type:String, handler:Function, options:Object|
|delHandler|移除事件流上的某一个事件监听|type:String, handler:Function|
|fireMessage|在当前事件流上派发事件||

由上我们可以看出，宿主可以使用`swanEventFlow`对象，对小程序的各个生命周期关键事件发生节点进行监听。那么开发者可以具体利用的生命周期和事件都有哪些呢？请参见以下列表：
###生命周期：ApplifeCycle

|事件名称|触发时机|
|--|--|
|onLaunch|在小程序启动时，即首次进入|
|onShow|小程序展示时(包含当前页面第一次展示/小程序切换到前台/覆盖在该页面上的其他页面销毁)||
|onHide|小程序隐藏时（包含home键切换到后台/被其他页面覆盖）|
|onError|小程序的生命周期内，发生错误时|

###生命周期：PagelifeCycle`

|事件名称|触发时机|
|--|--|
|onLoad|小程序的某个页面加载|
|onShow|小程序的某个页面展示|
|onReady|页面初次渲染完成，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互||
|onHide|小程序某个页面隐藏|
|onUnload|小程序某个页面被卸载|
|onPullDownRefresh|页面发生下拉刷新时|
|onReachBottom|页面上拉触底|
|onPageScroll|页面滚动|
|shareAction|点击转发|
|shareSuccess|转发成功|
|shareFailed|转发失败|

###生命周期：TraceEvents

|事件名称|触发时机|
|--|--|
|masterPreloadStart|开始|
|masterPreloadCreateHistorystack|建立页面栈|
|masterPreloadCommunicatorListened|通讯开始监听|
|masterPreloadConstructVirtualComponentFactory|构造组件工厂|
|masterPreloadGetMastermanager|mastermanager创建成功|
|masterPreloadDecorateContext|包裹对开发者暴露的上下文|
|masterPreloadInitBindingEnvironmentEvents|绑定声明周期相关事件|
|masterPreloadConstructSlaveEventsRouter|构造slave事件路由|
|masterPreloadInitBindingEvents|初始化事件绑定|
|masterPreloadEnd|预加载结束|
|--|--|
|slavePreloadStart|slave预加载开始|
|slavePreloadListened|slave开始监听用户active|
|slavePreloadGetComponents|拿到所有组件|
|slavePreloadGetComponentFactory|拿到组件工厂|
|slavePreloadDefineComponentsStart|定义组件开始|
|slavePreloadDefineComponentsEnd|定义组件结束|
|slavePreloadEnd|slave预加载结束|
|--|--|
|masterActiveStart|用户进入小程序|
|masterActiveInitRender|初始化渲染|
|masterActiveCreateInitslave|创建初始slave|
|masterActivePushInitslave|入栈开始|
|masterActiveCreateInitslaveEnd|创建初始slave结束|
|masterActivePushInitslaveEnd|入栈结束|
|masterActiveAppJsLoaded|app.js加载结束|
|masterActiveCreatePageFlowStart|创建页面流开始|
|masterActiveGetUserPageInstance|创建用户page|
|masterActiveInitUserPageInstance|初始化用户page实例|
|masterActiveOnqueueInitslave|增加生命周期|
|masterActiveCreatePageFlowEnd|创建页面流结束|
|masterActiveSendInitdataStart|发送数据开始|
|masterActiveSendInitdataEnd|发送数据结束|
|masterActiveInitAction|app.js开始加载|
|--|--|
|slaveActiveStart|用户打开一个新的webview|
|slaveActivePageLoadStart|加载开始|
|slaveActiveCssLoaded|css加载完成|
|slaveActiveSwanJsLoaded|js加载完成|
|slaveActivePageRender|页面渲染完成|
|slaveActiveConstructUserPage|构造开发者页面|
|slaveActiveDefineComponentPage|定义page-component|
|slaveActiveUserPageSlaveloaded|通知渲染完成|
|slaveActiveJsParsed|slavejs解析完成|
|slaveActiveReceiveInitData|接收到数据|
|slaveActiveRenderStart|接收到数据后渲染页面开始|
|slaveActiveRenderEnd|接收到数据后渲染页面结束|
|slaveActivePageAttached|加载完成，未渲染|
|slaveFeFirstPaint|渲染完成（仅Android上有）|
|slaveActiveAppCssLoaded|用户资源app.css加载完成|
|slaveActivePageCssLoaded|用户资源page.css 加载完成|
|slaveActiveSwanJsStart|js加载开始|