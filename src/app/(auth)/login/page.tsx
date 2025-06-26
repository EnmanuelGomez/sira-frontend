"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import styles from "../AuthForm.module.css";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Correo o contraseña incorrectos");
    } else {
      router.push("/seguros"); 
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>SIRA</div>

      <div className={styles.card}>
        <h2 className={styles.title}>Inicio Sesión</h2>

        <label className={styles.label}>Correo Electrónico</label>
        <input
          type="email"
          placeholder="ejemplo@gmail.com"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
        />
          <span
            className={styles.toggleIcon}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
          </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Cargando..." : "Login"}
        </button>

        <p className={styles.link}>
          ¿Tienes una cuenta?{" "}
          <Link href="/register">
            <span style={{ color: "blue" }}>Regístrate</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
