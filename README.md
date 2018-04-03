# Node.js sync download
---

## 介绍

在 Node.js 8.1 的基础上，通过 `Await` 、`Async`、`Promise` 实现的同步顺序执行，顺序下载图片的程序。

###  了解 JavaScript 中同步执行（ Await、Async、Promise）

##### Await
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await

Await 会暂停当前 `async function` 的执行，等待 Promise 处理完成。

##### Async 
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function

Asyn 函数中若有 await 表达式，这会使 async 函数暂停执行，等待表达式中的 Promise 解析完成后继续执行 async 函数并返回 resolve  结果。

##### Promise
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

解决回调地狱问题，可以像写同步代码一样写异步操作。

#### 组合实现同步执行

```js
'use strict';
/**
 * 第一个任务
 */
function task1 () {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('1', '我是第一个任务，必须第一个执行');
      resolve('done');
    }, 3000);
  });
}

/**
 * 第二个任务
 */
function task2 () {

  return new Promise(resolve => {
    setTimeout(() => {
      console.log('2', '第二个任务');
      resolve('done');
    }, 1000)
  });
}

/**
 * 第三个任务
 */
function task3 () {
  return new Promise((resolve, reject) => {
    console.log('3', '第三个任务');
    reject('error');
  });
}

/**
 * 第四个任务
 */
function task4 () {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('4', '第四个任务');
      resolve('done');
    }, 2000);
  })
}

/**
 * 所有任务
 */
async function allTasks () {
  await task1();
  await task2();
  await task3();
  await task4();
}

// 执行任务
allTasks();

/**
 * 3秒后
 * 1 我是第一个任务，必须第一个执行
 * 1秒后
 * 2 第二个任务
 * 3 第三个任务
 * Uncaught (in promise) error
 */
```

## 使用

> Node.js 推荐最新版或其它版本，但保证支持 `Await` 、`Async`

### 安装 

```shell
npm install
```

### 运行

```shell
node app
```

## License

MIT  © 2018 [givebest](https://github.com/givebest)


