export default function () {
    return (
        <main>
            <h1>Welcome to Vinta.js</h1>
            <p>Start editing at {__filename}</p>

            <h3>Conditional example</h3>
            {10 > 5 && <p>10 is more than 5</p>}

            <h3>Arithmetic example</h3>
            <p>1 + 1 = {1 + 1}</p>
            
            <h3>Iterable example</h3>
            {[
                "Hello,", "World!"
            ].map(str =>
                <p key={str}>{str}</p>
            )}
        </main>
    )
}