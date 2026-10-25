"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "../Icon";

/**
 * Accessible modal built on the native <dialog> element: focus is trapped by
 * the browser, Escape closes it, and focus returns to the element that opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  variant = "center",
  labelId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "center" | "sheet";
  labelId: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
      const target = returnFocus.current;
      if (target && target.isConnected) target.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const position =
    variant === "sheet"
      ? "m-0 ml-auto h-dvh max-h-dvh w-full max-w-md rounded-none sm:rounded-l-[1.75rem]"
      : "m-auto max-h-[92dvh] w-[min(100%-2rem,40rem)] rounded-2xl sm:rounded-[1.75rem]";

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      className={`${position} overflow-hidden bg-paper p-0 text-ink shadow-2xl backdrop:bg-crate-deep/60`}
      onClick={(event) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
          <h2 id={labelId} className="sign text-3xl text-crate">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-crate"
          >
            <Icon name="close" width="1.4em" height="1.4em" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}
