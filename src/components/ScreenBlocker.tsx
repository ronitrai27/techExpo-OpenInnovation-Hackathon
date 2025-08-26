"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ScreenSizeBlocker = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 820);
    };

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isSmallScreen) return null;

  return (
    <Dialog open={true} modal={true}>
      <DialogContent
        className="sm:max-w-[400px] text-center"
        // hideCloseButton // ensures no close button
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Screen Too Small
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm mt-2">
          This app cannot be used on smaller screens. <br />
          For the best experience, please use a laptop or PC.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenSizeBlocker;
