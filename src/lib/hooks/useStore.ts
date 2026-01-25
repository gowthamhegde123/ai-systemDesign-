import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType
} from 'reactflow';
import { Problem } from '@/types';

export type Theme = 'light' | 'dark';
export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier';

interface DrawingSettings {
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
    opacity: number;
}

interface AppState {
    nodes: Node[];
    edges: Edge[];
    selectedNodes: string[];
    currentProblem: Problem | null;
    isPassed: boolean;
    isSubmitted: boolean;
    theme: Theme;
    edgeType: EdgeType;
    drawingSettings: DrawingSettings;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    deleteNode: (nodeId: string) => void;
    deleteSelectedNodes: () => void;
    setSelectedNodes: (nodeIds: string[]) => void;
    setProblem: (problem: Problem) => void;
    setPassed: (passed: boolean) => void;
    setSubmitted: (submitted: boolean) => void;
    toggleTheme: () => void;
    setEdgeType: (type: EdgeType) => void;
    updateDrawingSettings: (settings: Partial<DrawingSettings>) => void;
    clearCanvas: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            nodes: [],
            edges: [],
            selectedNodes: [],
            currentProblem: null,
            isPassed: false,
            isSubmitted: false,
            theme: 'dark',
            edgeType: 'smoothstep',
            drawingSettings: {
                strokeWidth: 2,
                strokeColor: '#3b82f6',
                fillColor: '#3b82f6',
                opacity: 1,
            },

            onNodesChange: (changes: NodeChange[]) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                });
            },
            onEdgesChange: (changes: EdgeChange[]) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                });
            },
            onConnect: (connection: Connection) => {
                const edge = {
                    ...connection,
                    type: get().edgeType,
                    animated: true,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: get().theme === 'dark' ? '#3b82f6' : '#2563eb',
                    },
                    style: {
                        strokeWidth: get().drawingSettings.strokeWidth,
                        stroke: get().drawingSettings.strokeColor,
                    },
                };
                set({
                    edges: addEdge(edge, get().edges),
                });
            },
            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),
            addNode: (node) => set({ nodes: [...get().nodes, node] }),
            deleteNode: (nodeId) => {
                set({
                    nodes: get().nodes.filter(n => n.id !== nodeId),
                    edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
                    selectedNodes: get().selectedNodes.filter(id => id !== nodeId),
                });
            },
            deleteSelectedNodes: () => {
                const selectedIds = get().selectedNodes;
                set({
                    nodes: get().nodes.filter(n => !selectedIds.includes(n.id)),
                    edges: get().edges.filter(e => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)),
                    selectedNodes: [],
                });
            },
            setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
            setProblem: (problem) => set({
                currentProblem: problem,
                isPassed: false,
                isSubmitted: false,
                nodes: [],
                edges: [],
                selectedNodes: [],
            }),
            setPassed: (passed) => set({ isPassed: passed }),
            setSubmitted: (submitted) => set({ isSubmitted: submitted }),
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });

                // Update document class for global CSS variables
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }

                // Update existing edges color
                const newStrokeColor = newTheme === 'dark' ? '#3b82f6' : '#2563eb';
                set({
                    edges: get().edges.map(e => ({
                        ...e,
                        markerEnd: typeof e.markerEnd === 'object' ? {
                            ...e.markerEnd,
                            color: newStrokeColor,
                        } : {
                            type: MarkerType.ArrowClosed,
                            color: newStrokeColor,
                        },
                        style: {
                            ...(e.style || {}),
                            stroke: newStrokeColor,
                        }
                    })),
                    drawingSettings: {
                        ...get().drawingSettings,
                        strokeColor: newStrokeColor,
                        fillColor: newStrokeColor,
                    }
                });
            },
            setEdgeType: (type) => set({ edgeType: type }),
            updateDrawingSettings: (settings) => set({
                drawingSettings: { ...get().drawingSettings, ...settings }
            }),
            clearCanvas: () => set({ nodes: [], edges: [], selectedNodes: [] }),
        }),
        {
            name: 'canvas-store',
            partialize: (state) => ({ theme: state.theme, drawingSettings: state.drawingSettings }),
        }
    )
);
