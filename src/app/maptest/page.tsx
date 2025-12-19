"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 1. Map Initialization Logic
  const initMap = () => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // JEJU (Context)
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current!, options);

      new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(33.450701, 126.570667),
        map: map,
      });

      new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(33.450701, 126.570667),
        content: `
          <div style="padding:10px; background:#fff; border-radius:15px; border:2px solid #fbbf24; font-weight:bold; color:#000; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            GIGA CHAD STATION
          </div>`,
        map: map,
      });

      map.relayout();
    });
  };

  
  useEffect(() => {
    if (mapLoaded) {
      initMap();
    }
  }, [mapLoaded]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-900 p-6">
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("SDK Loaded. Dominating the Map...");
          setMapLoaded(true);
        }}
      />

      <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">
        KAKAO MAP : <span className="text-yellow-500">GIGA CHAD EDITION</span>
      </h1>

      {/* 3. 지도 컨테이너: 깔끔한 마감 보장 */}
      <div
        ref={mapRef}
        className="w-full max-w-5xl h-[600px] rounded-[2rem] border-[12px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      />
      
      <p className="mt-6 text-zinc-500 font-medium">
        {mapLoaded ? "SYSTEM ONLINE" : "LOADING RESOURCES..."}
      </p>
    </div>
  );
}