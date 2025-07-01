import Link from "next/link";
import Image from "next/image";
import styles from '../styles/peopleOriented.module.css'; 
import Header from "../components/Header";
import ManualButton from "../components/ManualButton";

const PeopleOrientedPage = () => {
  return (
    <>  
        <Header />
        <ManualButton />
        <h2 className={styles.titulo}>Selecciona el tipo de seguro</h2>

    <div className={styles.container}>
      <Link href="/peopleOriented/salud">
        <div className={styles.recuadro}>
          <Image src="/icons/salud-icon.png" alt="Salud" width={100} height={100} />
          <span>Seguros de Salud</span>
        </div>
      </Link>
      <Link href="/peopleOriented/viaje">
        <div className={styles.recuadro}>
          <Image src="/icons/viaje-icon.png" alt="Viaje" width={100} height={100} />
          <span>Seguros de Viaje</span>
        </div>
      </Link>
      <Link href="/peopleOriented/vida">
        <div className={styles.recuadro}>
          <Image src="/icons/vida-icon.png" alt="Vida" width={100} height={100} />
          <span>Seguros de Vida</span>
        </div>
      </Link>
    </div>
    </>
  );
};

export default PeopleOrientedPage;