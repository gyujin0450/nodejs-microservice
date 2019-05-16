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
    case "DELETE" :
      return unregister(method, pathname, params, (response) => {
        process.nextTick(cb, res, response)
      })
    default:
      return process.nextTick(cb, res, null)
  }
}

/**
 * 회원 등록 기능
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

  if (params.username == null || params.password == null) {
    response.errorcode = 1
    response.errormessage = 'Invaild Parameters'
    cb(response)
  } else {
    let connection = mysql.createConnection(conn)
    connection.connect()

    // ToDo : sql문 교재와 다르게 정의함
    let sql = 'insert into members(username, password) values (?, password(?))'
    let vals = [params.username, params.password]
    sql = mysql.format(sql, vals)

    console.log('member-insert-sql ==>', sql)

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
 * 회원 인증 기능
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

  if (params.username === null || params.password === null) {
    response.errorcode = 1
    response.errormessage = 'Invalid Parameters'
  } else {
    let connection = mysql.createConnection(conn);
    connection.connect()

    // ToDo : 교재와 다르게 sql 코딩함
    let sql = `select * from members where username = ${params.username} and password = ${params.password}`
    console.log('member-select-sql ==>',sql)

    connection.query(sql, (err, results, fields) => {
      if (err || results.length === 0) {
        response.errorcode = 1
        response.errormessage = err ? err : 'invalid password'
      } else {
        response.userid = results[0].id
      }
      cb(response)
    })
    connection.end()
  }
}

/**
 * 회원의 탈퇴 기능
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

  if (params.username === null) {
    response.errercode = 1
    response.errormessage = 'Invalid Parameters'
    cb(response)
  } else {
    let connection = mysql.createConnection(conn)
    connection.connect()

    let sql = 'delete from members where username = ?'
    let vals= [params.username]
    sql = mysql.format(sql, vals)

    console.log('member-del-sql => ', sql)

    connection.query(sql,(err, results, fields) => {
      if (err) {
        response.errorcode = 1
        response.errormessage = err
      }
      cb(response)
    })
    connection.end()
  }
}