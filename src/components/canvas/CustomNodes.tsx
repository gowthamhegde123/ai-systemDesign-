import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
    Database, Server, Globe, Layers, HardDrive, Cpu,
    ArrowRightLeft, Zap, Search, Share2, MessageSquare,
    Shield, ShieldCheck, Lock, Box, Activity, Terminal,
    BarChart3, Layout, Smartphone, Radio, Key, Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const NodeIcon = ({ type }: { type: string }) => {
    const iconClass = "w-6 h-6";
    switch (type) {
        case 'WEB_SERVER': return <Server className={clsx(iconClass, "text-blue-400")} />;
        case 'MICROSERVICE': return <Cpu className={clsx(iconClass, "text-orange-500")} />;
        case 'LAMBDA': return <Zap className={clsx(iconClass, "text-yellow-400")} />;
        case 'CONTAINER': return <Box className={clsx(iconClass, "text-blue-500")} />;
        case 'K8S': return <Layers className={clsx(iconClass, "text-blue-600")} />;
        case 'LB': return <ArrowRightLeft className={clsx(iconClass, "text-gray-400")} />;
        case 'API_GATEWAY': return <Layers className={clsx(iconClass, "text-indigo-400")} />;
        case 'CDN': return <Globe className={clsx(iconClass, "text-cyan-400")} />;
        case 'DNS': return <Search className={clsx(iconClass, "text-blue-300")} />;
        case 'SERVICE_MESH': return <Share2 className={clsx(iconClass, "text-pink-500")} />;
        case 'SQL_DB': return <Database className={clsx(iconClass, "text-blue-600")} />;
        case 'NOSQL_DB': return <Database className={clsx(iconClass, "text-green-500")} />;
        case 'S3': return <HardDrive className={clsx(iconClass, "text-orange-400")} />;
        case 'BLOB': return <HardDrive className={clsx(iconClass, "text-orange-300")} />;
        case 'GRAPH_DB': return <Share2 className={clsx(iconClass, "text-emerald-500")} />;
        case 'SEARCH_ENGINE': return <Search className={clsx(iconClass, "text-yellow-600")} />;
        case 'REDIS': return <Zap className={clsx(iconClass, "text-red-500")} />;
        case 'KAFKA': return <Share2 className={clsx(iconClass, "text-purple-500")} />;
        case 'PUB_SUB': return <MessageSquare className={clsx(iconClass, "text-pink-400")} />;
        case 'ETL_PIPELINE': return <Activity className={clsx(iconClass, "text-orange-600")} />;
        case 'STREAM_PROCESSOR': return <Terminal className={clsx(iconClass, "text-green-600")} />;
        case 'FIREWALL': return <Shield className={clsx(iconClass, "text-red-600")} />;
        case 'WAF': return <ShieldCheck className={clsx(iconClass, "text-green-600")} />;
        case 'AUTH': return <Lock className={clsx(iconClass, "text-yellow-600")} />;
        case 'KMS': return <Key className={clsx(iconClass, "text-amber-500")} />;
        case 'SIEM': return <Eye className={clsx(iconClass, "text-slate-400")} />;
        case 'MONITORING': return <Activity className={clsx(iconClass, "text-lime-500")} />;
        case 'LOGGING': return <Terminal className={clsx(iconClass, "text-slate-300")} />;
        case 'ANALYTICS': return <BarChart3 className={clsx(iconClass, "text-violet-500")} />;
        case 'DASHBOARD': return <Layout className={clsx(iconClass, "text-sky-500")} />;
        case 'CLIENT': return <Globe className={clsx(iconClass, "text-blue-400")} />;
        case 'MOBILE_APP': return <Smartphone className={clsx(iconClass, "text-slate-400")} />;
        case 'IOT_DEVICE': return <Radio className={clsx(iconClass, "text-orange-400")} />;
        default: return <Server className={iconClass} />;
    }
};

const BaseNode = ({ data, selected }: NodeProps) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "px-4 py-3 shadow-xl rounded-xl bg-card border-2 min-w-[180px] relative group",
                "cursor-pointer active:scale-95 transition-all duration-200 ease-out",
                selected
                    ? "border-primary ring-[6px] ring-primary/20 shadow-2xl scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:shadow-2xl"
            )}
        >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl overflow-hidden" />

            {/* Handle Positions */}
            <div className="absolute inset-0 pointer-events-none">
                <Handle
                    type="target"
                    position={Position.Top}
                    id="t"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                />
                <Handle
                    type="source"
                    position={Position.Top}
                    id="ts"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                    style={{ left: '50%' }}
                />

                <Handle
                    type="target"
                    position={Position.Bottom}
                    id="b"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="bs"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                    style={{ left: '50%' }}
                />

                <Handle
                    type="target"
                    position={Position.Left}
                    id="l"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="ls"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                    style={{ top: '50%' }}
                />

                <Handle
                    type="target"
                    position={Position.Right}
                    id="r"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="rs"
                    className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background !opacity-0 group-hover:!opacity-100 transition-opacity !pointer-events-auto hover:!scale-150"
                    style={{ top: '50%' }}
                />
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors shadow-inner">
                    <NodeIcon type={data.type || 'DEFAULT'} />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm font-bold text-card-foreground tracking-tight">{data.label}</div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-70">
                        {data.type?.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Selection Indicator */}
            {selected && (
                <motion.div
                    layoutId="selection"
                    className="absolute -inset-0.5 border-2 border-primary rounded-xl z-0"
                    initial={false}
                />
            )}
        </motion.div>
    );
};

export const CustomNode = memo(BaseNode);
