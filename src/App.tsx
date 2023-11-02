import MainLayout from 'layouts/MainLayout'

import Route from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from 'components/Spinner'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

function App() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  return (
    <div className='App'>
      {isFetching + isMutating !== 0 && <Spinner />}
      <ToastContainer />
      <MainLayout>
        <Route />
      </MainLayout>
    </div>
  )
}

export default App
