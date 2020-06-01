import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

class User extends Component {

    signup = () => {}
    register = () => {}
    deregister = () => {}
    
    render() {
        return(
            <div>
                <div>
                    <form action="POST" onsubmit="">
                        <label for="name">이름</label>
                        <input type="text" id="nane"/><br>
                        <label for="address">주소</label>
                        <input type="text" id="address"/><br>
                        <button type="submit" value="submit">등록</button>
                    </form>
                </div>
                <div>
                    <p>Contract 주소: </p>
                    <p>내 이름: </p>
                    <p>내 주소: </p>
                    <form onsubmit="">
                        <label for="name">조회승인 요청</label>
                        <input type="text" id="nane"/>
                        <button type="submit" value="submit">등록</button><br>
                        <label for="address">조회해제 요청</label>
                        <input type="text" id="address"/>
                        <button type="submit" value="submit">해제</button><br>
                    </form>
                </div>
            </div>
        );
    }
}