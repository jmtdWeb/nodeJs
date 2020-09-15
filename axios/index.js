const axios = require('axios');
const md5 = require('md5-node')

/**
 * 接口加密用到了此方法
 * json对象转化为地址栏参数  type为true表示加密字符不需要转码   false时需要转码用于微信浏览器识别
*/
function jsonParams(data,type){
    try{
        let tempArr = []
        for(let i in data){
            let key = type?i:encodeURIComponent(i);
            let value = type?data[i]:encodeURIComponent(data[i]);
            tempArr.push(key + '=' + value);
        }
        let urlParamsStr = '?' + tempArr.join('&')
        return urlParamsStr
    }catch(err){
        return ''
    }
}

/**
 * 接口加密用到了此方法
 * 处理对象排序
*/
function objKeySort(obj,type) {
    var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
        if(type){//传参数组
            if(obj[newkey[i]] != undefined){
                newObj[newkey[i]] = obj[newkey[i]];
            }
        }else{
            if(obj[newkey[i]].toString() != '' && newkey[i] != 'keyword' && newkey[i] != 'wx_nickname' && newkey[i] != 'wx_headimgurl'){
                if(!Array.isArray(obj[newkey[i]]) && obj[newkey[i]] != undefined){
                    newObj[newkey[i]] = obj[newkey[i]];
                }
            }
        }
    }
    return newObj;//返回排好序的新对象
}

/**
 * 请求接口
*/
function axiosApi() {
    this.http = (url, method, data) => {
        let thisData = data ? data : {};
        thisData.encryption_time = '18';
        thisData.platform = 'pc';
        /**
         * 加密开始
        */
        let encryption = jsonParams(objKeySort(thisData),1).substr(1);
        thisData.encryption_word = md5('wm182019'+url+method+encryption+thisData.encryption_time);
        /**
         * 加密结束
        */
        return axios({
            url: 'http://api.wm18.com/'+url,
            method: method,
            data: thisData,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Content-Type': 'application/json',
                'Accept-Language': 'zh-cn'
            }
        }).then((res) => {
            console.log(res.data.data)
            return res
        }).catch(function (error) {
            console.log(error)
        })
    } 
};
module.exports = axiosApi;