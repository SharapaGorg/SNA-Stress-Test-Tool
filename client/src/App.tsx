import React, {useState} from 'react';
import {io} from "socket.io-client";
import {StartAttackButton, TextField} from "./components";

const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL);

const startAttack = (target: string) => {
    if (!target.trim()) {
        alert("Please enter a target!");
        return;
    }

    socket.emit('startAttack', {
        target
    })
}

function App() {
    const [target, setTarget] = useState('');

    return (
        <div className="control-panel-container">
            <div className="header">Stress-Test Control Panel</div>

            <TextField
                placeholder="Enter target URL"
                value={target}
                onChange={setTarget}
            />

            <StartAttackButton onClick={() => {
                startAttack(target)
            }}/>
        </div>
    );
}

export default App;
