import type { DieValue } from '../types';

interface DieProps {
  value: DieValue;
  isHeld: boolean;
  onClick: () => void;
}

export function Die({ value, isHeld, onClick }: DieProps) {
  const dots: Record<DieValue, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  };

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        isHeld
          ? 'bg-white border-gray-400 shadow-lg'
          : 'bg-white border-gray-300 shadow-md hover:border-gray-400'
      }`}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2 h-full">
        {Array.from({ length: 9 }).map((_, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const hasDot = dots[value].some(([r, c]) => r === row && c === col);
          return (
            <div
              key={idx}
              className={`rounded-full ${
                hasDot ? 'bg-gray-800' : 'bg-transparent'
              }`}
            />
          );
        })}
      </div>
    </button>
  );
}
