/**
 *  기존 상품 관리 기능을 마이크로서비스로 만듦 : 회원관리
 */

'use strict'

// 비즈니스로직 파일 참조
const business = require('../business/monolithic_members.js')

// Servoce 클래스 참조
class members extends require('../architecture/server.js'){
  constructor () {
    super("members"
      , process.argv[2] ? Number(process.argv[2]) : 9020
      , ["POST/members", "GET/members", "DELETE/members"]
    )

    this.connectToDistributor("127.0.0.1", 9000, (data) => {
      console.log("Distributor Notification", data)
    })
  }

  // 클라이언트 요청에 따른 비즈니스로직 호출
  onRead(socket, data) {
    console.log("onRead", socket.remoteAddress, socket.remotePort, data)
    business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
      socket.write(JSON.stringify(packet) + '¶')
    })
  }
}

// 인스턴스 생성
new members()