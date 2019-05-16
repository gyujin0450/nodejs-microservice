/**
 * Distributor 만들기(p116)
 *
 * - 노드가 접속하면 접속한 노드에 현재 접속증인 다른 노드의 정보를 제공(sendInfo)하고
 * - 노드 접속이 종료되면 다른 접속된 노드에게 전파하는 기능(sendInfo) 구현
 */
'use strict'
// 접속 노드 관리 오브젝트
let map = {}

// Server 클래스 상속받음
class distributor extends require('./server.js') {

  constructor () {
    super("distributor", 9000, ["POST/distributes","GET/distributes"])
  }

  // 노드 접속 이벤트 처리
  onCreate (socket) {
    console.log("onCreate", socket.remoteAddress, socket.remotePort)
    this.sendInfo(socket)
  }

  // 노드 접속 해제 이벤트 처리
  onClose (socket) {
    console.log("onCreate", socket.remoteAddress, socket.remotePort)
    this.sendInfo(socket)
  }

  // 노드 등록 처리
  onRead (socket, json) {
    let key = socket.remoteAddress + ":" + socket.remotePort
    console.log("onRead", socket.remoteAddress, socket.remotePort, json)

    if (json.uri === "/distributes" && json.method === "POST") {
      map[key] = {
        socket: socket
      }
      map[key].info = json.params
      map[key].info.host = socket.remoteAddress

      this.sendInfo()
    }
  }

  // 패킷 전송
  write (socket, packet) {
    socket.write(JSON.stringify(packet) + '¶')
  }

  // 접속 노드 혹은 특정 소켓에 접속 노드 정보 전파
  sendInfo(socket) {
    let packet = {
      uri: "/distributes",
      method: "GET",
      key: 0,
      params: []
    }

    for (let n in map) {
      packet.params.push(map[n].info)
    }

    if (socket) {
      this.write(socket, packet)
    } else {
      for (let n in map) {
        this.write(map[n].socket, packet)
      }
    }
  }
} // end of distributor class

// distributor 객체 생성
new distributor()