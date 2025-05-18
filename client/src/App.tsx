import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";
import {StartAttackButton, TextField, LogsArea, PacketsCounter, CounterBlock} from "./components";

const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL);

const stopAttack = () => {
    socket.emit('stopAttack');
}

type Stats = {
    log: string,
    bots: number,
    totalPackets?: number
}

function App() {
    const [target, setTarget] = useState('');
    const [logs, setLogs] = useState([]);
    const [isAttacking, setIsAttacking] = useState(false);
    const [totalPackets, setTotalPackets] = useState(0);

    const addLog = (message: string) => {
        setLogs((prev) => [{
            level: "info",
            content: message
        }, ...prev].slice(0, 12));
    };

    const startAttack = (target: string) => {
        if (!target.trim()) {
            alert("Please enter a target!");
            return;
        }

        setIsAttacking(true);

        socket.emit('startAttack', {
            target
        })

    }

    useEffect(() => {
        socket.on('stats', (data: Stats) => {
            console.log('ADD SOME STATS', data);
            if (data.totalPackets) {
                setTotalPackets(data.totalPackets);
            }

            addLog(data.log);
        });

        socket.on("attackEnd", () => {
            setIsAttacking(false);
        })

        return () => {
            socket.off('stats');
            socket.off('attackEnd');
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

            <div className="grid grid-cols-2 w-ful gap-x-4">
                <CounterBlock count={totalPackets} header="Packets"/>
            </div>

            <LogsArea logs={logs}/>

            <StartAttackButton
                isAttacking={isAttacking}
                onClick={() => {
                    isAttacking ? stopAttack() : startAttack(target);
                }}/>
        </div>
    );
}

export default App;
