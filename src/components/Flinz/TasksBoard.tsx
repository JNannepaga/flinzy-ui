import React, { useState, useRef, useEffect, useCallback } from "react";
import TaskItem from "./TaskItem";

type Status = "todo" | "inprogress" | "done";

export type Task = {
  id: string;
  title: string;
  status: Status;
};

type ColumnRects = Partial<Record<Status, DOMRect>>;

const initialTasks: Task[] = [
  { id: "1", title: "Write specs", status: "todo" },
  { id: "2", title: "Implement UI", status: "inprogress" },
  { id: "3", title: "QA & fix", status: "done" },
];

export default function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // column DOM nodes
  const colRefs = {
    todo: useRef<HTMLDivElement | null>(null),
    inprogress: useRef<HTMLDivElement | null>(null),
    done: useRef<HTMLDivElement | null>(null),
  };

  // measured rects used to detect drop target
  const colsRef = useRef<ColumnRects>({});

  // dragging metadata
  const [drag, setDrag] = useState<{
    task: Task;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    sourceStatus: Status;
  } | null>(null);

  // measure columns (call on start and on resize/scroll)
  const measureCols = useCallback(() => {
    colsRef.current = {
      todo: colRefs.todo.current?.getBoundingClientRect() ?? undefined,
      inprogress: colRefs.inprogress.current?.getBoundingClientRect() ?? undefined,
      done: colRefs.done.current?.getBoundingClientRect() ?? undefined,
    };
  }, []);

  useEffect(() => {
    const onResize = () => measureCols();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    measureCols();
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [measureCols]);

  // start dragging: called by TaskItem with the element and pointer coordinates
  const startDrag = useCallback(
    (task: Task, el: HTMLElement, clientX: number, clientY: number) => {
      // measure columns at start
      measureCols();
      const r = el.getBoundingClientRect();
      setDrag({
        task,
        width: r.width,
        height: r.height,
        offsetX: clientX - r.left,
        offsetY: clientY - r.top,
        x: r.left,
        y: r.top,
        sourceStatus: task.status,
      });

      // attach global listeners
      const onMove = (ev: PointerEvent) => {
        ev.preventDefault();
        setDrag((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            x: ev.clientX - prev.offsetX,
            y: ev.clientY - prev.offsetY,
          };
        });
      };

      const onUp = (ev: PointerEvent) => {
        ev.preventDefault();
        // decide target column
        const centerX = ev.clientX;
        const rects = colsRef.current;
        let target: Status = task.status;
        const candidates: { s: Status; rect?: DOMRect }[] = [
          { s: "todo", rect: rects.todo },
          { s: "inprogress", rect: rects.inprogress },
          { s: "done", rect: rects.done },
        ];
        // pick the column that contains centerX, otherwise nearest by center distance
        const containing = candidates.find((c) => c.rect && centerX >= c.rect.left && centerX <= c.rect.right);
        if (containing) {
          target = containing.s;
        } else {
          // fallback nearest
          let best: { s: Status; d: number } | null = null;
          for (const c of candidates) {
            if (!c.rect) continue;
            const center = c.rect.left + c.rect.width / 2;
            const d = Math.abs(centerX - center);
            if (!best || d < best.d) best = { s: c.s, d };
          }
          if (best) target = best.s;
        }

        // update tasks only if status changed
        setTasks((prev) => (prev.map((t) => (t.id === task.id ? { ...t, status: target } : t))));

        // cleanup
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        setDrag(null);
      };

      // use capture listeners on window so we receive events outside the element
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    },
    [measureCols]
  );

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const columnStyle: React.CSSProperties = {
    flex: 1,
    padding: 12,
    borderRight: "1px solid #eee",
    minHeight: 200,
  };

  return (
    <div style={{ display: "flex", gap: 0, height: "100%" }}>
      <div ref={colRefs.todo} style={columnStyle}>
        <h3>To Do</h3>
        {grouped.todo.map((t) => (
          <TaskItem key={t.id} task={t} hidden={!!(drag && drag.task.id === t.id)} onPointerDown={startDrag} />
        ))}
      </div>

      <div ref={colRefs.inprogress} style={columnStyle}>
        <h3>In Progress</h3>
        {grouped.inprogress.map((t) => (
          <TaskItem key={t.id} task={t} hidden={!!(drag && drag.task.id === t.id)} onPointerDown={startDrag} />
        ))}
      </div>

      <div ref={colRefs.done} style={{ ...columnStyle, borderRight: "none" }}>
        <h3>Done</h3>
        {grouped.done.map((t) => (
          <TaskItem key={t.id} task={t} hidden={!!(drag && drag.task.id === t.id)} onPointerDown={startDrag} />
        ))}
      </div>

      {/* Drag ghost overlay */}
      {drag && (
        <div
          style={{
            position: "fixed",
            left: drag.x,
            top: drag.y,
            width: drag.width,
            height: drag.height,
            pointerEvents: "none",
            zIndex: 1000,
            transform: "translateZ(0)",
          }}
        >
          <div
            style={{
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <div style={{ fontWeight: 600 }}>{drag.task.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>Moving...</div>
          </div>
        </div>
      )}
    </div>
  );
}