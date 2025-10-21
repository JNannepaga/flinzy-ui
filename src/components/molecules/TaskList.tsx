import { Box } from "@mui/material";
import TaskCard from "../atoms/TaskCard";
import type { Status, TaskItemDto } from "../../types/TaskItemDto";
import { useEffect, useRef, useState } from "react";
import type { DraggedTaskInfo, TaskContainerRefs } from "../templates/TasksPage";

interface TaskListProps {
  tasks: TaskItemDto[];
  status: Status; // "ToDo" | "InProgress" | "Done"
  //currentContainerRef: React.RefObject<HTMLDivElement | null>;
  containerRefs: TaskContainerRefs;
  newElementDragged?: DraggedTaskInfo | null;
  onDragEnd: (status: Status, updatedTasks: TaskItemDto[]) => void;
  onMoveToAnotherContainer: (from: Status, to: Status, task: TaskItemDto) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  status,
  containerRefs,
  newElementDragged,
  onDragEnd,
  onMoveToAnotherContainer,
}) => {
  const [orderedTasks, setOrderedTasks] = useState<TaskItemDto[]>(tasks);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const isBeingDragged = (taskId: string) => drag?.task.id === taskId;

  const taskDragStarted = (task: TaskItemDto, index: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
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

    const onMove = (ev: PointerEvent) => {
      setDrag((prev) => {
      if (!prev) return null;

      const newX = ev.clientX - prev.offsetX;
      const newY = ev.clientY - prev.offsetY;
      const centerX = newX + prev.width / 2;
      const centerY = newY + prev.height / 2;

      // Detect cross-container move
      for (const [otherStatus, otherRef] of Object.entries(containerRefs)) {
        const otherRect = otherRef.current?.getBoundingClientRect();
        if (!otherRect) continue;

        const inside =
          centerX >= otherRect.left &&
          centerX <= otherRect.right &&
          centerY >= otherRect.top &&
          centerY <= otherRect.bottom;

          console.log("Pointer at", centerX, centerY, "checking against", otherStatus, otherRect, "inside:", inside);
        if (inside && otherStatus !== status) {
          onMoveToAnotherContainer(status, otherStatus as Status, prev.task);
          setDrag(null);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onPointerUp);
          return null;
        }
      }

      // Intra-container reordering
      const container = containerRef.current;
      if (!container) return { ...prev, x: newX, y: newY };

      // Create an "others" list (all items except the dragged one)
      const others = orderedTasks.filter(t => t.id !== prev.task.id);

      // Determine target insertion index by comparing pointer Y to midpoint of visible children (skipping the dragged one)
      const children = Array.from(container.children) as HTMLElement[];
      let targetIndex = others.length;
      let seen = 0;
      for (let i = 0; i < children.length; i++) {
        // orderedTasks includes the dragged item, so use it to align children -> task mapping
        const mappedTask = orderedTasks[i];
        if (!mappedTask) continue;
        if (mappedTask.id === prev.task.id) continue; // skip dragged's original element
        
        const child = children[i];
        const rect = child.getBoundingClientRect();
        const midY1 = rect.top + 10;
        const midY2 = rect.bottom - 10;
        if (newY + prev.height < midY1 || newY + prev.height < midY2) {
          targetIndex = seen;
          break;
        }
        seen++;
      }

      // Build new ordered array where dragged item is removed then inserted at targetIndex
      const updated = [...others];
      updated.splice(targetIndex, 0, prev.task);
      setOrderedTasks(updated);

      return {
        ...prev,
        index: targetIndex,
        x: newX,
        y: newY,
      };
      });
    };

    const onPointerUp = () => {
      if (drag) {
        onDragEnd(status, orderedTasks);
      }
      setDrag(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
  setOrderedTasks(tasks);
}, [tasks]);

  useEffect(() => {
    if (newElementDragged && newElementDragged.fromStatus !== status) {
      const alreadyPresent = orderedTasks.some(t => t.id === newElementDragged.task.id);

      if (!alreadyPresent) {
        // 1. Insert the task at index 0
        const insertedTasks = [newElementDragged.task, ...orderedTasks];
        setOrderedTasks(insertedTasks);

        // 2. Trigger taskDragStarted after DOM update
        setTimeout(() => {
          const el = containerRef.current?.querySelector(`[data-task-id="${newElementDragged.task.id}"]`) as HTMLElement | null;
          if (el) {
            el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
          }
        }, 0);
      }
    }
  }, [newElementDragged, orderedTasks, status]);


  return (
    <div ref={containerRef}>
      {orderedTasks.map((task, index) => (
        <Box
          key={task.id}
          data-task-id={task.id}
          bgcolor={isBeingDragged(task.id) ? "#001F3D" : "transparent"}
          onDoubleClick={(e) => taskDragStarted(task, index, e)}
        >
          <TaskCard task={task} hide={isBeingDragged(task.id)} />
        </Box>
      ))}

      {drag && (
        <div
          style={{
            cursor: "grabbing",
            position: "fixed",
            top: drag.y,
            left: drag.x,
            opacity: 0.8,
            width: drag.width,
            height: drag.height,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <TaskCard task={drag.task} />
        </div>
      )}
    </div>
  );
};

export default TaskList;