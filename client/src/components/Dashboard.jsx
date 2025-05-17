import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './Card';

const steps = [
  { label: 'Welcome', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" /></svg>
  ) },
  { label: 'Personal Info' },
  { label: 'Professional Info' },
  { label: 'Additional Info' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, logout, loading: authLoading, user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/form/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          const submissionsData = data.submissions || {};
          const submissionsArray = Object.values(submissionsData);
          setSubmissions(submissionsArray);
        } else if (response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(data.error || 'Failed to fetch submissions');
        }
      } catch (error) {
        setError('Error fetching submissions');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchSubmissions();
    }
  }, [token, authLoading, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-cyan-500/10">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-14 w-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-indigo-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with user info and logout */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-12 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex h-10 w-10 rounded-full bg-indigo-100 items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="bg-white/80 backdrop-blur-sm text-indigo-900 font-medium rounded-xl px-5 py-2.5 shadow-sm border border-white/30 transition-all duration-300 hover:shadow-md">
            {user?.email ? (
              <span>Welcome, <span className="font-semibold">{user.email}</span></span>
            ) : (
              <span>Welcome</span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/80 backdrop-blur-sm text-rose-600 hover:text-white hover:bg-rose-600 font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-rose-600"
        >
          <span>Logout</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
        {/* Welcome Card */}
        <Card className="w-full mb-12 p-8 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/50 animate-fade-in transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center w-full">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">Welcome to Your Dashboard</h1>
            <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
              Track and manage your form submissions from one centralized location. Review previous entries or create new ones.
            </p>
            
            <div className="mt-6 text-center">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
                {Array.isArray(submissions) ? (
                  <span>You have <span className="font-bold">{submissions.length}</span> {submissions.length === 1 ? 'submission' : 'submissions'}</span>
                ) : (
                  <span>No submissions found</span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => navigate('/form/page1')}
              className="mt-8 group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center">
                New Submission
                <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </Card>

        {error && (
          <div className="w-full mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-fade-in text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Submissions List */}
        <section className="w-full animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Submissions</h2>
            <div className="bg-white/80 backdrop-blur-sm text-indigo-800 px-4 py-2 rounded-xl shadow-sm border border-white/30">
              <span className="text-sm font-medium">Viewing as: </span>
              <span className="font-semibold">{user?.email || 'User'}</span>
            </div>
          </div>
          
          {!Array.isArray(submissions) || submissions.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-gray-500 shadow-sm animate-fade-in">
              <svg className="w-20 h-20 mx-auto mb-6 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-6">Your submissions will appear here</p>
              <button
                onClick={() => navigate('/form/page1')}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Create Your First Submission
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {submissions.map((submission, index) => (
                <div
                  key={submission._id || index}
                  className="group bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-indigo-200 animate-fade-in animate-delay"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 mr-3 text-white font-bold shadow">
                              {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Submission #{index + 1}</h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(submission.createdAt).toLocaleDateString()} at {new Date(submission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="bg-gray-50/70 p-5 rounded-xl shadow-sm transition-all duration-300 group-hover:shadow group-hover:bg-white">
                            <h4 className="font-semibold text-indigo-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Personal Information
                            </h4>
                            {submission.page1 ? (
                              <div className="space-y-2 text-sm">
                                <div className="flex">
                                  <span className="w-20 font-medium text-gray-600">Name:</span> 
                                  <span className="text-gray-800 font-medium">{submission.page1.name || 'N/A'}</span>
                                </div>
                                <div className="flex">
                                  <span className="w-20 font-medium text-gray-600">Email:</span> 
                                  <span className="text-gray-800">{submission.page1.email || 'N/A'}</span>
                                </div>
                                <div className="flex">
                                  <span className="w-20 font-medium text-gray-600">City:</span> 
                                  <span className="text-gray-800">{submission.page1.city || 'N/A'}</span>
                                </div>
                                <div className="flex">
                                  <span className="w-20 font-medium text-gray-600">State:</span> 
                                  <span className="text-gray-800">{submission.page1.state || 'N/A'}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">No personal information provided</div>
                            )}
                          </div>
                          
                          {/* Educational Status */}
                          <div className="bg-gray-50/70 p-5 rounded-xl shadow-sm transition-all duration-300 group-hover:shadow group-hover:bg-white">
                            <h4 className="font-semibold text-indigo-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              Educational Status
                            </h4>
                            {submission.page2 ? (
                              <div className="space-y-2 text-sm">
                                <div className="flex">
                                  <span className="font-medium text-gray-600 w-28">Studying:</span> 
                                  <span className={`font-medium ${submission.page2.isStudying === 'true' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {submission.page2.isStudying === 'true' ? 'Yes' : 'No'}
                                  </span>
                                </div>
                                {submission.page2.isStudying === 'true' && (
                                  <>
                                    <div className="flex">
                                      <span className="font-medium text-gray-600 w-28">Institution:</span> 
                                      <span className="text-gray-800">{submission.page2.studyLocation || 'N/A'}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium text-gray-600 w-28">Field:</span> 
                                      <span className="text-gray-800">{submission.page2.fieldOfStudy || 'N/A'}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">No educational information provided</div>
                            )}
                          </div>
                          
                          {/* Projects */}
                          <div className="bg-gray-50/70 p-5 rounded-xl shadow-sm md:col-span-2 transition-all duration-300 group-hover:shadow group-hover:bg-white">
                            <h4 className="font-semibold text-indigo-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              Projects
                            </h4>
                            {submission.page3 && submission.page3.projects && submission.page3.projects.length > 0 ? (
                              <div>
                                <div className="text-sm mb-3 text-gray-600">
                                  {submission.page3.projects.length} project{submission.page3.projects.length !== 1 ? 's' : ''} submitted
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {submission.page3.projects.map((project, idx) => (
                                    <div 
                                      key={idx} 
                                      className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm transition-all duration-300 hover:shadow hover:border-indigo-100 transform hover:-translate-y-1"
                                    >
                                      <div className="font-semibold text-gray-800 mb-1">{project.title || 'Untitled Project'}</div>
                                      <div className="text-xs text-gray-600 line-clamp-2 mb-2">{project.description || 'No description'}</div>
                                      {project.githubLink && (
                                        <a 
                                          href={project.githubLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                        >
                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                                          </svg>
                                          GitHub Repository
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic">No projects submitted</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 lg:ml-8 lg:self-center">
                        <button
                          onClick={() => navigate(`/form/edit/${submission._id}`)}
                          className="w-full lg:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow transform hover:-translate-y-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>View/Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="mt-12 w-full max-w-5xl mx-auto text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Multi-Step Form Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard; 