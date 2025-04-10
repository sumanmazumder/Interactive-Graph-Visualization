import './App.css'
import 'boxicons'
import AppRoutes from "./AppRoutes";
import { Provider } from "react-redux";
import { store } from './reducers/store';

function App() {
  return (
    <>
      <div className='min-h-screen bg-neutral-100 dark:bg-neutral-950 relative transation-colors duration-900'>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </div>
    </>
  )
}

export default App
