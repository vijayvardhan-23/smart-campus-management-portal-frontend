import {useEffect,useState} from 'react'
import {RefreshCw,Users} from 'lucide-react'
import api,{errorMessage} from '../api'
export default function UsersPage(){
 const [rows,setRows]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true)
 const load=()=>{setLoading(true);api.get('/users').then(r=>setRows(r.data)).catch(e=>setError(errorMessage(e))).finally(()=>setLoading(false))}
 useEffect(()=>{load()},[])
 return <><div className="page-heading"><div><p className="eyebrow">ADMINISTRATION</p><h1>User directory</h1><p className="muted">View campus accounts.</p></div><button className="secondary-btn" onClick={load}><RefreshCw size={16}/> Refresh</button></div>{error&&<div className="alert error">{error}</div>}<section className="panel table-panel"><div className="panel-heading"><div><h2>Campus users</h2><p className="muted">The local demo uses a seeded sample student.</p></div><Users size={22}/></div>{loading?<div className="empty-state">Loading users…</div>:<div className="table-scroll"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Created</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.fullName}</td><td>{r.email}</td><td><span className="status">{r.role}</span></td><td>{r.department||'—'}</td><td>{r.createdAt?new Date(r.createdAt).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div>}</section></>
}
