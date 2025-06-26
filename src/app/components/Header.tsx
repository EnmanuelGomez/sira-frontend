import Link from "next/link";
import styles from "@/app/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>Inicio</Link>
          <Link href="/seguros" className={styles.link}>Buscar Seguros</Link>
          <Link href="/guardados" className={styles.link}>Seguros Guardados</Link>
        </div>
      </nav>
    </header>
  );
}