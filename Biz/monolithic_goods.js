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
    connection.connect()

    // ToDo : 교재와 다르게 정의함
    let sql = 'insert into goods(name, category, price, description) values( ?, ?, ?, ?)'
    let vals = [params.name, params.category, params.price, params.description]
    sql = mysql.format(sql, vals)

    console.log('goods-insert-sql ==>', sql)

    connection.query(sql, (err, results, fields) => {
      if (err) {
          response.errorcode = 1
          response.errormessage = err
      }

      cb(response)
    })

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

  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  }

  let connection = mysql.createConnection(conn);
  connection.connect()

  let sql = 'select * from goods'
  console.log('goods-insert-sql ==> ', sql)

  connection.query(sql, (err, results, fields) => {
    if (err || results.length === 0) {
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
    connection.connect()

    let sql = 'delete from goods where id = ?'
    let vals= [params.id]
    sql = mysql.format(sql, vals)

    console.log('goods-del-sql ==>', sql)

    connection.query(sql, (err, results, fields) => {
      if (err) {
        response.errorcode = 1
        response.errormessage = err
      }
      cb(response)
    })
    connection.end()
  }
}
