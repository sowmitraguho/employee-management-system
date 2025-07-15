import { createBrowserRouter } from "react-router"
import MainLayout from "../../Layouts/MainLayout/MainLayout"
import Home from "../../Pages/Home/Home"
import About from "../../Pages/About/About"
import Register from "../../Pages/Authentication/Register"
import SignIn from "../../Pages/Authentication/SignIn"
import Dashboard from "../../Pages/Dashboard/Dashboard"
import PrivateRoute from "../PrivateRoute/PrivateRoute"
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout"
import EmployeeWorksheet from "../../Pages/EmployeeSection/EmployeeWorkSheet/EmployeeWorksheet"
import PaymentHistory from "../../Pages/EmployeeSection/EmployeePaments/PaymentHistory"

const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, Component: Home },
            { path: "about", Component: About },
            { path: "register", Component: Register },
            { path: "login", Component: SignIn },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout/>
        </PrivateRoute>,
        children: [
            {index: true, Component: Dashboard},
            {path: 'worksheet/:email', Component: EmployeeWorksheet},
            {path: 'paymenthistory/:email', Component: PaymentHistory}
        ]
    }
])

export default routes;