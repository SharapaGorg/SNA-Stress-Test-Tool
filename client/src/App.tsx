import {useState} from 'react';


function StartAttackButton() {
    return (
        <button className="start-attack-button">
            Start attack
        </button>
    )
}

function TextField(props: {
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

            <StartAttackButton/>
        </div>
    );
}

export default App;
