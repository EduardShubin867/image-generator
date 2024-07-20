export default function Parser({ result }) {
    return (
        <div>
            <h2>Parsed Result:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}
