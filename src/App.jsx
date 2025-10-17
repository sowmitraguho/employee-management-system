import { RouterProvider } from 'react-router'
import './App.css'
import routes from './Routes/AppRoute/AppRoutes'

function App() {

  return (
    <>

      <RouterProvider router={routes} />
    </>
  )
}

export default App
