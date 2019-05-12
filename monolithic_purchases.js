// MySQL 모듈 로드 및 접속 정보
const mysql = require('mysql')
const conn = {
  host: 'localhost',
  user: 'pmsadmin02',
  password: 'alal590606',
  database: 'monolithic'
}

/**
 * 회원 관리의 각 기능별 분기
 */
exports.onRequest = function (res, method, pathname, params, cb) {
  switch (method) {
    case "POST":
      return register(method, pathname, params, (response) => {
        process.nextTick(cb, res, response)
      })
    case "GET":
      return inquiry(method, pathname, params, (response) => {
        process.nextTick(cb, res, response)
      })
    default:
      return process.nextTick(cb, res, null)
  }
}

/**
 * 구매 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {

  console.log('[purchases] function register(method, pathname, params, cb) :',
    `${method} | ${pathname} | ${params} | ${cb} `)
  console.log('reponse.key ==>', params.key)

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  if (params.userid == null || params.goodsid == null) {
    response.errorcode = 1
    response.errormessage = 'Invaild Parameters'
    cb(response)
  } else {
    let connection = mysql.createConnection(conn)
    let sql = 'insert into purchases(userid, goodid) values(?,?)'
    connection.connect()
    connection.query(sql, [params.userid, params.goodsid],
      (err, results, fields) => {
        if (err) {
          response.errorcode = 1
          response.errormessage = err
        }
        cb(response)
      }
    )
    connection.end()
  }
}

/**
 * 구매 내역 조회 기능
 * @param method    메서드
 * @parma parhname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {

  console.log('[purchases] function inquiry(method, pathname, params, cb) :',
    `${method} | ${pathname} | ${params} | ${cb} `)
  console.log('reponse.key ==>', params.key)

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  if (params.userid === null) {
    response.errorcode = 1
    response.errormessage = 'Invalid Parameters'
  } else {
    let connection = mysql.createConnection(conn);
    let sql = `select id, goodsid, date from purchases where userid = ${params.userid}`
    // ToDo : 교재와 다르게 sql 코딩함
    connection.connect()
    connection.query(sql, (err, results, fields) => {
      if (err || result.length === 0) {
        response.errorcode = 1
        response.errormessage = err
      } else {
        response.userid = results
      }
      cb(response)
    })
    connection.end()
  }
}