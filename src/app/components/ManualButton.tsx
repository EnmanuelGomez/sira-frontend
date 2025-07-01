"use client";

import React from "react";
import styles from "@/app/styles/ManualButton.module.css";
import { BookOpen } from "lucide-react";

interface ManualButtonProps {
  label?: string;
  route?: string;
}

const ManualButton: React.FC<ManualButtonProps> = ({
  label = "Ver Manual de Usuario",
  route = "/manual",
}) => {
  const handleClick = () => {
    window.location.href = route;
  };

  return (
    <div className={styles.container}>
      <button onClick={handleClick} className={styles.button}>
        <BookOpen size={20} />
        {label}
      </button>
    </div>
  );
};

export default ManualButton;
