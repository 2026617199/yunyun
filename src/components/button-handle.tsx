import { useCallback, useEffect, useRef, useState } from "react";
import { Position, type HandleProps } from "@xyflow/react";
import { BaseHandle } from "@/components/base-handle";

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]:
    "flex-col-reverse left-1/2 -translate-y-full -translate-x-1/2",
  [Position.Bottom]: "flex-col left-1/2 translate-y-[10px] -translate-x-1/2",
  [Position.Left]:
    "flex-row-reverse top-1/2 -translate-x-full -translate-y-1/2",
  [Position.Right]: "top-1/2 -translate-y-1/2 translate-x-[10px]",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function ButtonHandle({
  showButton = true,
  position = Position.Bottom,
  followAreaSize = 96,
  buttonSize = 28,
  children,
  ...props
}: HandleProps & {
  showButton?: boolean;
  followAreaSize?: number;
  buttonSize?: number;
}) {
  const wrapperClassName = wrapperClassNames[position || Position.Bottom];
  const vertical = position === Position.Top || position === Position.Bottom;
  const followAreaRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState(() => ({
    x: (followAreaSize - buttonSize) / 2,
    y: (followAreaSize - buttonSize) / 2,
  }));

  // 当跟随区域尺寸变化时，重置到区域中心，避免按钮漂移到无效位置。
  useEffect(() => {
    setCursorPosition({
      x: (followAreaSize - buttonSize) / 2,
      y: (followAreaSize - buttonSize) / 2,
    });
  }, [buttonSize, followAreaSize]);

  // 使用 rAF 合并高频 pointer move 更新，降低渲染抖动。
  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const area = followAreaRef.current;
      if (!area) {
        return;
      }

      const rect = area.getBoundingClientRect();
      const maxX = Math.max(rect.width - buttonSize, 0);
      const maxY = Math.max(rect.height - buttonSize, 0);

      const nextX = clamp(clientX - rect.left - buttonSize / 2, 0, maxX);
      const nextY = clamp(clientY - rect.top - buttonSize / 2, 0, maxY);

      setCursorPosition((prev) => {
        if (prev.x === nextX && prev.y === nextY) {
          return prev;
        }
        return { x: nextX, y: nextY };
      });
    },
    [buttonSize],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        updatePosition(event.clientX, event.clientY);
      });
    },
    [updatePosition],
  );

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    },
    [],
  );

  return (
    <BaseHandle position={position} id={props.id} {...props}>
      {showButton && (
        <div
          className={`absolute flex items-center ${wrapperClassName} pointer-events-none`}
        >
          <div
            className={`bg-gray-300 ${vertical ? "h-10 w-px" : "h-px w-10"}`}
          />
          <div
            ref={followAreaRef}
            className="relative nodrag nopan pointer-events-auto"
            style={{
              width: followAreaSize,
              height: followAreaSize,
            }}
            onPointerMove={handlePointerMove}
          >
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: buttonSize,
                height: buttonSize,
                transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`,
                willChange: "transform",
              }}
            >
              <div className="nodrag nopan pointer-events-auto">
                {children ?? (
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-600 shadow-sm">
                    +
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseHandle>
  );
}
