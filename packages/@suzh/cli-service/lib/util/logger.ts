import chalk from 'chalk';
// import readline from 'readline';

const chalkTag = (msg: string) => chalk.bgBlackBright.white.dim(` ${msg} `);

// 格式化输出
const format = (label: string, msg: string) => {
    return msg
        .split('\n')
        .map((line: string, i: number) => {
            return i === 0
                ? `${label} ${line}`
                : line.padStart(chalk.reset(label).length)
        })
        .join('\n');
}

/**
 * 打印错误
 * @param msg string
 * @param tag string
 */ 
export function error(msg: string, tag: string | null = null) {
    console.log(
        format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg))
    );
}
