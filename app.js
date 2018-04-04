'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');

const config = {
  url: 'https://movie.douban.com/subject/26942631/photos?type=S' // 豆瓣电影图片列表
};

/**
 * 获取 HTML
 * @return {[type]}     [description]
 */
function getHtml (url) {
  // @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
  return new Promise(resolve => {
    // @see https://github.com/request/request
    request(url, (error, response, body) => {
      // 出错时不要使用 reject，会抛出异常，停止运行
      // @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await
      if (error) {
        console.log('error', error);
        resolve('error');
        return;
      }
      resolve(body);
    });
  });
}

/**
 * 解析 HTML
 * @return {[type]}      [description]
 */
function parseHtml (html) {
  return new Promise(resolve => {
    if (!html || html === 'error') {
      resolve('error');
      return;
    }

    // 解析出电影名字和图片集合
    let $ = cheerio.load(html);
    let name = $('#content > h1').text(),
      items = $('ul.poster-col3 > li'),
      images = [];

    name = name.replace('的剧照', '');

    items.each(function () {
      let img = $(this).find('img').attr('src');
      if (img) {
        images.push(img);
      }
    });

    resolve({
      name:name,
      images: images
    });
  });
}

/**
 * 获取图片
 * @return {[type]}     [description]
 */
// @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
async function getIma、ge (opts) {
  if (opts === 'error') {
    return 'error'
  }

  opts = opts || {};
  let movieName = opts.name,
    images = opts.images || [];

  if (images.length <= 0) {
    return 'error';
  }

  // 根据电影名字创建目录
  let dir = 'download/' + movieName + '/';
  creatDir(dir);

  // 遍历图片下载
  for (var i = images.length - 1; i >= 0; i--) {
    let img = images[i],
      imgName = path.basename(img);
    await saveImage({
      url: img,
      dir:dir + imgName
    });
  }
}

/**
 * 保存图片
 * @return {[type]}      [description]
 */
function saveImage (opts) {
  opts = opts || {};
  let url = opts.url,
    dir = opts.dir;

  return new Promise (resolve => {
    if (!url || !dir) {
      resolve('error');
      return;
    }

    // 单个保存完成后继续下一个
    setTimeout(() => {

      // 检查图片是否已存在
      if (fs.existsSync(dir)) {
        console.log('Exist', dir);
        resolve('exist');
        return;
      }

      // 请求并保存图片
      request(url, (error, response, body) => {
        if (error) {
          console.log('error', error);
          resolve('error');
          return;
        }
      }).pipe(fs.createWriteStream(dir));
      console.log('Saved', dir);
      resolve('done');
    }, 1000);
  });
}

/**
 * 创建目录
 * @return {[type]}     [description]
 */
function creatDir (dir) {
  // @see https://github.com/jprichardson/node-fs-extra
  fse.ensureDirSync(dir)
}

/**
 * 初始化
 * @return {[type]} [description]
 */
async function init () {
  let html = await getHtml(config.url);
  let opts = await parseHtml(html);
  await getImage(opts);
}

init()
