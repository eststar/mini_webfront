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
                    className="text-[12vw] md:text-[8vw] font-[1000] tracking-widest uppercase leading-none text-orange-500/95" >
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
                            제주도 여행을 즐기던 도중 예고없이 찾아오는 생리적 위협에 대응하십시오. <br/>
                            PEECEMAKER와 함께 당신을 사회적 사망 위기에서 구원해줄 은밀하고 위대한 작전을 계획해보십시오.
                        </p>
                        <div className='grid md:grid-cols-3 gap-8 md:gap-12 mt-5 text-center justify-center'>
                            <div className='w-60'><h1 className='font-extrabold text-[24px]'>MAP</h1> 지도와 GPS를 활용해 주변의 화장실 위치, 정보, 리뷰를 제공합니다.</div>
                            <div className='w-60'><h1 className='font-extrabold text-[24px]'>CHART</h1>제주시 화장실 데이터에 대한 각종 통계 및 평점 순위를 차트와 그래프로 제공합니다.</div>
                            <div className='w-60'><h1 className='font-extrabold text-[24px]'>COMMUNITY</h1>게시판을 통해 소통하거나 화장지를 급히 구하는 등의 활동을 할 수 있는 공간을 제공합니다.</div>
                        </div>
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