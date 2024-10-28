import React from 'react';
import './App.css';
import PatientList from "./patients/PatientList";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import PatientDetails from "./patients/PatientDetails";
import {ThemeProvider} from "@mui/material";
import darkTheme from "./theme/DarkTheme";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PatientList/>,
        errorElement: <ErrorPage/>,
    }, {
        path: "patients/:patientId",
        element: <PatientDetails/>,
    }
]);

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
