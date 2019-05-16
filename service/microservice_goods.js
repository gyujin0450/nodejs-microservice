/**
 * 기존 상품 관리 기능을 마이크로서비스로 만듦 : 상품관리
 */

'use strict'

// 비즈니스로직 파일 참조
const business = require('../business/monolithic_goods.js')

// Server 클래스 참조
class goods extends require('../architecture/server.js') {
  // 상속 받은 goods 클래스를 초기화하고
  // Distributor 연결 기능을 추가
  constructor() {
    // 서비스명, 포트정보, 처리가능한 URI 정보 전달
    super("goods"
      , process.argv[2] ? Number(process.argv[2]) : 9010
      , ["POST/goods", "GET/goods", "DELETE/goods"]
    )

    this.connectToDistributor("127.0.0.1", 9000, (data) => {
      console.log("Distributor Notification", data)
    })
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    console.log("onRead", socket.remoteAddress, socket.remotePort, data)
    business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
      socket.write(JSON.stringify(packet) + '¶')
    })
  }
}

new goods() // 인스턴스 생성