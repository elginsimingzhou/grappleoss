import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

import { getYouTubeThumb } from "../../helpers/graph_helpers";
import type { NodeConnection } from "../../types/index";

// ✅ adjust path to your zustand store
import { useGraphStore } from "../../stores/useGraphStore";

export type DetailNodeType =
  | "Position"
  | "Action"
  | "Reaction"
  | "Submission"
  | "None";

export type DetailNodeData = {
  label: string;
  type: DetailNodeType;
  description: string;
  content?: string; // Rich text content from TipTap editor
  connections?: NodeConnection[]; // Connections to other nodes
  youtubeUrl?: string;
  youtubeVideoId?: string;
};

export default function DetailNode({ data }: NodeProps<DetailNodeData>) {
  useGraphStore((s) => s.nodes);

  return (
    <div className="w-[360px] rounded-md border bg-white p-2 text-sm text-black">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {/* Title */}
      <div className="mb-2">
        {data.youtubeVideoId && (
          <div className="relative block w-full overflow-hidden border mb-2">
            <img
              src={getYouTubeThumb(data.youtubeVideoId)}
              alt="YouTube thumbnail"
              className="w-full h-32 object-cover"
              loading="lazy"
            />

            {/* Play overlay */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full bg-black/60 px-3 py-2 text-white text-xs">
                ▶
              </div>
            </div>
          </div>
        )}
        <h3 className="font-semibold">{data.label}</h3>
        <p>{data.description}</p>
        {/* <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commitLabel}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              commitLabel();
            }
          }}
          className="w-full border p-1"
          placeholder="Untitled"
        />  */}
      </div>
    </div>
  );
}
