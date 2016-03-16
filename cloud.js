var AV = require('leanengine');
var _ = require('lodash');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});

AV.Cloud.define('rank', function (request, response) {
    AV.Query.doCloudQuery('select user from Action').then(function (data) {
        var users = [];
        users = _.chain(data.results)
            .countBy(function(item){
                return item.get('user');
            })
            .toPairs()
            .sortBy(1)
            .reverse()
            .mapValues(0)
            .value();

        response.success(users);
    }, function (error) {
        console.log(error);
        response.success(error);
    });
});

module.exports = AV.Cloud;
