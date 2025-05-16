import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";
import {StartAttackButton, TextField, LogsArea} from "./components";

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

type Stats = {
    log: string,
    bots: number
}

function App() {
    const [target, setTarget] = useState('');
    const [logs, setLogs] = useState([]);

    const addLog = (message: string) => {
        setLogs((prev) => [{
            level: "info",
            content: message
        }, ...prev].slice(0, 12));
    };

    useEffect(() => {
        const handleStats = (data: Stats) => {
            console.log('ADD SOME STATS', data);
            addLog(data.log);
        };

        socket.on('stats', handleStats);

        return () => {
            socket.off('stats', handleStats);
        };
    }, []);



    return (
        <div className="control-panel-container">
            <div className="header">Stress-Test Control Panel</div>

            <TextField
                placeholder="Enter target URL"
                value={target}
                onChange={setTarget}
            />

            <LogsArea logs={logs}/>

            <StartAttackButton onClick={() => {
                startAttack(target)
            }}/>
        </div>
    );
}

export default App;
