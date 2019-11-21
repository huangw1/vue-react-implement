/**
 * @Author: huangw1
 * @Date: 2019-11-21 10:39
 */

import {Component, render} from "../src/reconciler/diff";
import {h} from "../src/h";

class App extends Component {
    constructor (props) {
        super(props);

        this.state = {
            count: 0
        }
    }

    render() {
        const state = this.state;
        return (
            <div onClick={() => {
                this.setState({
                    count: ++state.count
                })
            }}>{state.count}</div>
        )
    }
}

render(<App/>, document.getElementById('diff-app'));
