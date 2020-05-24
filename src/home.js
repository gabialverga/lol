import React from 'react';
import './App.css';
import iconsChampions from './iconsChampions.json'
import { Link } from 'react-router-dom';

import champions from './attChampions.json'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.listBusca = [];
        this.state = {
            items: [],
            currentItem: {
                text: '1',
                lane: 'middle',
                key: Date.now()
            }
        }
        this.handleInputChamp = this.handleInputChamp.bind(this);
        this.handleInputLane = this.handleInputLane.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    handleInputChamp(e) {
        this.setState({
            currentItem: {
                text: e.target.value,
                lane: this.state.currentItem.lane,
                key: Date.now()
            }
        });
    }

    handleInputLane(e) {
        this.setState({
            currentItem: {
                text: this.state.currentItem.text,
                lane: e.target.value,
                key: Date.now()
            }
        });
    }

    addItem(e) {
        e.preventDefault();
        const newItem = this.state.currentItem;
        if (newItem.text !== "") {
            const newItems = [...this.state.items, newItem];
            this.setState({
                items: newItems,
                currentItem: {
                    text: '1',
                    lane: 'middle',
                    key: Date.now()
                }
            });
        }
    }

    deleteItem(key) {
        const filteredItens = this.state.items.filter(item => item.key !== key);
        this.setState({ items: filteredItens });
    }

    render() {
        return (
            <div className="App">
                <header>
                    <h1 className="text-center">LOL Data</h1>
                    <form class="d-flex" onSubmit={this.addItem}>
                        <div className="col-5 pl-0">
                            <select className="form-control" value={this.state.currentItem.text} onChange={this.handleInputChamp}>
                                {
                                    Object.entries(champions).map(c => {
                                        let key = c[0]
                                        let value = c[1]
                                        return <option value={key}>{value}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-5 pl-0">
                            <select className="form-control" value={this.state.currentItem.lane} onChange={this.handleInputLane}>
                                <option value="middle">Mid</option>
                                <option value="top">Top</option>
                                <option value="jungle">Jungle</option>
                                <option value="bottom">Adc</option>
                                <option value="support">Suporte</option>
                            </select>
                        </div>
                        <button className="btn btn-primary col-2" type="submit">Adicionar</button>
                    </form>
                </header>
                <div class="mt-3 w-100 d-flex flex-wrap">
                    {this.state.items.map(champ => {
                        return <div className="d-flex p-1 col-4" key={champ.key}>
                            <div className="d-flex pl-2 pr-1 py-1 justify-content-between align-items-center w-100 border-bonita">
                            <img src={iconsChampions[champ.lane]} className="iconLane"></img> {champions[champ.text]}
                                <button class="btn btn-primary rounded-circle" onClick={() => this.deleteItem(champ.key)} >X</button>
                            </div>
                        </div>
                    })}
                </div>
                <Link to={{
                    pathname: '/busca',
                    items: this.state.items
                }}>
                    <button className="btn btn-primary mt-3 w-100" type="submit">Buscar</button>
                </Link>
            </div>
        );
    }
}

export default Home;
