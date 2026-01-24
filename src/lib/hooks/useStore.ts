import { create } from 'zustand';
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

interface AppState {
    nodes: Node[];
    edges: Edge[];
    currentProblem: Problem | null;
    isPassed: boolean;
    isSubmitted: boolean;
    theme: Theme;
    edgeType: EdgeType;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: Node) => void;
    setProblem: (problem: Problem) => void;
    setPassed: (passed: boolean) => void;
    setSubmitted: (submitted: boolean) => void;
    toggleTheme: () => void;
    setEdgeType: (type: EdgeType) => void;
    clearCanvas: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    nodes: [],
    edges: [],
    currentProblem: null,
    isPassed: false,
    isSubmitted: false,
    theme: 'dark',
    edgeType: 'smoothstep',

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
                strokeWidth: 2,
                stroke: get().theme === 'dark' ? '#3b82f6' : '#2563eb',
            },
        };
        set({
            edges: addEdge(edge, get().edges),
        });
    },
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    addNode: (node) => set({ nodes: [...get().nodes, node] }),
    setProblem: (problem) => set({
        currentProblem: problem,
        isPassed: false,
        isSubmitted: false,
        nodes: [],
        edges: []
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
        set({
            edges: get().edges.map(e => ({
                ...e,
                markerEnd: typeof e.markerEnd === 'object' ? {
                    ...e.markerEnd,
                    color: newTheme === 'dark' ? '#3b82f6' : '#2563eb',
                } : {
                    type: MarkerType.ArrowClosed,
                    color: newTheme === 'dark' ? '#3b82f6' : '#2563eb',
                },
                style: {
                    ...(e.style || {}),
                    stroke: newTheme === 'dark' ? '#3b82f6' : '#2563eb',
                }
            }))
        });
    },
    setEdgeType: (type) => set({ edgeType: type }),
    clearCanvas: () => set({ nodes: [], edges: [] }),
}));
