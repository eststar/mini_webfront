"use client";

import React from 'react';
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

interface WriteProps {
    onBack: () => void;
}

export default function BoardWrite({ onBack }: WriteProps) {
    return (
        <motion.div
            key="write"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full p-8 md:p-12"
        >
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-3 bg-white/50 rounded-full hover:bg-white transition-colors">
                    <FaArrowLeft className="text-slate-700" />
                </button>
                <h2 className="text-3xl md:text-4xl font-[1000] text-slate-800 tracking-tighter uppercase">New Post</h2>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <input className="w-full bg-white/60 border border-white/80 p-6 rounded-3xl text-xl font-bold outline-none focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" placeholder="제목" />
                <textarea className="w-full flex-1 bg-white/60 border border-white/80 p-6 rounded-4xl text-lg font-bold outline-none focus:ring-4 focus:ring-orange-500/20 transition-all resize-none shadow-inner scrollbar-hide" placeholder="내용" />

                <div className="flex gap-4">
                    <button onClick={onBack} className="flex-1 p-4 bg-slate-200/80 text-slate-600 rounded-3xl font-black text-lg hover:bg-slate-300 transition-all">취소</button>
                    <button className="flex-2 p-4 bg-orange-500 text-white rounded-3xl font-black text-xl shadow-xl shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all">등록하기</button>
                </div>
            </div>
        </motion.div>
    );
}