import { useEffect } from 'react'
import { Toaster } from './components/ui/sonner'
import useAuthStore from './user/store'

const Layout = ({
  children,
}: {
  children: React.JSX.Element[] | React.JSX.Element
}) => {
  const initializeToken = useAuthStore((s) => s.initializeToken)

  useEffect(() => {
    initializeToken()
  }, [])

  return (
    <>
      <div className="px-24 h-screen relative">{children}</div>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default Layout
