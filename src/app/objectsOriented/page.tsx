import Link from "next/link";
import Image from "next/image";
import styles from '../styles/objectsOriented.module.css'; 
import Header from "../components/Header";
import ManualButton from "../components/ManualButton";

const ObjectsOrientedPage = () => {
  return (
    <>
        <Header />
        <ManualButton />
        <h2 className={styles.titulo}>Selecciona el tipo de seguro</h2>

    <div className={styles.container}>
      <Link href="/objectsOriented/vehiculo">
        <div className={styles.recuadro}>
          <Image src="/icons/car-icon.png" alt="Vehiculo" width={100} height={100} />
          <span>Seguros de Vehículo</span>
        </div>
      </Link>
      <Link href="/objectsOriented/hogar">
        <div className={styles.recuadro}>
          <Image src="/icons/home-icon.png" alt="Vivienda" width={100} height={100} />
          <span>Seguros de Vivienda</span>
        </div>
      </Link>
    </div>
  </>
  );
};

export default ObjectsOrientedPage;