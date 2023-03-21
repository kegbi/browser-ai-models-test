import React from "react";

export type ButtonSelectorButtonConfig = {
  label: string;
  value: string;
  action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isDisabled?: boolean;
  isHidden?: boolean;
};
