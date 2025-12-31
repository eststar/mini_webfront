"use client";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsGoogle } from "react-icons/bs";
import { SiNaver } from "react-icons/si";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-7 h-7 mx-auto border-4 border-white/10 border-t-white border-l-white rounded-full flex justify-center items-center"
    />
  );


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


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("제대로 입력하세요")
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/back/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        router.push("/main")
      }
      else {
        const errorData = await response.json().catch(() => ({}));
        alert(`로그인 실패(서버 문제)`);
      }
    } catch (error) {
      alert(`로그인 실패`);
      console.error(error);
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <main className="fixed inset-0 overflow-hidden flex items-center justify-center p-6">

      <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#e1fbff] via-[#ffe9c5] to-[#e0f5ff]" />


      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] w-200 h-200 bg-orange-200/30 rounded-full blur-[150px] z-0 pointer-events-none"
      />

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-lg z-10"
      >
        <div className="relative overflow-hidden rounded-[40px] bg-white/30 backdrop-blur-[30px] border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] p-12 md:p-16">
          <form onSubmit={handleLogin} className="relative z-10">

            {/* HEADER */}
            <motion.div variants={itemVars} className="mb-14">
              <h2 className="text-5xl font-[950] tracking-tighter uppercase text-slate-800 ">
                LOG <span className="text-orange-500">IN</span>
              </h2>
              <p className="mt-6 text-[11px] font-black tracking-[0.5em] text-slate-500 uppercase leading-relaxed">
                To Save <br />Your Dignity
              </p>
            </motion.div>


            <motion.div variants={itemVars} className="space-y-4">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/40 border border-white px-7 py-5 rounded-2xl outline-none focus:bg-white/80 transition-all text-slate-700 placeholder:text-slate-400 text-sm tracking-widest font-bold"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-white/40 border border-white px-7 py-5 rounded-2xl outline-none focus:bg-white/80 transition-all text-slate-700 placeholder:text-slate-400 text-sm tracking-widest font-bold"
              />
            </motion.div>


            <motion.div variants={itemVars} className="group relative w-full mt-10">
              <button type="submit" disabled={isLoading} className="relative w-full py-6 cursor-pointer active:scale-95 transition-all duration-500 rounded-2xl overflow-hidden shadow-xl shadow-orange-200/30">

                <div className="absolute inset-0 bg-orange-500 transition-colors duration-500 group-hover:bg-orange-600" />
                <div className="absolute inset-0 rounded-2xl border border-white/20 z-20" />
                <span className="relative z-30 text-white font-[950] tracking-[0.5em] uppercase text-sm">
                  {isLoading ? <Spinner />: "Log In"}
                </span>
              </button>
            </motion.div>

            <motion.div variants={itemVars} className="relative my-10 flex items-center justify-center">
              <span className="relative bg-transparent px-4 text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Or Continue With</span>
            </motion.div>


            <motion.div variants={itemVars} className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-5 bg-white/40 border border-white rounded-2xl transition-all hover:bg-white/70 hover:shadow-md duration-300">
                <span className="text-2xl text-blue-600"><BsGoogle /></span>
              </button>

              <button className="flex items-center justify-center py-5 bg-white/40 border border-white rounded-2xl transition-all hover:bg-white/70 hover:shadow-md duration-300">
                <span className="text-2xl text-green-500"><SiNaver /></span>
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVars} className="mt-12 flex flex-col items-center gap-6">
            <button className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase hover:text-orange-500 transition-colors" onClick={() => router.push("/signin")}>
              Create New Account
            </button>
            <button
              onClick={() => router.back()}
              className="text-[10px] font-bold text-slate-400 tracking-[0.5em] uppercase hover:text-orange-500 transition-colors"
            >
              ← Return
            </button>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}