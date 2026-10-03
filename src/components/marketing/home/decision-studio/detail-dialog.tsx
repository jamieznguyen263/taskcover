"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export function DetailDialog({ children, onClose, video = false }: {
  children: ReactNode; onClose: () => void; video?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = dialog.current;
    element?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={dialog} className={video ? "video-dialog" : undefined} aria-labelledby="dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="dialog-top">
        <Image src="/brand/taskcover-horizontal.png" alt="Taskcover" width={150} height={65} />
        <button ref={closeButton} className="icon-button" aria-label="Close dialog" onClick={onClose}><X aria-hidden="true" /></button>
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
