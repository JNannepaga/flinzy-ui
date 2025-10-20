import React, { useEffect, useRef, useState } from "react";
import TaskCard from "../atoms/TaskCard";
import type { TaskItemDto } from "../../types/TaskItemDto";

interface TaskListProps {
  tasks: TaskItemDto[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
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
  
  const isBeingDragged = (taskId: string) => {
    return drag?.task.id === taskId;
  }

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
        if (!prev) return prev;

        const newX = ev.clientX - prev.offsetX;
        const newY = ev.clientY - prev.offsetY;

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
          const midY = rect.top + rect.height / 2;
          if (newY < midY) {
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
    
    window.addEventListener("pointermove", onMove);
  }

  useEffect(() => {
    ()=>{
      return window.removeEventListener("pointermove", ()=>{});
    }
  },[]);

  if (!tasks || tasks.length === 0) return <p>No tasks available</p>;

  return (
    <div ref={containerRef}>
      {orderedTasks.map((task, index) => (
        <div
          key={task.id} 
          style={{
            visibility: isBeingDragged(task.id) ? "hidden" : "visible",
          }}
          onDoubleClick={(e) => taskDragStarted(task, index, e)}>
          <TaskCard key={task.id} task={task} />
        </div>
      ))}
      {
        drag && (
          <div
            key={drag.task?.id} 
            style={{
              cursor: "grabbing",
              position: "fixed",
              top: drag.y,
              left: drag.x,
              opacity: 0.8,
              width: drag.width,
              height: drag.height,
              //pointerEvents: "none",
              zIndex: 1000,
            }}>
            <TaskCard key={0} task={drag?.task} />
          </div>
        )
      }
    </div>
  );
};

export default TaskList;