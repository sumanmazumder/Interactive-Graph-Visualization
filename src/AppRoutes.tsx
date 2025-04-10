import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Dashboard } from './pages/dashboard/Dashboard';
import Main from "./pages/Main";
import { InflowGraph } from "./pages/dashboard/InflowGraph";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Main />}>
                    <Route index path="/" element={<Dashboard />} />
                    <Route index path="inflowGraph" element={<InflowGraph />} />
                </Route>
            </Routes>
        </Router>

    )
}
export default AppRoutes