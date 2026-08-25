import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  
  // Navigation
  const [activeModule, setActiveModule] = useState('overview'); // 'overview', 'grading', 'attendance', 'defaulters', 'profile'
  const [selectedSemester, setSelectedSemester] = useState(6);
  
  // Data States
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Marks Entry State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [savingMarks, setSavingMarks] = useState(false);

  // Live Attendance Marking State
  const [selectedAttendanceSubject, setSelectedAttendanceSubject] = useState(null);
  const [attendanceRoster, setAttendanceRoster] = useState([]);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [selectedSemester]);

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [studentsRes, subjectsRes, analyticsRes] = await Promise.all([
        axiosClient.get('/marks/students/search', { params: { semester: selectedSemester } }),
        axiosClient.get('/academic/curriculum'),
        axiosClient.get(`/marks/analytics?semester=${selectedSemester}`)
      ]);

      setStudents(studentsRes.data);
      const semSubjects = subjectsRes.data.filter(s => s.semester === selectedSemester);
      setSubjects(semSubjects);
      if (semSubjects.length > 0) {
        setSelectedAttendanceSubject(semSubjects[0]);
      }
      setAnalytics(analyticsRes.data);

      // Initialize Attendance Roster
      setAttendanceRoster(studentsRes.data.map(s => ({ studentId: s.id, name: s.name, prnNumber: s.prnNumber, attended: true })));
    } catch (error) {
      console.error('Failed to load faculty data', error);
      showToast('Failed to load faculty data', true);
    } finally {
      setLoading(false);
    }
  };

  // Select Student for Marks Entry
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const response = await axiosClient.get(`/marks/student/${student.id}?semester=${selectedSemester}`);
      setMarks(response.data);
    } catch (error) {
      console.error('Failed to load student marks', error);
      showToast('Failed to load student marks', true);
    }
  };

  const handleMarkChange = (subjectId, field, value) => {
    setMarks(marks.map(m => 
      m.subjectId === subjectId ? { ...m, [field]: value } : m
    ));
  };

  // Save Marks
  const handleSaveMarks = async () => {
    setSavingMarks(true);
    try {
      await axiosClient.put('/marks/update', { marksData: marks });
      showToast('Marks & Grade Points saved successfully!');
      // Refresh analytics
      const analyticsRes = await axiosClient.get(`/marks/analytics?semester=${selectedSemester}`);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to save marks', error);
      showToast('Failed to save marks.', true);
    } finally {
      setSavingMarks(false);
    }
  };

  // Toggle Attendance checkbox for student
  const toggleAttendanceStatus = (studentId) => {
    setAttendanceRoster(attendanceRoster.map(item => 
      item.studentId === studentId ? { ...item, attended: !item.attended } : item
    ));
  };

  const markAllPresent = () => {
    setAttendanceRoster(attendanceRoster.map(item => ({ ...item, attended: true })));
  };

  // Submit Batch Attendance
  const handleSubmitAttendance = async () => {
    if (!selectedAttendanceSubject) {
      showToast('Please select a subject first.', true);
      return;
    }
    setSavingAttendance(true);
    try {
      await axiosClient.post('/marks/attendance/batch', {
        subjectId: selectedAttendanceSubject.id,
        semester: selectedSemester,
        attendanceData: attendanceRoster
      });
      showToast(`Attendance recorded for ${selectedAttendanceSubject.name}!`);
      // Refresh analytics
      const analyticsRes = await axiosClient.get(`/marks/analytics?semester=${selectedSemester}`);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to record attendance', error);
      showToast('Failed to record attendance', true);
    } finally {
      setSavingAttendance(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.prnNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#fafafa]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#eaeaea] hidden lg:flex flex-col justify-between flex-shrink-0 print-hidden">
        <div>
          {/* Logo & Branding */}
          <div className="h-20 flex items-center px-6 border-b border-[#eaeaea]">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-black text-sm rounded-lg shadow-sm mr-3">
              FAC
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-black block">Faculty Portal</span>
              <span className="text-[11px] text-[#888888] font-medium block">Dept of Computer Engg</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'Class Analytics', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { id: 'grading', label: 'Semester Marks Entry', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'attendance', label: 'Live Attendance Marker', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { id: 'defaulters', label: 'Defaulters Radar (<75%)', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
              { id: 'profile', label: 'Faculty Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeModule === tab.id 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-[#555555] hover:bg-[#f5f5f5] hover:text-black'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d={tab.icon}></path>
                </svg>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* User Badge */}
        <div className="p-4 border-t border-[#eaeaea]">
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#fafafa] rounded-xl border border-[#eaeaea]">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'F'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-black truncate">{user?.name}</p>
              <p className="text-[11px] text-[#777777] truncate">Faculty Member</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full mt-2.5 py-2 text-xs font-semibold text-[#666666] hover:text-black transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Bar with Semester Selector */}
        <header className="h-16 bg-white border-b border-[#eaeaea] flex items-center justify-between px-6 lg:px-10 print-hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">Active Semester:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                    selectedSemester === sem ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-[#777777] font-medium hidden sm:block">
            Academic Session: <strong className="text-black">Winter / Spring 2026</strong>
          </div>
        </header>

        {/* Module Content */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          {/* ============================================================ */}
          {/* 1. CLASS OVERVIEW & ANALYTICS                               */}
          {/* ============================================================ */}
          {activeModule === 'overview' && analytics && (
            <div className="animate-fade-in space-y-8">
              
              <div>
                <h1 className="text-2xl font-black text-black">Class Academic Overview (Sem {selectedSemester})</h1>
                <p className="text-xs text-[#666666] mt-0.5">Real-time cohort performance, attendance health, and course allocations.</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Total Enrolled Students</span>
                  <p className="text-4xl font-black text-black my-2">{analytics.totalStudents}</p>
                  <span className="text-xs text-[#777777]">Division A & B Combined</span>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Average Class CGPA</span>
                  <p className="text-4xl font-black text-black my-2">{analytics.averageClassCGPA}</p>
                  <span className="text-xs text-emerald-600 font-semibold">Healthy Academic Benchmark</span>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Defaulter Students (&lt;75%)</span>
                  <p className={`text-4xl font-black my-2 ${analytics.defaulterCount > 0 ? 'text-red-600' : 'text-black'}`}>
                    {analytics.defaulterCount}
                  </p>
                  <span className="text-xs text-red-600 font-semibold">Requires Remediation</span>
                </div>
              </div>

              {/* Student Roster Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#eaeaea] bg-[#fafafa] flex items-center justify-between">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider">Semester {selectedSemester} Student Directory</h3>
                  <span className="text-xs font-bold text-[#888888]">{students.length} Total Enrolled</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white border-b border-[#eaeaea] text-[#777777] font-bold uppercase">
                      <tr>
                        <th className="p-4">PRN</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4 text-center">Semester</th>
                        <th className="p-4 text-center">CGPA</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaea] font-medium">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="p-4 font-mono font-bold text-black">{student.prnNumber}</td>
                          <td className="p-4 font-bold text-black">{student.name}</td>
                          <td className="p-4 text-[#666666]">{student.email}</td>
                          <td className="p-4 text-center font-bold text-black">Sem {student.currentSemester}</td>
                          <td className="p-4 text-center font-mono font-black text-black">{student.cgpa}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                handleSelectStudent(student);
                                setActiveModule('grading');
                              }}
                              className="px-3 py-1 bg-black text-white rounded-md text-[11px] font-bold hover:bg-[#333333]"
                            >
                              Grade Student
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 2. SEMESTER MARKS ENTRY & EVALUATOR                         */}
          {/* ============================================================ */}
          {activeModule === 'grading' && (
            <div className="animate-fade-in space-y-6">
              
              <div>
                <h1 className="text-2xl font-black text-black">Semester Marks & Evaluation Suite</h1>
                <p className="text-xs text-[#666666] mt-0.5">Enter MSE (out of 50), ESE (out of 100), and Lab Work (out of 25) with automatic weighting calculations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Student Selector */}
                <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[560px]">
                  <div className="p-4 border-b border-[#eaeaea] bg-[#fafafa]">
                    <input
                      type="text"
                      placeholder="Search PRN or Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glass-input w-full px-3 py-2 text-xs rounded-lg"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#eaeaea]">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className={`p-3.5 cursor-pointer transition-colors ${
                          selectedStudent?.id === student.id ? 'bg-black text-white' : 'hover:bg-[#fafafa]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{student.name}</span>
                          <span className={`text-[10px] font-mono ${selectedStudent?.id === student.id ? 'text-gray-300' : 'text-[#777777]'}`}>
                            {student.prnNumber}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${selectedStudent?.id === student.id ? 'text-gray-300' : 'text-[#888888]'}`}>
                          CGPA: {student.cgpa}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Grade Card Editor */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between">
                  {selectedStudent ? (
                    <div className="space-y-6">
                      
                      <div className="flex items-center justify-between border-b border-[#eaeaea] pb-4">
                        <div>
                          <h3 className="text-base font-bold text-black">{selectedStudent.name}</h3>
                          <p className="text-xs font-mono text-[#666666]">PRN: {selectedStudent.prnNumber} • Semester {selectedSemester}</p>
                        </div>
                        <button
                          onClick={handleSaveMarks}
                          disabled={savingMarks}
                          className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] transition-colors shadow-sm disabled:opacity-50"
                        >
                          {savingMarks ? 'Saving Changes...' : 'Save & Publish Marks'}
                        </button>
                      </div>

                      {/* Marks Editor Table */}
                      <div className="space-y-3">
                        {marks.map(mark => (
                          <div key={mark.subjectId} className="p-4 rounded-xl border border-[#eaeaea] bg-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <span className="font-mono text-xs font-bold text-black">{mark.subject?.code}</span>
                              <h4 className="text-xs font-bold text-black">{mark.subject?.name}</h4>
                              <span className="text-[10px] text-[#777777] font-semibold">{mark.subject?.credits} Credits</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div>
                                <label className="block text-[9px] font-bold text-[#888888] uppercase mb-0.5">MSE (50)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={mark.mse || ''}
                                  onChange={(e) => handleMarkChange(mark.subjectId, 'mse', e.target.value)}
                                  className="glass-input w-16 px-2 py-1.5 text-xs text-center font-mono font-bold rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-[#888888] uppercase mb-0.5">ESE (100)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={mark.ese || ''}
                                  onChange={(e) => handleMarkChange(mark.subjectId, 'ese', e.target.value)}
                                  className="glass-input w-16 px-2 py-1.5 text-xs text-center font-mono font-bold rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-[#888888] uppercase mb-0.5">Lab (25)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="25"
                                  value={mark.labWork || ''}
                                  onChange={(e) => handleMarkChange(mark.subjectId, 'labWork', e.target.value)}
                                  className="glass-input w-16 px-2 py-1.5 text-xs text-center font-mono font-bold rounded"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="py-32 text-center text-xs text-[#888888]">
                      ← Select a student from the left panel to begin evaluation.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 3. LIVE ATTENDANCE MARKER TOOL                               */}
          {/* ============================================================ */}
          {activeModule === 'attendance' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-black">Live Classroom Attendance Logger</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Batch record lecture and laboratory attendance for registered cohorts.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllPresent}
                    className="px-3 py-2 bg-white border border-[#eaeaea] text-black text-xs font-bold rounded-lg hover:bg-gray-50"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={handleSubmitAttendance}
                    disabled={savingAttendance}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm disabled:opacity-50"
                  >
                    {savingAttendance ? 'Submitting...' : 'Submit Attendance'}
                  </button>
                </div>
              </div>

              {/* Subject & Date Selector */}
              <div className="glass-card p-4 rounded-xl flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#888888]">Course:</span>
                  <select
                    value={selectedAttendanceSubject?.id || ''}
                    onChange={(e) => {
                      const s = subjects.find(sub => sub.id === parseInt(e.target.value));
                      setSelectedAttendanceSubject(s);
                    }}
                    className="glass-input px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#888888]">Lecture Date:</span>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="glass-input px-3 py-1.5 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Student Checklist Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafafa] border-b border-[#eaeaea] text-[#777777] font-bold uppercase">
                    <tr>
                      <th className="p-4">Roll / PRN</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Quick Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaea] font-medium">
                    {attendanceRoster.map(item => (
                      <tr key={item.studentId} className="hover:bg-[#fafafa] transition-colors">
                        <td className="p-4 font-mono font-bold text-black">{item.prnNumber}</td>
                        <td className="p-4 font-bold text-black">{item.name}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            item.attended ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.attended ? 'PRESENT' : 'ABSENT'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleAttendanceStatus(item.studentId)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              item.attended ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            Mark {item.attended ? 'Absent' : 'Present'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 4. DEFAULTER RADAR (<75%)                                   */}
          {/* ============================================================ */}
          {activeModule === 'defaulters' && analytics && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-black">Attendance Defaulter Radar (&lt;75%)</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Official debarred candidates list subject to administrative remediation</p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm flex items-center gap-2"
                >
                  Export Defaulters PDF
                </button>
              </div>

              {analytics.defaulters.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-2xl">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-sm font-bold text-black mt-2">Zero Defaulters in Semester {selectedSemester}!</h3>
                  <p className="text-xs text-[#777777] mt-1">All enrolled students have maintained above 75% attendance criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.defaulters.map((def, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-black">{def.name}</h3>
                          <p className="text-xs font-mono font-bold text-[#666666]">PRN: {def.prnNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-red-600 font-mono">{def.overallPercentage}%</span>
                          <p className="text-[10px] font-bold text-red-600 uppercase">Defaulter Status</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#eaeaea] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {def.subjects.map((sub, sIdx) => (
                          <div key={sIdx} className="p-2 rounded bg-[#fafafa] border border-[#eaeaea]">
                            <span className="font-mono text-[10px] font-bold text-black block">{sub.code}</span>
                            <span className="text-[11px] text-[#555555] truncate block">{sub.name}</span>
                            <span className={`text-xs font-bold font-mono ${sub.percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {sub.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* 5. FACULTY PROFILE                                          */}
          {/* ============================================================ */}
          {activeModule === 'profile' && (
            <div className="animate-fade-in space-y-6 max-w-3xl">
              <h1 className="text-2xl font-black text-black">Faculty Profile & Credentials</h1>
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-[#eaeaea]">
                  <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-md">
                    {user?.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-black">{user?.name}</h2>
                    <p className="text-xs font-bold text-[#777777] mt-0.5">Faculty ID: {user?.prnNumber}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-black text-white text-[11px] font-bold rounded">
                      Department of Computer Engineering
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <dt className="font-bold text-[#888888] uppercase text-[10px]">Email Address</dt>
                    <dd className="mt-1 font-semibold text-black text-sm">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#888888] uppercase text-[10px]">Faculty Role</dt>
                    <dd className="mt-1 font-semibold text-black text-sm">Associate Professor / Senior Evaluator</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
