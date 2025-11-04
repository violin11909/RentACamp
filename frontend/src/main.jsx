import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Camp from "./Pages/CampPage/Camp.jsx";
import Login from "./Pages/LogininPage/Login.jsx";
import Signup from "./Pages/SignupPage/Signup.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import GoogleMapContainer from "./Pages/GoogleMap/GoogleMapContainer.jsx";
import BookListPage from "./Pages/BookListPage/BookListPage.jsx";
import Book from './Pages/BookPage/Book.jsx';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext.jsx'; // 👈 1. Import
const queryClient = new QueryClient()

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "/",
        Component: Login,
      },
      {
        path: "/camp",
        Component: Camp,
      },
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/homepage",
        Component: HomePage
      },
      {
        path: "/map-container",
        Component: GoogleMapContainer
      },
      {
        path: "/booklistpage",
        Component: BookListPage
      },
      {
        path: "/bookpage",
        Component: Book
      }
    ]
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
