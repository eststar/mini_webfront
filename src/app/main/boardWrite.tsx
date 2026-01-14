"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck, FaPaperPlane, FaPenNib } from "react-icons/fa";

interface Board {
    boardId: number;
    nickname: string;
    title: string;
    content: string;
    memberId: string;
    createDate: string;
    commentCnt: number;
}
interface WriteProps {
    onBack: () => void;
    onSuccess: () => void; 
    mode?: 'write' | 'edit';
    post?: Board | null;
    userData?: any;
}

export default function BoardWrite({ onBack, onSuccess, mode = 'write', post, userData }: WriteProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const isEditMode = mode === 'edit';


    useEffect(() => {
        if (isEditMode && post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [isEditMode, post]);


    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주십시오.");
            return;
        }
        try {
            const url = isEditMode ? "/back/api/test/board/putboard" : "/back/api/test/board/postboard";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    ...(isEditMode && { boardId: post?.boardId }) 
                }),
                credentials: 'include' 
            });

            if (response.ok) {
                alert(isEditMode ? "수정 완료" : "등록 완료");
                onSuccess(); 
            } else {
                const msg = response.status === 403 ? "권한이 없습니다." : "작업 실패";
                alert(msg);
            }
        } catch (err) {
            console.error("저장 에러:", err);
            alert("통신 오류 발생");

        }
    };

    return (
        <motion.div
            key="write-container"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            className="flex flex-col h-full overflow-hidden scrollbar-hide"
        >
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        className="p-3 bg-white/50 rounded-2xl hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90 dark:bg-zinc-600/30 dark:border-zinc-400/10"
                    >
                        <FaArrowLeft className="text-slate-700 dark:text-white" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-orange-400 tracking-[0.2em] uppercase opacity-80">Community Board</span>
                        <h2 className="text-2xl md:text-3xl font-[1000] text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-2">
                            {isEditMode ? "Edit Post" : "New Post"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* 입력 영역 */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12  scrollbar-hide">
                <div className="max-w-4xl mx-auto flex flex-col gap-8">
                    {/* 제목 입력 */}
                    <div className="group space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-zinc-500 ml-2 uppercase tracking-widest">Post Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/40 border-2 border-white/20 p-6 rounded-3xl text-xl md:text-2xl font-black outline-none focus:border-orange-400 transition-all dark:bg-zinc-700/30 dark:border-zinc-600/10 dark:text-white "
                            placeholder="제목"
                        />
                    </div>

                    {/* 본문 입력 */}
                    <div className="group space-y-2 flex-1">
                        <label className="text-xs font-black text-slate-400 dark:text-zinc-500 ml-2 uppercase tracking-widest">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 md:h-80 bg-white/40 border-2 border-white/20 p-8 rounded-[2.5rem] text-lg font-bold outline-none focus:border-orange-400 transition-all resize-none dark:bg-zinc-700/30 dark:border-zinc-600/10 dark:text-white"
                            placeholder="내용"
                        />
                    </div>
                </div>
            </div>

            {/* 하단 액션바 */}
            <div className="px-8 py-6 bg-white/30 border-t border-white/10 dark:bg-zinc-800/20">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button 
                        onClick={onBack} 
                        className="flex-1 p-5 bg-white/60 text-slate-500 rounded-3xl font-black text-sm md:text-base hover:bg-slate-100 transition-all active:scale-95 dark:bg-zinc-600/30 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        CANCEL
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="flex-2 p-5 bg-orange-400 text-white rounded-3xl font-[1000] text-lg md:text-xl shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <FaPaperPlane />
                        <span>{isEditMode ? "UPDATE POST" : "POST NOW"}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}