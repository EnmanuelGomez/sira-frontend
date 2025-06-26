import styles from "@/app/styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div>
          <p>Santo Domingo, D.N, República Dominicana</p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} SIRA. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
