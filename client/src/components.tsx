export function StartAttackButton({onClick}) {
    return (
        <button className="start-attack-button" onClick={onClick}>
            Start attack
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
