"use client";

import { useState, useEffect, useMemo } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import { motion } from "framer-motion";

interface Toilet {
    data_cd: string;
    toilet_nm: string;
    la_crdnt: number;
    lo_crdnt: number;
    distance?: number;
}

export default function ListView() {
    const [toilets, setToilets] = useState<Toilet[]>([]);

    // 개발용 사용자 위치
    const fixedUserLoc = { lat: 33.5003464, lng: 126.531151 };

    // 거리 측정 함수
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    
    useEffect(() => {
        fetch("/data/toilets.json")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.toilet_info) {
                    const sanitizedData = data.toilet_info.map((item: any) => ({
                        ...item,
                        la_crdnt: Number(item.la_crdnt),
                        lo_crdnt: Number(item.lo_crdnt)
                    }));
                    setToilets(sanitizedData);
                }
            })
            .catch((err) => console.error("데이터 로드 실패:", err));


    }, []);

    const sortedToilets = useMemo(() => {
        if (toilets.length === 0) return [];

        return [...toilets]
            .map(t => ({
                ...t,
                distance: getDistance(fixedUserLoc.lat, fixedUserLoc.lng, t.la_crdnt, t.lo_crdnt)
            }))
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }, [toilets]);

    return (
        <div className="w-full h-full relative overflow-y-auto pb-32 pt-32 px-4 md:px-8 custom-scrollbar">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl mx-auto flex flex-col gap-6"
            >


                {sortedToilets.length === 0 ? (
                    <div className="text-center text-slate-500 font-bold py-20 animate-pulse">
                        정렬중.
                    </div>
                ) : (
                    sortedToilets.map((toilet) => (
                        <div
                            key={toilet.data_cd}
                            className="group relative bg-white/30 backdrop-blur-md border border-white/40 p-6 rounded-[35px] shadow-xl flex justify-between items-center transform-gpu hover:scale-[1.01] transition-transform"
                        >
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl font-[1000] text-slate-800 leading-tight">
                                    {toilet.toilet_nm}
                                </h3>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                        <FaMale className="text-cyan-600 text-xs" />
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                        <FaFemale className="text-rose-600 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">
                                    {toilet.distance !== undefined
                                        ? (toilet.distance < 1
                                            ? `${Math.round(toilet.distance * 1000)}m`
                                            : `${toilet.distance.toFixed(1)}km`)
                                        : "---"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </motion.div>
        </div>
    );
}