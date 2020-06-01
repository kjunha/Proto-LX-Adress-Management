import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

class Corp extends Component {
    render() {
        return(
            <div>
                <div>
                    <form action="POST" onsubmit="">
                        <label for="name">사용자 이름</label>
                        <input type="text" id="name">
                        <button type="submit" value="submit">조회</button>
                    </form>
                </div>
                <div>
                    <p>이름: </p>
                    <p>주소: </p>
                </div>
            </div>
        );
    }
}