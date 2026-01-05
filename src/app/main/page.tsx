"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaList, FaClipboardList, FaChartPie } from "react-icons/fa";

import MapView from "./mapView";
import ListView from "./listView";
import BoardView from "./boardView"
import ChartView from "./chartView";

interface UserData {
    nickname?: string;
    role?: string;
    username?: string;
}

export default function MainPage() {
    const router = useRouter();


    const [activeTab, setActiveTab] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>({});

    useEffect(() => {

        setIsClient(true);
        const saved = localStorage.getItem("activeTab");
        if (saved) {
            setActiveTab(parseInt(saved));
        }

        const checkAuth = async () => {
            try {

                const res = await fetch("/back/api/members/myinfo", {
                    method: "GET",

                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                    setIsLoggedIn(true);
                    console.log("✅ 인증 성공:", data);
                    console.log(data);
                } else {

                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error("🚨 인증 체크 실패:", err);
                setIsLoggedIn(false);
            }
        };

        checkAuth();

    }, []);


    useEffect(() => {
        if (isClient) {
            localStorage.setItem("activeTab", activeTab.toString());
        }
    }, [activeTab, isClient]);

    const menuItems = [
        { icon: <FaMapMarkerAlt />, id: 0 },
        { icon: <FaChartPie />, id: 1 },
        { icon: <FaClipboardList />, id: 2 },
    ];

    const renderContent = () => {
        if (!isClient) return <MapView />;
        switch (activeTab) {
            case 0: return <MapView />;
            case 1: return <ChartView />;
            case 2: return <BoardView />;
            default: return <MapView />;
        }
    };

    const handleAuth = () => {
        if (isLoggedIn) {
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            setIsLoggedIn(false);
            alert("로그아웃 되었습니다.");
            router.refresh();
        } else {
            router.push('/login');
        }
    };

    return (
        <main className="relative w-screen h-screen overflow-hidden inset-0 z-0 bg-gradient-to-tr from-[#e1fbff] via-[#ffe9c5] to-[#e0f5ff] text-black font-sans selection:bg-orange-100">

            <motion.nav
                initial={{ y: -120, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-30 flex justify-between items-center pointer-events-none"
            >
                <div className="flex gap-2 md:gap-4 pointer-events-auto">
                    <div onClick={() => router.push('/')}
                        className="group relative flex items-center gap-2 px-5 py-3 md:px-8 md:py-5 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-full md:rounded-[40px] shadow-2xl cursor-pointer transition-all duration-300 active:scale-95">
                        <h1 className="text-lg md:text-3xl font-[1000] tracking-widest uppercase leading-none group-hover:scale-105">
                            <span className="text-orange-500">PEECE</span>
                            <span className="ml-1 text-slate-700">MAKER</span>
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleAuth}
                    className="group relative pointer-events-auto px-6 py-3 md:px-10 md:py-5 bg-orange-500/85 backdrop-blur-md text-white font-[950] text-xs md:text-base tracking-widest uppercase rounded-full md:rounded-[40px] border border-white/20 shadow-lg hover:bg-orange-600/85 active:scale-90 transition-all cursor-pointer overflow-hidden"
                    key={isLoggedIn ? "logout-btn" : "login-btn"}
                >
                    {isLoggedIn ? (
                        <>
                            
                            <span className="inline-block group-hover:opacity-0 transition-opacity duration-200">
                                {userData?.nickname}
                            </span>
                          
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                LOG OUT
                            </span>
                        </>
                    ) : (
                        "LOG IN"
                    )}
                </button>
            </motion.nav>


            <div className="w-full h-full relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ y: 120, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
            >
                <div className="flex items-center p-1.5 bg-white/20 backdrop-blur-2xl border border-white/60 rounded-[30px] md:rounded-[40px] shadow-2xl pointer-events-auto relative">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative px-7 py-4 md:px-10 md:py-5 rounded-[25px] md:rounded-[35px] transition-colors duration-300 flex items-center justify-center cursor-pointer ${activeTab === item.id ? 'text-white' : 'text-slate-700 hover:text-black'}`}
                        >
                            <span className={`text-2xl md:text-3xl relative z-30 transition-all duration-300 active:scale-75 ${activeTab === item.id ? 'text-white' : 'text-slate-700'}`}>
                                {item.icon}
                            </span>
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-orange-500/90 rounded-[25px] md:rounded-[35px] z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}