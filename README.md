# 탈중앙화 어플리케이션 Quick Starter
## Truffle.js를 이용한 Solidity 어플리케이션 개발 및 테스팅 및 로컬 Gnache 서버에서의 배포
Framework 버전정보
----
버전정보 확인 필수!
```
Node v8.11.2
npm v5.6.0
Solidity v0.5.12 //^0.5.0 가능
Truffle v5.0.44
Web3.js v1.2.2
```
필수 Truffle.js 명령어
----
컴파일
```
truffle compile
```
마이그레이션
```
//새로운 마이그레이션
truffle migration
//기존 마이그레이션 업데이트
truffle migration --reset
```
콘솔창
```
truffle console
//종료
> .exit
```
Dapp 개발 Lifecycle
----
1. 솔리디티 파일 작성. 리믹스 테스트환경에서 코드 무결성 확인 [Rimix](https://remix.ethereum.org/, "rimix link")
(플러그인 추가에서 DEPLOY & RUN TRANSACTIONS 만 추가하면 됨)
2. 마이그레이션 파일 작성. 마이그레이션 파일 제목은 마이그레이션 순서를 나타내는 번호로 함
3. 테스팅 혹은 로컬 테스트넷(Gnache) 환경에서 실행
    + test 폴더 안에 테스트.js 파일 작성
    + truffle-config.js 설정내용 확인
    + truffle test 로 테스트 </br>
혹은</br>
    + truffle compile 로 컴파일함
    + truffle migration 으로 마이그레이션 함
    + (마이그레이션 수정 없이 Solidity 만 수정된 경우 --reset 옵션 사용함)
    + truffle console 에서 실행가능

기타 개발 팁
----
블록체인 구조특성상 트렌잭션을 수행하는데 시간이 오래 걸리므로 async 키워드를 사용하여 비동기 호출함
예를들어 콘솔에서나 테스팅에서 계약을 불러올 시 (함수리턴값을 변수에 할당할때도 동일)
```javascript
const contract = async <ContractName>.deployed()
```
리턴값이 없는 함수를 호출할 때
```javascript
async contract.<function>();
async contract.<function>.call();
```
Payable 함수와 non-payable 함수의 호출시
```javascript
send(uint amount); //payable 함수
call(parameter); //view, pure 함수
```