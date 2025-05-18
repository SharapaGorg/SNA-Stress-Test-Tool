import {useEffect, useRef} from "react";

function randomInteger(min: number = 0, max: number = 1000000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function CounterBlock(props: {
    header: string,
    count: number
}) {
    return (
        <div className="packets-counter-container">
            <div className="counter-header">{props.header}</div>
            <div className="text-2xl">{props.count}</div>
        </div>
    )
}

export function StartAttackButton({onClick, isAttacking}) {
    return (
        <button className={`start-attack-button ${isAttacking ? 'bg-blue-600' : 'bg-red-600'}`} onClick={onClick}>
            {isAttacking ? "⏹ Stop attack" : "▶ Start attack"}
        </button>
    )
}

export function TextField(props: {
    placeholder: string,
    value: string,
    onChange?: any
}) {
    return (
        <input
            className='text-field'
            placeholder={props.placeholder}
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
        />
    )
}

export type Log = {
    datetime?: string,
    content: string,
    level: "warning" | "error" | "info" | "debug"
}

export function LogsArea(props: {
    logs: Log[]
}) {
    const reversedLogs = [...props.logs].reverse();
    const logsContainerRef = useRef<HTMLDivElement>(null);

    const logsList = reversedLogs.map(log => {
        return (
            <div className="log text-green-600" key={randomInteger()}>
                {">"} {log.content}
            </div>
        )
    })

    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTo({
                behavior: "smooth",
                top: logsContainerRef.current.scrollHeight
            })
        }
    })

    return (
        <div className="logs-area-container" ref={logsContainerRef}>
            {logsList}
        </div>
    )
}
