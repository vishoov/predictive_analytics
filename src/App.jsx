import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import PrivateRoutes from './utils/PrivateRoutes.jsx'
import RoleBasedRoutes from './utils/RoleBasedRoutes.jsx'
import AdminSummary from './components/dashboard/AdminSummary.jsx'
import ReportsList from './components/reports/ReportsList.jsx'
import ReviewsList from './components/reviews/ReviewsList.jsx'
import DiseaseStatistics from './components/diagnostics/DiseaseList.jsx'
import ReportDetail from './components/reports/ReportDetails.jsx'
import ReviewReport from './components/reviews/ReviewReport.jsx'
import Users from './components/users/Users.jsx'
import Settings from './pages/Settings.jsx'
import NewReport from './components/reports/NewReport.jsx'
import GraphUpload from './components/upload/GraphUpload.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path='/login' element={<Login />} />
        
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={['admin']}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          } 
        >
          <Route index element={<AdminSummary />} />
          <Route path="diagnostics" element={<DiseaseStatistics />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="reports/:reportId" element={<ReportDetail />} />
          {/* <Route path="reports/new" element={<RestrictedFeature />} /> */}
          <Route path="reports/new" element={<NewReport />} />

          <Route path="reviews" element={<ReviewsList />} />
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="settings" element={<Settings />} />
          {/* <Route path="image-upload" element={<GraphUpload />} /> */}

          <Route path="/admin-dashboard/reports/:reportId/review" element={<ReviewReport />} />
          {/* <Route path="*" element={<Navigate to="/admin-dashboard" replace />} /> */}
        </Route>

        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
