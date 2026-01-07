"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react'; // useRef 추가
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaUserCircle, FaSearch, FaChevronLeft, FaChevronRight, FaRegCommentDots } from "react-icons/fa";
import memberData from '@/assets/member.json';
import BoardDetail from './boardDetail'; 
import BoardWrite from './boardWrite';

interface Board {
    id: number;
    name: string;
    title: string;
    content: string;
    member_id: string;
    create_date: string;
    comment_count: number;
}

export default function BoardView() {
    const [board, setBoard] = useState<Board[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'write' | 'detail'>('list');
    const [selectedPost, setSelectedPost] = useState<Board | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 8; 

 
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Promise.all([
            fetch("/data/board.json").then((res) => res.json()),
            fetch("/data/comment.json").then((res) => res.json())
        ])
        .then(([boardData, commentData]) => {
            if (boardData && commentData) {
                const memberMap = new Map(memberData.map((m: any) => [m.member_id, m.nickname]));
                const commentCountMap = commentData.reduce((acc: Record<number, number>, comment: any) => {
                    acc[comment.board_id] = (acc[comment.board_id] || 0) + 1;
                    return acc;
                }, {});

                const formattedData = boardData.map((item: any) => ({
                    id: item.board_id,
                    name: memberMap.get(item.member_id),
                    title: item.title,
                    content: item.content,
                    member_id: item.member_id,
                    create_date: item.create_date,
                    comment_count: commentCountMap[item.board_id] || 0
                }));

                const sortedData = formattedData.sort((a: Board, b: Board) => b.id - a.id);
                setBoard(sortedData);
            }
            setIsReady(true);
        })
        .catch((err) => {
            console.error("데이터 로딩 에러:", err);
            setIsReady(true);
        });
    }, []);

   
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'auto'
            });
        }
    }, [currentPage]);

    const filteredBoard = useMemo(() => {
        return board.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [board, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredBoard.length / POSTS_PER_PAGE);
    const currentPosts = filteredBoard.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const getPageNumbers = () => {
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handlePostClick = (post: Board) => {
        setSelectedPost(post);
        setViewMode('detail');
    };

    if (!isReady) return null;

    return (
        <div className="w-full h-full flex items-center justify-center pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-8 bg-transparent">
            <div className="w-full max-w-5xl h-[75vh] md:h-187.5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-4xl md:rounded-4xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden text-slate-900 relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            
                            <div 
                                ref={scrollContainerRef}
                                className="flex-1 overflow-y-auto custom-scrollbar bg-white/5 touch-pan-y overflow-x-hidden"
                            >
                                <div className="flex flex-col">
                                    <AnimatePresence mode="popLayout">
                                        {currentPosts.map((post) => (
                                            <motion.div
                                                key={post.id}
                                                layout
                                                onClick={() => handlePostClick(post)}
                                                className="group flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 md:px-10 py-6 md:py-8 border-b border-white/20 hover:bg-white/40 transition-all cursor-pointer"
                                            >
                                                <div className="md:col-span-9 flex flex-col gap-1 md:gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg md:text-xl font-[1000] group-hover:text-orange-600 transition-colors tracking-tight truncate">
                                                            {post.title}
                                                        </h3>
                                                        {post.comment_count > 0 && (
                                                            <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-orange-600 md:text-xs font-black">
                                                                <FaRegCommentDots className="text-[12px]" />
                                                                {post.comment_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 font-bold text-[12px] md:text-sm line-clamp-1 opacity-70">{post.content}</p>
                                                </div>
                                                <div className="md:col-span-3 flex items-center md:items-end md:justify-center justify-between mt-2 md:mt-0">
                                                    <div className="flex items-center gap-2">
                                                        <FaUserCircle className="text-slate-700 text-xl" />
                                                        <span className="font-black text-[11px] md:text-sm tracking-tight">{post.name}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {filteredBoard.length === 0 && (
                                        <div className="py-20 text-center font-black text-slate-400">검색 결과 없음.</div>
                                    )}
                                </div>
                            </div>

                            {/* 페이지네이션 */}
                            {totalPages > 0 && (
                                <div className="flex justify-center items-center gap-1 md:gap-2 py-4 bg-white/20 border-t border-white/10">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(1)}
                                        className="w-8 h-8 flex items-center justify-center disabled:opacity-10 hover:text-orange-500 transition-colors  md:flex"
                                    >
                                        <div className="flex items-center -space-x-1">
                                            <FaChevronLeft size={10} /><FaChevronLeft size={10} />
                                        </div>
                                    </button>
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="w-8 h-8 flex items-center justify-center disabled:opacity-20 hover:text-orange-500 transition-colors"
                                    >
                                        <FaChevronLeft size={14} />
                                    </button>
                                    
                                    <div className="flex items-center gap-1 md:gap-2">
                                        {getPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl font-black text-xs md:text-sm transition-all ${
                                                    currentPage === pageNum 
                                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                                                    : "hover:bg-white/60 text-slate-600 bg-white/30"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="w-8 h-8 flex items-center justify-center disabled:opacity-20 hover:text-orange-500 transition-colors"
                                    >
                                        <FaChevronRight size={14} />
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="w-8 h-8 flex items-center justify-center disabled:opacity-10 hover:text-orange-500 transition-colors md:flex"
                                    >
                                        <div className="flex items-center -space-x-1">
                                            <FaChevronRight size={10} /><FaChevronRight size={10} />
                                        </div>
                                    </button>
                                </div>
                            )}

                            <div className="px-6 md:px-10 py-4 border-t border-white/40 bg-white/30 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative w-full md:w-72 group">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH POSTS"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <button
                                    onClick={() => setViewMode('write')}
                                    className="w-full md:w-auto px-8 py-4 bg-orange-500 text-white rounded-2xl md:rounded-3xl shadow-[0_15px_30px_-5px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 border border-white/20 hover:bg-orange-600 active:scale-95 transition-all duration-300"
                                >
                                    <FaEdit className="text-xl md:text-2xl" />
                                    <span className="font-[1000] tracking-tighter text-sm md:text-base uppercase">Write Now</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : viewMode === 'write' ? (
                        <BoardWrite onBack={() => setViewMode('list')} />
                    ) : (
                        <BoardDetail post={selectedPost} onBack={() => setViewMode('list')} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}