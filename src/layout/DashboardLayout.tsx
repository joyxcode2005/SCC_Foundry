import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="container px-8 py-8 mx-auto">
                    {/* The Outlet renders the nested route components */}
                    <Outlet />
                </div>
            </main>
        </div>
    )
}