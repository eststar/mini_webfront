"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaArrowLeft, FaPaperPlane, FaClock } from "react-icons/fa";
import Comments from '@/assets/comment.json';
import memberData from '@/assets/member.json';

interface Board {
    id: number;
    name: string;
    title: string;
    content: string;
    create_date: string;
    member_id: string;
}

interface DetailProps {
    post: Board | null;
    onBack: () => void;
}

export default function BoardDetail({ post, onBack }: DetailProps) {
    const [commentText, setCommentText] = useState("");


    const postComments = Comments.filter(c => c.board_id === post?.id);


    const getNickname = (memberId: string) => {
        const member = memberData.find(m => m.member_id === memberId);
        return member ? member.nickname : "알 수 없는 사용자";
    };

    // 날짜 포맷팅 (YYYY. MM. DD)
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    if (!post) return null;

    return (
        <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
        >
            {/* 상단 헤더 - 고정 */}
            <div className="flex items-center justify-between px-6 py-4 ">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/60 rounded-2xl hover:bg-white transition-all shadow-sm active:scale-90 text-slate-700 flex items-center gap-2 font-black text-sm dark:bg-zinc-600/30 dark:border-zinc-400/10 dark:text-white dark:hover:bg-zinc-800">
                    <FaArrowLeft />
                </button>
                <div className="w-10" />
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-10">

                {/* 게시글 본문 섹션 */}
                <section className="flex flex-col gap-6">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-[1000] text-slate-800 dark:text-white tracking-tighter leading-tight wrap-break-words">
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-3">
                            <FaUserCircle className="text-3xl text-slate-400 dark:text-orange-500" />
                            <div className="flex items-center gap-3">
                                <span className="font-black text-slate-800 dark:text-white text-sm md:text-base">{post.name}</span>
                                <span className="text-xs md:text-sm text-slate-400 font-bold flex items-center gap-1">

                                    {formatDate(post.create_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-lg md:text-xl text-slate-700 dark:text-white font-medium leading-relaxed whitespace-pre-wrap min-h-38 bg-white/30 p-6 rounded-3xl border border-white/40 dark:bg-zinc-600/30 dark:border-zinc-400/10 shadow-inner">
                        {post.content}
                    </div>
                </section>

                {/* 댓글 섹션 */}
                <section className="space-y-6 pb-4">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        COMMENTS <span className="text-orange-600 bg-orange-100 dark:bg-zinc-500/30 px-2 py-0.5 rounded-lg text-sm">{postComments.length}</span>
                    </h3>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {postComments.length > 0 ? (
                                postComments.map((comment, index) => (
                                    <div key={`comment-${comment.comment_id}-${index}`} className="flex gap-3 items-center">
                                        <FaUserCircle className="text-slate-700 dark:text-orange-500 text-3xl shrink-0" />
                                        <div className="flex flex-col bg-white/80 p-4 rounded-2xl  shadow-sm border border-white/80 w-full group transition-all dark:bg-zinc-600/30 dark:border-zinc-400/10">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-black text-xs text-slate-600 dark:text-white">
                                                    {getNickname(comment.member_id)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-300 font-bold">
                                                    {new Date(comment.create_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-100 font-bold leading-snug text-sm md:text-base">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white/20 rounded-3xl border border-dashed border-white/60 text-slate-400 font-bold dark:bg-zinc-600/30 dark:border-zinc-400/10">
                                    아직 작성된 댓글이 없습니다. 첫 댓글을 작성해보세요!
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </div>

            {/* 하단 댓글 입력창 - 고정 */}
            <div className="p-6">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="댓글 남기기"
                        className="w-full p-4 pr-16 rounded-2xl border-2 border-white bg-white/90 focus:outline-none focus:border-orange-400 font-bold text-slate-700 placeholder:text-slate-400 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:bg-zinc-600/30 dark:border-zinc-400/10"
                    />
                    <button
                        className={`absolute right-2 p-3 rounded-xl transition-all shadow-lg active:scale-90 ${commentText.trim()
                                ? "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
                                : "bg-slate-200 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                        disabled={!commentText.trim()}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}