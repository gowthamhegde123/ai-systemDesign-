import { DesignState, Problem } from '@/types';

export const generateSystemPrompt = () => {
  return `You are a Senior System Architect and Interviewer at a top-tier tech company.
Your task is to evaluate a candidate's system design diagram (provided as JSON metadata).

Evaluation Criteria:
1. Scalability: Can the system handle the specified RPS/DAU?
2. Availability: Are there single points of failure (SPOF)?
3. Performance: Is latency optimized (caching, CDN, etc.)?
4. Correctness: Do the components and data flows make sense for the problem?

Hidden Test Cases to check:
- If high read volume: Is there a Cache (Redis/Memcached)?
- If high write volume: Is there a Message Queue (Kafka/RabbitMQ) for async processing?
- If global users: Is there a CDN and DNS?
- If microservices: Is there an API Gateway?
- If relational data: Is a SQL DB used?

You MUST be strict. If a critical component for the specific constraints is missing, the status must be 'Fail'.`;
};

export const generateUserPrompt = (problem: Problem, design: DesignState) => {
  const nodesList = design.nodes.map(n => `- ${n.data.label} (Type: ${n.data.type}, ID: ${n.id})`).join('\n');
  const edgesList = design.edges.map(e => `- ${e.source} -> ${e.target} ${e.label ? `(${e.label})` : ''}`).join('\n');

  return `
PROBLEM TO SOLVE:
Title: ${problem.title}
Description: ${problem.description}
Requirements:
${problem.requirements.map(r => `- ${r}`).join('\n')}
Constraints:
${problem.constraints.map(c => `- ${c}`).join('\n')}

CANDIDATE'S DESIGN METADATA:
Nodes:
${nodesList}

Edges (Data Flow):
${edgesList}

TASK:
Analyze the design against the requirements and constraints. 
Provide a status of 'Pass' ONLY if the design is robust, scalable, and has no major flaws.

OUTPUT FORMAT (JSON ONLY):
{
  "status": "Pass" | "Fail",
  "feedback": "Detailed critique explaining why it passed or failed...",
  "score": 0-100,
  "suggestions": ["specific improvement 1", "specific improvement 2"]
}
`;
};
