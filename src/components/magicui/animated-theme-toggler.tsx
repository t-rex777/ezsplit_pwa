"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { Switch } from "../ui/switch";

type props = {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
};

export const AnimatedThemeToggler = ({ theme, setTheme }: props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const changeTheme = async () => {
    if (!buttonRef.current) return;

    await document.startViewTransition(() => {
      flushSync(() => {
        const dark = document.documentElement.classList.toggle("dark");
        setTheme(dark ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return (
    <Switch
      ref={buttonRef}
      checked={theme === "dark"}
      onCheckedChange={changeTheme}
      className="ml-auto"
    />
  );
};
