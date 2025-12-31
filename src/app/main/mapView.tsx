"use client";
import { motion, Variants } from "framer-motion";
import { Map, CustomOverlayMap, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import { FaMale, FaFemale, FaWheelchair, FaBaby, FaMapMarkerAlt } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";
import { MdGpsFixed } from "react-icons/md";
let cachedToilets: Toilet[] = [];

interface Toilet {
    dataCd: string;
    toiletNm: string;
    laCrdnt: number;
    loCrdnt: number;
    maleClosetCnt: number;
    maleUrinalCnt: number;
    femaleClosetCnt: number;
    maleDspsnClosetCnt: number;
    femaleDspsnClosetCnt: number;
    diaperExhgTablYn: string;
}

export default function MapView() {
    const [loading] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string,
        libraries: ["services", "clusterer"],
    });

    const [toilets, setToilets] = useState<Toilet[]>(cachedToilets);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [level, setLevel] = useState(3);
    const [map, setMap] = useState<kakao.maps.Map | null>(null);

    const [myPos, setMyPos] = useState<{ lat: number; lng: number }>({
        lat: 33.497,
        lng: 126.537
    });

    const Spinner = () => (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-7 h-7 mx-auto border-4 border-white/10 border-t-orange-500 border-l-orange-500 rounded-full flex justify-center items-center"
        />
    );
    useEffect(() => {
        if (cachedToilets.length > 0) return;

        const fetchToilets = async () => {
            try {
                const response = await fetch("/back/api/test/toiletinfo/getallinfo");
                const data = await response.json();

                const list = data.toilet_info || data;
                const st = list.map((t: any) => ({
                    ...t
                }));

                setToilets(st);
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            }
        };

        fetchToilets();
    }, []);

    



    if (loading) return (
        <div className="flex h-full items-center justify-center font-black text-orange-500 animate-pulse text-2xl tracking-widest bg-white/10 backdrop-blur-md">
            <Spinner />
        </div>
    );

    return (
        <div className="w-full h-full relative">

            <Map
                center={myPos}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onCreate={setMap}
                onZoomChanged={(map) => setLevel(map.getLevel())}
            >

                {/* 자기 위치 */}
                <CustomOverlayMap position={myPos} zIndex={100}>
                    <div className="relative flex items-center justify-center">

                        <div className="absolute w-10 h-10 bg-stone-700/30 rounded-full animate-ping" />
                        <div className="relative w-6 h-6 bg-stone-700/95 backdrop-blur-2xl rounded-full border border-white shadow-lg flex justify-center items-center">
                            <FaPersonWalking className="text-xl text-stone-100" />
                        </div>

                    </div>
                </CustomOverlayMap>


                {toilets.length > 0 && (
                    <MarkerClusterer
                        averageCenter={true}
                        minLevel={3}

                        styles={[
                            {
                                width: '60px',
                                height: '60px',
                                background: 'rgba(249, 115, 22, 0.95)',
                                borderRadius: '50%',
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: '1000',
                                lineHeight: '60px',
                                fontSize: '18px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                border: '2px solid white'
                            }
                        ]}
                    >
                        {toilets.map((toilet) => (
                            <CustomOverlayMap
                                key={toilet.dataCd}
                                position={{ lat: toilet.laCrdnt, lng: toilet.loCrdnt }}
                                clickable={true}
                                zIndex={hoveredId === toilet.dataCd ? 50 : 1}
                            >

                                <div className="relative w-0 flex flex-col h-0 items-center justify-end"
                                    onMouseEnter={() => setHoveredId(toilet.dataCd)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => {
                                        if (!map) return;
                                        const targetPos = new kakao.maps.LatLng(toilet.laCrdnt, toilet.loCrdnt);
                                        if (map.getLevel() > 2) {
                                            map.setLevel(2);
                                        }
                                        map.panTo(targetPos);
                                        setHoveredId(toilet.dataCd);
                                    }}
                                >

                                    {(level <= 4) && (
                                        <div className="relative flex flex-col items-center px-2 py-1.5 rounded-3xl bg-white/50 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/70 group-hover:border-orange-400/50 group-hover:shadow-orange-200/50 group-hover:scale-115 transition-all duration-300 z-20 mb-1">
                                            <span className="text-[14px] font-[1000] text-slate-900 tracking-tight mb-2 max-w-37 truncate">
                                                {toilet.toiletNm}
                                            </span>
                                            <div className="flex gap-1.5 items-center pt-2 border-t border-white/80 w-full justify-center">
                                                {(Number(toilet.maleClosetCnt) > 0) && (
                                                    <div className="w-10 h-7 flex items-center justify-center bg-cyan-50 rounded-xl text-cyan-600 shadow-sm border border-cyan-100/50">
                                                        <FaMale size={16} />
                                                    </div>
                                                )}
                                                {(Number(toilet.femaleClosetCnt) > 0) && (
                                                    <div className="w-10 h-7 flex items-center justify-center bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100/50">
                                                        <FaFemale size={16} />
                                                    </div>
                                                )}
                                                {(Number(toilet.maleDspsnClosetCnt) > 0 || Number(toilet.femaleDspsnClosetCnt) > 0) && (
                                                    <div className="w-10 h-7 flex items-center justify-center bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100/50">
                                                        <FaWheelchair size={16} />
                                                    </div>
                                                )}
                                                {toilet.diaperExhgTablYn === "Y" && (
                                                    <div className="w-10 h-7 flex items-center justify-center bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100/50">
                                                        <FaBaby size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}


                                    <div className="relative h-6 w-6 flex items-center justify-center">
                                        <div className="w-3.5 h-3.5 bg-orange-500 rounded-full shadow-md z-10 border border-white flex justify-center items-center text-center" />
                                        <div className="absolute w-7 h-7 bg-orange-400/30 rounded-full animate-ping" />
                                    </div>
                                </div>
                            </CustomOverlayMap>
                        ))}
                    </MarkerClusterer>
                )}
            </Map>
            <div className="absolute bottom-8 right-3 z-999">
                <button
                    onClick={() => {
                        if (!map) return;
                        const pos = new kakao.maps.LatLng(myPos.lat, myPos.lng);
                        if (map.getLevel() > 2) {
                            map.setLevel(2);
                        }
                        map.panTo(pos);

                    }}
                    className="group relative w-14 h-14 bg-white/40 backdrop-blur-2xl border border-white/60  rounded-full   shadow-[0_0_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all active:scale-90 hover:border-orange-500/50 cursor-pointer"
                >

                    <MdGpsFixed  className="text-slate-700 text-2xl group-hover:text-orange-500 transition-colors" />
                </button>
            </div>
        </div>
    );
}