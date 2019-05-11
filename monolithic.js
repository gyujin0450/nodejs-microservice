// REST API 서버 만들기(p62~)
// - 기본적으로 HTTP 서버임
// - 3.3.1에서 작성한 HTTP 서버에 메서드, URL별로 분기할 수 있도록 몇가지 코드를 추가함
const http = require('http')

let server = http.createServer((req, res) => {

}).listen(8000)

