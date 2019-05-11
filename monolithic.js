// REST API 서버 만들기(p62~)
// - 기본적으로 HTTP 서버임
// - 3.3.1에서 작성한 HTTP 서버에 메서드, URL별로 분기할 수 있도록 몇가지 코드를 추가함
const http = require('http')
const url = require('url')
// url 모듈은 url 정보를 객체로 가져와 분석하거나(parse) url 객체를 문자열로 바꿔주는 기능(format, resolve)을 수행함
const querystring = require('querystring')
// querystring 모듈은 url 객체의 query와 관련된 모듈
// 분명 유용한 모듈이긴 하지만 url 모듈의 두 번째 인자 값을 조정함으로써 해결할 수도 있음(?)

let server = http.createServer((req, res) => {
  let method = req.method
  let uri = url.parse(req.url, true)
  let pathname = uri.pathname

  if (method === "POST" || method === "PUT") {
    let body = ""

    req.on('data', (data) => { body += data })

    req.on('end', () => {
      let params
      if ( req.headers['content-type'] == "application/json") {
        params = JSON.parse(body)
      } else {
        params = querystring.parse(body)
      }

      res.end("response 1")

    })
  } else {
    res.end("response 2")
  }

}).listen(8000)