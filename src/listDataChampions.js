import React, { Component } from 'react'
import axios from 'axios'
import champions from './attChampions.json'
import iconsChampions from './iconsChampions.json'
import './App.css';
import ReactHtmlParser from 'react-html-parser';

class ListDataChampions extends Component {

    constructor(props) {
        super(props);
        if (!('items' in this.props.location)) {
            window.location.assign("/");
        }
        this.state = {
            n: 10,
            items: this.props.location.items,
            champs: []
        }
        this.addItem = this.addItem.bind(this);
    }

    addItem(obj) {
        const newChamps = [...this.state.champs, obj];
        this.setState({
            n: this.state.n,
            items: this.state.items,
            champs: newChamps
        });
    }

    componentDidMount() {
        this.state.items.map(c => {
            let path = '10.10'
            let url = 'https://api.op.lol/champion/2/?patch=' + path + '&cid=' + c.text + '&lane=' + c.lane + '&tier=diamond_plus&queue=ranked&region=kr';
            axios.get(url)
                .then(resp => {
                    let laneOrder = 'enemy_' + c.lane;
                    let dt = resp.data.display[laneOrder];
                    let winRate = parseFloat(resp.data.display.winRate);
                    let pick = resp.data.display.pick;

                    let x = dt.map((row) => [
                        row[0],
                        ((row[2] / row[1]) * 100).toFixed(2),
                        ((row[2] / row[1]) * 100 + row[3] - 100).toFixed(2),
                        ((row[1] / pick) * 100).toFixed(2),
                        row[1].toLocaleString(),
                        ((row[2] / row[1]) * 100 - (winRate / (row[3] + winRate) * 100)).toFixed(2)])

                    let n = x.filter(row => parseFloat(row[3]) >= 0.5)

                    let championData = {
                        cid: c.text,
                        lane: c.lane,
                        strong: n.sort((a, b) => {
                            if (parseFloat(b[1]) == parseFloat(a[1])) {
                                return parseFloat(b[4]) - parseFloat(a[4])
                            } else {
                                return parseFloat(b[1]) - parseFloat(a[1])
                            }
                        }).slice(0, this.state.n),
                        weak: n.sort((a, b) => {
                            if (parseFloat(b[1]) == parseFloat(a[1])) {
                                return parseFloat(b[4]) - parseFloat(a[4])
                            } else {
                                return parseFloat(a[1]) - parseFloat(b[1])
                            }
                        }).slice(0, this.state.n)
                    }

                    this.addItem(championData);
                })
                .catch(error => {
                    console.log(error)
                });
        });
    }

    render() {
        let trHeader = '';
        let trChamps = [];
        this.state.champs.map(champ => {
            trHeader += '<th class="text-center">Forte</th><th class="text-center">Fraco</th>';
            for (let i = 0; i < this.state.n; i++) {
                if (trChamps.length <= i) {
                    trChamps.push('');
                }
                trChamps[i] += '<td class="text-center p-2"><p class="font-weight-bold m-0">' + champ.strong[i][1].toString() + '%</p><img src=' + iconsChampions[champ.strong[i][0].toString()] + ' class="icon2"></img><p class="font-weight-bold m-0">' + champions[champ.strong[i][0].toString()] + '</p></td><td class="text-center p-2"><p class="font-weight-bold m-0">' + champ.weak[i][1].toString() + '%</p><img src=' + iconsChampions[champ.weak[i][0].toString()] + ' class="icon2"></img><p class="font-weight-bold m-0">' + champions[champ.weak[i][0].toString()] + '</p></td>'
            }
        });

        return (
            <div className="App">
                <h2 className="text-center">Campeões</h2>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                    <table class="mw-100 table-bordered table-striped mb-0">
                        <thead>
                            <tr>
                                {this.state.champs.map(champ => {
                                    return <th colspan="2" className="text-center">
                                        <img src={iconsChampions[champ.cid]} className="iconChamp"></img>
                                    </th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {this.state.champs.map(champ => {
                                    return <td colspan="2" className="text-center">
                                        <img src={iconsChampions[champ.lane]} className="iconLane"></img>
                                    </td>
                                })}
                            </tr>
                            <tr>
                                {ReactHtmlParser(trHeader)}
                            </tr>
                            {trChamps.map(l => {
                                return <tr>
                                    {ReactHtmlParser(l)}
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ListDataChampions;