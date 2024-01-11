import './App.css';
import Login from './components/LoginForm';
import Home from './components/Home';
import Team from './components/Team';
import TeamTable from './components/TeamTable';
import CompetitionTable from './components/CompetitionTable';
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
    useEffect(() => {
        document.title = 'Predictia';
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
        path: "/teams/:id",
        element: <TeamTable followed='false' />,
    },
    {
        path: "/team/:id",
        element: <Team />,
    },
    {
        path: "/competitions",
        element: <CompetitionTable />,
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
