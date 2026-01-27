import React, { useState } from 'react';
import { NodeType } from '@/types';
import {
    Database, Server, Layers, HardDrive, Cpu,
    ArrowRightLeft, Globe, Zap, Search, Share2,
    MessageSquare, Shield, ShieldCheck, Lock,
    Box, Activity, Terminal, BarChart3, Layout,
    Smartphone, Radio, Key, Eye, ChevronDown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tool {
    type: NodeType;
    label: string;
    icon: React.ReactNode;
}

interface Category {
    name: string;
    tools: Tool[];
}

const CATEGORIES: Category[] = [
    {
        name: 'Compute',
        tools: [
            { type: 'WEB_SERVER', label: 'Web Server', icon: <Server className="w-4 h-4 text-blue-400" /> },
            { type: 'MICROSERVICE', label: 'Microservice', icon: <Cpu className="w-4 h-4 text-orange-500" /> },
            { type: 'LAMBDA', label: 'Lambda/FaaS', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
            { type: 'CONTAINER', label: 'Container', icon: <Box className="w-4 h-4 text-blue-500" /> },
            { type: 'K8S', label: 'Kubernetes', icon: <Layers className="w-4 h-4 text-blue-600" /> },
        ]
    },
    {
        name: 'Networking',
        tools: [
            { type: 'LB', label: 'Load Balancer', icon: <ArrowRightLeft className="w-4 h-4 text-gray-400" /> },
            { type: 'API_GATEWAY', label: 'API Gateway', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
            { type: 'CDN', label: 'CDN', icon: <Globe className="w-4 h-4 text-cyan-400" /> },
            { type: 'DNS', label: 'DNS', icon: <Search className="w-4 h-4 text-blue-300" /> },
            { type: 'SERVICE_MESH', label: 'Service Mesh', icon: <Share2 className="w-4 h-4 text-pink-500" /> },
        ]
    },
    {
        name: 'Storage',
        tools: [
            { type: 'SQL_DB', label: 'SQL DB', icon: <Database className="w-4 h-4 text-blue-600" /> },
            { type: 'NOSQL_DB', label: 'NoSQL DB', icon: <Database className="w-4 h-4 text-green-500" /> },
            { type: 'S3', label: 'Object Storage', icon: <HardDrive className="w-4 h-4 text-orange-400" /> },
            { type: 'BLOB', label: 'Blob Storage', icon: <HardDrive className="w-4 h-4 text-orange-300" /> },
            { type: 'GRAPH_DB', label: 'Graph DB', icon: <Share2 className="w-4 h-4 text-emerald-500" /> },
            { type: 'SEARCH_ENGINE', label: 'Search Engine', icon: <Search className="w-4 h-4 text-yellow-600" /> },
        ]
    },
    {
        name: 'Messaging & Streaming',
        tools: [
            { type: 'REDIS', label: 'Redis/Cache', icon: <Zap className="w-4 h-4 text-red-500" /> },
            { type: 'KAFKA', label: 'Message Queue', icon: <Share2 className="w-4 h-4 text-purple-500" /> },
            { type: 'PUB_SUB', label: 'Pub/Sub', icon: <MessageSquare className="w-4 h-4 text-pink-400" /> },
            { type: 'ETL_PIPELINE', label: 'ETL Pipeline', icon: <Activity className="w-4 h-4 text-orange-600" /> },
            { type: 'STREAM_PROCESSOR', label: 'Stream Proc', icon: <Terminal className="w-4 h-4 text-green-600" /> },
        ]
    },
    {
        name: 'Security',
        tools: [
            { type: 'FIREWALL', label: 'Firewall', icon: <Shield className="w-4 h-4 text-red-600" /> },
            { type: 'WAF', label: 'WAF', icon: <ShieldCheck className="w-4 h-4 text-green-600" /> },
            { type: 'AUTH', label: 'Auth Service', icon: <Lock className="w-4 h-4 text-yellow-600" /> },
            { type: 'KMS', label: 'KMS', icon: <Key className="w-4 h-4 text-amber-500" /> },
            { type: 'SIEM', label: 'SIEM', icon: <Eye className="w-4 h-4 text-slate-400" /> },
        ]
    },
    {
        name: 'Observability',
        tools: [
            { type: 'MONITORING', label: 'Monitoring', icon: <Activity className="w-4 h-4 text-lime-500" /> },
            { type: 'LOGGING', label: 'Logging', icon: <Terminal className="w-4 h-4 text-slate-300" /> },
            { type: 'ANALYTICS', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-violet-500" /> },
            { type: 'DASHBOARD', label: 'Dashboard', icon: <Layout className="w-4 h-4 text-sky-500" /> },
        ]
    },
    {
        name: 'Clients',
        tools: [
            { type: 'CLIENT', label: 'Web Client', icon: <Globe className="w-4 h-4 text-blue-400" /> },
            { type: 'MOBILE_APP', label: 'Mobile App', icon: <Smartphone className="w-4 h-4 text-slate-400" /> },
            { type: 'IOT_DEVICE', label: 'IoT Device', icon: <Radio className="w-4 h-4 text-orange-400" /> },
        ]
    }
];

export const Toolbar = () => {
    const [expanded, setExpanded] = useState<string[]>(CATEGORIES.map(c => c.name));

    const toggleCategory = (name: string) => {
        setExpanded(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const onDragStart = (event: React.DragEvent, nodeType: NodeType, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow-label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-72 bg-card border-r border-border flex flex-col h-full overflow-hidden shadow-2xl z-20">
            <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="font-bold text-xl text-foreground tracking-tight">Asset Toolbox</h2>
                <p className="text-xs text-muted-foreground mt-1">Drag components to architect</p>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {CATEGORIES.map((category) => (
                    <div key={category.name} className="space-y-1">
                        <button
                            onClick={() => toggleCategory(category.name)}
                            className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <span>{category.name}</span>
                            {expanded.includes(category.name) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>

                        <AnimatePresence initial={false}>
                            {expanded.includes(category.name) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 gap-1.5 py-1">
                                        {category.tools.map((tool) => (
                                            <div
                                                key={tool.type}
                                                draggable
                                                onDragStart={(event) => onDragStart(event, tool.type, tool.label)}
                                                className="cursor-grab"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-center gap-3 p-2.5 bg-muted/20 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20 group"
                                                >
                                                    <div className="p-2 bg-card rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                                        {tool.icon}
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                                                        {tool.label}
                                                    </span>
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </aside>
    );
};
