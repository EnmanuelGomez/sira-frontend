import styles from "@/app/styles/Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando recomendaciones...</p>
    </div>
  );
};

export default Loader;
