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
                    <div className=" text-[14px] md:text-lg text-zinc-300/90 font-light leading-relaxed break-keep">
                        <p>
                            비즈니스 세계에서 실수는 용납되지 않습니다. 특히 바지에 실수는 당신이 여태 쌓아온 사회적 평판에 아주 치명적인 영향을 미칩니다.<br />
                             지인들이 당신을 위한 연말 선물로 성인용 기저귀를 고려하게 만들지 마십시오. <br />
                             지금 당장 PEECEMAKER를 통해 은밀하고 위대한 괄약근 해방작전을 설계해보십시오.
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