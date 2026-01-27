import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    EdgeProps,
} from 'reactflow';
import { X } from 'lucide-react';
import { useStore } from '@/lib/hooks/useStore';

export const EdgeWithDelete = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    ...props
}: EdgeProps) => {
    const type = props.type || 'default';
    const { onEdgesChange } = useStore();

    let edgePath = '';
    let labelX = 0;
    let labelY = 0;

    const pathParams = {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    };

    if (type === 'straight') {
        [edgePath, labelX, labelY] = getStraightPath(pathParams);
    } else if (type === 'step') {
        [edgePath, labelX, labelY] = getSmoothStepPath({ ...pathParams, borderRadius: 0 });
    } else if (type === 'smoothstep') {
        [edgePath, labelX, labelY] = getSmoothStepPath(pathParams);
    } else {
        // Default to bezier
        [edgePath, labelX, labelY] = getBezierPath(pathParams);
    }

    const [isHovered, setIsHovered] = React.useState(false);

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onEdgesChange([{ id, type: 'remove' }]);
    };

    return (
        <g
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group"
        >
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: isHovered ? (style.strokeWidth as number || 2) + 1 : style.strokeWidth,
                }}
            />
            {/* Invisible thicker path to make hovering easier */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                className="react-flow__edge-interaction"
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.2s',
                    }}
                    className="nodrag nopan"
                >
                    <button
                        className="w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center hover:bg-destructive hover:border-destructive hover:text-destructive-foreground transition-all shadow-lg scale-110"
                        onClick={onEdgeClick}
                        title="Delete connection"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </EdgeLabelRenderer>
        </g>
    );
};
