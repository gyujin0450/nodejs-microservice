/**
 *  Server 클래스 만들기(p107)
 *
 *  - 기본 기능 : 리슨, 데이터 수신, 클라이언트 접속관리
 *  - 추가 기능 : tcpClient를 이용해 Distribute에 주기적으로 접속을 시도 기능(connectToDistributor)
 */

'use strict'

const net = require('net')
const tcpClient = require('./client.js')

class tcpServer {
  constructor (name, port, urls) {
    this.context = {
      port: port,
      name: name,
      urls: urls
    }
    this.merge = {}

    // 서버 객체 생성
    this.server = net.createServer((socket) => {
      // 클라이언트 접속 이벤트
      this.onCreate(socket)

      // 에러 이벤트
      socket.on('error', (exception) => {
        this.onClose(socket)
      })

      // 클라이언트 접속 종류 이벤트
      socket.on('close', () => {
        this.onClose(socket)
      })

      // 데이터 수신 이벤트
      socket.on('data', (data) => {
        let key = socket.remoteAddress + ":" + socket.remotePort
        let sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString()
        let arr = sz.split('¶')

        for ( let n in arr) {
          if ( sz.charAt(sz.length - 1) !== '¶' && n === arr.length - 1 ) {
            this.merge[key] = arr[n]
            break
          } else if ( arr[n] === "" ) {
            break
          } else {
            this.onRead( socket, JSON.parse(arr[n]))
          }
        }
      })
    })

    // 서버 객체 에러 이벤트
    this.server.on('error', (err) => {
      console.log(err)
    })

    // 리슨
    this.server.listen(port, () => {
      console.log('listen', this.server.address())
    })

  } // end of constructor

  onCreate(socket) {
    console.log("onCreate", socket.remoteAddress, socket.remotePort)
  }

  onClose(socket) {
    console.log("onClose", socket.remoteAddress, socket.remotePort)
  }

  // Distribute 접속 함수
  connectToDistributor (host, port, onNoti) {

    // Distributor 전달 패킷
    let packet = {
      uri: "/distributes",
      method: "POST",
      key: 0,
      params: this.context
    }

    let isConnectedDistributor = false

    this.clientDistributor = new tcpClient(
      host,
      port,
      (options) => {
        isConnectedDistributor = true
        this.clientDistributor.write(packet)
      },
      (options, data) => { onNoti(data) },
      (options) => { isConnectedDistributor = false },
      (options) => { isConnectedDistributor = false }
    )

    // 주기적으로 재접속 시도
    setInterval(() => {
      if(isConnectedDistributor !== true) {
        this.clientDistributor.connect()
      }
    }, 3000)
  }
}

module.exports = tcpServer