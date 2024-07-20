'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'

export default function Home() {
    const [url, setUrl] = useState<string>('')
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data: { imageSrc?: string; error?: string } =
                await response.json()
            if (data.imageSrc) {
                setImageSrc(data.imageSrc)
                setError(null)
            } else {
                setError(data.error || 'Image source not found')
                setImageSrc(null)
            }
        } catch (error) {
            console.error('Error:', error)
            setError('Failed to parse URL')
            setImageSrc(null)
        }
    }

    return (
        <div>
            <h1>Image Source Extractor</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    required
                />
                <button type="submit">Extract Image Source</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageSrc && (
                <div>
                    <h2>Extracted Image:</h2>
                    <Image
                        src={imageSrc}
                        alt="Extracted"
                        style={{ maxWidth: '100%' }}
                    />
                    <p>Image source: {imageSrc}</p>
                </div>
            )}
        </div>
    )
}
