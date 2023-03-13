import React from "react";
import styles from "./SelectorComponent.module.css";

interface ModelSelectorProps {
  selectedValue: string;
  setSelectHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

export function SelectorComponent({
  selectedValue,
  setSelectHandler,
  children,
}: ModelSelectorProps) {
  return (
    <select
      className={styles.modelSelector}
      onChange={(event) => setSelectHandler(event)}
      value={selectedValue}
    >
      {children}
    </select>
  );
}
