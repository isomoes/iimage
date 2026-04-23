import { useEffect, useState } from 'react'
import { initStore } from './store'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TaskGrid from './components/TaskGrid'
import InputBar from './components/InputBar'
import DetailModal from './components/DetailModal'
import Lightbox from './components/Lightbox'
import SettingsModal from './components/SettingsModal'
import ConfirmDialog from './components/ConfirmDialog'
import Toast from './components/Toast'

async function checkForAppUpdate() {
  const currentUrl = new URL(window.location.href)
  currentUrl.hash = ''
  currentUrl.searchParams.set('__version_check', Date.now().toString())

  const response = await fetch(currentUrl.toString(), {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, max-age=0',
      Pragma: 'no-cache',
    },
  })
  if (!response.ok) return

  const html = await response.text()
  const match = html.match(/<meta\s+name=["']app-version["']\s+content=["']([^"']+)["']/i)
  const latestVersion = match?.[1]
  if (latestVersion && latestVersion !== __APP_VERSION__) {
    window.location.reload()
  }
}

export default function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      try {
        await checkForAppUpdate()
        await initStore()
      } finally {
        if (!cancelled) setIsReady(true)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  if (!isReady) return null

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-48">
        <SearchBar />
        <TaskGrid />
      </main>
      <InputBar />
      <DetailModal />
      <Lightbox />
      <SettingsModal />
      <ConfirmDialog />
      <Toast />
    </>
  )
}
