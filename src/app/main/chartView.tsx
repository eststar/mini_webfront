"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import { FaShieldAlt, FaWheelchair, FaBaby, FaLayerGroup } from "react-icons/fa";

const COLORS = ['#f97316', '#1e293b', '#64748b', '#94a3b8'];
interface Toilet {
    dataCd: string;
    toiletNm: string;
    emgncBellInstlYn: string;
    toiletEntrncCctvInstlYn: string;
    maleClosetCnt: number;
    laCrdnt: number;
    loCrdnt: number;
}
export default function ChartView() {
    const [rawToiletData, setRawToiletData] = useState<any[]>([]);
    const [filterMode, setFilterMode] = useState<'all' | 'secure' | 'accessible' | 'family'>('all');
    let cachedToilets: Toilet[] = [];
    
    useEffect(() => {
        const fetchToilets = async () => {
            try {
                const response = await fetch("/back/api/test/toiletinfo/getallinfo");
                const data = await response.json();

                const list = data.toilet_info || data;
                const sanitized = list.map((t: any) => ({
                    ...t
                   
                }));

                setRawToiletData(sanitized);
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            }
        };

        fetchToilets();
    }, []);


    const totalStats = useMemo(() => {
        if (!rawToiletData.length) return null;
        return {
            all: rawToiletData.length,
            secure: rawToiletData.filter(t => t.emgncBellInstlYn === 'Y' || t.toiletEntrncCctvInstlYn === 'Y').length,
            accessible: rawToiletData.filter(t => (Number(t.maleDspsnClosetCnt) > 0) || (Number(t.femaleDspsnClosetCnt) > 0)).length,
            family: rawToiletData.filter(t => t.diaperExhgTablYn === 'Y').length,
        };
    }, [rawToiletData]);


    const filteredData = useMemo(() => {
        switch (filterMode) {
            case 'secure': return rawToiletData.filter(t => t.emgncBellInstlYn === 'Y' || t.toiletEntrncCctvInstlYn === 'Y');
            case 'accessible': return rawToiletData.filter(t => (Number(t.maleDspsnClosetCnt) > 0) || (Number(t.femaleDspsnClosetCnt) > 0));
            case 'family': return rawToiletData.filter(t => t.diaperExhgTablYn === 'Y');
            default: return rawToiletData;
        }
    }, [rawToiletData, filterMode]);



    const emdStats = useMemo(() => {
        const counts: any = {};
        filteredData.forEach(t => { counts[t.emdNm] = (counts[t.emdNm] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value).slice(0, 7);
    }, [filteredData]);

    const genderStats = useMemo(() => {
        let male = 0, female = 0;
        filteredData.forEach(t => {
            male += (Number(t.maleClosetCnt) || 0) + (Number(t.maleUrinalCnt) || 0);
            female += (Number(t.femaleClosetCnt) || 0);
        });
        return [
            { name: '남성', value: male, fill: '#00b8db' },
            { name: '여성', value: female, fill: '#ff2056' }
        ];
    }, [filteredData]);


    return (
        <div className="w-full h-full relative overflow-y-auto pb-40 pt-32 px-4 md:px-8 custom-scrollbar bg-transparent">
            <div className="max-w-5xl mx-auto flex flex-col gap-12">


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'all', label: '전체 시설', icon: <FaLayerGroup />, count: totalStats?.all, color: 'border-slate-400/20' },
                        { id: 'secure', label: '비상벨, CCTV 설치 시설', icon: <FaShieldAlt />, count: totalStats?.secure, color: 'border-emerald-500/20' },
                        { id: 'accessible', label: '장애인 편의 시설', icon: <FaWheelchair />, count: totalStats?.accessible, color: 'border-blue-500/20' },
                        { id: 'family', label: '유아 편의 시설', icon: <FaBaby />, count: totalStats?.family, color: 'border-orange-500/20' },
                    ].map((btn) => (
                        <motion.button
                            key={btn.id}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setFilterMode(btn.id as any)}
                            className={`p-6 rounded-2xl border-2 backdrop-blur-md transition-all flex flex-col items-center gap-2 shadow-2xl
                                ${filterMode === btn.id ? `${btn.color} bg-white/50 ring-4 ring-white/20` : 'border-transparent bg-white/20 opacity-60 hover:opacity-100'}`}
                        >
                            <span className="text-2xl mb-1">{btn.icon}</span>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600">{btn.label}</span>
                            <span className="text-3xl font-[1000] text-slate-900">{btn.count}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                    {/* 지역별 분포 */}
                    <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-xl shadow-2xl h-100 flex flex-col">
                        <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">
                            지역별 분포
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emdStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#1e293b' }} fontSize={12} />
                                <YAxis hide />
                                <Bar dataKey="value" fill="#f97316" radius={[10, 10, 0, 0]} barSize={40} isAnimationActive={true}>
                                    <LabelList
                                        dataKey="value"
                                        position="middle"
                                        style={{ fill: '#ffffff', fontWeight: '900', fontSize: '14px' }}
                                        offset={10} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* 남녀 변기 비율 */}
                    <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-2xl h-100 flex flex-col">
                        <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">
                            남녀 수용력
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={genderStats} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" isAnimationActive={true} animationEasing="ease-out" animationDuration={500}
                                    labelLine={false}
                                    label={({ cx, cy, midAngle = 0, innerRadius, outerRadius, value }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x} y={y}
                                                fill="white"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className="font-black text-sm">
                                                {value}
                                            </text>
                                        );
                                    }}

                                >
                                    {genderStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}

                                </Pie>

                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* 리뷰 상위 5개 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-2xl col-span-1 md:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-[1000] text-slate-800 uppercase tracking-tighter ">Top 5 RATED Toilet</h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            {[
                                { name: "제주4·3평화공원 1번 화장실", score: 4.9, reviewCount: 128 },
                                { name: "함덕해수욕장 중앙 화장실", score: 4.7, reviewCount: 256 },
                                { name: "한라산 탐방로 입구", score: 4.5, reviewCount: 89 },
                                { name: "제주공항 P1 주차장", score: 4.4, reviewCount: 412 },
                                { name: "성산일출봉 매표소 옆", score: 4.2, reviewCount: 167 }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                                    className="flex items-center justify-between p-5 bg-white/20 rounded-3xl border border-white/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <span className={`text-2xl font-black ${index === 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                                            0{index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg">{item.name}</h4>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest"> {item.reviewCount} Reviews</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-2xl shadow-sm">
                                        <span className="text-orange-500 font-black">★</span>
                                        <span className="font-[1000] text-slate-800">{item.score}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}