import './App.css';
import Login from './components/LoginForm';
import Search from './components/Search';
import Home from './components/Home';
import Team from './components/Team';
import TeamTable from './components/TeamTable';
import FollowTeams from './components/FollowTeams';
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
import UserProfile from './components/UserProfile';
import Simulation from "./components/Simulation";

function App() {
    useEffect(() => {
        document.title = 'Predictia';
    }, []);

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
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
        path: "/teams/:id",
        element: <TeamTable />,
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
        path: "/follow_teams/:id",
        element: <FollowTeams />,
    },
    {
        path: "/search/:search",
        element: <Search />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
      path: "/simulation",
      element: <Simulation />,
    },
    {
        path: "/profile/:id",
        element: <UserProfile />,
    }
  ],
  },
]);

export default App;
