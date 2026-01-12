"use client";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();

    const specs = [
        {
            title: "CORE PACKAGES",
            items: ["Next.js 15 (App)", "React 19", "TypeScript", "Framer Motion", "Tailwind CSS", "Lucide Icons"]
        },
        {
            title: "EXTERNAL API & DATA",
            items: ["Kakao Maps API", "National Emergency Medical Center API", "Jeju Open Data Portal"]
        },
        {
            title: "COMPONENTS",
            items: ["MapEngine.tsx", "EmergencyMarker.tsx", "SideInfoPanel.tsx", "LocationTracker.tsx"]
        }
    ];

    return (
        <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-4 md:p-8">
            {/* 🔱 배경: 제주도 비디오 (고정) */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
                    <source src="/jeju.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* 🔱 좌상단 뒤로가기 버튼 */}
            <button
                onClick={() => router.back()}
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/50 hover:text-orange-500 transition-all group"
            >
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-orange-500/50 transition-all">
                    <IoMdArrowRoundBack size={24} />
                </div>
            </button>

            {/* 🔱 메인 컨텐츠: 글래스모피즘 그리드 */}
            <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. 프로젝트 설명 (Large Card) */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-8 p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col justify-center"
                >
                    <h1 className="text-5xl md:text-8xl font-[1000] text-white tracking-tighter mb-6 leading-none">
                        PEECE<span className="text-orange-500">MAKER</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-8">
                        제주도 내 실시간 응급 의료 데이터를 시각화하여 가장 빠른 평화를 전달하는 
                        긴급 구호 서포트 플랫폼입니다. 복잡한 데이터를 직관적인 지도로 연결합니다.
                    </p>
                    <div className="flex gap-4">
                        <span className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black tracking-widest uppercase">
                            Protocol v1.0
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-black tracking-widest uppercase">
                            Emergency Support
                        </span>
                    </div>
                </motion.section>

                {/* 2. 스펙 카드들 (Stacked Cards) */}
                <div className="md:col-span-4 grid grid-cols-1 gap-6">
                    {specs.map((spec, idx) => (
                        <motion.div
                            key={spec.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col"
                        >
                            <h3 className="text-orange-500 font-black text-[10px] tracking-[0.3em] mb-4 uppercase opacity-80">
                                {spec.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {spec.items.map(item => (
                                    <span key={item} className="text-white/80 text-sm font-bold tracking-tight">
                                        {item}{idx === specs.length - 1 ? "" : " ·"}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 3. 하단 한 줄 카피 (Wide Card) */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="md:col-span-12 p-6 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between px-10"
                >
                    <span className="text-zinc-500 text-[10px] font-black tracking-[0.5em] uppercase hidden md:block">
                        © 2026 PEECE MAKER PROJECT
                    </span>
                    <span className="text-white font-black italic tracking-widest text-sm mx-auto md:mx-0">
                        "WE BRING PEACE TO YOUR EMERGENCY"
                    </span>
                </motion.div>
            </main>
        </div>
    );
}