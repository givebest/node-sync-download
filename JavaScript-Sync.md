# JavaScript 中顺序执行异步函数

##  火于异步

1995年，当时最流行的浏览器——网景中开始运行 JavaScript （最初称为 LiveScript）。 1996年，微软发布了 JScript 兼容 JavaScript。随着网景、微软竞争而不断的技术更新，在 2000年前后，JavaScript 相关的技术基础准备就绪。 随后到 2005 年前后，以 Google 为首开始重视使用 AJAX（即 Asynchronous JavaScript and XML)，使得复杂的网页交互体验接近桌面应用。

然后，随着 Web 应用变得越来越复杂 ，JavaScript 的生态和重要性也日益提升，YUI、prototype.js、jQuery 等各种库相应登场，随之而来就到了  JavaScript 的繁荣期。

2008年，Google 发布了 JavaScript 引擎 V8 大大改善了 JavaScript 的执行速度，进一步推动了 JavaScript 的繁荣，也为 JavaScript 进军服务器端打下了基础（如：Node.js）。

## 顺序执行异步函数

异步为 JavaScript 带来非阻塞等便利的同时，同时也在一些场景下带了不便，如：顺序执行异步函数，下面总结了一些常用的方法。

### 1. "回调地狱"

随着应用复杂度几何式增加，我们可能遇到下面“回调地狱”式的代码。

```js
// 第一个任务
function task1 (callback) {
  setTimeout(() => {
    console.log('1', '我是第一个任务，必须第一个执行');
    callback && callback(1);
  }, 3000);
}

// 第二个任务
function task2 (callback) {
  setTimeout(() => {
    console.log('2', '我是第二个任务');
    callback && callback(2);
  }, 1000);
}

// 第三个任务
function task3 (callback) {
  setTimeout(() => {
    console.log('3', '我是第三个任务');
    callback && callback(3);
  }, 1000);
}

// 所有任务
function allTasks () {
  task1((cb1) => {
    if (cb1) {
      task2((cb2) => {
        if (cb2) {
          task3((cb3) => {
            if (cb3) {
              // 顺序完成所有任务
            }
          })
        }   
      });
    }
  });
}

allTasks();

/**
 * 3秒后
 * 1 我是第一个任务，必须第一个执行
 * 1秒后
 * 2 第二个任务
 * 1秒后
 * 3 第三个任务
 */
```

### 2.  Promise

* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

为了避免“回调地狱”带来的复杂性和不易阅读，ES6 推出了 Promise。这次实现起来简单多了，但还存在 Promise 中嵌套多层 Promise 的问题，似乎又回到了类似“回调地狱”的问题上。

```javascript
new Promise(resolve => {
  setTimeout(() => {
    console.log('1', '我是第一个任务，必须第一个执行');
    resolve(1);
  }, 3000);
}).then((val) => {

  new Promise(resolve => {
    setTimeout(() => {
      console.log('2', '我是第二个任务');
      resolve(2);
    }, 1000);
  }).then(val => {
    setTimeout(() => {
      console.log('3', '我是第三个任务');
    }, 1000); 
  });

});
/**
 * 3秒后
 * 1 我是第一个任务，必须第一个执行
 * 1秒后
 * 2 第二个任务
 * 1秒后
 * 3 第三个任务
 */
```

### 3. Await、Async

> 确保支持，详细见：https://caniuse.com/#search=async

* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await

为了更易书写和阅读来实现顺序执行异步函数，ES2017 新增了 `await` 和 `async`。这次书写体验非常的棒，就像写同步代码一样完成了顺序执行异步的需求。

```js
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
    setTimeout(() => {
      console.log('3', '第三个任务');
      reject('error');
    }, 1000);
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
 * 1秒后
 * 3 第三个任务
 * Uncaught (in promise) error
 */
```

## 参考

* 《JavaScript编程全解》
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/

