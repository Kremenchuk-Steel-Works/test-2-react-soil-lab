import { createBrowserRouter, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { UnAuthRoute } from "./UnAuthRoute"

import LoginPage from "../pages/LoginPage"
import MainPage from "../pages/MainPage"

import SpectralAnalysisList from "../pages/SpectralAnalysis/List"
import SpectralAnalysisAdd from "../pages/SpectralAnalysis/Add"
import SpectralAnalysisLayout from "../pages/SpectralAnalysis/Layout"

import StreamlitPage from "../pages/StreamlitPage"

export const PATHS = {
  LOGIN: "/login",
  MAIN: "/",
  SPECTRAL_ANALYSIS: "/spectral_analysis",
  STREAMLIT: "/streamlit",
}

export const router = createBrowserRouter([
  {
    path: PATHS.LOGIN,
    element: (
      <UnAuthRoute>
        <LoginPage />
      </UnAuthRoute>
    ),
  },
  {
    path: PATHS.MAIN,
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: PATHS.SPECTRAL_ANALYSIS,
    element: (
      <ProtectedRoute allowedPermissions={["spectral_analysis_view"]}>
        <SpectralAnalysisLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SpectralAnalysisList /> },
      {
        path: "add",
        element: (
          <ProtectedRoute allowedPermissions={["spectral_analysis_add"]}>
            <SpectralAnalysisAdd />
          </ProtectedRoute>
        ),
      },
      // { path: ":id", element: <SpectralAnalysisDetail /> },
      // { path: ":id/edit", element: <SpectralAnalysisEdit /> },
    ],
  },
  {
    path: PATHS.STREAMLIT,
    element: (
      <ProtectedRoute>
        <StreamlitPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to={PATHS.MAIN} replace />,
  },
])
