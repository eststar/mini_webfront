"use client";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ChangeInfoPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [newPasswordrepeat, setNewPasswordrepeat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [originNickname, setOriginNickname] = useState("");

  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-7 h-7 mx-auto border-4 border-white/10 border-t-white border-l-white rounded-full flex justify-center items-center"
    />
  );


  useEffect(() => { setMounted(true); }, []);


  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const res = await fetch("/back/api/members/myinfo", {
          headers: { "ngrok-skip-browser-warning": "69420" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOriginNickname(data.nickname);
        }
      } catch (err) {
        console.error("로그인 정보 로드 실패", err);
      }
    };
    getMyInfo();
  }, []);

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
    },
  };

  // 정보 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!password) {
      alert("기존 비밀번호를 입력해주십시오.");
      return;
    }


    const finalNickname = (nickname && nickname.trim() !== "") ? nickname : originNickname;


    if (newPassword && newPassword !== newPasswordrepeat) {
      alert("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);


    const updateData = {
      nickname: finalNickname,
      password: password,
      newPassword: newPassword || "" 
    };

    try {
      const response = await fetch("/back/api/members/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert("정보가 수정되었습니다.");
        router.push("/main");
      } else {

        const errorText = await response.text();
        console.error("서버 응답 에러:", errorText);
        alert("수정 실패: 입력 정보를 다시 확인해주세요.");
      }
    } catch (error) {
      console.error("통신 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!confirm("정말로 탈퇴하시겠습니까? 바지 버려도 모릅니다.")) return;

    const currentPass = prompt("비밀번호를 입력해주세요.");
    if (!currentPass) return;

    setIsLoading(true);
    try {
      const response = await fetch("/back/api/members/signout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
        body: JSON.stringify({ password: currentPass }),
      });


      console.log("📡 [응답 상태 코드]:", response.status);
      console.log("📡 [응답 OK 여부]:", response.ok);

      if (response.status !== 204 && response.ok) {
        const data = await response.json();
        console.log("📦 [응답 바디]:", data);
      }
      // ----------------------------------

      if (response.status === 204 || response.ok) {
        alert("탈퇴 완료되었습니다.");
        localStorage.removeItem("user_nickname");
        window.location.replace("/main");
      } else {

        try {
          const errorData = await response.json();
          console.error("❌ [실패 상세]:", errorData);
        } catch (e) {
          console.error("❌ [실패]: 상세 메시지 없음 (Status: " + response.status + ")");
        }
        alert("탈퇴 실패: 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("🚨 통신 실패:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden flex items-center justify-center p-6">

      <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#638388] via-[#ffe9c5] to-[#e0f5ff]" />
      {resolvedTheme === 'dark' && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-zinc-950/80 mix-blend-multiply" />
      )}

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-lg z-10"
      >
        <div className="relative overflow-hidden rounded-[40px] bg-white/30 backdrop-blur-[30px] border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] p-12 md:p-16 dark:bg-zinc-600/30 dark:border-zinc-400/10">
          <form onSubmit={handleUpdate} className="relative z-10">

            {/* HEADER */}
            <motion.div variants={itemVars} className="mb-14">
              <h2 className="text-5xl font-[950] tracking-tighter uppercase text-slate-800 dark:text-white">
                정보 <span className="text-orange-500">수정</span>
              </h2>

            </motion.div>


            <motion.div variants={itemVars} className="space-y-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="NEW NICKNAME"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewpassword(e.target.value)}
                placeholder="NEW PASSWORD (IF YOU NEED)"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
              <input
                type="password"
                value={newPasswordrepeat}
                onChange={(e) => setNewPasswordrepeat(e.target.value)}
                placeholder="NEW PASSWORD AGAIN (IF YOU NEED)"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
            </motion.div>


            <motion.div variants={itemVars} className="group relative w-full mt-10">
              <button type="submit" disabled={isLoading} className="relative w-full py-6 cursor-pointer active:scale-95 transition-all duration-500 rounded-2xl overflow-hidden shadow-orange-200/30">

                <div className="absolute inset-0 bg-orange-400 transition-colors duration-500 group-hover:bg-orange-500" />
                <div className="absolute inset-0 rounded-2xl border border-white/20 z-20" />
                <span className="relative z-30 text-white font-[950] tracking-[0.5em] uppercase text-sm">
                  {isLoading ? <Spinner /> : "SUBMIT"}
                </span>
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVars} className="mt-12 flex flex-col items-center gap-6">

            <button
              onClick={() => router.back()}
              className="text-[10px] font-bold text-slate-400 tracking-[0.5em] uppercase hover:text-orange-500 transition-colors"
            >
              ← Return
            </button>

            <button
              onClick={handleDeleteAccount}
              className="mt-4 text-[12px] font-bold text-rose-400/80 tracking-[0.3em] uppercase hover:text-red-500 transition-colors cursor-pointer"
            >
              DELETE YOUR ACCOUNT
            </button>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}