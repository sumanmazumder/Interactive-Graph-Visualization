import { useEffect, useState } from "react";

const Header = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        document.documentElement.classList.add('light');
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        console.log(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
    }

    return (
        <>
            <div className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b items-center">
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <h1 className="text-2md pl-8 dark:text-white">Interactive Graph Visualization</h1>
                </div>
                <button onClick={toggleDarkMode} className='w-9 h-9 rounded-full flex justify-center items-center bg-amber-500 mr-5'>
                    <i className={`bx bx-${darkMode ? 'moon' : 'sun'} text-lg lg:text-xl`}></i>
                </button>
            </div>
        </>
    )
}
export default Header