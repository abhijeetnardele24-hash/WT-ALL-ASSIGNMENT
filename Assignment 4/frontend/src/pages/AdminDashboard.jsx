import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'curriculum', 'notices'
  
  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState(6);

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    prnNumber: '',
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Computer Engineering',
    currentSemester: 6,
    batch: '2022-2026',
    phone: '+91 98765 43210',
    password: ''
  });

  // Subject Modal State
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    code: '',
    name: '',
    credits: 4,
    semester: 6,
    department: 'Computer Engineering',
    type: 'Core'
  });

  // Notice Modal State
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    category: 'ACADEMIC',
    content: '',
    priority: 'NORMAL',
    author: 'Dean of Academics, VIT'
  });

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, subjectsRes, noticesRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/users'),
        axiosClient.get('/admin/subjects'),
        axiosClient.get('/academic/notices')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSubjects(subjectsRes.data);
      setNotices(noticesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      showToast('Error loading administration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // --- USER CRUD ---
  const handleOpenUserModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setUserFormData({
        prnNumber: u.prnNumber,
        name: u.name,
        email: u.email || '',
        role: u.role,
        department: u.department || 'Computer Engineering',
        currentSemester: u.currentSemester || 6,
        batch: u.batch || '2022-2026',
        phone: u.phone || '+91 98765 43210',
        password: ''
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        prnNumber: '',
        name: '',
        email: '',
        role: 'STUDENT',
        department: 'Computer Engineering',
        currentSemester: 6,
        batch: '2022-2026',
        phone: '+91 98765 43210',
        password: 'password123'
      });
    }
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosClient.put(`/admin/users/${editingUser.id}`, userFormData);
        showToast('User credentials updated successfully!');
      } else {
        await axiosClient.post('/admin/users', userFormData);
        showToast('New user account provisioned!');
      }
      setIsUserModalOpen(false);
      fetchAllAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleUserDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user and all associated academic records?')) {
      try {
        await axiosClient.delete(`/admin/users/${id}`);
        showToast('User account deleted.');
        fetchAllAdminData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // --- SUBJECT CRUD ---
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/admin/subjects', subjectFormData);
      showToast('New course added to syllabus!');
      setIsSubjectModalOpen(false);
      setSubjectFormData({ code: '', name: '', credits: 4, semester: 6, department: 'Computer Engineering', type: 'Core' });
      fetchAllAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create subject');
    }
  };

  const handleSubjectDelete = async (id) => {
    if (confirm('Delete this course from the university curriculum?')) {
      try {
        await axiosClient.delete(`/admin/subjects/${id}`);
        showToast('Course removed from syllabus.');
        fetchAllAdminData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  // --- NOTICES CRUD ---
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/admin/notices', noticeFormData);
      showToast('Circular published successfully!');
      setIsNoticeModalOpen(false);
      setNoticeFormData({ title: '', category: 'ACADEMIC', content: '', priority: 'NORMAL', author: 'Dean of Academics, VIT' });
      fetchAllAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to broadcast notice');
    }
  };

  const handleNoticeDelete = async (id) => {
    if (confirm('Delete this notice from public noticeboard?')) {
      try {
        await axiosClient.delete(`/admin/notices/${id}`);
        showToast('Notice deleted.');
        fetchAllAdminData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete notice');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.prnNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredSubjects = subjects.filter(s => s.semester === selectedSemester);

  return (
    <div className="min-h-screen flex bg-[#fafafa]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#eaeaea] hidden lg:flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Branding */}
          <div className="h-20 flex items-center px-6 border-b border-[#eaeaea]">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-black text-sm rounded-lg shadow-sm mr-3">
              ADM
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-black block">Administration</span>
              <span className="text-[11px] text-[#888888] font-medium block">Institutional Controller</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'System Overview & Stats', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'users', label: 'User Directory (CRUD)', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { id: 'curriculum', label: 'Curriculum & Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { id: 'notices', label: 'Circulars & Notices', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id 
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
        
        {/* User Profile */}
        <div className="p-4 border-t border-[#eaeaea]">
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#fafafa] rounded-xl border border-[#eaeaea]">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-black truncate">{user?.name}</p>
              <p className="text-[11px] text-red-600 font-bold uppercase truncate">System Admin</p>
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

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#eaeaea] flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-black uppercase tracking-wider">Enterprise ERP System Active</span>
          </div>
          <div className="text-xs text-[#777777] font-medium hidden sm:block">
            Database: <strong className="text-black font-mono">SQLite (vit_results.sqlite)</strong>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          {/* ============================================================ */}
          {/* 1. OVERVIEW & HEALTH MODULE                                 */}
          {/* ============================================================ */}
          {activeTab === 'overview' && stats && (
            <div className="animate-fade-in space-y-8">
              
              <div>
                <h1 className="text-2xl font-black text-black">Institutional ERP Control Dashboard</h1>
                <p className="text-xs text-[#666666] mt-0.5">Global operational metrics, database telemetry, and institutional controls.</p>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Total Enrolled Students</span>
                  <p className="text-4xl font-black text-black my-2">{stats.totalStudents}</p>
                  <span className="text-xs text-emerald-600 font-semibold">100% Verified Profiles</span>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Faculty Members</span>
                  <p className="text-4xl font-black text-black my-2">{stats.totalFaculty}</p>
                  <span className="text-xs text-[#777777]">Authorized Staff</span>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Active Syllabus Courses</span>
                  <p className="text-4xl font-black text-black my-2">{stats.totalSubjects}</p>
                  <span className="text-xs text-[#777777]">Across 8 Semesters</span>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#888888] uppercase">Institution Avg CGPA</span>
                  <p className="text-4xl font-black text-black my-2">{stats.averageCGPA}</p>
                  <span className="text-xs text-black font-semibold">AY 2025-26</span>
                </div>
              </div>

              {/* Diagnostic Server Status Card */}
              <div className="glass-card p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-white via-white to-gray-50">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <h3 className="text-base font-bold text-black">Database & Server Operational</h3>
                  </div>
                  <p className="text-xs text-[#666666]">
                    REST API endpoints responding with sub-10ms latency. Multi-semester calculation engines active.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleOpenUserModal()}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm flex items-center gap-2"
                  >
                    + Provision User
                  </button>
                  <button 
                    onClick={() => setIsSubjectModalOpen(true)}
                    className="px-4 py-2 bg-white text-black border border-[#eaeaea] text-xs font-bold rounded-lg hover:bg-gray-50 shadow-sm"
                  >
                    + Add Course
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 2. USER MANAGEMENT (CRUD)                                   */}
          {/* ============================================================ */}
          {activeTab === 'users' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-black">User Directory & Provisioning</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Manage Student PRNs, Faculty Credentials, and Administrative Access</p>
                </div>

                <button 
                  onClick={() => handleOpenUserModal()}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm flex items-center gap-2 self-start"
                >
                  + Add New User
                </button>
              </div>

              {/* Search & Role Filter Bar */}
              <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search PRN or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input w-full px-3 py-2 text-xs rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
                  {['ALL', 'STUDENT', 'FACULTY', 'ADMIN'].map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        roleFilter === role ? 'bg-black text-white' : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Data Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fafafa] border-b border-[#eaeaea] text-[#777777] font-bold uppercase">
                      <tr>
                        <th className="p-4">PRN / Username</th>
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4 text-center">Role</th>
                        <th className="p-4 text-center">Semester / Dept</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaea] font-medium">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="p-4 font-mono font-bold text-black">{u.prnNumber}</td>
                          <td className="p-4 font-bold text-black">{u.name}</td>
                          <td className="p-4 text-[#666666]">{u.email || 'N/A'}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                              u.role === 'FACULTY' ? 'bg-purple-100 text-purple-800' :
                              'bg-black text-white'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-center text-[#666666]">
                            {u.role === 'STUDENT' ? `Sem ${u.currentSemester}` : u.department}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              onClick={() => handleOpenUserModal(u)}
                              className="text-xs font-bold text-black hover:underline"
                            >
                              Edit
                            </button>
                            {u.id !== user?.id && (
                              <button 
                                onClick={() => handleUserDelete(u.id)}
                                className="text-xs font-bold text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
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
          {/* 3. CURRICULUM & COURSES BUILDER                              */}
          {/* ============================================================ */}
          {activeTab === 'curriculum' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-black">Curriculum & Course Syllabus</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Manage credit configurations and syllabus courses across Semesters 1 to 8</p>
                </div>

                <button 
                  onClick={() => setIsSubjectModalOpen(true)}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm flex items-center gap-2 self-start"
                >
                  + Add Course
                </button>
              </div>

              {/* Semester Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#eaeaea]">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                      selectedSemester === sem ? 'bg-black text-white' : 'bg-white border border-[#eaeaea] text-[#666666] hover:border-black'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>

              {/* Course Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafafa] border-b border-[#eaeaea] text-[#777777] font-bold uppercase">
                    <tr>
                      <th className="p-4">Course Code</th>
                      <th className="p-4">Course Title</th>
                      <th className="p-4 text-center">Type</th>
                      <th className="p-4 text-center">Credits</th>
                      <th className="p-4">Department</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaea] font-medium">
                    {filteredSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="p-4 font-mono font-bold text-black">{sub.code}</td>
                        <td className="p-4 font-bold text-black">{sub.name}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded">
                            {sub.type}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-black">{sub.credits}</td>
                        <td className="p-4 text-[#666666]">{sub.department}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleSubjectDelete(sub.id)}
                            className="text-xs font-bold text-red-600 hover:underline"
                          >
                            Delete
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
          {/* 4. CIRCULARS & NOTICES PUBLISHER                            */}
          {/* ============================================================ */}
          {activeTab === 'notices' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-black">Official Circulars & Announcements</h1>
                  <p className="text-xs text-[#666666] mt-0.5">Broadcast institutional circulars, exam schedules, and event notices</p>
                </div>

                <button 
                  onClick={() => setIsNoticeModalOpen(true)}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-[#222222] shadow-sm flex items-center gap-2 self-start"
                >
                  + Broadcast Notice
                </button>
              </div>

              {/* Notice Cards */}
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          notice.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-black text-white'
                        }`}>
                          {notice.category}
                        </span>
                        <span className="text-xs text-[#888888]">{notice.date}</span>
                      </div>
                      <button 
                        onClick={() => handleNoticeDelete(notice.id)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Delete Notice
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-black">{notice.title}</h3>
                      <p className="text-xs text-[#555555] mt-1 leading-relaxed">{notice.content}</p>
                    </div>

                    <div className="text-[11px] text-[#888888] pt-2 border-t border-[#eaeaea]">
                      Published by: <strong className="text-black">{notice.author}</strong>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* --- MODAL: PROVISION / EDIT USER --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#eaeaea]">
            <div className="flex justify-between items-center border-b border-[#eaeaea] pb-3">
              <h3 className="text-base font-bold text-black">
                {editingUser ? 'Edit User Credentials' : 'Provision New User'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-xs font-bold text-[#888888] hover:text-black">✕</button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#666666] mb-1">PRN / Registration ID</label>
                <input
                  type="text"
                  required
                  value={userFormData.prnNumber}
                  onChange={(e) => setUserFormData({...userFormData, prnNumber: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Email Address</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#666666] mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#666666] mb-1">Current Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={userFormData.currentSemester}
                    onChange={(e) => setUserFormData({...userFormData, currentSemester: parseInt(e.target.value)})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Password</label>
                <input
                  type="password"
                  placeholder={editingUser ? 'Leave blank to keep unchanged' : 'Initial password'}
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaeaea]">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-[#666666] font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white font-bold rounded-lg shadow-sm"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD COURSE --- */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#eaeaea]">
            <div className="flex justify-between items-center border-b border-[#eaeaea] pb-3">
              <h3 className="text-base font-bold text-black">Add Course to Syllabus</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-xs font-bold text-[#888888] hover:text-black">✕</button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#666666] mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS608"
                  value={subjectFormData.code}
                  onChange={(e) => setSubjectFormData({...subjectFormData, code: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Embedded Systems & RTOS"
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({...subjectFormData, name: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#666666] mb-1">Semester (1-8)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={subjectFormData.semester}
                    onChange={(e) => setSubjectFormData({...subjectFormData, semester: parseInt(e.target.value)})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#666666] mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={subjectFormData.credits}
                    onChange={(e) => setSubjectFormData({...subjectFormData, credits: parseInt(e.target.value)})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Course Type</label>
                <select
                  value={subjectFormData.type}
                  onChange={(e) => setSubjectFormData({...subjectFormData, type: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                >
                  <option value="Core">Core</option>
                  <option value="Professional Elective">Professional Elective</option>
                  <option value="Open Elective">Open Elective</option>
                  <option value="Lab">Lab / Practical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaeaea]">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-[#666666] font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white font-bold rounded-lg shadow-sm"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: BROADCAST NOTICE --- */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#eaeaea]">
            <div className="flex justify-between items-center border-b border-[#eaeaea] pb-3">
              <h3 className="text-base font-bold text-black">Broadcast Official Circular</h3>
              <button onClick={() => setIsNoticeModalOpen(false)} className="text-xs font-bold text-[#888888] hover:text-black">✕</button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#666666] mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remedial Exam Schedule"
                  value={noticeFormData.title}
                  onChange={(e) => setNoticeFormData({...noticeFormData, title: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#666666] mb-1">Category</label>
                  <select
                    value={noticeFormData.category}
                    onChange={(e) => setNoticeFormData({...noticeFormData, category: e.target.value})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Examination</option>
                    <option value="CIRCULAR">Circular</option>
                    <option value="PLACEMENT">Placement</option>
                    <option value="EVENT">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#666666] mb-1">Priority</label>
                  <select
                    value={noticeFormData.priority}
                    onChange={(e) => setNoticeFormData({...noticeFormData, priority: e.target.value})}
                    className="glass-input w-full px-3 py-2 rounded-lg font-bold"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#666666] mb-1">Content / Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Type the full announcement details here..."
                  value={noticeFormData.content}
                  onChange={(e) => setNoticeFormData({...noticeFormData, content: e.target.value})}
                  className="glass-input w-full px-3 py-2 rounded-lg leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eaeaea]">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-[#666666] font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white font-bold rounded-lg shadow-sm"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
