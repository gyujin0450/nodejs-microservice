// REST API 서버 만들기(p62~)
const http = require('http')
const url = require('url')
const querystring = require('querystring')

// 메서드와 URI별 각 기능 매칭하기(p65)
const members = require('./monolithic_members.js')
const goods = require('./monolithic_goods')
const purchases = require('./monolithic_purchases.js')

/**
 * Http 서버를 생성하고 요청에 대한 처리
 */
let server = http.createServer((req, res) => {
  let method = req.method
  let uri = url.parse(req.url, true)
  let pathname = uri.pathname

  console.log(`${method} | ${uri} | ${pathname}`)

  if (method === "POST" || method === "PUT") {
    let body = ""

    req.on('data', (data) => { body += data })

    req.on('end', () => {
      let params
      if ( req.headers['content-type'] === "application/json") {
        params = JSON.parse(body)
      } else {
        params = querystring.parse(body)
      }

      onRequest(res, method, pathname, params)

    })
  } else {
    onRequest(res, method, pathname, uri.query)
  }
}).listen(8000)

/**
 * 요청에 대해 회원관리 상품관리 구매 관리 모듈로 분기
 * @param res       response 객체
 * @param method    메소드
 * @param pathname  URI
 * @param params    입력 파라미터
 */
function onRequest(res, method, pathname, params) {
  switch (pathname){
    case "/members" :
      members.onRequest(res, method, pathname, params, response)
      break
    case "/goods" :
      goods.onRequest(res, method, pathname, params, response)
      break
    case "/purchases" :
      purchases.onRequest(res, method, pathname, params, response)
      break
    default:
      res.writeHead(404)
      return res.end()
  }
}

/**
 * HTTP 헤더에 JSON형식으로 응답
 * @param res     response 객체
 * @param packet  결과 파라미터
 */
function response(res, packet){
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(packet))
}