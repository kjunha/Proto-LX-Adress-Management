import React, { Component } from 'react';
import ServiceHost from '../abis/ServiceHost.json';
import Client from '../abis/Client.json';
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
        const networkData = ServiceHost.networks[networkId]
        //Prevents app to blow up.
        if(networkData) {
          const abi = ServiceHost.abi
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
            this.state.contract.methods.getClientAddress(this.state.name).call({from: this.state.account}).then((res) => {
                this.setState({
                    contractId: res
                })
                const abi = Client.abi
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

    viewRegisterationLog = () => {
        this.state.contract.getPastEvents('RegisterNewClient',{
            fromBlock: 0,
            toBlock: "latest"
        }, (err, res) => { console.log(res.length) })
    }

    viewMovingLog = () => {
        this.state.mount.getPastEvents('UpdateResidentialAddress',{
            fromBlock: 0,
            toBlock: "latest"
        }, (err, res) => { res.forEach((record, index) => {
            console.log(`${index}: ${record.returnValues.residence}`)
        })
    })

    }
    
    render() {
        return(
            <div className="master">
                {/* Client Page */}
                <div class="px-3 py-3 bg-success">
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h2 class="display-4">사용자 페이지</h2>
                            <p class="lead">LX 주소혁신 프로젝트 아이디어 프론트타입 입니다. 각 사용자 이름은 중복되지 않습니다.</p>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">주소정보 등록</div>
                        <div class="card-body">
                            <form className="form-group" onSubmit={(event) => {
                                event.preventDefault()
                                var name = this.name.value
                                var address = this.address.value
                                this.signup(name, address)
                            }}>
                                <label for="name">이름</label>
                                <input type="text" className="form-control mb-3" id="nane" ref={(input) => {this.name = input}}/>
                                <label for="address">주소</label>
                                <input type="text" className="form-control mb-3" id="address" ref={(input) => {this.address = input}}/>
                                <button type="submit" className="btn btn-block btn-primary" value="SIGNUP">등록</button>
                            </form>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">등록정보 조회</div>
                        <div class="card-body">
                            <p>Contract 주소: {this.state.contractId}</p>
                            <p>내 이름: {this.state.name}</p>
                            <p>내 주소: {this.state.address}</p>
                            <button className="btn btn-block btn-primary" onClick={() => {
                                if(this.state.mount != null) {
                                    this.viewMovingLog()
                                } else {
                                    alert(`먼저 사용자 등록을 해 주세요.`)
                                }
                            }}>주소변경이력 조회</button>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">조회가능기업 등록 및 해제</div>
                        <div class="card-body">
                            <form className="form-group" onSubmit={(event) => {
                                event.preventDefault()
                                var registration = this.reg_req.value
                                this.register(registration)
                            }}>
                                <label for="name">조회승인 요청</label>
                                <div class="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Corporation Node ID" id="name" ref={(input) => {this.reg_req = input}} aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                    <div class="input-group-append">
                                        <button type="submit" className="btn pl-3 pr-3 btn-primary" value="REGISTER">등록</button>
                                    </div>
                                </div>
                            </form>
                            <form className="form-group" onSubmit={(event) => {
                                event.preventDefault()
                                var deregistration = this.dereg_req.value
                                this.deregister(deregistration);
                            }}>
                                <label for="address">조회해제 요청</label>
                                <div class="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Corporation Node ID" id="address" ref={(input) => {this.dereg_req = input}} aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                    <div class="input-group-append">
                                        <button type="submit" className="btn pl-3 pr-3 btn-danger" value="DEREGISTER">해제</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* ---------- */}
                <hr/> 

                {/* Corporation Side */}
                <div className="px-3 py-3  bg-info">
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h2 class="display-4">기업 페이지</h2>
                            <p class="lead">LX 주소혁신 프로젝트 아이디어 프론트타입 입니다. 각 사용자 이름은 중복되지 않습니다.</p>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header">개인 주소정보 조회 요청</div>
                        <div class="card-body">
                            <form className="form-group" onSubmit={(event) => {
                                event.preventDefault()
                                var demender = this.demender.value
                                this.getInfo(demender)
                            }}>
                                <label for="corp_id">요청기관 주소</label>
                                <div class="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Corporation Node ID" id="corp_id" ref={(input) => {this.demender = input}} aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                                    <div class="input-group-append">
                                        <button type="submit" className="btn pl-3 pr-3 btn-primary" value="GETINFO">조회 요청</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header">요청정보 조회</div>
                        <div class="card-body">
                            <p>이름: {this.state.received.name}</p>
                            <p>주소: {this.state.received.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;