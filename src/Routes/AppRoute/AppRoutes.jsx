import { createBrowserRouter } from "react-router"
import MainLayout from "../../Layouts/MainLayout/MainLayout"
import Home from "../../Pages/Frontent Side/Home/Home"
import About from "../../Pages/Frontent Side/About/About"
import Register from "../../Pages/Authentication/Register"
import SignIn from "../../Pages/Authentication/SignIn"
import Dashboard from "../../Pages/Dashboard/Dashboard"
import PrivateRoute from "../PrivateRoute/PrivateRoute"
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout"

import PaymentHistory from "../../Pages/Dashboard/EmployeeSection/EmployeePaments/PaymentHistory"
import EmployeeList from "../../Pages/Dashboard/HRSection/EmployeeList/EmployeeList"
import EmployeeDetails from "../../Pages/Dashboard/HRSection/EmployeeDetails/EmployeeDetails"
import ProgressPage from "../../Pages/Dashboard/HRSection/Progress/ProgressPage"
import AdminEmployeesPage from "../../Pages/Dashboard/AdminSection/AllEmployeeList/AdminEmployeesPage"
import PayrollPage from "../../Pages/Dashboard/AdminSection/PayrollPage/PayrollPage"

import EmployeeProfile from "../../Pages/Dashboard/EmployeeSection/EmployeeProfile/EmployeeProfile"
import UserDetails from "../../Pages/Dashboard/UserDetails"
import HomepageDataPage from "../../Pages/Dashboard/AdminSection/HomePageData/HomepageDataPage"
import NotificationsPage from "../../Pages/Dashboard/NotificationsPage"
import EmployeeWorksheet from "../../Pages/Dashboard/EmployeeSection/EmployeeWorkSheet/EmployeeWorksheet"
import ContactUs from "../../Pages/Frontent Side/ContactUs/ContactUs"
import AnalyticsReports from "../../Pages/Dashboard/AdminSection/AnalyticReports/AnalyticReports"
import HRManagement from "../../Pages/Dashboard/AdminSection/HRManagement/HRManagement"
import DepartmentPage from "../../Pages/Dashboard/AdminSection/Department/DepartmentPage"
import TaskManagement from "../../Pages/Dashboard/AdminSection/TaskManagement/TaskManagement"

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
            { path: 'payroll', Component: PayrollPage },
            { path: 'hpagedata', Component: HomepageDataPage },
            { path: 'notifications', Component: NotificationsPage },
            { path: 'hrmanagement', Component: HRManagement },
            { path: 'departments', Component: DepartmentPage },
            { path: 'tasks', Component: TaskManagement },
            { path: 'userdetails', Component: UserDetails },
            { path: 'analytics', Component: AnalyticsReports },
        ]
    }
])

export default routes;