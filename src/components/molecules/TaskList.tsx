import React, { useEffect, useRef, useState } from "react";
import TaskCard from "../atoms/TaskCard";
import type { TaskItemDto } from "../../types/TaskItemDto";
import { Box } from "@mui/material";

interface TaskListProps {
  tasks: TaskItemDto[];
  onDragEnd: (sortedTasks: TaskItemDto[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDragEnd }) => {
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

        // Use a single "reference point" that represents where the *center* of the dragged card
        // would be given the current pointer position and the initial click offset.
        // This normalizes clicks made at top/middle/bottom of the card and makes up & down shifts symmetric.
        //
        // pointerY = ev.clientY (the finger / mouse location)
        // prev.offsetY = where inside the card the pointer originally grabbed it (distance from card top)
        // prev.height  = card height (you said fixed 200)
        // referenceY = pointerY + (cardCenter - offsetY)
        //            = pointerY + (height/2 - offsetY)
        // compare referenceY against each sibling's midpoint to decide insertion index.
        const pointerY = ev.clientY;
        const referenceY = pointerY + (prev.height / 2 - prev.offsetY);

        // Build list of children, skipping the dragged element
        const children = Array.from(container.children) as HTMLElement[];
        let targetIndex = orderedTasks.filter(t => t.id !== prev.task.id).length;
        let seen = 0;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (!child) continue;
          if(child.dataset?.taskId === prev.task.id) continue;

          const rect = child.getBoundingClientRect();
          const childMid = rect.top + rect.height / 2;

          // use referenceY (not raw pointer or box top/bottom) so clicks at different offsets behave correctly
          if (referenceY < childMid) {
            targetIndex = seen;
            break;
          }
          seen++;
        }

        // Rebuild ordered list with dragged item removed then inserted at targetIndex
        const others = orderedTasks.filter(t => t.id !== prev.task.id);
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

    const onPointerUp = (ev: PointerEvent) => {
      onDragEnd(orderedTasks);
      setDrag(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onPointerUp);
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
        <Box
          component={"div"}
          key={task.id}
          bgcolor={isBeingDragged(task.id) ? "#001F3D" : "transparent"}
          onDoubleClick={(e) => taskDragStarted(task, index, e)}
        >
          <TaskCard key={task.id} task={task} hide={isBeingDragged(task.id)}/>
        </Box>
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