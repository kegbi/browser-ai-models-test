import React from "react";
import styles from "@/components/ButtonSelector/ButtonSelector.module.css";
import cn from "classnames";
import { ExecutionProviders } from "@/components/SelectorComponent/types";

interface ButtonSelectorProps {
  selectedValue: string;
  setSelectHandler: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  options: string[];
}

export function ButtonSelector({
  selectedValue,
  setSelectHandler,
  options,
}: ButtonSelectorProps) {
  return (
    <div className={styles.buttonGroup}>
      {options.map((option) => (
        <button
          key={option}
          onClick={(event) => setSelectHandler(event)}
          value={option}
          className={cn(styles.button, {
            [styles.selectedButton]: option === selectedValue,
          })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
