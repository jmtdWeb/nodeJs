const ejs     = require('ejs');
const fs      = require("fs");

/**
 * 请求接口
*/
function html() {
    /**
     * 生成html
    */
    this.sethtml = (src, data, name) => {
        ejs.renderFile(src, data, {/*option：配置选项*/}, function(err, str){
            /**
             * str => 输出渲染后的 HTML 字符串
            */
            let html = str
            fs.writeFile('html/'+name+'.html', html, function(err) {
                if(err) { console.log(err); return false }
                return true;
            }); 
        });
    }
};
module.exports = html;