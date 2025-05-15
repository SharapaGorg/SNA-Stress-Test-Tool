import { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <header>
                <h1>SNA Stress Test Tool</h1>
            </header>
            <main>
                <p>Welcome to the Stress Test Tool!</p>
                <button onClick={() => setCount((count) => count + 1)}>
                    Count is: {count}
                </button>
            </main>
        </div>
    );
}

export default App;
