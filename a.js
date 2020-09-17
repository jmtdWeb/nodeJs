//使用express框架开发node项目
var express = require('express');
var app = express();
//2.使用mysql连接数据库
var mysql = require('mysql');
//3.使用log4js查看日志
var log4js = require('log4js');
//3.1 配置日志项
log4js.configure({
    appenders: {
        cheese: {
            type: 'file',
            filename: 'cheese.log',
            coloured:'red'
        }
    },
    categories: {
        default: {
            appenders: [
                'cheese'
            ],
            level: 'error'
        }
    }
});
var logger = log4js.getLogger('cheese');
//连接数据库
var connection = mysql.createConnection({
    host     : '127.0.0.1',//主机
    user     : 'root',//用户名
    password : 'Aa111111',//密码
    database : 'sys'//数据库名称
});
connection.connect();
app.get('/addUserInfo', function (req, res) {
    //打印请求报文
    logger.info(req.query);
    //写sql语句
    connection.query('INSERT INTO user VALUES("jack",123)', function (error, results, fields) {
        if (error) throw error;
        res.setHeader('Content-Type', 'text/plain');
        //配置 cros 解决跨域问题
        res.setHeader('Access-Control-Allow-Origin', '*');
        //打印响应报文
        logger.info(results);
        var obj = {
            msg:'',
            code:0
        }
        if(results.affectedRows == 1){
            obj.msg = '添加成功';
            obj.code = 1;
        }else {
            obj.msg = '添加失败';
            obj.code = -1;
        }
        //打印输出结果
        logger.info(obj);
        res.send(obj);
    });
});
//监听 8081 端口
app.listen(8081);
