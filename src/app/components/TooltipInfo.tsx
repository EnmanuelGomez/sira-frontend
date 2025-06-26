"use client";
import { useState } from "react";
import { Info } from "lucide-react";

import styles from "@/app/styles/TooltipInfo.module.css";

interface TooltipInfoProps {
  text: string;
}

const TooltipInfo = ({ text }: TooltipInfoProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={styles.tooltipWrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info size={16} className={styles.icon} />
      {visible && <div className={styles.tooltip}>{text}</div>}
    </span>
  );
};

export default TooltipInfo;
