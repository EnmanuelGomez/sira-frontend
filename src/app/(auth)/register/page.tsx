"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient"; 
import styles from "../AuthForm.module.css";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>SIRA</div>

      <div className={styles.card}>
        <h2 className={styles.title}>Registro</h2>

        <label className={styles.label}>Nombre</label>
        <input
          type="text"
          name="firstName"
          className={styles.input}
          value={form.firstName}
          onChange={handleChange}
        />

        <label className={styles.label}>Apellidos</label>
        <input
          type="text"
          name="lastName"
          className={styles.input}
          value={form.lastName}
          onChange={handleChange}
        />

        <label className={styles.label}>Correo Electrónico</label>
        <input
          type="email"
          name="email"
          className={styles.input}
          value={form.email}
          onChange={handleChange}
        />

        <label className={styles.label}>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
          />
          <span
            className={styles.toggleIcon}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
        </div>

        <label className={styles.label}>Confirm Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            className={styles.input}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span
            className={styles.toggleIcon}
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <button
          className={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className={styles.link}>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login">
            <span style={{ color: "blue" }}>Inicia sesión</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
