import { useState } from "react";
import { Link } from "react-router-dom";

const SidebarPanel = () => {
    const [activeTab, setActiveTab] = useState('outFlow');

    return (
        <div className="">
            <h1 className="dark:text-white text-center py-8">Toggle Visible Track Node</h1>
            <label className="dark:text-white text-sm">Add Wallet Address</label>
            <form className="mt-5 flex flex-row">
                <input className="pl-5 text-gray border-1 border-solid rounded-sm border-indigo-500 h-10 basis-64 w-10" placeholder="Enter wallet address" />
                <button className="grow-1 basis-20 w-full bg-amber-500 text-white py-1 px-2 rounded hover:bg-amber-800">Add</button>
            </form>
            <div className="w-100% mt-5 bg-gray-800 text-white flex flex-row p-4">
                <Link onClick={() => setActiveTab('inFlow')} className={`py-2 px-3 rounded text-left transition ${activeTab === 'inFlow' ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`} to="./inflowGraph">INFLOWS</Link>
                <Link onClick={() => setActiveTab('outFlow')} className={`py-2 px-3 rounded text-left transition ${activeTab === 'outFlow' ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`} to="./">OUTFLOWS</Link>
            </div>
        </div>
    )
}
export { SidebarPanel }