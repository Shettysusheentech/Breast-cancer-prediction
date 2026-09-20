import React from "react";

export default function ConfusionMatrix({ matrix }) {
  // matrix rows/cols are ordered [Benign(2), Malignant(4)]
  const labels = ["Benign", "Malignant"];
  const max = Math.max(...matrix.flat());

  return (
    <table className="border-collapse w-full text-sm">
      <thead>
        <tr>
          <th className="p-2"></th>
          <th colSpan={2} className="text-[11px] text-inkMuted text-center pb-1 uppercase tracking-wide">
            Predicted
          </th>
        </tr>
        <tr>
          <th className="p-2"></th>
          {labels.map((l) => (
            <th key={l} className="p-2 text-xs text-inkMuted font-medium border-b border-line">
              {l}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {i === 0 && (
              <th
                rowSpan={2}
                className="text-[11px] text-inkMuted uppercase tracking-wide pr-2 align-middle"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Actual
              </th>
            )}
            <th className="p-2 text-xs text-inkMuted font-medium text-right border-r border-line whitespace-nowrap">
              {labels[i]}
            </th>
            {row.map((val, j) => {
              const isDiagonal = i === j;
              const intensity = max === 0 ? 0 : val / max;
              return (
                <td key={j} className="p-2 text-center border border-line/60 w-20">
                  <div
                    className="lab-digits text-base py-2"
                    style={{
                      backgroundColor: isDiagonal
                        ? `rgba(22, 163, 74, ${0.1 + intensity * 0.5})`
                        : val > 0
                        ? `rgba(220, 38, 38, ${0.08 + intensity * 0.45})`
                        : "transparent",
                    }}
                  >
                    {val}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
