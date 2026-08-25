import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function ResultPage() {
  const { user, logout } = useAuth();
  
  // Navigation
  const [activeModule, setActiveModule] = useState('dashboard'); // 'dashboard', 'results', 'gradesheet', 'attendance', 'hallticket', 'fees', 'notices', 'profile'
  const [selectedSemester, setSelectedSemester] = useState(1);
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [semesterResult, setSemesterResult] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [hallTicket, setHallTicket] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [notices, setNotices] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [semLoading, setSemLoading] = useState(false);
  const [error, setError] = useState('');
  const [noticeFilter, setNoticeFilter] = useState('ALL');

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const overviewRes = await axiosClient.get('/academic/overview');
        const currentSem = overviewRes.data.student.currentSemester;
        setSelectedSemester(currentSem);
        
        const [semRes, attRes, feesRes, noticesRes, htRes] = await Promise.all([
          axiosClient.get(`/academic/results?semester=${currentSem}`),
          axiosClient.get(`/academic/attendance?semester=${currentSem}`),
          axiosClient.get('/academic/fees'),
          axiosClient.get('/academic/notices'),
          axiosClient.get('/academic/hall-ticket')
        ]);

        setOverview(overviewRes.data);
        setSemesterResult(semRes.data);
        setAttendanceData(attRes.data);
        setFeeData(feesRes.data);
        setNotices(noticesRes.data);
        setHallTicket(htRes.data);
      } catch (err) {
        console.error('Failed to fetch student data', err);
        setError(err.response?.data?.message || err.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch Semester Results when semester changed
  const handleSemesterChange = async (sem) => {
    setSelectedSemester(sem);
    try {
      setSemLoading(true);
      const [res, attRes] = await Promise.all([
        axiosClient.get(`/academic/results?semester=${sem}`),
        axiosClient.get(`/academic/attendance?semester=${sem}`)
      ]);
      setSemesterResult(res.data);
      setAttendanceData(attRes.data);
    } catch (err) {
      console.error('Failed to change semester', err);
    } finally {
      setSemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] text-slate-900">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-sm text-[#666666]">Loading Student ERP System...</p>
      </div>
    );
  }

  const filteredNotices = noticeFilter === 'ALL' 
    ? notices 
    : notices.filter(n => n.category === noticeFilter);

  return (
    <div className="min-h-screen flex bg-[#fafafa]">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#eaeaea] hidden lg:flex flex-col justify-between flex-shrink-0 print-hidden">
        <div>
          {/* Logo & Portal Branding */}
          <div className="h-20 flex items-center px-6 border-b border-[#eaeaea]">
            <div className="w-9 h-9 bg-[#0072bc] text-white flex items-center justify-center font-bold text-sm rounded-lg shadow-sm mr-3">
              VIT
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block">Student Portal</span>
              <span className="text-[11px] text-[#888888] font-medium block">Academic ERP v4.2</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'results', label: 'Multi-Semester Results', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'gradesheet', label: 'Official Grade Card', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { id: 'attendance', label: 'Attendance & Defaulters', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { id: 'hallticket', label: 'Exam & Hall Ticket', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
              { id: 'fees', label: 'Fee Invoices & Receipts', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
              { id: 'notices', label: 'Notices & Circulars', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
              { id: 'profile', label: 'Student Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeModule === tab.id 
                    ? 'bg-[#0072bc] text-white shadow-sm' 
                    : 'text-[#555555] hover:bg-[#f5f5f5] hover:text-slate-900'
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
        
        {/* User Badge & Logout */}
        <div className="p-4 border-t border-[#eaeaea]">
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#fafafa] rounded-xl border border-[#eaeaea]">
            <div className="w-8 h-8 rounded-full bg-[#0072bc] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-[#777777] font-mono truncate">{user?.prnNumber}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full mt-2.5 py-2 text-xs font-semibold text-[#666666] hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-[#eaeaea] flex items-center justify-between px-6 print-hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0072bc] text-white flex items-center justify-center font-bold text-xs rounded">VIT</div>
            <span className="font-bold text-sm">Student Portal</span>
          </div>
          <button onClick={logout} className="text-xs font-semibold text-red-600">Logout</button>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="m-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 print-hidden">
            <strong>System Error:</strong> {error}
          </div>
        )}

        {/* Module Content Container */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          {/* ============================================================ */}
          {/* 1. DASHBOARD OVERVIEW MODULE                                */}
          {/* ============================================================ */}
          {activeModule === 'dashboard' && overview && (
            <div className="animate-fade-in space-y-8">
              
              {/* Hero Banner */}
              <div className="glass-card p-8 rounded-2xl bg-gradient-to-r from-white via-white to-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0072bc] text-white uppercase tracking-wider">
                      AY 2025-26
                    </span>
                    <span className="text-xs text-[#777777] font-medium">B.Tech {overview.student.department}</span>
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight tracking-tight text-slate-900">
                    Welcome back, {overview.student.name.split(' ')[0]}!
                  </h1>
                  <p className="text-sm text-[#666666] mt-1 font-normal">
                    PRN: <span className="font-mono font-bold text-slate-900">{overview.student.prnNumber}</span> • Current Semester: <span className="font-bold text-slate-900">Sem {overview.student.currentSemester}</span> • Batch: {overview.student.batch}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveModule('gradesheet')}
                    className="px-4 py-2 bg-[#0072bc] text-white text-xs font-semibold rounded-lg hover:bg-[#00508a] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Print Grade Sheet
                  </button>
                  <button 
                    onClick={() => setActiveModule('hallticket')}
                    className="px-4 py-2 bg-white text-slate-900 border border-[#eaeaea] text-xs font-semibold rounded-lg hover:bg-[#f5f5f5] transition-colors shadow-sm"
                  >
                    Hall Ticket
                  </button>
                </div>
              </div>

              {/* 4 Core Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* CGPA */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Cumulative CGPA</span>
                  <div className="my-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-slate-900">{overview.cgpa.toFixed(2)}</span>
                    <span className="text-xs text-[#888888] font-semibold">/ 10.0</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                    Top 5% in Department
                  </span>
                </div>

                {/* Total Credits */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Credits Earned</span>
                  <div className="my-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-slate-900">{overview.totalCreditsEarned}</span>
                    <span className="text-xs text-[#888888] font-semibold">/ 160 Total</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-900 bg-gray-100 px-2 py-0.5 rounded w-fit">
                    Degree Track on Schedule
                  </span>
                </div>

                {/* Aggregate Attendance */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Current Attendance</span>
                  <div className="my-3 flex items-baseline gap-1.5">
                    <span className={`text-4xl font-semibold tracking-tight ${overview.isDefaulter ? 'text-red-600' : 'text-slate-900'}`}>
                      {overview.currentSemesterAttendance}%
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded w-fit ${
                    overview.isDefaulter ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {overview.isDefaulter ? '⚠️ Defaulter Warning (<75%)' : '✓ Safe Academic Standing'}
                  </span>
                </div>

                {/* Fee Status */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Semester Fee Status</span>
                  <div className="my-3">
                    <span className="text-3xl font-semibold tracking-tight text-emerald-600">CLEARED</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#777777]">
                    Receipt: REC-2026-00452
                  </span>
                </div>

              </div>

              {/* Multi-Semester SGPA Progression */}
              <div className="glass-card p-7 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Semester Performance Progression</h2>
                    <p className="text-xs text-[#777777] mt-0.5">Historical SGPA across completed semesters</p>
                  </div>
                  <span className="text-xs font-semibold text-[#888888]">Zero Backlogs (KT)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {overview.semesterHistory.map((sem) => (
                    <div 
                      key={sem.semester}
                      onClick={() => {
                        handleSemesterChange(sem.semester);
                        setActiveModule('results');
                      }}
                      className="cursor-pointer p-4 rounded-xl border border-[#eaeaea] bg-[#fafafa] hover:bg-[#0072bc] hover:text-white transition-all group flex flex-col justify-between h-28"
                    >
                      <span className="text-xs font-bold text-[#888888] group-hover:text-gray-300">Sem {sem.semester}</span>
                      <div>
                        <p className="text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-white">{sem.sgpa.toFixed(2)}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold group-hover:text-emerald-300">PASS ({sem.credits} Cr)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Official Circulars */}
              <div className="glass-card p-7 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-900">Official University Circulars</h2>
                  <button onClick={() => setActiveModule('notices')} className="text-xs font-semibold text-slate-900 hover:underline">
                    View All Circulars →
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="p-4 rounded-xl border border-[#eaeaea] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            notice.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {notice.category}
                          </span>
                          <span className="text-xs text-[#888888] font-medium">{notice.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                      </div>
                      <span className="text-xs text-[#777777] font-medium flex-shrink-0">{notice.author}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 2. MULTI-SEMESTER RESULTS MODULE                           */}
          {/* ============================================================ */}
          {activeModule === 'results' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Multi-Semester Gradebook</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Explore detailed marks, credit distribution, and grade points for each semester</p>
                </div>

                <button 
                  onClick={() => setActiveModule('gradesheet')}
                  className="px-4 py-2 bg-[#0072bc] text-white text-xs font-semibold rounded-lg hover:bg-[#00508a] transition-colors shadow-sm flex items-center gap-2 self-start"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Official Grade Sheet View
                </button>
              </div>

              {/* Semester Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#eaeaea]">
                {Array.from({ length: overview.student.currentSemester }, (_, i) => i + 1).map(sem => (
                  <button
                    key={sem}
                    onClick={() => handleSemesterChange(sem)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                      selectedSemester === sem
                        ? 'bg-[#0072bc] text-white shadow-sm'
                        : 'bg-white text-slate-900 border border-[#eaeaea] hover:border-[#0072bc]'
                    }`}
                  >
                    <span>Semester {sem}</span>
                    <span className={`w-2 h-2 rounded-full ${selectedSemester === sem ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  </button>
                ))}
              </div>

              {/* Results Table */}
              {semLoading ? (
                <div className="py-20 text-center text-xs text-[#777777]">Loading semester {selectedSemester} records...</div>
              ) : semesterResult && (
                <div className="space-y-6">
                  
                  {/* Semester Summary Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="glass-card p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-[#888888] uppercase">Semester SGPA</span>
                      <p className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{semesterResult.sgpa}</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-[#888888] uppercase">Semester Credits</span>
                      <p className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{semesterResult.totalCredits}</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-[#888888] uppercase">Aggregate %</span>
                      <p className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">{semesterResult.percentage}%</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-[#888888] uppercase">Result Status</span>
                      <p className="text-2xl font-semibold tracking-tight text-emerald-600 mt-1">{semesterResult.resultStatus}</p>
                    </div>
                  </div>

                  {/* Course Table */}
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#fafafa] border-b border-[#eaeaea] text-[11px] font-bold text-[#777777] uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-4">Course Details</th>
                            <th className="px-4 py-4 text-center">Type</th>
                            <th className="px-4 py-4 text-center">Credits</th>
                            <th className="px-4 py-4 text-center">MSE (30)</th>
                            <th className="px-4 py-4 text-center">ESE (70)</th>
                            <th className="px-4 py-4 text-center">Total (100)</th>
                            <th className="px-4 py-4 text-center">Grade</th>
                            <th className="px-6 py-4 text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaeaea] bg-white font-medium">
                          {semesterResult.subjects.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-[#fafafa] transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-mono font-bold text-xs text-slate-900 block">{sub.subjectCode}</span>
                                <span className="text-xs text-[#555555] block mt-0.5">{sub.subjectName}</span>
                              </td>
                              <td className="px-4 py-4 text-center text-xs text-[#777777]">{sub.type}</td>
                              <td className="px-4 py-4 text-center text-xs font-bold text-slate-900">{sub.credits}</td>
                              <td className="px-4 py-4 text-center text-xs font-mono font-bold text-slate-900">{sub.mseMarks}</td>
                              <td className="px-4 py-4 text-center text-xs font-mono font-bold text-slate-900">{sub.eseMarks}</td>
                              <td className="px-4 py-4 text-center text-xs font-mono font-bold text-slate-900">{sub.totalMarks}</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${
                                  sub.grade === 'S' || sub.grade === 'A' 
                                    ? 'bg-[#0072bc] text-white' 
                                    : sub.grade === 'F' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-gray-100 text-slate-900 border border-gray-200'
                                }`}>
                                  {sub.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-mono font-bold text-xs text-slate-900">
                                {sub.gradePoint * sub.credits}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* 3. OFFICIAL UNIVERSITY GRADE CARD (PRINT-READY)             */}
          {/* ============================================================ */}
          {activeModule === 'gradesheet' && semesterResult && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex items-center justify-between print-hidden">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveModule('results')} className="text-xs font-bold text-[#666666] hover:text-slate-900">
                    ← Back to Results
                  </button>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs font-bold text-slate-900">Semester {selectedSemester} Official Transcript</span>
                </div>

                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0072bc] text-white text-xs font-bold rounded-lg hover:bg-[#00508a] transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Print / Save Official PDF
                </button>
              </div>

              {/* Official Printable Grade Card Container */}
              <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#eaeaea] print-sheet space-y-6 shadow-sm">
                
                {/* University Header */}
                <div className="text-center border-b-2 border-slate-700 pb-6 space-y-1">
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight uppercase tracking-tight text-slate-900">
                    Vishwakarma Institute of Technology, Pune
                  </h1>
                  <p className="text-xs font-bold text-[#444444] uppercase tracking-wider">
                    (An Autonomous Institute Affiliated to Savitribai Phule Pune University)
                  </p>
                  <p className="text-[11px] text-[#666666]">
                    666, Upper Indira Nagar, Bibwewadi, Pune, Maharashtra - 411037
                  </p>
                  <div className="pt-2">
                    <span className="inline-block border-2 border-slate-700 px-4 py-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                      Statement of Grades - Semester {selectedSemester}
                    </span>
                  </div>
                </div>

                {/* Student Bio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs py-2 border-b border-[#eaeaea]">
                  <div>
                    <span className="text-[#888888] font-bold block text-[10px] uppercase">Candidate Name</span>
                    <span className="font-bold text-slate-900 block">{semesterResult.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold block text-[10px] uppercase">Permanent Reg. No (PRN)</span>
                    <span className="font-mono font-bold text-slate-900 block">{semesterResult.prnNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold block text-[10px] uppercase">Department / Program</span>
                    <span className="font-bold text-slate-900 block">{semesterResult.department}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold block text-[10px] uppercase">Examination Session</span>
                    <span className="font-bold text-slate-900 block">{semesterResult.examSession}</span>
                  </div>
                </div>

                {/* Grade Table */}
                <table className="w-full text-left text-xs border border-slate-700">
                  <thead className="bg-[#f0f0f0] border-b border-slate-700 font-bold uppercase">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Course Code</th>
                      <th className="p-2 border-r border-slate-700">Course Title</th>
                      <th className="p-2 text-center border-r border-slate-700">Credits</th>
                      <th className="p-2 text-center border-r border-slate-700">MSE (30)</th>
                      <th className="p-2 text-center border-r border-slate-700">ESE (70)</th>
                      <th className="p-2 text-center border-r border-slate-700">Total</th>
                      <th className="p-2 text-center border-r border-slate-700">Grade</th>
                      <th className="p-2 text-right">Earned Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-medium">
                    {semesterResult.subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono font-bold border-r border-slate-700">{sub.subjectCode}</td>
                        <td className="p-2 border-r border-slate-700">{sub.subjectName}</td>
                        <td className="p-2 text-center font-bold border-r border-slate-700">{sub.credits}</td>
                        <td className="p-2 text-center font-mono border-r border-slate-700">{sub.mseMarks}</td>
                        <td className="p-2 text-center font-mono border-r border-slate-700">{sub.eseMarks}</td>
                        <td className="p-2 text-center font-mono font-bold border-r border-slate-700">{sub.totalMarks}</td>
                        <td className="p-2 text-center font-bold border-r border-slate-700">{sub.grade}</td>
                        <td className="p-2 text-right font-mono font-bold">{sub.gradePoint * sub.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* SGPA & Result Summary Box */}
                <div className="grid grid-cols-3 gap-4 border border-slate-700 p-4 text-center bg-[#fafafa]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#666666] block">Semester SGPA</span>
                    <span className="text-2xl font-semibold tracking-tight text-slate-900">{semesterResult.sgpa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#666666] block">Total Credits Earned</span>
                    <span className="text-2xl font-semibold tracking-tight text-slate-900">{semesterResult.totalCredits}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#666666] block">Result Status</span>
                    <span className="text-2xl font-semibold tracking-tight text-slate-900">{semesterResult.resultStatus}</span>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="flex justify-between items-end pt-12 text-xs">
                  <div className="space-y-1">
                    <p className="text-[11px] text-[#777777]">Date of Issue: {semesterResult.issuedDate}</p>
                    <p className="text-[11px] text-[#777777]">Pune, Maharashtra</p>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-36 border-b border-slate-700 pb-1 mb-1 font-serif italic text-sm">
                      Vikramaditya S.
                    </div>
                    <span className="font-bold text-[10px] uppercase block">Dean of Academics</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-36 border-b border-slate-700 pb-1 mb-1 font-serif italic text-sm">
                      Dr. K. N. Rao
                    </div>
                    <span className="font-bold text-[10px] uppercase block">Controller of Examinations</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 4. ATTENDANCE & DEFAULTERS MODULE                           */}
          {/* ============================================================ */}
          {activeModule === 'attendance' && attendanceData && (
            <div className="animate-fade-in space-y-6">
              
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Attendance & Defaulter Tracking</h1>
                <p className="text-xs text-[#666666] mt-0.5">Subject-wise lecture and lab attendance monitoring. Minimum 75% attendance mandatory for exam eligibility.</p>
              </div>

              {/* Defaulter Alert Banner */}
              {attendanceData.isOverallDefaulter ? (
                <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <h3 className="text-sm font-bold text-red-700">Attendance Defaulter Warning</h3>
                    <p className="text-xs text-red-600 mt-0.5">
                      Your aggregate attendance is currently <strong className="font-mono">{attendanceData.overallPercentage}%</strong>, which is below the university threshold (75%). You may be debarred from writing End-Semester Examinations if uncorrected.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <div className="text-xl">✓</div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-800">Academic Attendance Clear</h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your current aggregate attendance is <strong className="font-mono">{attendanceData.overallPercentage}%</strong>. You are completely eligible for upcoming examinations.
                    </p>
                  </div>
                </div>
              )}

              {/* Subject Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceData.breakdown.map((item) => (
                  <div key={item.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.subjectCode}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isDefaulter ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.isDefaulter ? 'DEFAULTER' : 'REGULAR'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.subjectName}</h4>
                      <p className="text-xs text-[#777777] mt-0.5">{item.type}</p>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#666666]">Attended: <strong className="text-slate-900 font-mono">{item.totalAttended} / {item.totalConducted}</strong> sessions</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{item.percentage}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#eaeaea] h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.isDefaulter ? 'bg-red-500' : 'bg-[#0072bc]'
                          }`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 5. EXAMINATION & DIGITAL HALL TICKET MODULE                 */}
          {/* ============================================================ */}
          {activeModule === 'hallticket' && hallTicket && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex items-center justify-between print-hidden">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Digital Examination Hall Ticket</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Official admission card for End-Semester Theory & Practical Examinations</p>
                </div>

                {hallTicket.isEligible && (
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#0072bc] text-white text-xs font-bold rounded-lg hover:bg-[#00508a] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print Hall Ticket
                  </button>
                )}
              </div>

              {/* Hall Ticket Card */}
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#eaeaea] print-sheet space-y-6 shadow-sm">
                
                {/* Header */}
                <div className="text-center border-b-2 border-slate-700 pb-4 space-y-1">
                  <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900">{hallTicket.institution}</h2>
                  <p className="text-xs font-bold uppercase text-[#444444]">End-Semester Examination Admit Card (Summer 2026)</p>
                  <p className="text-[11px] font-mono text-[#666666]">{hallTicket.hallTicketNumber}</p>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs py-2 border-b border-[#eaeaea]">
                  <div>
                    <span className="text-[#888888] font-bold text-[10px] uppercase block">Student Name</span>
                    <span className="font-bold text-slate-900 block">{hallTicket.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold text-[10px] uppercase block">PRN Number</span>
                    <span className="font-mono font-bold text-slate-900 block">{hallTicket.prnNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold text-[10px] uppercase block">Department</span>
                    <span className="font-bold text-slate-900 block">{hallTicket.department}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] font-bold text-[10px] uppercase block">Exam Center</span>
                    <span className="font-bold text-slate-900 block">VIT Pune (Main)</span>
                  </div>
                </div>

                {/* Exam Timetable */}
                <table className="w-full text-left text-xs border border-slate-700">
                  <thead className="bg-[#f0f0f0] border-b border-slate-700 font-bold uppercase">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Course Code</th>
                      <th className="p-2 border-r border-slate-700">Course Title</th>
                      <th className="p-2 border-r border-slate-700 text-center">Exam Date</th>
                      <th className="p-2 border-r border-slate-700 text-center">Slot Time</th>
                      <th className="p-2 text-center">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-medium">
                    {hallTicket.timetable.map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono font-bold border-r border-slate-700">{t.subjectCode}</td>
                        <td className="p-2 border-r border-slate-700">{t.subjectName}</td>
                        <td className="p-2 text-center border-r border-slate-700 font-bold">{t.examDate}</td>
                        <td className="p-2 text-center border-r border-slate-700 text-[#555555]">{t.examTime}</td>
                        <td className="p-2 text-center text-gray-300 font-serif">_______________</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Instructions */}
                <div className="border border-slate-700 p-4 text-[11px] space-y-1 bg-[#fafafa]">
                  <strong className="block font-bold uppercase text-slate-900">Important Examination Regulations:</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#444444]">
                    {hallTicket.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer Signatures */}
                <div className="flex justify-between items-end pt-8 text-xs">
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-700 pb-1 mb-1"></div>
                    <span className="font-bold text-[10px] uppercase">Candidate Signature</span>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-700 pb-1 mb-1 font-serif italic text-xs">Dr. K. N. Rao</div>
                    <span className="font-bold text-[10px] uppercase">Controller of Examinations</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 6. FEES & INVOICES MODULE                                  */}
          {/* ============================================================ */}
          {activeModule === 'fees' && feeData && (
            <div className="animate-fade-in space-y-6">
              
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Fees, Invoices & Receipts</h1>
                <p className="text-xs text-[#666666] mt-0.5">Manage tuition fee schedules, verify clearance status, and download digital payment receipts.</p>
              </div>

              {/* Fee Breakdown Structure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fee Structure Card */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Annual Fee Structure Breakdown (AY 2025-26)</h3>
                  
                  <div className="space-y-3">
                    {feeData.feeStructure.map((fee, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#eaeaea]">
                        <span className="text-[#666666]">{fee.title}</span>
                        <span className="font-mono font-bold text-slate-900">₹{fee.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-sm font-bold pt-2">
                      <span>Total Semester Dues</span>
                      <span className="font-mono text-slate-900">₹85,000</span>
                    </div>
                  </div>
                </div>

                {/* Latest Payment Status Card */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#888888] uppercase">Current Semester Clearance</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">PAID & VERIFIED</span>
                    </div>
                    <p className="text-3xl font-semibold tracking-tight text-slate-900">₹85,000.00</p>
                    <p className="text-xs text-[#777777] mt-1">Transaction Ref: <span className="font-mono font-bold text-slate-900">TXN-VIT-89421</span></p>
                  </div>

                  <button 
                    onClick={() => window.print()}
                    className="w-full mt-6 py-2.5 bg-[#0072bc] text-white text-xs font-bold rounded-lg hover:bg-[#00508a] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Fee Receipt
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 7. NOTICES & CIRCULARS MODULE                              */}
          {/* ============================================================ */}
          {activeModule === 'notices' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notices & Academic Circulars</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Official announcements from Deans, Heads of Departments, and Student Council</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['ALL', 'EXAM', 'ACADEMIC', 'CIRCULAR', 'PLACEMENT', 'EVENT'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNoticeFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                        noticeFilter === cat 
                          ? 'bg-[#0072bc] text-white' 
                          : 'bg-white text-[#666666] border border-[#eaeaea] hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice Cards List */}
              <div className="space-y-4">
                {filteredNotices.map((notice) => (
                  <div key={notice.id} className="glass-card p-6 rounded-2xl hover:border-slate-700 transition-all space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                          notice.priority === 'URGENT' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-[#0072bc] text-white'
                        }`}>
                          {notice.category}
                        </span>
                        {notice.priority === 'URGENT' && (
                          <span className="text-[10px] font-bold text-red-600 uppercase">URGENT ACTION</span>
                        )}
                      </div>
                      <span className="text-xs text-[#888888] font-medium">{notice.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                    <p className="text-xs text-[#555555] leading-relaxed font-normal">{notice.content}</p>
                    
                    <div className="pt-2 border-t border-[#eaeaea] flex items-center justify-between text-xs text-[#888888]">
                      <span>Issued by: <strong className="text-slate-900">{notice.author}</strong></span>
                      <span className="font-mono text-[11px]">Notice Ref #{notice.id}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 8. STUDENT PROFILE MODULE                                   */}
          {/* ============================================================ */}
          {activeModule === 'profile' && overview && (
            <div className="animate-fade-in space-y-6 max-w-3xl">
              
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Student Profile & Credentials</h1>
                <p className="text-xs text-[#666666] mt-0.5">Permanent university registration records and contact details</p>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-8 border-b border-[#eaeaea] flex items-center gap-6 bg-gradient-to-r from-white to-gray-50">
                  <div className="w-20 h-20 bg-[#0072bc] text-white rounded-2xl flex items-center justify-center text-3xl font-semibold tracking-tight shadow-md flex-shrink-0">
                    {overview.student.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{overview.student.name}</h2>
                    <p className="text-xs font-mono font-bold text-[#666666] mt-0.5">PRN: {overview.student.prnNumber}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">
                      Enrolled Student (Regular)
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-xs">
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Email Address</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">{overview.student.email}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Mobile Number</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">{overview.student.phone}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Department</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">{overview.student.department}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Academic Batch</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">{overview.student.batch}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Current Semester</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">Semester {overview.student.currentSemester}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#888888] uppercase text-[10px]">Degree Program</dt>
                      <dd className="mt-1 font-semibold text-slate-900 text-sm">Bachelor of Technology (B.Tech)</dd>
                    </div>
                  </dl>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
