import React, { Component } from 'react';
import Tokenizer from '../abis/Tokenizer.json';
import MessageOwner from '../abis/MessageOwner.json';
import Web3 from 'web3';
//import './App.css';

class User extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        console.log("web3 may be attatched!")
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        //load the account, see web3 eth doc.
        const accounts = await web3.eth.getAccounts()
        //Set account 0 as a React state (user)
        this.setState({account: accounts[0]})
    
        //Deployed smart contract instance, taken by web3.
        //Color is defined by grabbing abi json file from /src/abis
        const networkId = await web3.eth.net.getId()
        const networkData = Tokenizer.networks[networkId]
        //Prevents app to blow up.
        if(networkData) {
          const abi = Tokenizer.abi
          const address = networkData.address
          //get contract and save it to the state
          const contract = new web3.eth.Contract(abi, address)
          this.setState({ contract });
          console.log(contract)
        } else {
          window.alert("smart contract is not deployed on this network")
        }

    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            name: '',
            address: '',
            contractId: '',
            contract: null,
            mount: null,
            received: {
                name: '',
                address: ''
            }
        }
    }

    signup = (name, address) => {
        const web3 = window.web3
        this.state.contract.methods.signup(name, address).send({from: this.state.account}).once('receipt', (receipt) => {
            this.setState({
                name: name,
                address: address
            })
            this.state.contract.methods.getOwnerAddress(this.state.name).call({from: this.state.account}).then((res) => {
                this.setState({
                    contractId: res
                })
                const abi = MessageOwner.abi
                const client = new web3.eth.Contract(abi, this.state.contractId)
                this.setState({ mount: client })
                if(this.state.mount == null) {
                    console.log("client not mounted!")
                } else {
                    console.log(this.state.mount.options.address);
                }
            })
        })
    }

    register = (id) => {
        this.state.mount.methods.register(id).send({from: this.state.account}).once('receipt', (receipt) => {
            alert(`${id} 이(가) 등록되었습니다.`)
        })
    }

    deregister = (id) => {
        this.state.mount.methods.deregister(id).send({from: this.state.account}).once('receipt', (receipt => {
            alert(`${id} 이(가) 등록해제 되었습니다.`)
        }))
    }

    getInfo = (id) => {
        this.state.mount.methods.getInfo().call({from: id}).then((res) => {
            this.setState({
                received: {
                    name: res['_name'],
                    address: res['_residence']
                }
            })
        })
    }
    
    render() {
        return(
            <div>
                <div>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        var name = this.name.value
                        var address = this.address.value
                        this.signup(name, address)
                    }}>
                        <label for="name">이름</label>
                        <input type="text" id="nane" ref={(input) => {this.name = input}}/><br/>
                        <label for="address">주소</label>
                        <input type="text" id="address" ref={(input) => {this.address = input}}/><br/>
                        <button type="submit" value="SIGNUP">등록</button>
                    </form>
                </div>
                <div>
                    <p>Contract 주소: {this.state.contractId}</p>
                    <p>내 이름: {this.state.name}</p>
                    <p>내 주소: {this.state.address}</p>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        var registration = this.reg_req.value
                        this.register(registration)
                    }}>
                        <label for="name">조회승인 요청</label>
                        <input type="text" id="name" ref={(input) => {this.reg_req = input}}/>
                        <button type="submit" value="REGISTER">등록</button>
                    </form>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        var deregistration = this.dereg_req.value
                        this.deregister(deregistration);
                    }}>
                        <label for="address">조회해제 요청</label>
                        <input type="text" id="address" ref={(input) => {this.dereg_req = input}}/>
                        <button type="submit" value="DEREGISTER">해제</button>
                    </form>
                    <hr/>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        var demender = this.demender.value
                        this.getInfo(demender)
                    }}>
                        <label for="corp_id">요청기관 주소</label>
                        <input type="text" id="corp_id" ref={(input) => {this.demender = input}}/>
                        <button type="submit" value="GETINFO">조회 요청</button>
                    </form>
                    <p>이름: {this.state.received.name}</p>
                    <p>주소: {this.state.received.address}</p>
                </div>
            </div>
        );
    }
}

export default User;