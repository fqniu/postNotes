// app application 应用程序
// 把当前的模块所有依赖项都声明在文件模块最上面
// 为了让目录结果保持统一清晰，所以我们约定，把所有的HTML文件都放在views（视图）目录里面
// 我们为了方便统一处理这些静态资源，所以我们约定把所有的静态资源都存放在public目录
// 那些资源能被用户访问，那些资源不能被用户访问，现在可以通过代码来进行非常灵活的操作

//  /index
//  /public 整个public目录中的资源都允许被访问
const http = require('http')
const fs = require('fs')
const template = require('art-template')
const url = require('url')

let comments = [
  {
    name:'fqniu1',
    message:'今天下雨!',
    dateTime:'2020-05-30'
  },
  {
    name:'fqniu2',
    message:'今天下雨!!',
    dateTime:'2020-05-30'
  },
  {
    name:'fqniu3',
    message:'今天下雨!!!',
    dateTime:'2020-05-30'
  },
]

http
  .createServer(function(req, res) {
    // res.end('hello')

    // 使用url.parse 方法将路径解析为一个方便操作的对象，
    // 第二个参数为true表示直接将查询字符串转化为了一个对象（通过query属性来访问）
    const parseObj = url.parse(req.url, true)
    // 单独获取不包含查询字符串的路径部分（该路径不包含？之后的那些内容）
    let pathName = parseObj.pathname

    // const url = req.url
    if(pathName === '/'){
      fs.readFile('./views/index.html', function(err, data) {
        if(err){
          return res.end('404 Not Found!')
        }
        let htmlStr = template.render(data.toString(), {
          comments:comments
        })
          res.end(htmlStr)
      })
    } else if(pathName === '/post') {
      fs.readFile('./views/post.html', function(err, data) {
        if(err){
          return res.end('404 Not Found!!')
        }
          res.end(data)
      })
    } else if(pathName.indexOf('/public/') === 0){
      //  /public/css/main.css
      //  /public/js/main.css
      //  /public/lib/jquery.css
      // 统一处理：
      //     如果请求路径是以 /public / 开头的，则我认为你要获取public里面的某个资源
      //     所以我就直接可以把请求路径当做文件路径来直接进行读取
      //  怎么判断是 /public/ 开头的呢？ 用url.indexof('/public/' === 0) 判断是第一个存在，则返回第一个索引号
      // console.log(url);
      fs.readFile('.' + pathName, function(err, data) {
        if(err){
          return res.end('404 Not Found!!!') 
        }
        res.end(data)
      })
      
    } else if(pathName === '/pinglun') {
      // 注意：这个时候不论 /pinglun?xxx 之后是什么 都不用担心了，因为我的pathName是不包含 ？ 之后的那个路径
      // console.log('收到表单请求了',parseObj.query)
      // 一次请求对应一次响应，响应结束，这次请求就结束了，后面再发送响应数据不管用了
      // res.end(JSON.stringify(parseObj.query))
      // 我们已经使用url.parse方法把请求路径中的查询字符串解析成一个对象
      // 接下来要做的是：
      //   1、获取表单提交的数据 parseObj.query
      //   2、生成日期到数据对象中，然后存储到数组中
      //   3、让用户重定向跳转到首页 /
      //      当用户重新请求 / 的时候，我数组中的数据已经发生变化，所以用户看到的页面数据同时改变
      let comment = parseObj.query
      comment.dateTime = '2020-5-30'
      comments.unshift(comment)
      // 服务器这个时候已经把数据存储好了，接下来让用户重新请求 / 首页 ，就可以看到最新的留言内容数据

      // 如何通过服务器让客户临时重定向？
      //   1、状态码设置为 302 临时重定向
      //      statusCode
      //   2、在响应头中告诉 Location 告诉客户端 往哪重定向
      //      setHeader
      // 如果客户端发现收到服务器的响应的状态码是 302 就会自动去响应头中找 Location，
      // 然后对该地址发新的请求，所以你会看到客户端自动跳转了
      res.statusCode = 302
      res.setHeader('Location','/')
      res.end()

    } else { 
      // 其他的都处理成 404 (没有 找不到的意思)
      fs.readFile('./views/404.html', function(err, data) {
        if(err){
          return res.end('404 Not Found!!!!')
        }
        res.end(data)
      })
    }
  })
  .listen(3000, function() {
    console.log('server is running...')
})

// 写案例照着下面的步骤写：
// 1. / index.html
// 2. 开放 public 目录中的静态资源
//    当请求 /public/xxx 的时候，读取响应 public 目录中的具体资源
// 3. /post post.html
// 4. /pinglun
//    4.1 接收表单提交数据
//    4.2 存储表单提交的数据
//    4.3 让表单重定向到 /
//        statusCode
//        setHeader


