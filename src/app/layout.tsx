import './globals.css'

export const metadata = {
  title: 'KEEPR - Digital Memory Keeper',
  description: 'Store and unlock your precious memories with KEEPR - secure digital memory keeper',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
