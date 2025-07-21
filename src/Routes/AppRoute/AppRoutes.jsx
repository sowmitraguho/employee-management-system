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
import EmployeeList from "../../Pages/HRSection/EmployeeList/EmployeeList"
import EmployeeDetails from "../../Pages/HRSection/EmployeeDetails/EmployeeDetails"
import ProgressPage from "../../Pages/HRSection/Progress/ProgressPage"
import AdminEmployeesPage from "../../Pages/AdminSection/AllEmployeeList/AdminEmployeesPage"
import PayrollPage from "../../Pages/AdminSection/PayrollPage/PayrollPage"
import ContactUs from "../../Pages/ContactUs/ContasctUs"
import EmployeeProfile from "../../Pages/EmployeeSection/EmployeeProfile/EmployeeProfile"

const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, Component: Home },
            { path: "about", Component: About },
            { path: "contactus", Component: ContactUs },
            { path: "register", Component: Register },
            { path: "login", Component: SignIn },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>,
        children: [
            { index: true, Component: Dashboard },
            { path: 'worksheet/:email', Component: EmployeeWorksheet },
            { path: 'paymenthistory/:email', Component: PaymentHistory },
            { path: 'employeelist', Component: EmployeeList },
            { path: 'employeedetails/:email', Component: EmployeeDetails },
            { path: 'progress', Component: ProgressPage },
            { path: 'adminemployeelist', Component: AdminEmployeesPage },
            { path: 'employeeprofile', Component: EmployeeProfile },
            { path: 'payroll', Component: PayrollPage }
        ]
    }
])

export default routes;