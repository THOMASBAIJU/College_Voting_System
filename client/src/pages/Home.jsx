import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Vote, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-20 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl -z-10"
                ></motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold font-display leading-tight"
                >
                    Secure Blockchain <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-purple-300">
                        Voting System
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-300 max-w-2xl mx-auto"
                >
                    Experience the future of democracy. Transparent, tamper-proof, and accessible digital elections for your university.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center gap-4"
                >
                    {user ? (
                        <div className="glass-card p-8 flex flex-col items-center space-y-4 max-w-md mx-auto">
                            <p className="text-lg font-medium">Welcome back, <span className="text-primary-300">{user.username}</span></p>
                            <div className="flex gap-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="btn-primary flex items-center gap-2">
                                        <Shield className="w-5 h-5" /> Admin Dashboard
                                    </Link>
                                )}
                                {(user.role === 'voter' || user.role === 'candidate') && (
                                    <Link to="/student" className="btn-primary flex items-center gap-2">
                                        <Vote className="w-5 h-5" /> Voting Center
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login" className="btn-primary flex items-center gap-2 text-lg px-8">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="#features" className="px-8 py-3 rounded-lg font-semibold border border-white/20 hover:bg-white/10 transition-colors">
                                Learn More
                            </a>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Features Grid */}
            <motion.section
                id="features"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
            >
                {[
                    {
                        icon: Shield,
                        title: "Secure & Transparent",
                        desc: "Built with blockchain concepts to ensure every vote is immutable and verifiable."
                    },
                    {
                        icon: BarChart3,
                        title: "Real-time Analytics",
                        desc: "Watch election results unfold in real-time with beautiful, interactive visualizations."
                    },
                    {
                        icon: CheckCircle,
                        title: "Verifiable Results",
                        desc: "End-to-end verification allows any stakeholder to audit the election integrity."
                    }
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        className="glass-card p-8 hover:bg-white/10 transition-colors duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-primary-500/20 text-primary-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.section>
        </div>
    );
};

export default Home;
