"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaUserCircle, FaSearch } from "react-icons/fa";

interface Board {
    id: number;
    name: string;
    title: string;
    content: string;
}

export default function BoardView() {
    const [board, setBoard] = useState<Board[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/data/board.json")
            .then((res) => res.json())
            .then((data) => {
                if (data) {

                    const sortedData = [...data].sort((a, b) => b.id - a.id);
                    setBoard(sortedData);
                }
            })
            .catch((err) => console.error("Error:", err));
    }, []);


    const filteredBoard = useMemo(() => {
        return board.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [board, searchQuery]);

    if (board.length === 0) return null;

    return (
        <div className="w-full h-full flex items-center justify-center pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-8 bg-transparent">
            <div className="w-full max-w-5xl h-[75vh] md:h-187.5 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[30px] md:rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden text-slate-900">

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/5 touch-pan-y overflow-x-hidden">
                    <div className="flex flex-col">
                        <AnimatePresence>
                            {filteredBoard.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                    className="group flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 md:px-10 py-6 md:py-8 border-b border-white/20 hover:bg-white/40 transition-all cursor-pointer"
                                    >
                                    <div className="md:col-span-9 flex flex-col gap-1 md:gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-black text-[10px] md:text-sm italic">#{post.id}</span>
                                            <h3 className="text-lg md:text-xl font-[1000] group-hover:text-orange-600 transition-colors tracking-tight truncate">
                                                {post.title}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 font-bold text-[12px] md:text-sm line-clamp-1 md:pl-11 opacity-70">
                                            {post.content}
                                        </p>
                                    </div>

                                    <div className="md:col-span-3 flex items-center md:items-end md:justify-center justify-between mt-2 md:mt-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full text-slate-700  flex items-center justify-center text-5xl overflow-hidden">
                                                <FaUserCircle />
                                            </div>
                                            <span className="font-black text-[11px] md:text-sm tracking-tight">{post.name}</span>
                                        </div>
                                        <span className="text-slate-400 font-black text-[9px] md:hidden tracking-tighter italic">2025.12.24</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredBoard.length === 0 && (
                            <div className="py-20 text-center font-black text-slate-400">검색 결과가 없다 브라더.</div>
                        )}
                    </div>
                </div>


                <div className="px-6 md:px-10 py-2 md:py-4 border-t border-white/40 bg-white/30 flex flex-col md:flex-row items-center justify-between gap-4">


                    <div className="relative w-full md:w-72 group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500  transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH POSTS"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-sm font-black tracking-tighter focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-400"
                        />

                    </div>


                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full md:w-auto px-8 py-4 bg-orange-500 text-white rounded-2xl md:rounded-3xl shadow-[0_15px_30px_-5px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 border border-white/20 hover:bg-orange-600 transition-all duration-300"
                    >
                        <FaEdit className="text-xl md:text-2xl" />
                        <span className="font-[1000] tracking-tighter text-sm md:text-base uppercase">Write Now</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}