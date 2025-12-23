"use client";

import { Map, CustomOverlayMap, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

let cachedToilets: Toilet[] = [];

interface Toilet {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

export default function MapView() {
    const [loading] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string,
        libraries: ["services", "clusterer"],
    });

    const [toilets, setToilets] = useState<Toilet[]>(cachedToilets);

    useEffect(() => {
        if (cachedToilets.length > 0) return;

        fetch("/data/toilets.json")
            .then((res) => res.json())
            .then((data) => {
                cachedToilets = data;
                setToilets(data);
            })
            .catch((err) => console.error(err));
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
        <div className="flex h-full items-center justify-center font-black text-orange-500 animate-pulse text-2xl tracking-widest">
            로딩...
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
                            }
                        ]}
                    >
                        {toilets.map((toilet) => (
                            <CustomOverlayMap
                                key={toilet.id}
                                position={{ lat: toilet.lat, lng: toilet.lng }}
                                yAnchor={1.2}
                            >
                                <div
                                    onClick={() => handleMarkerClick(toilet.name)}
                                    className="relative flex flex-col items-center group cursor-pointer"
                                >
                                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-2xl shadow-xl transition-all bg-white group-hover:scale-110 group-hover:border-orange-500">
                                        <span className="text-xs font-black uppercase text-zinc-900">
                                            {toilet.name}
                                        </span>
                                        <div className="flex gap-1 items-center">
                                            <FaMale className="text-cyan-500" />
                                            <FaFemale className="text-red-500" />
                                        </div>
                                    </div>
                                    <div className="w-3 h-3 rotate-45 -mt-1.75 bg-white" />
                                </div>
                            </CustomOverlayMap>
                        ))}
                    </MarkerClusterer>
                )}
            </Map>
        </div>
    );
}