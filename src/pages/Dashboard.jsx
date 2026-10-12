import { useEffect, useState } from 'react'
import { ArrowUpRight, BookOpen, CalendarDays, ClipboardList, MessageSquareText, Megaphone, PartyPopper } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'

const cards = [
  ['courses','Courses',BookOpen,'/courses'],
  ['announcements','Announcements',Megaphone,'/announcements'],
  ['events','Campus events',PartyPopper,'/events'],
  ['requests','Service requests',MessageSquareText,'/requests']
]

export default function Dashboard() {
  const { user } = useAuth()
  const [data,setData] = useState(null)
  const [error,setError] = useState('')
  useEffect(() => { api.get('/dashboard').then(r => setData(r.data)).catch(e => setError(errorMessage(e))) }, [])

  return <>
    <div className="welcome-row">
      <div><p className="eyebrow">CAMPUS OVERVIEW</p><h1>Welcome, {(user?.fullName || 'Student').split(' ')[0]}.</h1><p className="muted">Here is what is happening on your campus.</p></div>
      <div className="date-chip"><CalendarDays size={17}/>{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</div>
    </div>
    {error && <div className="alert error">{error}. Check that the backend and MySQL are running.</div>}
    <div className="stat-grid">{cards.map(([key,label,Icon,to],i)=><Link to={to} className={`stat-card stat-${i}`} key={key}><div className="stat-top"><span>{label}</span><Icon size={20}/></div><strong>{data?.[key]??'—'}</strong><span className="stat-bottom">Open module <ArrowUpRight size={14}/></span></Link>)}</div>
    <div className="dashboard-lower">
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">GET THINGS DONE</p><h2>Campus services</h2></div><ClipboardList size={21}/></div><div className="quick-links">{[['/attendance','Attendance'],['/results','Results'],['/timetable','Timetable'],['/requests','Raise a request']].map(([to,label])=><Link key={to} to={to}>{label}<ArrowUpRight size={15}/></Link>)}</div></section>
      <section className="panel note-panel"><div className="panel-heading"><div><p className="eyebrow">SAMPLE STUDENT</p><h2>Student details</h2></div><BookOpen size={21}/></div><div className="profile-facts"><span><small>Full name</small><b>{user?.fullName || 'Vijay Kumar'}</b></span><span><small>Student ID</small><b>{user?.id ?? '—'}</b></span><span><small>Email</small><b>{user?.email || 'vijay@campus.local'}</b></span><span><small>Department</small><b>{user?.department || 'Computer Science'}</b></span></div><div className="notice"><span className="notice-dot"/><span>Sample student data is loaded from the local MySQL database.</span></div></section>
    </div>
  </>
}
