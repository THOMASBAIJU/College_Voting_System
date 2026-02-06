import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Calendar, ArrowLeft, CheckCircle, User, AlertCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const VoterDashboard = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [results, setResults] = useState(null); // Results for finished election
    const [stats, setStats] = useState({});
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/elections');
            const activeElections = res.data.filter(e => e.status === 'active' || e.status === 'finished');
            setElections(activeElections);

            // Fetch stats for each election
            activeElections.forEach(election => fetchElectionStats(election._id));
        } catch (error) {
            console.error(error);
            toast.error('Failed to load elections');
        }
    };

    const fetchElectionStats = async (electionId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/elections/${electionId}/stats`);
            setStats(prev => ({ ...prev, [electionId]: res.data }));
        } catch (error) {
            console.error("Failed to load stats for election " + electionId);
        }
    };

    const handleElectionClick = async (election) => {
        if (election.status === 'finished') {
            try {
                const res = await axios.get(`http://localhost:5000/api/votes/${election._id}/results`);
                setResults(res.data);
                setCandidates([]); // Clear candidates list mode
            } catch (error) {
                toast.error('Failed to load results');
            }
        } else {
            setResults(null);
            fetchCandidates(election._id);
        }
        setSelectedElection(election);
    };

    const fetchCandidates = async (electionId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/elections/${electionId}/candidates`);
            setCandidates(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load candidates');
        }
    };

    const handleVote = async (electionId, category, candidateId) => {
        try {
            await axios.post('http://localhost:5000/api/votes', {
                electionId,
                category,
                candidateId
            });
            toast.success('Vote cast successfully!');
            // Refresh logic if needed
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to vote');
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
                    <Vote className="w-8 h-8 text-primary-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-display">Voting Center</h2>
                    <p className="text-slate-400">Cast your secure vote</p>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {!selectedElection ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {elections.length === 0 ? (
                            <div className="col-span-full text-center py-12 glass rounded-xl border-dashed border-2 border-slate-700">
                                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No active elections found.</p>
                            </div>
                        ) : elections.map(election => (
                            <motion.div
                                key={election._id}
                                layoutId={election._id}
                                className="glass-card p-6 flex flex-col cursor-pointer hover:bg-white/10 transition-colors group"
                                onClick={() => handleElectionClick(election)}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-300 transition-colors">{election.title}</h3>
                                    {election.status === 'finished' && (
                                        <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                                            Results Published
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(election.date).toLocaleDateString()}
                                </p>

                                {stats[election._id] && (
                                    <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>{stats[election._id].votedCount} / {stats[election._id].totalVoters} Voters</span>
                                            <span className="text-primary-300 font-bold">{stats[election._id].turnout}% Voted</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stats[election._id].turnout}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}
                                <button className={`mt-auto btn-primary w-full flex items-center justify-center gap-2 ${election.status === 'finished' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                                    {election.status === 'finished' ? 'View Results' : 'Vote Now'} <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <button
                            onClick={() => setSelectedElection(null)}
                            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Elections
                        </button>

                        <div className="mb-8">
                            <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">{selectedElection.title}</h3>
                            <p className="text-slate-400 mt-2">
                                {results ? 'Official Election Results' : 'Please cast your vote for each category below'}
                            </p>
                        </div>

                        {results ? (
                            <div className="space-y-12">
                                {Object.entries(results).map(([category, candidates]) => {
                                    const maxVotes = Math.max(...candidates.map(c => c.voteCount));
                                    const winners = candidates.filter(c => c.voteCount === maxVotes && c.voteCount > 0);

                                    return (
                                        <div key={category} className="glass-card p-6 md:p-8 relative overflow-hidden">
                                            {/* Winner Confetti Effect (CSS only for now, can use library later) */}
                                            {winners.length > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full blur-3xl"></div>}

                                            <h4 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-3 relative z-10">
                                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                                {category}
                                            </h4>

                                            <div className="space-y-4 relative z-10">
                                                {candidates.map(candidate => {
                                                    const isWinner = candidate.voteCount === maxVotes && candidate.voteCount > 0;
                                                    return (
                                                        <div key={candidate._id} className={`p-4 rounded-xl border ${isWinner ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-white/5 border-white/5'}`}>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isWinner ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-slate-600'}`}>
                                                                        {candidate.user?.photo ?
                                                                            <img src={candidate.user.photo} className="w-full h-full object-cover" /> :
                                                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">{candidate.user?.username?.[0]}</div>
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        <h5 className={`font-bold text-lg ${isWinner ? 'text-yellow-400' : 'text-slate-200'}`}>
                                                                            {candidate.user?.fullName || candidate.user?.username}
                                                                            {isWinner && <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Winner</span>}
                                                                        </h5>
                                                                        {isWinner && <p className="text-yellow-200/50 text-xs italic">Congratulations on your victory!</p>}
                                                                    </div>
                                                                </div>
                                                                <span className="text-2xl font-bold font-display">{candidate.voteCount}</span>
                                                            </div>
                                                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(candidate.voteCount / (candidates.reduce((a, c) => a + c.voteCount, 0) || 1)) * 100}%` }}
                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                    className={`h-full ${isWinner ? 'bg-yellow-400' : 'bg-slate-500'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {selectedElection.categories.map(category => (
                                    <div key={category._id} className="glass-card p-6 md:p-8">
                                        <h4 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                                            <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                                            {category.name}
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {candidates.filter(c => c.category === category.name).map(candidate => (
                                                <div key={candidate._id} className="bg-white/5 rounded-xl p-6 flex flex-col items-center hover:bg-white/10 transition-colors border border-white/5 hover:border-primary-500/50">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full mb-4 overflow-hidden border-4 border-white/10 shadow-lg flex items-center justify-center">
                                                        {candidate.user && candidate.user.photo ?
                                                            <img src={candidate.user.photo} alt={candidate.user.fullName} className="w-full h-full object-cover" /> :
                                                            <User className="w-10 h-10 text-slate-500" />
                                                        }
                                                    </div>
                                                    <h5 className="font-bold text-lg text-center mb-1">{candidate.user?.fullName || candidate.user?.username}</h5>
                                                    {candidate.description && (
                                                        <p className="text-sm text-slate-400 text-center mb-4 italic">"{candidate.description}"</p>
                                                    )}
                                                    <button
                                                        onClick={() => handleVote(selectedElection._id, category.name, candidate._id)}
                                                        className="mt-auto btn-primary w-full py-2 text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Vote
                                                    </button>
                                                </div>
                                            ))}
                                            {candidates.filter(c => c.category === category.name).length === 0 && (
                                                <div className="col-span-full py-8 text-center text-slate-500 italic border-2 border-dashed border-white/5 rounded-xl">
                                                    No candidates registered for {category.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoterDashboard;
