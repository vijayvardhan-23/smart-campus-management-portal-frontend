import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useAuth, AuthProvider } from './AuthContext'
import { apiConfigured } from './api'
import { LayoutDashboard, BookOpen, CalendarDays, ClipboardCheck, GraduationCap, Megaphone, MessageSquareText, PartyPopper, Users, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import ModulePage from './pages/ModulePage.jsx'
import UsersPage from './pages/UsersPage.jsx'

const modules = [
  ['courses','Courses',BookOpen], ['enrollments','Enrollments',GraduationCap],
  ['attendance','Attendance',ClipboardCheck], ['results','Results',GraduationCap],
  ['timetable','Timetable',CalendarDays], ['announcements','Announcements',Megaphone],
  ['requests','Service Requests',MessageSquareText], ['events','Campus Events',PartyPopper]
]

function Shell({ children }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const links = [['/', 'Dashboard', LayoutDashboard], ...modules.map(([slug,label,Icon]) => [`/${slug}`,label,Icon])]
  if (user?.role === 'ADMIN') links.push(['/users','Users',Users])
  return <div className="app-shell">
    <aside className={`sidebar ${open?'sidebar-open':''}`}>
      <div className="brand"><div className="brand-icon">SC</div><div><b>Smart Campus</b><small>Student Services Portal</small></div><button className="icon-btn mobile-close" onClick={()=>setOpen(false)}><X size={18}/></button></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav>{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="user-avatar">{String(user?.full_name||user?.fullName||'V').slice(0,1).toUpperCase()}</div><div className="user-meta"><b>{user?.full_name||user?.fullName||'Vijay Kumar'}</b><small>Sample student</small></div></div>
    </aside>
    {open && <div className="mobile-overlay" onClick={()=>setOpen(false)} />}
    <main className="main-area"><header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setOpen(true)}><Menu size={20}/></button><div><span className="breadcrumb">Campus / </span><strong>Workspace</strong></div><span className="online"><i/> Connected</span></header><div className="page-content">{children}</div></main>
  </div>
}

function PortalRoutes() {
  const { user } = useAuth()
  return <Routes>
    <Route path="/" element={<Shell><Dashboard/></Shell>}/>
    {modules.map(([slug,label])=><Route key={slug} path={`/${slug}`} element={<Shell><ModulePage module={slug} title={label}/></Shell>}/>)}
    <Route path="/users" element={user?.role==='ADMIN'?<Shell><UsersPage/></Shell>:<Navigate to="/" replace/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}

function DemoPortal() {
  const { user, loading, error, connectDemo } = useAuth()
  if (loading) return <div className="center-screen">Loading sample student and campus data…</div>
  if (!user) return <main className="center-screen"><section className="panel"><h2>Campus demo is unavailable</h2><p>{error}</p><p>{apiConfigured ? 'Check that the backend is running and try again.' : 'Set VITE_API_BASE_URL in Vercel to your public backend URL, then redeploy.'}</p><button className="primary-btn" onClick={connectDemo}>Retry connection</button></section></main>
  return <PortalRoutes/>
}

export default function App() {
  return <AuthProvider><DemoPortal/></AuthProvider>
}
