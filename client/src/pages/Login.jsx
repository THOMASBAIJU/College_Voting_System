import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Shield, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [role, setRole] = useState('voter');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isRegistering) {
            try {
                await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
                toast.success('Registration successful! Please login.');
                setIsRegistering(false);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Registration failed');
            } finally {
                setIsLoading(false);
            }
        } else {
            const result = await login(username, password);
            setIsLoading(false);
            if (result.success) {
                toast.success(`Welcome back, ${result.result?.username || 'User'}!`);
                const userRole = result.result?.role || 'voter';
                if (userRole === 'admin') navigate('/admin');
                else navigate('/student');
            } else {
                toast.error(result.message);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500"></div>

                    <div className="text-center mb-8">
                        <motion.h2
                            key={isRegistering ? 'register' : 'login'}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200"
                        >
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </motion.h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            {isRegistering ? 'Join the secure voting platform' : 'Enter your credentials to access the system'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isRegistering && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-2 pb-2">
                                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-1">Role</label>
                                        <div className="relative group">
                                            <Shield className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
                                            <select
                                                className="input-field pl-10 appearance-none cursor-pointer"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                <option value="voter" className="bg-slate-800">Voter</option>
                                                <option value="candidate" className="bg-slate-800">Candidate</option>
                                                <option value="admin" className="bg-slate-800">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isRegistering ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                className="ml-2 text-primary-400 hover:text-primary-300 font-medium transition-colors focus:outline-none"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setUsername('');
                                    setPassword('');
                                }}
                            >
                                {isRegistering ? 'Login' : 'Register'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
