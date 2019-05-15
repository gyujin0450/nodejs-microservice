/**
 * 분산 시스템 만들기
 *
 * - 모든 노드가 접속할 수 있는 서버(Distributor)에 자신의 정보를 저장하고,
 *   저장된 모든 정보를 조회하면 분산환경에서 원하는 노드에 접속할 수 있음
 * - 서비스 중 Distributor에 문제가 발생해도 마이크로서비스는 안정적으로 동작하도록 함
 *   1) Distributor가 실행되지 않았을 때도 / 노드들은 Distributor에 주기적으로 접속을 시도함
 *   2) 노드가 Distributor에 접속하거나 접속이 종료 되었을 때 /
 *      Distributor는 이를 인지하고, 다른 노드에 이 사실을 전파해야 함
 *   3) Disbutor가 종료되어도 각 노드는 알고 있는 정보를 이용해 노드 간 접속 상태를 유지해야 하며
 *      상태로 되돌아가 Distributor에 다시 접속될 때까지 주기적으로 접속을 시도해야 함
 *
 *  * Distributor : a person or company that supplies goods to the businesses that sell them
 *
 *  - Distributor는 노드들의 접속 상태를 알려면 접속 종료 이벤트를 인지할 수 있는 TCP 서버로 만듦
 *
 *  - Distributor 입장에서 각 노드는 클라이언트이지만. 요청을 처리하눈 서버가 되기도 함!!!
 *
 *  ---------------------------------------------------------------------------------------------------
 *  client 클래스 (p103)
 *  - 클라이언트의 기본 기능 : '접속','데이터 수신',''데이터 발송'
 *  - 자식 클래스에서는 접속(connect)와 데이터 발송(write) 함수에만 접근할 수 있고,
 *  - 데이터 수신은 수신이 완료하면 생성자에서 전달한 함수로 콜백 호출되도록 함
 */

'use strict'  // Strict 모드 사용 : ES5부터 적용되는 키워드로, 실행 시점에서 에러 표시함
const net = require('net')

/**
* tcp client 클래스
*/
class tcpClient {

  // 생성자
  constructor (host, port, onCreate, onRead, onEnd, onError) {
    this.options = {
      host: host,
      port: port
    }
    this.onCreate = onCreate  //
    this.onRead = onRead      //
    this.onEnd = onEnd        //
    this.onError = onError    //
  }

  // 접속 함수
  connect() {
    this.client = net.connect(this.options, () => {
      if (this.onCreate) {
        this.onCreate(this.options) // 접속 완료 이벤트 콜백
      }
    })

    // 데이터 수신 처리
    this.client.on('data', (data) => {
      // this.merge : ??
      let sz = this.merge ? this.merge + data.toString() : data.toString()
      let arr = sz.split('¶')      // ¶ 단축키 못찾음

      for ( let n in arr) {
        if (sz.charAt(sz.length - 1) !== '¶' && n === arr.length - 1) {
          this.merge = arr[n]
          break
        } else if (arr[n] === "") {
          break
        } else {
          this.onRead(this.options, JSON.parse(arr[n]))
        }
      }
    })

    // 접속 종료 처리
    this.client.on('close', () => {
      if (this.onEnd){
        this.onEnd(this.options)
      }
    })

    // 에러 처리
    this.client.on('error', (err) => {
      if (this.onError){
        this.onError(this.options, err)
      }
    })
  }

  // 데이터 발송
  write (packet) {
    this.client.write(JSON.stringify(packet) + '¶')
  }
} // end of tcpClient

module.exports = tcpClient