import { RouterProvider } from "react-router"
import AppRouter from "./router/AppRouter"
import { AppProviders } from "./context"

function App() {
  return (
    <AppProviders>
      <RouterProvider router={AppRouter} />
    </AppProviders>
  )
}

export default App
