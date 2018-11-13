const readline = require('readline');

exports.clearConsole = title => {
    // 如果当前有打开终端（tty）
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        // 将光标移动至 出事位置 x: 0, y: 0
        readline.cursorTo(process.stdout, 0 , 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
}