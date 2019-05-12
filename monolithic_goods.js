// MySQL 모듈 로드 및 접속 정보
const mysql = require('mysql')
const conn = {
  host: 'localhost',
  user: 'pmsadmin02',
  password: 'alal590606',
  database: 'monolithic'
}

/**
 * 상품 관리의 각 기능별 분기
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
    case "DELETE" :
      return unregister(method, pathname, params, (response) => {
        process.nextTick(cb, res, response)
      })
    default:
      return process.nextTick(cb, res, null)
  }
}

/**
 * 상품 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {

  console.log('[goods] function register(method, pathname, params, cb) :',
              `${method} | ${pathname} | ${params} | ${cb} `)
  console.log('reponse.key ==>', params.key)

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  if (params.name == null || params.category == null || params.price == null || params.description == null) {
    response.errorcode = 1
    response.errormessage = 'Invaild Parameters'
    cb(response)
  } else {
    let connection = mysql.createConnection(conn)
    let sql = 'insert into goods(name, category, price, description) values(?,?,?,?)'
    connection.connect()
    connection.query(sql, [params.name, params.category, params.price, params.description],
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
 * 상품 조회 기능
 * @param method    메서드
 * @parma parhname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {

  console.log('[goods] function inquiry(method, pathname, params, cb) :',
    `${method} | ${pathname} | ${params} | ${cb} `)
  console.log('reponse.key ==>', params.key)

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  let connection = mysql.createConnection(conn);
  let sql = 'select * from goods'
  connection.connect()
  connection.query(sql, (err, results, fields) => {
    if (err || result.length === 0) {
      response.errorcode = 1
      response.errormessage = err ? err : 'no data'
    } else {
      response.result = results
    }
    cb(response)
  })
  connection.end()
}

/**
 * 상품의 삭제 기능
 * @param method    메서드
 * @parma parhname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function unregister(method, pathname, params, cb) {
  console.log('[goods] function unregister(method, pathname, params, cb) :',
    `${method} | ${pathname} | ${params} | ${cb} `)
  console.log('reponse.key ==>', params.key)

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  if (params.id === null) {
    response.errercode = 1
    response.errormessage = 'Invalid Parameters'
    cb(response)
  } else {
    let connection = mysql.createConnection(conn)
    let sql = 'delete from goods where id = ?'
    connection.connect()
    connection.query(sql, [params.id], (err, results, fields) => {
      if (err) {
        response.errorcode = 1
        response.errormessage = err
      }
      cb(response)
    })
    connection.end()
  }
}
