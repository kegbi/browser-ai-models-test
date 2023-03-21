import React from "react";
import styles from "@/components/ButtonSelector/ButtonSelector.module.css";
import cn from "classnames";
import { ButtonSelectorButtonConfig } from "@/components/ButtonSelector/types";

interface ButtonSelectorProps {
  selectedValue: string;
  buttonsConfig: ButtonSelectorButtonConfig[];
}

export function ButtonSelector({
  selectedValue,
  buttonsConfig,
}: ButtonSelectorProps) {
  return (
    <div className={styles.buttonGroup}>
      {buttonsConfig.map((option) => (
        <button
          key={option.value}
          onClick={(event) => option.action(event)}
          value={option.value}
          className={cn(styles.button, {
            [styles.selectedButton]: option.value === selectedValue,
          })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
