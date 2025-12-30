"use client";
import { motion, Variants } from 'framer-motion';
import React from 'react'
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };
    const itemVars: Variants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (

        <main className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-x-hidden">

            <div className="fixed inset-0 z-0">
                {/* 첫 화면 비디오 */}
                <video
                    autoPlay loop muted playsInline preload="auto"
                    poster="/jeju.png"
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/jeju.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
            </div>


            <motion.div
                variants={containerVars}
                initial="initial"
                animate="animate"
                className="relative z-20 flex flex-col items-center text-center px-4 w-full py-16 md:py-0">

                {/*타이틀 */}
                <motion.h1
                    variants={itemVars}
                    className="text-[14vw] md:text-[8vw] font-[1000] tracking-widest uppercase leading-none text-orange-500/95" >
                    PEECE<span className="text-white/95">MAKER</span>
                </motion.h1>

                <motion.div
                    variants={itemVars}
                    className="w-24 h-1 bg-transparent my-6 md:my-4"/>


                <motion.div variants={itemVars} className="space-y-6">
                    <p className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase ">
                        THE GUARDIAN OF YOUR PRESTIGE
                    </p>
                    {/* 사이트 설명 */}
                    <div className="max-w-2xl text-[14px] md:text-lg text-zinc-300/90 font-light leading-relaxed break-keep">
                        <p>
                            에메랄드빛 바다, 시원한 바닷바람, 그리고 당신의 렌터카 창문 사이로 들이치는 감귤 내음. 하지만 그 평화로운 풍경 뒤에선 당신이 평생 쌓아온 사회적 명성과 지위를 한순간에 휴지조각으로 만들 '예기치 못한 생리적 재앙'이 호시탐탐 기회를 노리고 있습니다.
                        </p>
                        <p className="mt-2 md:mt-2">
                             한번의 실수에 당신은 '그 나이먹고 바지에 지린 사람'이란 꼬리표를 평생 달고 살아가야만 합니다. 지인들은 즐거운 여행, 당신의 파란만장한 인생사보다 그 참사를 더 기억하겠지요. 이래선 안됩니다. 그 재앙의 해결책이 바로 여기있습니다. 당신의 인생은 소중하니까요.
                        </p>
                        <p className="mt-2 md:mt-2">
                            PEECEMAKER는 당신의 존엄성을 수호할 최적의 생존 도구입니다. 복잡한 가입 절차 없이, 검증된 데이터를 바탕으로 당신에게 천국의 지름길을 제공합니다. 동료들이 직접 남긴 생생한 피드백을 읽으며 당신의 괄약근을 해방시킬 은밀하고 위대한 여정을 계획해보세요. 
                        </p>

                        <p className="mt-8 text-white text-lg md:text-xl font-bold tracking-wider">
                            PEECEMAKER와 함께, 상황을 통제하고 평화를 손에 넣으십시오.
                        </p>
                    </div>
                </motion.div>

                {/* 버튼 */}
                <motion.button
                    variants={itemVars}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/main')}
                    className="mt-12 px-10 md:px-24 py-5 md:py-6 bg-white/20 backdrop-blur-2xl text-white border border-white/20 text-sm md:text-lg rounded-4xl hover:text-orange-500 cursor-pointer font-[950] tracking-[0.2em] md:tracking-[0.5em] uppercase">
                    EXPLORE YOUR HEAVEN
                </motion.button>
            </motion.div>
        </main>
    );
}