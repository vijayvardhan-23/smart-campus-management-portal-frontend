import { useCallback, useEffect, useMemo, useState } from 'react'
import { Info, Pencil, Plus, RefreshCw, Save, Search, Trash2, X } from 'lucide-react'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'

const configs = {
  courses: { description: 'Browse and manage academic courses.', fields: [['code', 'Course code', 'text', true], ['title', 'Course title', 'text', true], ['department', 'Department', 'text'], ['faculty', 'Faculty', 'text'], ['credits', 'Credits', 'number'], ['semester', 'Semester', 'text']] },
  enrollments: { description: 'Connect a student to a course.', fields: [['student_id', 'Student user ID', 'number', true], ['course_id', 'Course ID', 'number', true], ['academic_year', 'Academic year', 'text'], ['status', 'Status', 'select', ['ENROLLED', 'COMPLETED', 'DROPPED']]] },
  attendance: { description: 'Record and review student attendance.', fields: [['student_id', 'Student user ID', 'number', true], ['course_id', 'Course ID', 'number', true], ['attendance_date', 'Date', 'date', true], ['status', 'Status', 'select', ['PRESENT', 'ABSENT', 'LATE']], ['remarks', 'Remarks', 'text']] },
  results: { description: 'Manage marks, grades, and examination results.', fields: [['student_id', 'Student user ID', 'number', true], ['course_id', 'Course ID', 'number', true], ['exam_name', 'Exam name', 'text', true], ['marks', 'Marks', 'number', true], ['max_marks', 'Maximum marks', 'number'], ['grade', 'Grade', 'text']] },
  timetable: { description: 'View and maintain the academic timetable.', fields: [['course_id', 'Course ID', 'number', true], ['day_of_week', 'Day', 'select', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']], ['start_time', 'Start time (HH:mm)', 'text', true], ['end_time', 'End time (HH:mm)', 'text', true], ['room', 'Room', 'text'], ['faculty', 'Faculty', 'text']] },
  announcements: { description: 'Campus notices and important updates.', fields: [['title', 'Title', 'text', true], ['message', 'Message', 'textarea', true], ['audience', 'Audience', 'select', ['ALL', 'STUDENT', 'FACULTY']], ['posted_by', 'Posted by', 'text']] },
  requests: { description: 'Submit complaints and track service request status.', fields: [['category', 'Category', 'select', ['IT Support', 'Facilities', 'Library', 'Accounts', 'Transport', 'Other']], ['subject', 'Subject', 'text', true], ['description', 'Description', 'textarea', true], ['status', 'Status', 'select', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']], ['response', 'Staff response', 'textarea']] },
  events: { description: 'Discover campus activities, workshops, and events.', fields: [['title', 'Event title', 'text', true], ['description', 'Description', 'textarea'], ['event_date', 'Event date', 'date'], ['venue', 'Venue', 'text'], ['organizer', 'Organizer', 'text'], ['registration_link', 'Registration link', 'url']] }
}

const titleCase = value => String(value ?? '').replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase())
const display = value => value === null || value === undefined || value === '' ? '—' : typeof value === 'object' ? JSON.stringify(value) : String(value)

export default function ModulePage({ module, title }) {
  const { user } = useAuth()
  const config = configs[module]
  const staff = ['ADMIN', 'FACULTY'].includes(user?.role)
  const canEdit = staff
  const canCreate = staff || module === 'requests'
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/data/${module}`)
      setRows(response.data)
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [module])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => rows.filter(row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query])
  const columns = useMemo(() => {
    if (!rows.length) return ['id', ...config.fields.slice(0, 4).map(field => field[0])]
    const preferred = ['id', ...config.fields.map(field => field[0])]
    return preferred.filter(key => key === 'id' || rows.some(row => key in row)).slice(0, 7)
  }, [rows, config])

  const openNew = () => { setEdit(null); setForm({}); setModal(true) }
  const openEdit = row => {
    setEdit(row)
    const next = {}
    config.fields.forEach(([key]) => { next[key] = row[key] ?? '' })
    setForm(next)
    setModal(true)
  }

  const save = async event => {
    event.preventDefault()
    setError('')
    const payload = {}
    config.fields.forEach(([key, , type]) => {
      const value = form[key]
      if (value !== '' && value !== undefined && value !== null) payload[key] = type === 'number' ? Number(value) : value
    })
    try {
      if (edit) await api.put(`/data/${module}/${edit.id}`, payload)
      else await api.post(`/data/${module}`, payload)
      setModal(false)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError))
    }
  }

  const remove = async row => {
    if (!window.confirm(`Delete record #${row.id}? This cannot be undone.`)) return
    try {
      await api.delete(`/data/${module}/${row.id}`)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError))
    }
  }

  return <>
    <div className="page-heading">
      <div><p className="eyebrow">CAMPUS MODULE</p><h1>{title}</h1><p className="muted">{config.description}</p></div>
      <div className="heading-actions"><button className="secondary-btn" onClick={load}><RefreshCw size={16}/> Refresh</button>{canCreate && <button className="primary-btn" onClick={openNew}><Plus size={17}/> Add new</button>}</div>
    </div>
    {error && <div className="alert error">{error}</div>}
    <section className="panel table-panel">
      <div className="table-toolbar"><div className="search-box"><Search size={17}/><input placeholder={`Search ${title.toLowerCase()}…`} value={query} onChange={event => setQuery(event.target.value)}/></div><span className="row-count">{filtered.length} records</span></div>
      {loading ? <div className="empty-state">Loading records…</div> : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Info size={24}/></div><h3>No records found</h3><p>{query ? 'Try a different search term.' : 'Records will appear here when they are available.'}</p>{canCreate && !query && <button className="secondary-btn" onClick={openNew}><Plus size={16}/> Add first record</button>}</div> : <div className="table-scroll"><table><thead><tr>{columns.map(column => <th key={column}>{titleCase(column)}</th>)}{canEdit && <th>Actions</th>}</tr></thead><tbody>{filtered.map(row => <tr key={row.id}>{columns.map(column => <td key={column}>{column === 'status' ? <span className={`status status-${String(row[column]).toLowerCase()}`}>{display(row[column])}</span> : display(row[column])}</td>)}{canEdit && <td><div className="row-actions"><button className="icon-btn" title="Edit" onClick={() => openEdit(row)}><Pencil size={15}/></button><button className="icon-btn danger-icon" title="Delete" onClick={() => remove(row)}><Trash2 size={15}/></button></div></td>}</tr>)}</tbody></table></div>}
    </section>
    {module === 'requests' && !staff && <p className="helper-text">You can submit and view your own requests. Staff can update request status.</p>}
    {modal && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setModal(false) }}><form className="modal-card" onSubmit={save}>
      <div className="modal-heading"><div><p className="eyebrow">{edit ? 'UPDATE RECORD' : 'NEW RECORD'}</p><h2>{edit ? 'Edit' : 'Add'} {title.slice(0, -1) || title}</h2></div><button type="button" className="icon-btn" onClick={() => setModal(false)}><X size={19}/></button></div>
      <div className="form-grid">{config.fields.filter(([key]) => module !== 'requests' || staff || !['status', 'response'].includes(key)).map(([key, label, type, options]) => <label key={key} className={type === 'textarea' ? 'field-wide' : ''}>{label}{type === 'select' ? <select required={options === true} value={form[key] ?? ''} onChange={event => setForm({ ...form, [key]: event.target.value })}><option value="">Select…</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select> : type === 'textarea' ? <textarea required={options === true} rows="3" value={form[key] ?? ''} onChange={event => setForm({ ...form, [key]: event.target.value })}/> : <input type={type || 'text'} required={options === true} value={form[key] ?? ''} onChange={event => setForm({ ...form, [key]: event.target.value })}/>}</label>)}</div>
      <div className="modal-footer"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancel</button><button className="primary-btn"><Save size={16}/>{edit ? 'Save changes' : 'Create record'}</button></div>
    </form></div>}
  </>
}
