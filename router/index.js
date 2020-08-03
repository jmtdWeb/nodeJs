const ejs     = require('ejs');
const express = require('express');
const router  = express.Router();
const axios   = require('../axios/index');
const url     = require('url');
const setHtml = require('../utils/setHtml');

api = new axios();
sh = new setHtml();

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

module.exports = app;