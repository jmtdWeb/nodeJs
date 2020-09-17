/**
 * node 配个 pm2
 * pm2是一个进程管理工具
 * 可以用它来管理你的node进程
 * 并查看node进程的状态
 * 当然也支持性能监控/进程守护/负载均衡等功能
 * node server.js
*/

const express = require('express');
const router = require("./router/index");
const fs = require('fs')


/**
 * 监听本地文件发生变动
 */
const filePath = './html/index.html'
console.log(`正在监1听 ${filePath}`);
fs.watchFile(filePath, (cur, prv) => {
    if (filePath) {
        // 打印出修改时间
        console.log(`cur.mtime>>${cur.mtime.toLocaleString()}`)
        console.log(`prv.mtime>>${prv.mtime.toLocaleString()}`)
        // 根据修改时间判断做下区分，以分辨是否更改
        if (cur.mtime != prv.mtime){
            console.log(`${filePath}文件发生更新！`)
        }
    }
})


app = express();
/**
 * 引入路由
*/
app.use("/",router);


/**
 * 启动
*/
app.listen(8005);
console.log('http://127.0.0.1:8005');