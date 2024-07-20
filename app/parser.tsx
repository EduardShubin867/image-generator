import React from 'react'

interface ParserProps {
    result: any // Можно заменить на более конкретный тип, если структура result известна
}

const Parser: React.FC<ParserProps> = ({ result }) => {
    return (
        <div>
            <h2>Parsed Result:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}

export default Parser
