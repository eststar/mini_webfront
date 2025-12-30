"use client";

import { Map, CustomOverlayMap, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import { FaMale, FaFemale, FaWheelchair, FaBaby } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";


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



    const handleMarkerClick = (name: string) => {
        toast.dismiss();
        toast.success(`${name}`, {
            position: "top-center",
            duration: 2000,
            style: {
                marginTop: "25px",
                borderRadius: '50px',
                background: '#ffffff',
                color: '#181818',
                fontWeight: '900',
                border: '2px solid #f97316',
                padding: '12px 24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            },
            iconTheme: {
                primary: '#f97316',
                secondary: '#fff',
            },
        });
    };

    if (loading) return (
        <div className="flex h-full items-center justify-center font-black text-orange-500 animate-pulse text-2xl tracking-widest bg-white/10 backdrop-blur-md">
            MAP LOADING...
        </div>
    );

    return (
        <div className="w-full h-full relative">
            <Toaster position="top-center" />
            <Map
                center={{ lat: 33.51315888, lng: 126.5246321 }}
                style={{ width: "100%", height: "100%" }}
                level={3}
            >
                {toilets.length > 0 && (
                    <MarkerClusterer
                        averageCenter={true}
                        minLevel={6}
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
                                yAnchor={1.2}
                                clickable={true}
                            >
                                <div
                                    onClick={() => handleMarkerClick(toilet.toiletNm)}
                                    className="relative flex flex-col items-center group cursor-pointer"
                                >
                                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-2xl shadow-xl transition-all bg-white border border-slate-200 group-hover:scale-110 group-hover:border-orange-500 group-hover:z-50">
                                        <span className="text-[10px] md:text-xs font-black uppercase text-zinc-900 whitespace-nowrap">
                                            {toilet.toiletNm}
                                        </span>
                                        <div className="flex gap-0.5 items-center">
                                            {/* 남성 화장실 */}
                                            {(Number(toilet.maleClosetCnt) > 0 || Number(toilet.maleUrinalCnt) > 0) && (
                                                <FaMale className="text-cyan-500 text-[10px] md:text-xs" />
                                            )}

                                            {/* 여성 화장실 */}
                                            {Number(toilet.femaleClosetCnt) > 0 && (
                                                <FaFemale className="text-red-500 text-[10px] md:text-xs" />
                                            )}

                                            {/* 장애인 시설 */}
                                            {(Number(toilet.maleDspsnClosetCnt) > 0 || Number(toilet.femaleDspsnClosetCnt) > 0) && (
                                                <FaWheelchair className="text-blue-500 text-[10px] md:text-xs" />
                                            )}

                                            {/* 기저귀 교체대 */}
                                            {toilet.diaperExhgTablYn === "Y" && (
                                                <FaBaby className="text-lime-500 text-[10px] md:text-xs" />
                                            )}

                                        </div>
                                    </div>
                                    <div className="w-2.5 h-2.5 rotate-45 -mt-1.5 bg-white border-r border-b border-slate-200" />
                                </div>
                            </CustomOverlayMap>
                        ))}
                    </MarkerClusterer>
                )}
            </Map>
        </div>
    );
}