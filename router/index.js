const ejs     = require('ejs');
const express = require('express');
const router  = express.Router();
const axios   = require('../axios/index');
const mysql   = require('../utils/mysql');
const url     = require('url');
const setHtml = require('../utils/setHtml');

api = new axios();
sh = new setHtml();
sql = new mysql();

app = express();
app.use(router)
//设置渲染文件的目录
app.set('views','./views');
//设置html模板渲染引擎
app.engine('ejs',ejs.__express);
//设置渲染引擎为html
app.set('view engine','ejs');
//静态文件路径
app.use(express.static('public'));


/**
 * 调用路由，进行页面渲染
 * https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
 * 首页
*/
app.get('/',async(request,response)=>{
    /**
     * 获取地址栏数据
    */
    let params = url.parse(request.url, true).query;
    console.log(params.name)
    
    /**
     * async/await/axios
     * 请求数据
    */
    let getData = await api.http('page/showUpdate','GET').then(res => {
        //console.log(res)
        return res;
    })

    /**
     * 数据
    */
    let thisData = {
        title:'首页', 
        lists:getData.data.data.list
    }

    /**
     * 调用渲染模板
    */
    response.render('index', thisData);

    /**
     * 生成html
     * 1要生成的模板
     * 2数据
     * 3生成名字
    */
    sh.sethtml('./views/index.ejs', thisData, 'index');
});

/**
 * 商品分类
*/
app.get('/goodsClass',async(request,response)=>{
    /**
     * async/await/axios
     * 请求数据
    */
    let getData = await api.http('goods/category-v2','GET').then(res => {
        //console.log(res.data.data.category_data)
        return res;
    })
    
    /**
     * 数据
    */
    let thisData = {
        title:'商品分类', 
        lists:getData.data.data.category_data
    }

    /**
     * 调用渲染模板
    */
    response.render('goodsClass', thisData);

    /**
     * 生成html
     * 1要生成的模板
     * 2数据
     * 3生成名字
    */
    sh.sethtml('./views/goodsClass.ejs', thisData, 'goodsClass');
});

/**
 * 获取数据库信息
*/
app.get('/sql',async(request,response)=>{
    /**
     * 获取地址栏参数
    */
    let params = url.parse(request.url, true).query;
    let getSqlData;

    /**
     * 操作
    */
    if(params.name == 'get'){
        /**
         * 获取数据
         * id in(1,2,3)
        */
        getSqlData = await sql.select(['*'],'websites').then(res => {
            if(res.length == 0){
                console.log('没有数据')
            }
            return res;
        });
    }else if(params.name == 'add'){
        /**
         * 添加数据
        */
        getSqlData = await sql.insert({name:'maikaolin'},'websites').then(res => {
            return res;
        });
    }else if(params.name == 'set'){
        /**
         * 编辑数据
        */
        getSqlData = await sql.update({name:'麦考林麦考林麦考林'},'websites',{id:5}).then(res => {
            return res;
        });
    }else if(params.name == 'delete'){
        /**
         * 删除数据
        */
        getSqlData = await sql.delete('websites',{id:11}).then(res => {
            return res;
        });
    }else if(params.name == 'api'){
        /**
         * 获取数据
        */
        getSqlData = await sql.select(['*'],'websites').then(res => {
            if(res.length == 0){
                console.log('没有数据')
            }
            /**
             * 配置 cros 解决跨域问题
            */
            //设置允许跨域的域名，*代表允许任意域名跨域
            response.header("Access-Control-Allow-Origin","*");
            //允许的header类型
            response.header("Access-Control-Allow-Headers","content-type");
            //跨域允许的请求方式 
            response.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
            /**
             * 打印输出结果
            */
           //response.render('haha',{'news':['阿斯顿撒','萨达','提货费']});
            response.send(res);
        });
    }
    
    /**
     * 数据
    */
    let thisData = {
        title:'首页', 
        lists:getSqlData?getSqlData:[]
    }

    /**
     * 调用渲染模板
    */
    response.render('sql', thisData);

    /**
     * 生成html
     * 1要生成的模板
     * 2数据
     * 3生成名字
    */
    sh.sethtml('./views/sql.ejs', thisData, 'index');
});
module.exports = app;