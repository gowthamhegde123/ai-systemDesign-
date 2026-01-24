'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    Node,
    Edge,
    Connection,
    addEdge,
    ReactFlowInstance,
    Panel,
    MiniMap,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore, EdgeType } from '@/lib/hooks/useStore';
import { CustomNode } from './CustomNodes';
import { Toolbar } from './Toolbar';
import { NodeType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
    Sun, Moon, Trash2, Maximize,
    MousePointer2, Share2, Layers,
    ArrowUpRight, Zap
} from 'lucide-react';
import { clsx } from 'clsx';

const nodeTypes = {
    custom: CustomNode,
};

const DesignCanvasContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        theme,
        toggleTheme,
        edgeType,
        setEdgeType,
        clearCanvas
    } = useStore();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current || !reactFlowInstance) {
                return;
            }

            const type = event.dataTransfer.getData('application/reactflow') as NodeType;
            const label = event.dataTransfer.getData('application/reactflow-label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
                y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
            });

            const newNode: Node = {
                id: uuidv4(),
                type: 'custom',
                position,
                data: { label, type },
            };

            addNode(newNode);
        },
        [reactFlowInstance, addNode]
    );

    return (
        <div className={clsx("flex h-full w-full transition-colors duration-500", theme === 'dark' ? 'dark' : '')}>
            <Toolbar />
            <div className="flex-grow h-full relative bg-background" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    className="bg-background"
                    defaultEdgeOptions={{
                        type: edgeType,
                        animated: true,
                    }}
                >
                    <Background
                        color={theme === 'dark' ? '#333' : '#ddd'}
                        gap={20}
                        size={1}
                        variant={BackgroundVariant.Dots}
                    />
                    <Controls className="!bg-card !border-border !shadow-xl rounded-lg overflow-hidden" />
                    <MiniMap
                        className="!bg-card !border-border !shadow-xl rounded-lg overflow-hidden"
                        maskColor={theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
                        nodeColor={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                    />

                    {/* Top Control Panel */}
                    <Panel position="top-center" className="flex gap-2 p-1 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
                        <div className="flex items-center gap-1 px-2 border-r border-border mr-1">
                            <MousePointer2 className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tools</span>
                        </div>

                        {[
                            { id: 'smoothstep', icon: <Share2 className="w-4 h-4" />, label: 'Smooth' },
                            { id: 'step', icon: <Layers className="w-4 h-4" />, label: 'Step' },
                            { id: 'straight', icon: <ArrowUpRight className="w-4 h-4" />, label: 'Straight' },
                        ].map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setEdgeType(tool.id as EdgeType)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-xs font-medium",
                                    edgeType === tool.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                {tool.icon}
                                <span>{tool.label}</span>
                            </button>
                        ))}

                        <div className="w-px h-6 bg-border mx-1" />

                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={clearCanvas}
                            className="p-2 hover:bg-destructive/10 rounded-xl transition-colors text-muted-foreground hover:text-destructive"
                            title="Clear Canvas"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Panel>

                    {/* Stats Panel */}
                    <Panel position="bottom-left" className="bg-card/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-border mb-4 ml-4">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Components</span>
                                <span className="text-lg font-bold text-foreground">{nodes.length}</span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Connections</span>
                                <span className="text-lg font-bold text-foreground">{edges.length}</span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-lg">
                                <Zap className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Sync</span>
                            </div>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
};

export const DesignCanvas = () => {
    return (
        <ReactFlowProvider>
            <DesignCanvasContent />
        </ReactFlowProvider>
    );
};
