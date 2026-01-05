"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import { FaShieldAlt, FaWheelchair, FaBaby, FaLayerGroup } from "react-icons/fa";
import { MdBabyChangingStation } from "react-icons/md";

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
interface Review {
    data_cd: string;
    rating: number;
}
const RankItem = ({ item, index, type }: { item: any, index: number, type: 'top' | 'worst' }) => (
    <motion.div
        className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/20 hover:bg-white/60 transition-all min-w-0 w-full"
    >
        {/* 왼쪽 섹션: 등수 + 이름 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className={`text-xl font-black shrink-0 w-8 ${type === 'top' ? 'text-emerald-500' : 'text-red-400'}`}>
                {index + 1}
            </span>
            <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-800 text-base md:text-lg truncate block" title={item.name}>
                    {item.name}
                </h4>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase">
                    {item.reviewCount} Reviews
                </p>
            </div>
        </div>
        
        {/* 오른쪽 섹션: 평점 */}
        <div className={`flex items-center gap-1 bg-white px-3 py-1 rounded-xl shadow-sm border shrink-0 ml-2 ${type === 'top' ? 'border-emerald-100' : 'border-red-100'}`}>
            <span className={`text-xs ${type === 'top' ? 'text-emerald-500' : 'text-red-500'}`}>★</span>
            <span className="font-black text-slate-800 text-sm">{item.score}</span>
        </div>
    </motion.div>
);

export default function ChartView() {
    const [rawToiletData, setRawToiletData] = useState<any[]>([]);
    const [filterMode, setFilterMode] = useState<'all' | 'secure' | 'accessible' | 'family'>('all');
    const [allReviews, setAllReviews] = useState<Review[]>([]);
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
                const reviewRes = await fetch("/data/review.json");
                const reviewData = await reviewRes.json();
                setAllReviews(reviewData);
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

    // 상위 & 하위 평점 데이터 계산
    const { top5, worst5 } = useMemo(() => {
        if (!allReviews.length || !filteredData.length) return { top5: [], worst5: [] };

        // 집계
        const ratingMap: Record<string, { total: number; count: number }> = {};
        allReviews.forEach(rev => {
            if (!ratingMap[rev.data_cd]) ratingMap[rev.data_cd] = { total: 0, count: 0 };
            ratingMap[rev.data_cd].total += rev.rating;
            ratingMap[rev.data_cd].count += 1;
        });

        // 2. 매칭 및 평균 계산
        const evaluatedToilets = Object.entries(ratingMap)
            .map(([dataCd, stats]) => {
                const toilet = filteredData.find(t => t.dataCd === dataCd);
                if (!toilet) return null;

                const avgScore = parseFloat((stats.total / stats.count).toFixed(1));

                
                if (avgScore < 1.1) return null;
                if (4.9 < avgScore ) return null

                return {
                    name: toilet.toiletNm,
                    score: avgScore,
                    reviewCount: stats.count
                };
            })
            .filter((item): item is { name: string; score: number; reviewCount: number } => item !== null);

        // TOP 5 추출 (점수 높은 순 -> 리뷰 많은 순)
        const top5 = [...evaluatedToilets]
            .sort((a, b) => b.score - a.score || b.reviewCount - a.reviewCount)
            .slice(0, 5);

        // WORST 5 추출 (점수 낮은 순 -> 리뷰 많은 순)
        const worst5 = [...evaluatedToilets]
            .sort((a, b) => a.score - b.score || b.reviewCount - a.reviewCount)
            .slice(0, 5);

        return { top5, worst5 };
    }, [allReviews, filteredData]);

    return (
        <div className="w-full h-full relative overflow-y-auto pb-40 pt-32 px-4 md:px-8 custom-scrollbar bg-transparent">
            <div className="max-w-5xl mx-auto flex flex-col gap-12">


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'all', label: '전체 시설', icon: <FaLayerGroup />, count: totalStats?.all, color: ' border-4  border-slate-400/40' },
                        { id: 'secure', label: '비상벨, CCTV 설치 시설', icon: <FaShieldAlt />, count: totalStats?.secure, color: ' border-4  border-emerald-500/40' },
                        { id: 'accessible', label: '장애인 편의 시설', icon: <FaWheelchair />, count: totalStats?.accessible, color: ' border-4  border-blue-500/40' },
                        { id: 'family', label: '유아 편의 시설', icon: <MdBabyChangingStation />, count: totalStats?.family, color: ' border-4 border-orange-500/50' },
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 col-span-1 md:col-span-2">

                        {/* TOP 5 */}
                        <motion.div className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-3xl shadow-2xl">
                            <h3 className="text-2xl font-[1000] text-emerald-600 uppercase tracking-tighter mb-8">Top 5 Rated</h3>
                            <div className="flex flex-col gap-4">
                                {top5.map((item, index) => (
                                    <RankItem key={`top-${index}`} item={item} index={index} type="top" />
                                ))}
                            </div>
                        </motion.div>

                        {/* WORST 5 */}
                        <motion.div className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-3xl shadow-2xl">
                            <h3 className="text-2xl font-[1000] text-red-600 uppercase tracking-tighter mb-8">Worst 5 Rated</h3>
                            <div className="flex flex-col gap-4">
                                {worst5.map((item, index) => (
                                    <RankItem key={`worst-${index}`} item={item} index={index} type="worst" />
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}