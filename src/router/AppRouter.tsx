import { createBrowserRouter } from "react-router"
import LayoutPage from "../app/layout/LayoutPage"
import HomePage from "../app/home/HomePage"
import ProductosPage from "../app/products/ProductsPage"

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPage />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/productos",
                element: <ProductosPage />
            }
        ]
    }
])

export default AppRouter
