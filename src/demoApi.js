const storageKey = 'smart-campus-browser-demo-v1'
const demoUser = {
  id: 1,
  fullName: 'Vijay Kumar',
  email: 'vijay@campus.local',
  role: 'STUDENT',
  department: 'Computer Science',
  createdAt: '2026-06-01T09:00:00'
}

function initialData() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    courses: [
      { id: 1, code: 'CS101', title: 'Introduction to Computer Science', department: 'Computer Science', faculty: 'Faculty Team', credits: 4, semester: 'Semester 1' },
      { id: 2, code: 'MA102', title: 'Applied Mathematics', department: 'Mathematics', faculty: 'Dr. Rao', credits: 3, semester: 'Semester 1' }
    ],
    enrollments: [
      { id: 1, student_id: 1, course_id: 1, academic_year: '2026-2027', status: 'ENROLLED' },
      { id: 2, student_id: 1, course_id: 2, academic_year: '2026-2027', status: 'ENROLLED' }
    ],
    attendance: [
      { id: 1, student_id: 1, course_id: 1, attendance_date: today, status: 'PRESENT', remarks: 'Sample attendance entry' }
    ],
    results: [
      { id: 1, student_id: 1, course_id: 1, exam_name: 'Midterm', marks: 88, max_marks: 100, grade: 'A' }
    ],
    timetable: [
      { id: 1, course_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '10:00', room: 'Room 101', faculty: 'Dr. Rao' },
      { id: 2, course_id: 2, day_of_week: 'Wednesday', start_time: '11:00', end_time: '12:00', room: 'Room 204', faculty: 'Dr. Iyer' }
    ],
    announcements: [
      { id: 1, title: 'Welcome to the sample campus', message: 'This is sample campus information. Explore your courses, results, and campus services.', audience: 'ALL', posted_by: 'Portal Admin', posted_at: today }
    ],
    requests: [
      { id: 1, student_id: 1, category: 'Library', subject: 'Sample library request', description: 'Please use this sample request to explore the portal.', status: 'OPEN', response: '', created_at: today }
    ],
    events: [
      { id: 1, title: 'Campus welcome day', description: 'Meet students and explore campus services.', event_date: today, venue: 'Main Hall', organizer: 'Student Services', registration_link: '' },
      { id: 2, title: 'Technology club meetup', description: 'A student meetup for technology projects and ideas.', event_date: today, venue: 'Innovation Lab', organizer: 'Technology Club', registration_link: '' }
    ]
  }
}

function readData() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      const defaults = initialData()
      return Object.fromEntries(Object.keys(defaults).map(key => [key, Array.isArray(parsed[key]) ? parsed[key] : defaults[key]]))
    }
  } catch {
    // Continue with the in-memory sample if browser storage is unavailable.
  }
  return initialData()
}

let data = readData()

function persist() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Changes remain available for the current page session without storage.
  }
}

function fail(message, status = 400) {
  const error = new Error(message)
  error.response = { status, data: { error: message } }
  throw error
}

export function demoApiRequest(method, rawUrl, body) {
  const path = rawUrl.split('?')[0].replace(/^\/+|\/+$/g, '')
  const parts = path.split('/')

  if (method === 'post' && path === 'auth/demo') {
    return { token: 'browser-demo-session', user: { ...demoUser } }
  }
  if (method === 'get' && path === 'dashboard') {
    return {
      courses: data.courses.length,
      announcements: data.announcements.length,
      events: data.events.length,
      requests: data.requests.filter(row => Number(row.student_id) === demoUser.id).length
    }
  }
  if (method === 'get' && path === 'users') return [{ ...demoUser }]

  if (parts[0] !== 'data' || !data[parts[1]]) fail('That campus module is not available in the browser demo.', 404)

  const module = parts[1]
  const rows = data[module]
  if (method === 'get' && parts.length === 2) {
    return rows.filter(row => module !== 'requests' || Number(row.student_id) === demoUser.id).map(row => ({ ...row }))
  }
  if (method === 'post' && parts.length === 2) {
    if (module !== 'requests') fail('The sample student can create service requests; staff modules are read-only in this demo.', 403)
    const row = {
      ...body,
      id: Math.max(0, ...rows.map(item => Number(item.id) || 0)) + 1,
      student_id: demoUser.id,
      status: 'OPEN',
      response: '',
      created_at: new Date().toISOString()
    }
    rows.unshift(row)
    persist()
    return { ...row }
  }
  if (parts.length === 3 && ['put', 'delete'].includes(method)) {
    fail('Editing and deleting records require a staff account and a connected backend.', 403)
  }

  fail('That demo action is not supported.', 404)
}

export function resetBrowserDemo() {
  data = initialData()
  persist()
}
