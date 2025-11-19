import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Camp from "./Pages/CampPage/Camp.jsx";
import Login from "./Pages/LogininPage/Login.jsx";
import Signup from "./Pages/SignupPage/Signup.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import MyGoogleMap from "./Pages/GoogleMap/MyGoogleMap.jsx";
import BookListPage from "./Pages/BookListPage/BookListPage.jsx";
import Book from './Pages/BookPage/Book.jsx';

import MainLayout from "./MainLayout.jsx";
import AuthLayout from "./AuthLayout.jsx";

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
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />
          },
          {
            path: "/signup",
            Component: Signup,
          }
        ]
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "/camp",
            children: [
              {
                index: true, 
                Component: Camp,
              },
              {
                path: "bookpage", 
                Component: Book
              },
            ]
          },
          {
            path: "/homepage",
            Component: HomePage
          },
          {
            path: "/google-maps",
            Component: MyGoogleMap
          },
          {
            path: "/booklistpage",
            Component: BookListPage
          },
          {
            path: "/bookpage/:id",
            Component: Book
          }
        ]
      },
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
