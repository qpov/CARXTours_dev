import App from './App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Error from './pages/Error';
import Login from './pages/Login';
import Register from './pages/Register';
import Ivents from './pages/Ivents';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Grid from './pages/Grid';
import { AuthProvider } from './components/AuthContext';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TournamentPage from './pages/TournamentPage';

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
  {
    path: "/error",
    element: <Error />,
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
    path: "/ivents",
    element: <Ivents />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/tournament/:id",
    element: <TournamentPage />,
  },
  {
    path: "/tournament/:id/grid",
    element: <Grid />,
  }
]);

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();