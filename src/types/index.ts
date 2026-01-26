import { Node, Edge } from 'reactflow';

export type NodeType =
  | 'WEB_SERVER' | 'MICROSERVICE' | 'LAMBDA' | 'CONTAINER' | 'K8S'
  | 'LB' | 'API_GATEWAY' | 'CDN' | 'DNS' | 'SERVICE_MESH'
  | 'SQL_DB' | 'NOSQL_DB' | 'S3' | 'BLOB' | 'GRAPH_DB' | 'SEARCH_ENGINE'
  | 'REDIS' | 'KAFKA' | 'PUB_SUB' | 'ETL_PIPELINE' | 'STREAM_PROCESSOR'
  | 'FIREWALL' | 'WAF' | 'AUTH' | 'KMS' | 'SIEM'
  | 'MONITORING' | 'LOGGING' | 'ANALYTICS' | 'DASHBOARD'
  | 'CLIENT' | 'MOBILE_APP' | 'IOT_DEVICE';

export interface SystemNodeData {
  label: string;
  type: NodeType;
  category?: string;
  description?: string;
}

export type SystemNode = Node<SystemNodeData>;
export type SystemEdge = Edge;

export interface DesignState {
  nodes: SystemNode[];
  edges: SystemEdge[];
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints: string[];
  requirements: string[];
  category?: string;
}

export interface AIAnalysisResult {
  status: 'Pass' | 'Fail';
  rating?: 'Excellent' | 'Improving' | 'Incomplete';
  feedback: string;
  score: number;
  suggestions?: string[];
}
