// ...existing code...
import React, { useEffect, useRef, useState, useCallback } from "react";
import TaskCard from "../atoms/TaskCard";
import type { TaskItemDto } from "../../types/TaskItemDto";

interface DragEndPayload {
  taskId: string;
  fromListId: string;
  toListId: string;
  toIndex: number;
}

interface TaskListProps {
  tasks: TaskItemDto[];
  // unique id for this column (e.g. "todo" | "inprogress" | "done")
  listId: string;
  // called when a drag finishes (either reorder in same list or drop to another list)
  onDragEnd: (payload: DragEndPayload) => void;
}

const CARD_HEIGHT = 200; // fixed height per your comment

const TaskList: React.FC<TaskListProps> = ({ tasks, listId, onDragEnd }) => {
  // container ref for this column
  const containerRef = useRef<HTMLDivElement | null>(null);

  // currently dragged item metadata
  const [drag, setDrag] = useState<{
    task: TaskItemDto;
    index: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
  } | null>(null);

  // hover index inside this column while dragging
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // helper: clamp
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  // compute index inside a column given clientY
  const indexFromClientY = useCallback((clientY: number, containerEl: HTMLElement | null, itemsCount: number) => {
    if (!containerEl) return 0;
    const rect = containerEl.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    let idx = Math.floor(relativeY / CARD_HEIGHT);
    idx = clamp(idx, 0, itemsCount);
    return idx;
  }, []);

  // start drag - called from card wrapper
  const handlePointerDown = (task: TaskItemDto, index: number, e: React.PointerEvent, el: HTMLElement) => {
    e.preventDefault();
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {}

    const rect = el.getBoundingClientRect();
    setDrag({
      task,
      index,
      width: rect.width,
      height: rect.height,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: rect.left,
      y: rect.top,
    });

    // initial hover index within this column
    setHoverIndex(index);

    // attach global listeners
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault();
      setDrag((prev) => {
        if (!prev) return prev;
        const newX = ev.clientX - prev.offsetX;
        const newY = ev.clientY - prev.offsetY;
        // update hover index for this column if pointer over this container
        const cont = containerRef.current;
        if (cont) {
          const over = document.elementFromPoint(ev.clientX, ev.clientY);
          const containerMatch = over ? (over as HTMLElement).closest("[data-listid]") : null;
          if (containerMatch && containerMatch.dataset.listid === listId) {
            const idx = indexFromClientY(ev.clientY, cont, tasks.length);
            setHoverIndex(idx);
          } else {
            // pointer is not over this column
            setHoverIndex(null);
          }
        }
        return { ...prev, x: newX, y: newY };
      });
    };

    const onUp = (ev: PointerEvent) => {
      ev.preventDefault();
      // detect drop target column
      const under = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const targetContainer = under ? under.closest("[data-listid]") as HTMLElement | null : null;
      const toListId = targetContainer?.dataset.listid ?? listId;
      let toIndex = 0;

      if (targetContainer) {
        toIndex = indexFromClientY(ev.clientY, targetContainer as HTMLElement, // items count unknown cross-list: approximate by dividing height
          // we can use child count; but to keep safe, use its number of children minus header elements
          (targetContainer.querySelectorAll("[data-task-id]").length)
        );
      } else {
        // fallback: if not over any column, keep original list and index
        toIndex = drag ? drag.index : 0;
      }

      // When dropping into same list and toIndex should account for removing original element:
      let finalIndex = toIndex;
      if (toListId === listId && drag) {
        // if moving down and removing original reduces index by 1
        if (finalIndex > drag.index) finalIndex = finalIndex - 1;
        finalIndex = clamp(finalIndex, 0, tasks.length - 1);
      }

      // call parent callback
      onDragEnd({
        taskId: drag!.task.id,
        fromListId: listId,
        toListId,
        toIndex: finalIndex,
      });

      // cleanup
      setDrag(null);
      setHoverIndex(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  useEffect(() => {
    // update measure on resize/scroll so indexFromClientY remains accurate
    const onResize = () => {};
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, []);

  if (!tasks || tasks.length === 0) return <p>No tasks available</p>;

  return (
    <div
      ref={containerRef}
      data-listid={listId}
      style={{ padding: 8 }}
    >
      {tasks.map((task, index) => {
        const isDragging = !!drag && drag.task.id === task.id;
        // render placeholder if this is the hovered insertion point
        const showPlaceholder = hoverIndex === index && (!!drag && drag.task.id !== task.id);

        return (
          <div key={task.id} style={{ position: "relative" }}>
            {showPlaceholder && (
              <div style={{ height: CARD_HEIGHT, border: "2px dashed #bbb", marginBottom: 8, borderRadius: 6 }} />
            )}

            <div
              data-task-id={task.id}
              style={{
                visibility: isDragging ? "hidden" : "visible",
                marginBottom: 8,
              }}
              ref={(el) => {
                // keep a ref for the first element only; we don't need to store each ref
              }}
              // Pointer handling: create wrapper that passes element to handler
              onPointerDown={(e) => {
                const el = (e.currentTarget as HTMLElement);
                handlePointerDown(task, index, e as React.PointerEvent, el);
              }}
            >
              <TaskCard task={task} />
            </div>
          </div>
        );
      })}

      {/* If hovered at end (insertion at tasks.length) */}
      {hoverIndex === tasks.length && (
        <div style={{ height: CARD_HEIGHT, border: "2px dashed #bbb", marginBottom: 8, borderRadius: 6 }} />
      )}

      {/* Ghost overlay */}
      {drag && (
        <div
          style={{
            position: "fixed",
            left: drag.x,
            top: drag.y,
            width: drag.width,
            height: drag.height,
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translateZ(0)",
          }}
        >
          <div style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderRadius: 8 }}>
            <TaskCard task={drag.task} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
// ...existing code...