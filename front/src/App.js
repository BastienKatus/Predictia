import './App.css';
import Login from './components/LoginForm';
import Home from './components/Home';
import TeamTable from './components/TeamTable';
import PlayerTable from './components/PlayerTable';
import Root from './routes/root';
import Register from './components/RegisterForm'
import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {Provider} from 'react-redux'
import store from './redux/store'

function App() {
    const [username, setUsername] = useState('');
    const [money, setMoney] = useState('');
    useEffect(() => {
        document.title = 'ASI-2SBM';
    }, []);
    return (
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root username='test' money='test'/>,
    children: [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/teams_followed",
        element: <TeamTable followed='true' />,
    },
    {
        path: "/teams",
        element: <TeamTable followed='false' />,
    },
    {
        path: "/players",
        element: <PlayerTable />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    }
  ],
  },
]);

export default App;
