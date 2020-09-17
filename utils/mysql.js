class Connect {
    constructor() {
        this.mysql = require('mysql');
        this.connection = this.mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Aa111111',
            database: 'sys'
        });
        this.connection.connect((err)=>{
            if(err){
                console.log(`mysql连接失败: ${err}!`);
            }
        });
    }
    /**
     * 读取数据
     * array:数组格式的要读的字段
     * table:字符串格式的表名
     * where:对象格式的条件
     * link:and && or ||
    */
    select(array, table, where, link) {
        let sql = "SELECT ";
        array.forEach(((value, index) => {
            if (index === 0) {
                sql += value;
            } else {
                sql += ',' + value
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        console.log(sql)
        return this._operation(sql);
    }
    /**
     * 添加一条新的数据
     * info:对象格式数据
     * table:表名
    */
    insert(info, table) {
        let sql = "INSERT INTO " + table + "(";
        let keyArray = [];
        let valueArray = [];
        Object.keys(info).forEach((key) => {
            keyArray.push(key);
            valueArray.push("'" + info[key] + "'");
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        return this._operation(sql);
    }
    /**
     * 编辑已经存在的数据
     * info:对象格式数据
     * table:字符串格式的表名
     * where:对象格式的条件
     * link:and && or ||
    */
    update(info, table, where, link) {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }
    /**
     * 删除已经存在的数据
     * table:字符串格式的表名
     * where:对象格式的条件
     * link:and && or ||
    */
    delete(table, where, link) {
        let sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    /**
     * 执行语句
    */
    _operation(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, result, fields) => {
                // console.log(error);
                // console.log(result);
                // console.log(fields);
                if (error) {
                    reject(error.message);
                } else {
                    resolve(result);
                }
            });
        })
    }
    /**
     * 遍历条件语句
     * where:条件
     * link:and && or ||
    */
    _handleWhereString(where, link) {
        let str = "";
        let whereArray = [];
        Object.keys(where).forEach((key) => {
            whereArray.push(String(key + "='" + where[key] + "'"));
        });
        if (link) {
            let whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        } else {
            let whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        return str;
    }
}

module.exports = Connect;