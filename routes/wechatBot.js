var router = require('express').Router();
var AV = require('leanengine');
var Action = AV.Object.extend('Action');

// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');

var WechatAPI = require('wechat-api');
var api = new WechatAPI('','');

function pickWater(user, thenCB){
    var post = new Action();
    post.set('user', user);
    post.set('eventStr', '打水');
    //post.set('event', 0);
    post.save().then(function(post) {
        // 成功保存之后，执行其他逻辑.
        console.log('New object created with objectId: ' + post.id);
        thenCB(post);
    }, function(err) {
        // 失败之后执行其他逻辑
        // error 是 AV.Error 的实例，包含有错误码和描述信息.
        console.log('Failed to create new object, with error message: ' + err.message);
    });
}

router.use('/', wechat('weixin').text(function (message, req, res, next) {
    var keyArray = ['你好', '约吗'];
    var content = message.Content;
    var keyIndex = keyArray.indexOf(content);
    switch (keyIndex) {
        case 0:
        {
            res.reply({
                type: "text",
                content: '您好，大家好才是真的好！'
            });

        }
            break;
        case 1:
        {
            res.reply({
                type: "text",
                content: '不约，不约，叔叔我们不约！'
            });

        }
            break;
        default:
            res.reply({
                type: "text",
                content: '服务器挂掉了，你的要求暂时无法满足……'
            });
            break;
    }
}).image(function (message, req, res, next) {
    // TODO
}).voice(function (message, req, res, next) {
    // TODO
}).video(function (message, req, res, next) {
    // TODO
}).shortvideo(function (message, req, res, next) {
    // TODO
}).location(function (message, req, res, next) {
    // TODO
}).link(function (message, req, res, next) {
    // TODO
}).event(function (message, req, res, next) {
    var clickEvents = ['pickWater'];
    var user = message.FromUserName;
    console.log(message);
    if (message.Event === 'CLICK') {
        var content = message.EventKey;
        var keyIndex = clickEvents.indexOf(content);
        switch (keyIndex) {
            case 0:
            {
                pickWater(user, function(){
                    res.reply({
                        type: "text",
                        content: '你打了一桶水！正在通知CBA的队友...'
                    });

                    console.log(api);

                    api.massSendText(user + '打了一桶水！', true, function(err, data, res){
                        console.log(err);
                        console.log(data);
                        console.log('群发成功！');
                    });

                });
            }
                break;
            default:
                console.log('default case branch');
                break;
        }
    }else if(message.Event === 'subscribe'){
        ///TODO add action for subscribe
    }
}).device_text(function (message, req, res, next) {
    // TODO
}).device_event(function (message, req, res, next) {
    // TODO
}).middlewarify());

module.exports = router;
