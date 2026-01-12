"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import Comments from '@/assets/comment.json'; // 실제 운영시엔 fetch로 가져오는 것을 권장
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
    onEdit: () => void; // 수정 모드 전환을 위한 prop
    onDeleteSuccess: () => void; // 삭제 후 목록 갱신을 위한 prop
}

export default function BoardDetail({ post, onBack, onEdit, onDeleteSuccess }: DetailProps) {
    const [commentText, setCommentText] = useState("");

    // 해당 게시글의 댓글 필터링
    const postComments = Comments.filter(c => c.board_id === post?.id);

    const getNickname = (memberId: string) => {
        const member = memberData.find(m => m.member_id === memberId);
        return member ? member.nickname : "알 수 없는 사용자";
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    // --- 삭제 로직 처리 ---
    const handleDelete = async () => {
        if (!confirm("진정으로 이 게시물을 삭제하시겠습니까? 기가 차드는 되돌아보지 않지만, 데이터는 소중하니까.")) return;
        
        try {
            // 실제 API 호출 시나리오 (현재는 JSON 파일이므로 성공 시뮬레이션)
            // await axios.delete(`/api/board/${post?.id}`);
            alert("게시물이 성공적으로 삭제되었습니다. 훗훗훗.");
            onDeleteSuccess();
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제에 실패했다. 힘이 부족한가?");
        }
    };

    if (!post) return null;

    return (
        <motion.div
            key="detail"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            className="flex flex-col h-full overflow-hidden"
        >
            {/* 상단 헤더 - 고정 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/60 rounded-2xl hover:bg-white transition-all shadow-sm active:scale-90 text-slate-700 flex items-center gap-2 font-black text-sm dark:bg-zinc-600/30 dark:border-zinc-400/10 dark:text-white dark:hover:bg-zinc-800"
                >
                    <FaArrowLeft />
                    <span className="hidden md:inline">BACK TO LIST</span>
                </button>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-white/60 text-slate-700 font-black text-xs rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-zinc-300 dark:hover:bg-orange-600 dark:hover:text-white"
                    >
                        EDIT
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-white/60 text-red-500 font-black text-xs rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                    >
                        DELETE
                    </button>
                </div>
            </div>

            {/* 스크롤 본문 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-10">
                {/* 게시글 섹션 */}
                <section className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-[1000] text-slate-800 dark:text-white tracking-tighter leading-tight break-words">
                            {post.title}
                        </h2>
                        <div className="flex items-center justify-between border-b border-white/20 pb-6">
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-4xl text-slate-400 dark:text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-800 dark:text-white text-base leading-none mb-1">{post.name}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        {formatDate(post.create_date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-lg md:text-xl text-slate-800 dark:text-white font-medium leading-relaxed whitespace-pre-wrap min-h-[200px] bg-white/30 p-8 rounded-4xl border border-white/20 shadow-inner dark:bg-zinc-600/30 dark:border-zinc-400/10">
                        {post.content}
                    </div>
                </section>

                {/* 댓글 섹션 */}
                <section className="space-y-6 pb-10">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        COMMENTS 
                        <span className="text-orange-600 bg-orange-100 dark:bg-zinc-500/30 px-3 py-1 rounded-full text-sm">
                            {postComments.length}
                        </span>
                    </h3>

                    <div className="space-y-4">
                        {postComments.length > 0 ? (
                            postComments.map((comment, index) => (
                                <motion.div 
                                    initial={{ opacity: 0}}
                                    animate={{ opacity: 1}}
                                    transition={{ delay: index * 0.05 }}
                                    key={`comment-${comment.comment_id}`} 
                                    className="flex gap-4 items-start"
                                >
                                    <FaUserCircle className="text-slate-400 dark:text-orange-500 text-3xl shrink-0 mt-1" />
                                    <div className="flex flex-col bg-white/60 p-5 rounded-3xl shadow-sm border border-white/80 w-full dark:bg-zinc-600/40 dark:border-zinc-400/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-black text-sm text-slate-700 dark:text-white">
                                                {getNickname(comment.member_id)}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">
                                                {new Date(comment.create_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base leading-normal">
                                            {comment.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white/10 rounded-4xl border-2 border-dashed border-white/20 text-slate-300 font-black dark:bg-zinc-700/20">
                                <p>NO COMMENTS YET.</p>
                                <p className="text-xs opacity-60">WRITE THE FIRST COMMENT!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* 하단 댓글 입력창 - 고정 */}
            <div className="p-6 bg-white/20 border-t border-white/10 dark:bg-zinc-800/20">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && commentText.trim() && alert("댓글 등록!")}
                        placeholder="LEAVE A COMMENT..."
                        className="w-full p-5 pr-16 rounded-3xl border-2 border-white/50 bg-white/80 focus:outline-none focus:border-orange-400 font-black text-slate-700 placeholder:text-slate-400 transition-all shadow-xl dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                    <button
                        className={`absolute right-3 p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${
                            commentText.trim()
                            ? "bg-orange-500 text-white hover:bg-orange-600 hover:rotate-12"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }`}
                        disabled={!commentText.trim()}
                    >
                        <FaPaperPlane size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}