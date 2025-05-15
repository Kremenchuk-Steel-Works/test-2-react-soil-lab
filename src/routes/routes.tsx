// routes.ts
import {
  FlaskConical,
  Database,
  type LucideIcon,
  View,
  Plus,
} from "lucide-react"
import SpectralAnalysisLayout from "../pages/SpectralAnalysis/Layout"
import SpectralAnalysisList from "../pages/SpectralAnalysis/List"
import SpectralAnalysisAdd from "../pages/SpectralAnalysis/Add"
import StreamlitPage from "../pages/StreamlitPage"

export type Permission =
  | "admin"
  | "spectral_analysis_view"
  | "spectral_analysis_add"
  | "quality_dash_view"
// …extend as you add features

export interface AppRoute {
  key: string // unique id, e.g. "spectral_analysis"
  path: string // URL segment, e.g. "/spectral_analysis"
  label: string // human‑readable name
  icon: LucideIcon // sidebar icon
  component: React.ReactNode // top‑level component or layout
  requiredPermissions: Permission[]
  children?: AppRoute[] // nested sub‑routes
}

export const APP_ROUTES: AppRoute[] = [
  {
    key: "spectral_analysis",
    path: "/spectral_analysis",
    label: "Спектральний аналіз 7657567565464",
    icon: FlaskConical,
    component: <SpectralAnalysisLayout />,
    requiredPermissions: ["spectral_analysis_view"],
    children: [
      {
        key: "spectral_analysis_list",
        path: "",
        label: "Список аналізів",
        icon: View,
        component: <SpectralAnalysisList />,
        requiredPermissions: ["spectral_analysis_view"],
      },
      {
        key: "spectral_analysis_add",
        path: "add",
        label: "Додати аналіз",
        icon: Plus,
        component: <SpectralAnalysisAdd />,
        requiredPermissions: ["spectral_analysis_add"],
      },
    ],
  },
  {
    key: "quality_dash",
    path: "/quality_dash",
    label: "Quality Dash",
    icon: Database,
    component: <StreamlitPage />,
    requiredPermissions: ["quality_dash_view"],
  },
]
