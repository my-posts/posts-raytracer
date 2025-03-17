"use client";

import {
  InteractiveCanvasOptionItemDescriptor,
  InteractiveCanvasOptionItemDescriptorComponentProps,
} from "@my-posts/components-code/InteractiveCanvasOptionDescriptor";
import { FloatInput } from "@my-posts/components-widget/floatInput";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Sphere } from "./Sphere";

export function SpheresOptionComponent({
  value,
  setValue,
}: InteractiveCanvasOptionItemDescriptorComponentProps<Sphere[]>) {
  const [state, setState] = useState(value);

  useEffect(() => setState(value), [value]);
  const handleAdd = useCallback(
    () => setState((state) => [...state, { center: [0, 0, 0], radius: 1 }]),
    [],
  );
  const handleSubmit = useCallback(() => setValue(state), [setValue, state]);
  const handleCancel = useCallback(() => setState(value), [setState, value]);

  return (
    <div>
      {state.map((_, i) => (
        <Row key={i} i={i} state={state} setState={setState} />
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={handleAdd} style={{ flex: 1 }}>
          추가
        </button>
        <button type="button" onClick={handleSubmit} style={{ flex: 1 }}>
          확인
        </button>
        <button type="button" onClick={handleCancel} style={{ flex: 1 }}>
          취소
        </button>
      </div>
    </div>
  );
}

interface RowProps {
  i: number;
  state: Sphere[];
  setState: (set: SetStateAction<Sphere[]>) => void;
}

function Row({ i, state, setState }: RowProps) {
  const {
    center: [x, y, z],
    radius,
  } = state[i];

  const setX = useCallback(
    (x: number) =>
      setState((state) =>
        state.map((row, j) =>
          j === i
            ? { center: [x, row.center[1], row.center[2]], radius: row.radius }
            : row,
        ),
      ),
    [i],
  );
  const setY = useCallback(
    (y: number) =>
      setState((state) =>
        state.map((row, j) =>
          j === i
            ? { center: [row.center[0], y, row.center[2]], radius: row.radius }
            : row,
        ),
      ),
    [i],
  );
  const setZ = useCallback(
    (z: number) =>
      setState((state) =>
        state.map((row, j) =>
          j === i
            ? { center: [row.center[0], row.center[1], z], radius: row.radius }
            : row,
        ),
      ),
    [i],
  );
  const setRadius = useCallback(
    (radius: number) =>
      setState((state) =>
        state.map((row, j) =>
          j === i ? { center: row.center, radius: radius } : row,
        ),
      ),
    [i],
  );
  const handleClick = useCallback(
    () => setState((state) => state.filter((_, j) => j !== i)),
    [i],
  );

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <FloatInput
        value={x}
        setValue={setX}
        style={{ flex: 1, minWidth: 0 }}
        placeholder="x"
      />
      <FloatInput
        value={y}
        setValue={setY}
        style={{ flex: 1, minWidth: 0 }}
        placeholder="y"
      />
      <FloatInput
        value={z}
        setValue={setZ}
        style={{ flex: 1, minWidth: 0 }}
        placeholder="z"
      />
      <FloatInput
        value={radius}
        setValue={setRadius}
        style={{ flex: 1, minWidth: 0 }}
        placeholder="반지름"
      />
      <button onClick={handleClick}>제거</button>
    </div>
  );
}

export function spheresOption(
  displayName: string,
  defaultValue: Sphere[],
): InteractiveCanvasOptionItemDescriptor<Sphere[]> {
  return {
    defaultValue,
    displayName,
    component: SpheresOptionComponent,
  };
}
