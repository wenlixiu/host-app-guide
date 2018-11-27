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
                // alert('OK!');
                // boxjs.publishThread({
                //     data:{
                //         title:'1234'
                //     }
                // });
                let test = 'Extension API Used';
                return test;
            }
        },

        // 扩展私有的统计逻辑
        customLog(swanEventFlow) {
            // 监听page生命周期函数
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onLoad') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onShow') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onReady') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onHide') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onUnload') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onPullDownRefresh') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onReachBottom') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'onPageScroll') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'shareAction') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'shareSuccess') {
                    console.log(event.params);
                }
            });
            swanEventFlow.onMessage('PagelifeCycle', event => {
                if (event.params.eventName === 'shareFailed') {
                    console.log(event.params);
                }
            });

            // 监听app生命周期函数
            swanEventFlow.onMessage('ApplifeCycle', event => {
                if (event.params.eventName === 'onLaunch') {
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('ApplifeCycle', event => {
                if (event.params.eventName === 'onShow') {
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('ApplifeCycle', event => {
                if (event.params.eventName === 'onHide') {
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('ApplifeCycle', event => {
                if (event.params.eventName === 'onError') {
                    console.log(event.params)
                }
            });

            // 监听框架流程事件
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'masterPreloadStart'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'masterPreloadCreateHistorystack'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'slavePreloadStart'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'slavePreloadListened'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'masterActiveStart'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'masterActiveInitRender'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'slaveActiveStart'){
                    console.log(event.params)
                }
            });
            swanEventFlow.onMessage('TraceEvents', event => {
                // 宿主打印日志的逻辑
                if(event.params.eventName === 'slaveActivePageLoadStart'){
                    console.log(event.params)
                }
            });

        }
    }
});
