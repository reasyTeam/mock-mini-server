const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const util = require('./util/index');

let config = { version: "1.0.0" };
util.loadFile(path.join(__dirname, '../package.json')).then(res => {
    config = JSON.parse(res);
});

const comments = [{
    key: 'defaultDataFile',
    text: '全数据文件名称',
    value: '""'
}, {
    key: 'baseDist',
    text: '所有数据文件的根目录',
    value: '""'
}, {
    key: 'port',
    text: '本地服务器端口',
    value: 10100
}, {
    key: 'openBrowser',
    text: '是否自动打开浏览器',
    value: false
}, {
    key: 'middleWare',
    text: '中间件，拦截请求之类的操作',
    value: null
}, {
    key: 'mockExtend',
    text: 'Mock扩展',
    value: null
}];

function handleInit() {
    let str = `module.exports = {\r\n\t`;

    comments.forEach(comment => {
        str += '/**\r\n\t';
        str += ` * ${comment.text}\r\n\t`;
        str += ' */\r\n\t';

        str += `${comment.key}: ${comment.value},\r\n\t`;
    })

    str = str.replace(/,\r\n\t$/g, '\r\n');
    str += '}';

    let outPath = path.join(process.cwd(), 'mockhttp.js');
    fs.writeFile(outPath, str, (err) => {
        if (err) {
            reject(err);
            return;
        }
        console.log(`生成配置文件：[${outPath}]`);
    });
}

function handleVersion() {
    console.log('v' + config.version);

    figlet('MOCK-MINI-SERVER', function (err, data) {
        if (err) {
            return;
        }
        console.log(data)
    });
}


function start() {
    if (process.argv.length === 2) {
        runServer();
        return;
    }

    let arg = process.argv[2];
    arg = arg.replace(/^-/, '').toLowerCase();
    switch (arg) {
        case 'init':
            handleInit();
            break;
        case 'v':
            handleVersion();
            break;
        default:
            runServer();
            break;
    }
}

function runServer() {
    const server = require('./server');
    server.run();
}
module.exports = start;