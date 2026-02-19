"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import {
    Dna, Users, Heart, Pill, Brain, Shield,
    ArrowRight, Zap, FileSearch, MessageSquare
} from 'lucide-react';

const features = [
    {
        icon: FileSearch,
        label: 'Genomic Analysis',
        desc: 'Upload your VCF file and get instant pharmacogenomic risk assessments across 6 critical genes — powered by CPIC guidelines.',
        color: 'from-blue-500 to-indigo-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-600',
        href: '/#analysis',
        tag: 'Core Feature',
    },
    {
        icon: Heart,
        label: 'IVF & Genetic Compatibility',
        desc: 'Understand how your genetic profile combines with your partner\'s to affect your children\'s medication responses.',
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        text: 'text-rose-600',
        href: '/ivf',
        tag: 'Family Planning',
    },
    {
        icon: Users,
        label: 'Genetic Twin Finder',
        desc: 'Find patients with similar genetic profiles in our community. Share experiences, compare reactions, and learn from each other.',
        color: 'from-violet-500 to-purple-500',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        text: 'text-violet-600',
        href: '/community',
        tag: 'Community',
    },
    {
        icon: MessageSquare,
        label: 'Community Feed',
        desc: 'A Reddit-style forum for the pharmacogenomics community. Post, upvote, and discuss real patient experiences with medications.',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        text: 'text-amber-600',
        href: '/community',
        tag: 'Community',
    },
    {
        icon: Brain,
        label: 'AI Report Assistant',
        desc: 'Our Groq-powered AI chatbot explains your genetic report in plain English. Ask anything — no medical jargon.',
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-600',
        href: '/ivf',
        tag: 'AI Powered',
    },
    {
        icon: Pill,
        label: 'Drug Interaction Checker',
        desc: 'Check how your body processes over 20 common medications including Codeine, Warfarin, Clopidogrel, and Simvastatin.',
        color: 'from-cyan-500 to-sky-500',
        bg: 'bg-sky-50',
        border: 'border-sky-100',
        text: 'text-sky-600',
        href: '/#analysis',
        tag: 'Analysis',
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-indigo-100 mb-6"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Everything You Need
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
                    >
                        Built for Patients,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Backed by Science</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto"
                    >
                        From genomic analysis to community connection — PharmaGuard is your complete pharmacogenomics companion.
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                            >
                                <Link href={f.href} className={`group block h-full ${f.bg} border ${f.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                                    {/* Icon + Tag */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-sm`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className={`text-xs font-semibold ${f.text} border ${f.border} bg-white px-2.5 py-1 rounded-full`}>
                                            {f.tag}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-slate-700 transition-colors">
                                        {f.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        {f.desc}
                                    </p>

                                    {/* CTA */}
                                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${f.text}`}>
                                        Explore
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Dna className="w-5 h-5 text-indigo-300" />
                            <span className="text-indigo-200 text-sm font-semibold uppercase tracking-widest">Open Beta</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">Start Your Pharmacogenomic Journey</h3>
                        <p className="text-indigo-200 text-sm">Upload your VCF file and get your first analysis in seconds. Free and open to everyone.</p>
                    </div>
                    <Link
                        href="/#analysis"
                        className="shrink-0 flex items-center gap-2 bg-white text-indigo-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
