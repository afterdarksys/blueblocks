import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'BlueBlocks Explorer',
  description: 'Explore the BlueBlocks healthcare blockchain',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blueblocks-500 to-blueblocks-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">BB</span>
                    </div>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">
                      BlueBlocks Explorer
                    </span>
                  </a>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {process.env.NEXT_PUBLIC_CHAIN_NAME || 'DevNet'}
                  </span>
                </div>

                <nav className="flex items-center space-x-6">
                  <a href="/blocks" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium">
                    Blocks
                  </a>
                  <a href="/transactions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium">
                    Transactions
                  </a>
                  <a href="/validators" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium">
                    Validators
                  </a>
                  <a href="/contracts" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium">
                    Contracts
                  </a>
                  <a href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium">
                    About
                  </a>
                  <a href="/blubee" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium flex items-center">
                    <span className="mr-1">🐱</span> BluBee
                  </a>
                  <a href="/faucet" className="px-3 py-1.5 text-sm font-medium text-white bg-blueblocks-600 hover:bg-blueblocks-700 rounded-lg">
                    Faucet
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-gray-500">
                  BlueBlocks Explorer - Healthcare Blockchain
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <a href="https://docs.blueblocks.xyz" className="hover:text-gray-700">Docs</a>
                  <a href="https://github.com/blueblocks" className="hover:text-gray-700">GitHub</a>
                  <a href="/api" className="hover:text-gray-700">API</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
