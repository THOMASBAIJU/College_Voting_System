import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, FileText, UserPlus, Trash2, Shield, AlertCircle, X, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [elections, setElections] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState('');
    const [candidateUsername, setCandidateUsername] = useState('');
    const [selectedElection, setSelectedElection] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [manifesto, setManifesto] = useState('');

    // Results Modal State
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState({});

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchElections();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load users');
        }
    };

    const fetchElections = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/elections');
            setElections(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load elections');
        }
    };

    const viewResults = async (electionId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/votes/${electionId}/results`);
            setResults(res.data);
            setShowResults(true);
        } catch (error) {
            toast.error('Failed to load results');
        }
    };

    const handleCreateElection = async (e) => {
        e.preventDefault();
        try {
            const categoryList = categories.split(',').map(c => ({ name: c.trim() }));
            await axios.post('http://localhost:5000/api/elections', {
                title,
                date,
                categories: categoryList
            });
            fetchElections();
            setTitle('');
            setDate('');
            setCategories('');
            toast.success('Election created successfully');
        } catch (error) {
            toast.error('Failed to create election');
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/elections/candidate', {
                username: candidateUsername,
                electionId: selectedElection,
                category: selectedCategory,
                manifesto
            });
            toast.success('Candidate added successfully');
            setCandidateUsername('');
            setManifesto('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add candidate');
        }
    };

    const handleUpdateStatus = async (electionId, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/elections/${electionId}/status`, { status });
            toast.success(`Election marked as ${status}`);
            fetchElections();
        } catch (error) {
            toast.error('Failed to update election status');
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Shield className="w-8 h-8 text-primary-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-display">Admin Dashboard</h2>
                    <p className="text-slate-400">Manage elections and candidates</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Election Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Plus className="w-5 h-5 text-green-400" />
                        <h3 className="text-xl font-bold">Create New Election</h3>
                    </div>
                    <form onSubmit={handleCreateElection} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="e.g. Student Council 2024"
                                    value={title} onChange={e => setTitle(e.target.value)} required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                                <input
                                    type="date"
                                    className="input-field pl-10"
                                    value={date} onChange={e => setDate(e.target.value)} required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Categories (comma separated)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Chairman, Secretary, Treasurer..."
                                value={categories} onChange={e => setCategories(e.target.value)} required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">
                            Create Election
                        </button>
                    </form>
                </motion.div>

                {/* Add Candidate Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <UserPlus className="w-5 h-5 text-blue-400" />
                        <h3 className="text-xl font-bold">Add Candidate</h3>
                    </div>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Select Election</label>
                            <select
                                className="input-field appearance-none"
                                value={selectedElection}
                                onChange={e => {
                                    setSelectedElection(e.target.value);
                                    setSelectedCategory('');
                                }}
                                required
                            >
                                <option value="" className="bg-slate-800">-- Select Election --</option>
                                {elections.map(e => (
                                    <option key={e._id} value={e._id} className="bg-slate-800">{e.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Select Category</label>
                            <select
                                className="input-field appearance-none"
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                required
                                disabled={!selectedElection}
                            >
                                <option value="" className="bg-slate-800">-- Select Category --</option>
                                {selectedElection && elections.find(e => e._id === selectedElection)?.categories.map(c => (
                                    <option key={c._id} value={c.name} className="bg-slate-800">{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Candidate</label>
                            <select
                                className="input-field appearance-none"
                                value={candidateUsername}
                                onChange={e => setCandidateUsername(e.target.value)}
                                required
                            >
                                <option value="" className="bg-slate-800">-- Select Candidate --</option>
                                {users.filter(u => u.role === 'candidate').map(user => (
                                    <option key={user._id} value={user.username} className="bg-slate-800">
                                        {user.fullName || user.username} ({user.username})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Manifesto (Short Description)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Vote for me because..."
                                value={manifesto} onChange={e => setManifesto(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full bg-gradient-to-r from-blue-600 to-blue-500">
                            Add Candidate
                        </button>
                    </form>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-xl font-bold mb-4 font-display">Active Elections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {elections.length === 0 ? (
                        <div className="col-span-full text-center py-12 glass rounded-xl border-dashed border-2 border-slate-700">
                            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No elections created yet.</p>
                        </div>
                    ) : elections.map(election => (
                        <div key={election._id} className="glass-card p-5 group hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-bold">{election.title}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${election.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-300'}`}>
                                    {election.status}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(election.date).toLocaleDateString()}
                            </p>
                            <div className="border-t border-white/10 pt-4">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Categories</h5>
                                <div className="flex flex-wrap gap-2">
                                    {election.categories.map(c => (
                                        <span key={c._id} className="text-xs bg-white/5 px-2 py-1 rounded text-slate-300">
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                {election.status === 'upcoming' && (
                                    <button
                                        onClick={() => handleUpdateStatus(election._id, 'active')}
                                        className="btn-primary py-1 px-3 text-sm bg-green-600 hover:bg-green-700 w-full"
                                    >
                                        Start Election
                                    </button>
                                )}
                                {election.status === 'active' && (
                                    <button
                                        onClick={() => handleUpdateStatus(election._id, 'finished')}
                                        className="btn-primary py-1 px-3 text-sm bg-red-600 hover:bg-red-700 w-full"
                                    >
                                        End Election
                                    </button>
                                )}
                                {election.status === 'finished' && (
                                    <button disabled className="btn-primary py-1 px-3 text-sm bg-slate-700 cursor-not-allowed w-full opacity-50">
                                        Election Ended
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
