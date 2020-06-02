#LX 주소혁신 프로젝트 프로젝트
개발자: 김준하
<br/>

기능
----
+ 사용자가 입력한 이름과 주소를 새로운 스마트계약에 저장
+ 사용자가 기존에 등록한 동일한 이름을 사용하고 다른 주소를 사용할 시 기존 스마트계약의 주소정보 업데이트
+ Host가 주소정보 요청시 별도 조회가능기업 등록 없이 조회 가능
+ 일반 기업이 주소정보 요청시 각 개인에게 조회가능기업으로 등록되어 있다면 조회 가능.
+ 개인에게 조회가능기업으로 등록되지 않은 기업은 해당 개인에게 개인주소정보 조회 불가.

프로토타입 전제조건
----
- 본 시스템의 이용자를 1. 주소정보를 등록하여 사용하는 개인, 2. 주소정보를 요청하여 사용하는 기업, 3. 한국국토정보공사 (시스템 Host)로 전제하였습니다.
- Ganache 로컬 블록체인 네트워크에서 제공하는 각 계정의 역할을 다음과 같이 전제했습니다.<br/>
0번 계정: 한국 국토정보공사 (Host)<br/>
1~n번 계정: 주소정보를 요청하는 기업체들
- 각 개인은 고유한 이름을 가지고 있으며, 같은 이름을 가진 사람은 없다고 전제하였습니다. 

요구사항
----
+ Chrome 웹 브라우저
+ git LTS 버전
+ node, npm LTS 버전
+ Ganache 로컬 블록체인 네트워트 [Ganache 다운로드](https://www.trufflesuite.com/ganache, "ganache downloader")
+ Chrome 웹 브라우저 MetaMask Extention [MetaMask 다운로드](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ko, "Metamask downloader")

설치방법
----
1. 저장소를 복제한다.
2. 복제한 저장소가 있는 디렉토리로 이동
3. npm install 으로 필요한 패키지들을 다운받는다. <br/> (truffle.js 는 글로벌 환경에 설치 권장)
```
npm install -g --save truffle
```
4. Ganache 실행 후 Quick Start 클릭
5. RPC server 7545 포트 번호 확인
6. MetaMask 실행 후 좌측상단 원형 계정 프로필 클릭 후 계정 가져오기 클릭
7. Ganache 화면의 0번 인덱스 계정의 열쇠모양 아이콘 클릭 후 Private Key 복사하기
8. 계정 가져오기 개인키 입력
9. MetaMask 좌측 상단 원형 계정 프로필 아이콘 > 설정 > 네트워크
10. 좌측 상단 네트워크 추가 클릭, 적당한 네트워크 이름 입력 (로컬 Ganache)
11. 새로운 RPC URL에 HTTP://127.0.0.1:7545 입력 (5번에서 확인한 RPC 주소)
12. 이후에 우측 상단 MetaMask 로고 클릭 후 죄측 상단 네트워크 Dropdown 목록에서 새로 추가한 네트워크 선택
13. 다시 콘솔로 이동하여 복제한 저장소가 있는 디렉토리에서 truffle migrate 실행.
```
truffle migrate
//이미 한번 마이그레이션 한 경우 --reset 플레그를 이용
truffle migrate --reset
```
14. 콘솔에서 npm start 실행
```
npm start
```
15. http:127.0.0.1:3000 혹은 localhost:3000 에서 어플리케이션 화면 확인