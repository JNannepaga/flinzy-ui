import React, { useRef } from "react";
import type { Task } from "./TasksBoard";

type Props = {
  task: Task;
  hidden?: boolean;
  // parent will receive element so it can measure and attach global listeners
  onPointerDown: (task: Task, el: HTMLElement, clientX: number, clientY: number) => void;
};

export default function TaskItem({ task, hidden, onPointerDown }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // prevent text selection / default drag behavior
    e.preventDefault();
    // capture pointer on this element to get subsequent pointer events if needed
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
    if (ref.current) {
      onPointerDown(task, ref.current, e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      style={{
        background: "white",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        cursor: "grab",
        userSelect: "none",
        visibility: hidden ? "hidden" : "visible",
      }}
      role="button"
      tabIndex={0}
    >
      <div style={{ fontSize: 15 }}>{task.title}</div>
    </div>
  );
}