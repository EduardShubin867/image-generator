import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cheerio from 'cheerio'

interface ParseResponse {
    imageSrc?: string
    error?: string
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ParseResponse>
) {
    if (req.method === 'POST') {
        try {
            const { url } = req.body as { url: string }

            const response = await axios.get(url, {
                timeout: 5000, // 5 секунд таймаут
                maxContentLength: 1000000, // Ограничение размера ответа до 1MB
            })

            const html = response.data
            const $ = cheerio.load(html)

            // Ищем div с нужным классом и извлекаем значение src
            const imageSrc = $(
                'div.photo-zoom__preview.j-zoom-image.hide'
            ).attr('src')

            if (imageSrc) {
                res.status(200).json({ imageSrc })
            } else {
                res.status(404).json({ error: 'Image source not found' })
            }
        } catch (error) {
            console.error('Error parsing URL:', error)
            res.status(500).json({
                error: 'Failed to parse the URL',
                message: (error as Error).message,
            })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
