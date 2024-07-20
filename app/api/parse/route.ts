import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

interface ParseResponse {
    imageSrc?: string
    error?: string
    message?: string
}

export async function POST(req: NextRequest) {
    try {
        const reqData = await req.json()
        const { url } = reqData

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url, {
            waitUntil: 'networkidle2', // Ждём загрузки всех сетевых запросов
        })

        // Выполняем JavaScript код на странице и получаем значение src
        const imageSrc = await page.evaluate(() => {
            const imageElement = document.querySelector(
                'img.photo-zoom__preview.j-zoom-image.hide'
            )
            return imageElement ? imageElement.getAttribute('src') : null
        })

        await browser.close()

        if (imageSrc) {
            return NextResponse.json({ imageSrc })
        } else {
            return NextResponse.json(
                { error: 'Image source not found' },
                { status: 404 }
            )
        }
    } catch (error) {
        console.error('Error parsing URL:', error)
        return NextResponse.json(
            {
                error: 'Failed to parse the URL',
                message: (error as Error).message,
            },
            { status: 500 }
        )
    }
}
