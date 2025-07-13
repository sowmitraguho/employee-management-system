import { createBrowserRouter } from "react-router"
import MainLayout from "../../Layouts/MainLayout/MainLayout"
import Home from "../../Pages/Home/Home"
import About from "../../Pages/About/About"

const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, Component: Home },
            { path: "about", Component: About },]
    }
])

export default routes;