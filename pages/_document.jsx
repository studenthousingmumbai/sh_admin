import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
    return (
      <Html className="h-full antialiased bg-gray-100" lang="en">
        <Head>
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
        </Head>
        <body className='h-full overflow-auto overflow-x-hidden'>
            <Main />
            <NextScript />
        </body>
      </Html>
    )
}