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
    const [activeProxies, setActiveProxies] = useState(0);

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
            if (data.bots) {
                setActiveProxies(data.bots);
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

            <div className="flex gap-x-2 items-center">
                <CounterBlock count={totalPackets} header="Packets"/>
                <CounterBlock header="Proxies" count={activeProxies}/>
                <CounterBlock header="Attempts" count={10}/>
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
