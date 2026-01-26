import { DesignState, Problem } from '@/types';

export const generateSystemPrompt = (problemTitle: string, type: 'evaluate' | 'hint' = 'evaluate') => {
  if (type === 'hint') {
    return `You are a World-Class System Architect. 
Your task is to provide a brief, pointwise hint to a student working on the "${problemTitle}" design problem.

FORMAT RULES:
1. Keep it SHORT and POINTWISE (max 3 bullets).
2. Align the hint with the logic of solving a design problem step-by-step (e.g., start with entry point, then data storage, then scaling).
3. DO NOT give the full solution.
4. ANALYZE the current nodes provided and suggest the NEXT logical step.
5. Format: Return a JSON object with a single "feedback" field containing the points separated by newlines and starting with a bullet point (•).`;
  }

  return `You are a Senior System Architect acting as an interviewer at a Tier-1 tech company.
Your goal is to provide a rigorous, highly specific evaluation of a system design diagram.

EVALUATION CORE:
- Be brutally honest. If the design won't work at the specified scale, it must fail.
- Detect "Generic Designs": If the candidate just threw a Load Balancer, API Gateway, and DB without considering the UNIQUE constraints of the specific problem, call it out.
- Check for Bottlenecks: Real-world systems fail at the seams (DB connections, network latencies, state synchronization).

CRITERIA:
1. Scalability: Can it handle the specific RPS/DAU mentioned in the constraints?
2. Availability: Are there single points of failure? Is replication mentioned or implied?
3. Tradeoffs: Did they choose the right DB type (SQL vs NoSQL) for THIS data model?
4. Logic: Do the lines (edges) represent actual data flow or just random connections?

You MUST provide feedback that refers to specific components and requirements. Avoid generic phrases like "Good start".`;
};

export const generateUserPrompt = (problem: Problem, design: DesignState) => {
  const nodesList = design.nodes.length > 0
    ? design.nodes.map(n => `- ${n.data.label} (Type: ${n.data.type})`).join('\n')
    : "No nodes added yet.";

  const edgesList = design.edges.length > 0
    ? design.edges.map(e => `- ${e.source} -> ${e.target} ${e.label ? `(${e.label})` : ''}`).join('\n')
    : "No connections made yet.";

  return `
=== PROBLEM CONTEXT ===
Title: ${problem.title}
Mission: ${problem.description}
Requirements for Success:
${problem.requirements.map(r => `- ${r}`).join('\n')}
Hard Constraints:
${problem.constraints.map(c => `- ${c}`).join('\n')}

=== CANDIDATE DESIGN (CURRENT STATE) ===
Nodes on Canvas:
${nodesList}

Data Flows / Edges:
${edgesList}

=== TASK ===
1. Compare the CURRENT STATE against the MISSION and REQUIREMENTS.
2. Identify the most critical component that is missing or wrongly configured.
3. Provide a detailed, technical critique.

OUTPUT JSON FORMAT:
{
  "status": "Pass" | "Fail",
  "feedback": "Deep technical analysis referring specifically to ${problem.title}...",
  "score": 0-100,
  "suggestions": ["specific technical improvement 1", "specific technical improvement 2"]
}
`;
};
