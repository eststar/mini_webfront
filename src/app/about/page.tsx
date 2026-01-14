'use client'
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { FaMapMarkedAlt, FaClipboardList, FaChartPie, FaCode, FaTerminal, FaLayerGroup, FaServer, FaChevronLeft, FaMapMarkerAlt, FaDatabase, FaExternalLinkAlt } from "react-icons/fa";
import { useRef } from "react";
import { SiGoogle, SiNaver, SiNextdotjs, SiSpring, SiSpringboot } from "react-icons/si";
import { RiSupabaseFill, RiTailwindCssFill } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { BiLogoPostgresql } from "react-icons/bi";

export default function AboutPage() {
    const router = useRouter();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const x1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
    const x2 = useTransform(scrollYProgress, [0, 1], [-500, 0]);
    const x3 = useTransform(scrollYProgress, [0, 1], [-200, -800]);
    const bgText = "PEECEMAKER ".repeat(10);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            ref={containerRef}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 bg-black/60 overflow-y-auto custom-scrollbar"
        >
            <motion.button
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    delay: 0.2
                }}

                onClick={() => router.back()}
                className="fixed top-8 left-8 z-50 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-bold hover:bg-orange-400 hover:border-orange-400 transition-all cursor-pointer group"
            >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="tracking-tighter uppercase text-sm group-hover:-translate-x-1 transition-transform">Back</span>
            </motion.button>


            <div className="fixed inset-0 z-0">
                <video autoPlay loop muted playsInline preload="auto" poster="/jeju.png" className="w-full h-full object-cover opacity-60">
                    <source src="/jeju.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
            </div>


            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute inset-0 flex flex-col justify-between py-10 opacity-[0.3] font-[1000] leading-none text-zinc-400/50">
                    {[x1, x2, x3, x1, x2, x3, x1, x2].map((xVal, i) => (
                        <motion.div key={i} style={{ x: xVal }} className="text-[12vh] whitespace-nowrap">{bgText}</motion.div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 px-6 md:px-20">

                <motion.section variants={itemVariants} className="flex flex-col justify-center pt-50">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-orange-400 text-white rounded-full text-xs font-black tracking-[0.3em] uppercase">
                            KDT-03 MINI PROJECT
                        </div>
                        <h1 className="text-6xl md:text-[10vw] font-[1000] leading-[0.9] tracking-tighter text-white">
                            <span className="text-orange-400 drop-shadow-sm leading-none">PEECE</span> MAKER
                        </h1>
                        <p className="text-xl md:text-3xl font-bold text-zinc-200 max-w-3xl leading-snug">
                            당신의 존엄성을 지키고<br />
                            평화로 이끌어주는 웹 서비스.
                        </p>
                    </div>
                </motion.section>


                <section className="space-y-10 py-20">
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 mb-16">
                        <h3 className="text-sm font-black tracking-[0.5em] text-orange-400 uppercase">Architecture</h3>
                        <h2 className="text-5xl font-[1000] tracking-tighter text-white leading-none uppercase">THE KEY FUNCTIONS</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <FaMapMarkedAlt />, title: "Toilet Map", desc: "핵심 서비스. 카카오 맵을 통해 주변의 화장실에 대한 정보와 위치를 제공합니다." },
                            { icon: <FaChartPie />, title: "Toilet Chart", desc: "차트를 통해 화장실에 대한 여러 통계를 제공합니다." },
                            { icon: <FaClipboardList />, title: "Toilet Board", desc: "사용자들이 정보나 대화를 나눌 수 있는 공간을 제공합니다." }
                        ].map((page, idx) => (

                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-xl group hover:bg-white/15 transition-colors"
                            >
                                <div className="text-3xl text-orange-400 mb-6">{page.icon}</div>
                                <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter text-white">{page.title}</h4>
                                <p className="text-zinc-300 font-bold leading-relaxed">{page.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>


                <section className="py-20">
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4 mb-16">
                        <h3 className="text-sm font-black tracking-[0.5em] text-orange-400 uppercase">Data Source</h3>
                        <h2 className="text-5xl font-[1000] tracking-tighter text-white leading-none uppercase">REGIONAL DATA INTEGRATION</h2>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-20 opacity-30 transition-opacity">
                            <FaDatabase  size={200} className="text-orange-400" />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                    <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">Jeju City Public Data</span>
                                </div>

                                <h3 className="text-4xl md:text-5xl font-[1000] text-white leading-tight tracking-tighter">
                                    제주특별자치도 제주시 제공<br />
                                    <span className="text-orange-400">공중화장실 현황</span> 데이터
                                </h3>

                                <p className="text-xl text-zinc-100 font-bold leading-relaxed">
                                    PEECEMAKER는 제주시 내의 모든 공중화장실 위치와 상세 시설 정보를 포함한 공공데이터를 기반으로 합니다. 위도, 경도는 물론 비상벨 설치 여부와 기저귀 교환 탁자 유무까지 분석하여 제주를 찾는 모든 이들에게 진정한 평화를 선사합니다.
                                </p>

                                
                            </div>

                            <div className="bg-zinc-900/20 rounded-[3rem] p-8 border border-white/5 space-y-6">
                                <h4 className="text-orange-400 font-black tracking-widest uppercase text-xl flex items-center gap-2">
                                    <FaTerminal /> Dataset Specifications
                                </h4>

                                <ul className="space-y-4">
                                    {[
                                        { label: "데이터 명칭", value: "제주특별자치도 제주시_공중화장실" },
                                        { label: "제공 기관", value: "제주특별자치도 제주시" },
                                        { label: "데이터 형식", value: "CSV / Open API" },
                                        { label: "핵심 컬럼", value: "위경도, 비상벨·CCTV 설치여부, 개방시간" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex flex-col border-b border-white/5 pb-3">
                                            <span className="text-lg text-orange-400 font-bold tracking-widest">{item.label}</span>
                                            <span className=" text-white font-bold tracking-tighter">{item.value}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="https://www.data.go.kr/data/15110521/fileData.do"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-5 bg-orange-400 text-white font-[1000] rounded-2xl hover:bg-orange-500  transition-all group"
                                >
                                    데이터 확인 <FaExternalLinkAlt/>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </section>



                <section className="py-20">
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden"
                    >
                        {/* 프론트엔드 */}
                        <div
                            className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-3xl p-10 md:p-16 flex flex-col justify-between border-t border-l border-b border-white/10 shadow-2xl rounded-t-4xl md:rounded-tr-none md:rounded-l-4xl"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-orange-400">
                                    <FaLayerGroup size={32} /><span className="font-black tracking-widest text-3xl uppercase">Front-end Developer</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-[1000] text-white leading-none tracking-tighter">윤치형</h2>
                                <p className="text-xl text-zinc-300 font-bold leading-relaxed italic border-l-4 border-orange-400 pl-4">"여기에 소감 입력."</p>
                                <div className="pt-10 space-y-4">
                                    <h4 className="flex items-center gap-2 font-black text-orange-400 tracking-widest uppercase text-2xl "><FaCode /> Technical Spec</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 font-bold text-xl text-white uppercase tracking-tighter">
                                        <li className="flex items-center gap-2">
                                            <SiNextdotjs />
                                            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                Next.js 16.0.0
                                            </a>
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <RiTailwindCssFill className="text-cyan-400" />
                                            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                Tailwind 4.0
                                            </a>
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-blue-400 bg-yellow-400 border-3 border-yellow-400 rounded-full" />
                                            <a href="https://apis.map.kakao.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                Kakao Map API
                                            </a>
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <VscVscode className="text-cyan-500 " />
                                            <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                VS CODE
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 백엔드 */}
                        <div
                            className="bg-zinc-900/40 hover:bg-zinc-900/55 transition-colors backdrop-blur-3xl text-white p-10 md:p-16 flex flex-col justify-between border-t border-r border-b border-zinc-400/10 md:border-l-0 border-l rounded-b-4xl md:rounded-bl-none shadow-2xl md:rounded-r-4xl"
                        >
                            <div className="space-y-8 md:items-end md:text-right flex flex-col">
                                <div className="flex items-center gap-4 text-orange-400">
                                    <span className="font-black tracking-widest text-3xl uppercase">Back-end Developer</span><FaServer size={32} />
                                </div>
                                <h2 className="text-5xl md:text-7xl font-[1000] text-white leading-none tracking-tighter">이동규</h2>
                                <p className="text-xl text-zinc-300 font-bold leading-relaxed italic border-r-4 border-orange-400 pr-4 md:border-l-0">"여기에 소감 입력."</p>
                                <div className="pt-10 space-y-4 w-full">
                                    <h4 className="flex items-center justify-end gap-2 font-black text-orange-400 tracking-widest uppercase text-2xl">Technical Spec <FaTerminal /></h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xl font-bold text-white  tracking-tighter">
                                        <li className="flex items-center justify-end gap-2">
                                            <a href="https://spring.io/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                SPRINGBOOT 3.5.8
                                            </a>
                                            <SiSpringboot className="text-lime-500" />
                                        </li>

                                        <li className="flex items-center justify-end gap-2">
                                            <a href="https://www.postgresql.org/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                PostgreSQL
                                            </a>
                                            <BiLogoPostgresql  className="text-cyan-600 text-2xl" />
                                        </li>

                                        <li className="flex items-center justify-end gap-2">
                                            <p className="mr-1">OAUTH2</p>
                                            <div className="flex items-center gap-1">
                                                <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noopener noreferrer"
                                                    className="cursor-pointer">
                                                    <SiGoogle className="text-blue-400" />
                                                </a>
                                                <span>│</span>
                                                <a href="https://developers.naver.com/products/login/api/api.nhn" target="_blank" rel="noopener noreferrer"
                                                    className="cursor-pointer">
                                                    <SiNaver className="text-lime-500" />
                                                </a>
                                            </div>
                                        </li>

                                        <li className="flex items-center justify-end gap-2">
                                            <a href="https://spring.io/tools" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:opacity-70 transition-opacity">
                                                STS 4
                                            </a>
                                            <SiSpring className="text-lime-500" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <footer className="pt-40 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                    >
                        <p className="text-zinc-500 font-bold tracking-[0.2em] text-xs uppercase">
                            © 2026 KDT-03 PEECE MAKER. ALL RIGHTS RESERVED.
                        </p>
                    </motion.div>
                </footer>


            </div>


        </motion.div>

    );
}