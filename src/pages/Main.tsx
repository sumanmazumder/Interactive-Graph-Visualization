import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import Header from '../common/components/Headers';
import { SidebarPanel } from '../common/components/Sidebar';


export default function Main() {
    return (
        <>
            <div className='sidePanel fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200 w-[290px]'>
                <SidebarPanel />
            </div>
            <div className='body flex-1 transition-all duration-300 ease-in-out lg:ml-[290px]'>
                <Header />
                <div className='outlet relative'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
