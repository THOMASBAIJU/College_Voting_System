import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Home, Shield, Vote } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getHomeRoute = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        return '/student';
    };

    const navLinks = [
        { path: getHomeRoute(), label: 'Home', icon: Home, roles: ['admin', 'voter', 'candidate', null] },
        { path: '/admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
        { path: '/student', label: 'Election Center', icon: Vote, roles: ['voter', 'candidate'] },
    ];

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden text-white font-sans selection:bg-primary-500 selection:text-white">

            {/* Background Texture/Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="glass rounded-2xl flex h-16 items-center justify-between px-6">
                        <div className="flex items-center">
                            <Link to={getHomeRoute()} className="flex items-center gap-2 text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                                <Vote className="w-8 h-8 text-primary-300" />
                                <span>VoteSystem</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                (!link.roles.includes(null) && !user) ? null :
                                    (link.roles.includes(null) || (user && link.roles.includes(user.role))) && (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`relative group flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${location.pathname === link.path ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.label}
                                            {location.pathname === link.path && (
                                                <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />
                                            )}
                                        </Link>
                                    )
                            ))}

                            <div className="h-6 w-px bg-white/20 mx-2"></div>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-200">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center font-bold shadow-lg border border-white/20">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden lg:inline capitalize font-medium">{user.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full hover:bg-white/10 text-red-300 hover:text-red-200 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary">
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                                {isMobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-24 left-4 right-4 z-50 glass rounded-xl p-4 flex flex-col space-y-4"
                        >
                            {navLinks.map((link) => (
                                (!link.roles.includes(null) && !user) ? null :
                                    (link.roles.includes(null) || (user && link.roles.includes(user.role))) && (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === link.path ? 'bg-primary-500/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                                        >
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    )
                            ))}
                            {user ? (
                                <>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="capitalize font-medium">{user.username}</span>
                                        </div>
                                        <button onClick={handleLogout} className="text-red-300">
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center">
                                    Sign In
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content with Transition */}
            <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 relative z-10 container mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-auto bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                    <p>&copy; 2024 College Voting System. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
