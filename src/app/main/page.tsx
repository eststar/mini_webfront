"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaChartBar, FaRegComments } from "react-icons/fa";
import MapView from "@/app/main/mapView";

export default function IntegratedMapPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const menuItems = [
        { icon: <FaMapMarkerAlt />, id: 0 },
        { icon: <FaChartBar />, id: 1 },
        { icon: <FaRegComments />, id: 2 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 0: return <MapView />;
            case 1: return <div className="w-full h-full flex items-center justify-center font-black text-slate-400">STATS</div>;
            case 2: return <div className="w-full h-full flex items-center justify-center font-black text-slate-400">COMMUNITY</div>;
            default: return <MapView />;
        }
    };

    return (
        <main className="relative w-screen h-screen overflow-hidden bg-white text-black font-sans selection:bg-orange-100">

            <motion.nav
                initial={{ y: -120, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                }}
                className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-30 flex justify-between items-center pointer-events-none"
            >
                <div className="flex gap-2 md:gap-4 pointer-events-auto">
    <div
        onClick={() => router.push('/')}
        className="group relative flex items-center gap-2 px-5 py-3 md:px-8 md:py-5  bg-white/40 backdrop-blur-xl border border-white/60 rounded-full md:rounded-4xl shadow-2xl cursor-pointer transition-all duration-300 ease-out active:scale-95">
        <h1 className="
            text-lg md:text-3xl font-[1000] tracking-tighter uppercase leading-none transition-transform duration-300 ease-out group-hover:scale-105">
            <span className="text-orange-500">
                PEECE
            </span>
            <span className="ml-1 text-slate-700">
                MAKER
            </span>
        </h1>
    </div>
</div>


                <button
                    onClick={() => router.push('/login')}
                    className="pointer-events-auto px-6 py-3 md:px-10 md:py-5 
               bg-orange-500/85 backdrop-blur-md  
               text-white font-[950] text-xs md:text-base tracking-widest uppercase 
               rounded-full md:rounded-4xl 
               border border-white/20             
               shadow-lg shadow-orange-500/30 
               hover:bg-orange-600/85 hover:shadow-orange-500/50 
               active:scale-90 transition-all cursor-pointer"
                >
                    LOGIN
                </button>
            </motion.nav>

            <div className="w-full h-full relative z-10 overflow-hidden">
                {isClient && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                transform: "translate3d(0, 0, 0)",
                                willChange: "opacity, transform",
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden"
                            }}
                            className="w-full h-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>


           <motion.div
    initial={{ y: 120, opacity: 1 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
    }}
    className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
>
    <div className="flex items-center p-1.5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[30px] md:rounded-[40px] shadow-2xl pointer-events-auto relative isolation-isolate">
        {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-7 py-4 md:px-10 md:py-5 rounded-[25px] md:rounded-[35px] transition-colors duration-300 flex items-center justify-center cursor-pointer ${
                    activeTab === item.id ? 'text-white' : 'text-slate-700 hover:text-black'
                }`}
            >
             
                <span className={`text-2xl md:text-3xl relative z-30 transition-all duration-300 active:scale-75 ${
                    activeTab === item.id ? 'text-white' : 'text-slate-700'
                }`}>
                    {item.icon}
                </span>

                {activeTab === item.id && (
                    <motion.div
                        layoutId="active-pill"
                      
                        className="absolute inset-0 bg-orange-500/90 rounded-[25px] md:rounded-[35px] z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{ transform: "translateZ(0)" }}
                    />
                )}
            </button>
        ))}
    </div>
</motion.div>
        </main>
    );
}