'use client';

import React, { useState, useCallback, useRef } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Server, 
  Cloud, 
  Shield, 
  Zap, 
  Globe, 
  MessageSquare, 
  BarChart3,
  Trash2,
  Play,
  RotateCcw,
  Save
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// System component types
interface SystemComponent {
  id: string;
  type: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  position: { x: number; y: number };
  connections: string[];
}

// Available component types
const COMPONENT_TYPES = [
  { type: 'api-gateway', name: 'API Gateway', icon: Globe, color: 'bg-blue-500' },
  { type: 'load-balancer', name: 'Load Balancer', icon: BarChart3, color: 'bg-green-500' },
  { type: 'web-server', name: 'Web Server', icon: Server, color: 'bg-purple-500' },
  { type: 'database', name: 'Database', icon: Database, color: 'bg-orange-500' },
  { type: 'cache', name: 'Cache', icon: Zap, color: 'bg-yellow-500' },
  { type: 'message-queue', name: 'Message Queue', icon: MessageSquare, color: 'bg-pink-500' },
  { type: 'cdn', name: 'CDN', icon: Cloud, color: 'bg-indigo-500' },
  { type: 'security', name: 'Security Layer', icon: Shield, color: 'bg-red-500' },
];

// Draggable component from palette
function PaletteComponent({ type, name, icon: Icon, color }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, name, icon: Icon, color }
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        ${color} text-white p-3 rounded-lg cursor-grab active:cursor-grabbing
        flex flex-col items-center gap-2 min-h-[80px] justify-center
        hover:scale-105 transition-transform shadow-lg
        ${isDragging ? 'opacity-50' : ''}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={24} />
      <span className="text-xs font-medium text-center">{name}</span>
    </motion.div>
  );
}

// Canvas component instance
function CanvasComponent({ component, onSelect, isSelected, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: component
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = component.icon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        absolute ${component.color} text-white p-4 rounded-lg cursor-grab active:cursor-grabbing
        flex flex-col items-center gap-2 min-w-[100px] shadow-lg
        ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
        ${isDragging ? 'opacity-50 z-50' : 'z-10'}
      `}
      onClick={() => onSelect(component.id)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      layout
    >
      <Icon size={32} />
      <span className="text-sm font-medium text-center">{component.name}</span>
      
      {isSelected && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={12} />
        </motion.button>
      )}
    </motion.div>
  );
}

// Main Design Canvas Component
export default function DesignCanvas() {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connections, setConnections] = useState<Array<{from: string, to: string}>>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { setNodeRef: setCanvasRef } = useDroppable({
    id: 'design-canvas'
  });

  // Handle drag end - add component to canvas
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    if (over?.id === 'design-canvas' && active.data.current) {
      const componentData = active.data.current;
      
      // If dragging from palette, create new component
      if (active.id.toString().startsWith('palette-')) {
        const newComponent: SystemComponent = {
          id: `${componentData.type}-${Date.now()}`,
          type: componentData.type,
          name: componentData.name,
          icon: componentData.icon,
          color: componentData.color,
          position: { x: delta.x + 200, y: delta.y + 100 },
          connections: []
        };
        
        setComponents(prev => [...prev, newComponent]);
      }
    }
  }, []);

  // Handle component selection
  const handleSelectComponent = useCallback((id: string) => {
    setSelectedComponent(prev => prev === id ? null : id);
  }, []);

  // Handle component deletion
  const handleDeleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id));
    setSelectedComponent(null);
  }, []);

  // Clear all components
  const handleClearCanvas = useCallback(() => {
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
  }, []);

  // Submit design for validation
  const handleSubmitDesign = useCallback(async () => {
    const design = {
      components: components.map(comp => ({
        id: comp.id,
        type: comp.type,
        position: comp.position
      })),
      connections
    };

    try {
      // This would call the ML validation service
      console.log('Submitting design for validation:', design);
      // const response = await fetch('/api/validate-design', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(design)
      // });
      alert('Design submitted for validation! (ML service integration pending)');
    } catch (error) {
      console.error('Validation error:', error);
    }
  }, [components, connections]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Component Palette Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">System Components</h2>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {COMPONENT_TYPES.map((componentType) => (
            <PaletteComponent key={componentType.type} {...componentType} />
          ))}
        </div>
        
        {/* Canvas Controls */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleClearCanvas}
            className="w-full flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <RotateCcw size={16} />
            Clear Canvas
          </button>
          
          <button
            onClick={handleSubmitDesign}
            disabled={components.length === 0}
            className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} />
            Validate Design
          </button>
          
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <Save size={16} />
            Save Design
          </button>
        </div>

        {/* Component Count */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Components: <span className="font-semibold text-foreground">{components.length}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Connections: <span className="font-semibold text-foreground">{connections.length}</span>
          </p>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          <div
            ref={(node) => {
              setCanvasRef(node);
              canvasRef.current = node;
            }}
            className="w-full h-full relative bg-background"
            style={{
              backgroundImage: `
                radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
            onClick={() => setSelectedComponent(null)}
          >
            {/* Canvas Header */}
            <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg p-3 z-20 border border-border">
              <h1 className="text-xl font-bold text-foreground">System Design Canvas</h1>
              <p className="text-sm text-muted-foreground">Drag components from the sidebar to build your architecture</p>
            </div>

            {/* Canvas Components */}
            <AnimatePresence>
              {components.map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  onSelect={handleSelectComponent}
                  isSelected={selectedComponent === component.id}
                  onDelete={handleDeleteComponent}
                />
              ))}
            </AnimatePresence>

            {/* Connection Lines (SVG Overlay) */}
            <svg className="absolute inset-0 pointer-events-none z-5">
              {connections.map((connection, index) => {
                const fromComponent = components.find(c => c.id === connection.from);
                const toComponent = components.find(c => c.id === connection.to);
                
                if (!fromComponent || !toComponent) return null;
                
                return (
                  <line
                    key={index}
                    x1={fromComponent.position.x + 50}
                    y1={fromComponent.position.y + 50}
                    x2={toComponent.position.x + 50}
                    y2={toComponent.position.y + 50}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>

            {/* Empty State */}
            {components.length === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center text-muted-foreground">
                  <Cloud size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Start Building Your System</h3>
                  <p className="text-sm">Drag components from the sidebar to begin designing your architecture</p>
                </div>
              </motion.div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}