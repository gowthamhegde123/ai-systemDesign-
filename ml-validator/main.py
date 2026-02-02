"""
AI System Design Validation Service
FastAPI service for validating system design architectures
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import logging
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI System Design Validator",
    description="ML-powered validation service for system design architectures",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ComponentModel(BaseModel):
    id: str
    type: str
    position: Dict[str, float]

class ConnectionModel(BaseModel):
    from_component: str = None
    to_component: str = None

class DesignModel(BaseModel):
    components: List[ComponentModel]
    connections: List[ConnectionModel] = []
    problem_id: Optional[str] = None

class ValidationResult(BaseModel):
    score: int
    passed: bool
    feedback: str
    detailed_results: Dict[str, Any]
    test_results: List[Dict[str, Any]]

# Component definitions and rules
COMPONENT_TYPES = {
    'api-gateway': {
        'name': 'API Gateway',
        'category': 'entry',
        'required_connections': ['web-server', 'load-balancer'],
        'optional_connections': ['security', 'cache'],
        'points': 10
    },
    'load-balancer': {
        'name': 'Load Balancer',
        'category': 'distribution',
        'required_connections': ['web-server'],
        'optional_connections': ['api-gateway'],
        'points': 15
    },
    'web-server': {
        'name': 'Web Server',
        'category': 'compute',
        'required_connections': ['database'],
        'optional_connections': ['cache', 'message-queue', 'load-balancer'],
        'points': 20
    },
    'database': {
        'name': 'Database',
        'category': 'storage',
        'required_connections': [],
        'optional_connections': ['web-server', 'cache'],
        'points': 25
    },
    'cache': {
        'name': 'Cache',
        'category': 'performance',
        'required_connections': [],
        'optional_connections': ['web-server', 'database', 'api-gateway'],
        'points': 15
    },
    'message-queue': {
        'name': 'Message Queue',
        'category': 'async',
        'required_connections': [],
        'optional_connections': ['web-server'],
        'points': 20
    },
    'cdn': {
        'name': 'CDN',
        'category': 'performance',
        'required_connections': [],
        'optional_connections': ['api-gateway'],
        'points': 10
    },
    'security': {
        'name': 'Security Layer',
        'category': 'security',
        'required_connections': [],
        'optional_connections': ['api-gateway', 'web-server'],
        'points': 15
    }
}

# Problem definitions
PROBLEMS = {
    'url-shortener': {
        'title': 'Design a URL Shortener (TinyURL)',
        'description': 'Design a URL shortening service like bit.ly. Functional: Generate short aliases, redirect. Non-Functional: High availability, low latency, 10k writes/sec.',
        'min_score': 70,
        'required_components': ['api-gateway', 'web-server', 'database', 'cache'],
        'optional_components': ['load-balancer', 'cdn', 'security'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'The "Celebrity Tweet": A single URL gets 1 million hits in 1 minute.',
                'evaluation': 'Does the user include a Cache (Redis/Memcached)?'
            },
            {
                'id': 'TC-02',
                'scenario': 'Database Exhaustion: 500 million URLs are stored.',
                'evaluation': 'Does the user mention Database Sharding or NoSQL?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Collision Test: Two users generate a short link at the exact same millisecond.',
                'evaluation': 'How is the unique ID generated? (Snowflake ID, Base62, etc.)'
            }
        ]
    },
    'chat-system': {
        'title': 'Design a Chat System (WhatsApp/Slack)',
        'description': 'Design a real-time messaging system. Functional: 1v1 chat, Group chat. Non-Functional: Low latency, Persistent storage.',
        'min_score': 75,
        'required_components': ['api-gateway', 'web-server', 'database', 'message-queue'],
        'optional_components': ['load-balancer', 'cache', 'security'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'Real-time User Experience.',
                'evaluation': 'Does the system use WebSockets or Long Polling for immediate message delivery?'
            },
            {
                'id': 'TC-02',
                'scenario': 'User goes offline and comes back.',
                'evaluation': 'Are messages queued/stored reliably to be delivered when user is back online?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Group Chat with 1000 users.',
                'evaluation': 'Does the system handle fan-out messages efficiently?'
            }
        ]
    },
    'social-media-feed': {
        'title': 'Design a Social Media Feed (Twitter/Instagram)',
        'description': 'Design a scalable social media platform. Functional: Post tweet, View feed. Non-Functional: Eventual consistency allowed, fast read, heavy read ratio.',
        'min_score': 80,
        'required_components': ['api-gateway', 'load-balancer', 'web-server', 'database', 'cache'],
        'optional_components': ['cdn', 'message-queue', 'security'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'Justin Bieber posts a photo (Viral Content).',
                'evaluation': 'Is a CDN used for media? Is the post metadata cached?'
            },
            {
                'id': 'TC-02',
                'scenario': 'Feed Generation Latency.',
                'evaluation': 'Does the system pre-generate feeds (Fan-out on write) or generate on read?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Heavy Read Traffic.',
                'evaluation': 'Are Read Replicas used for the database?'
            }
        ]
    },
    'video-streaming': {
        'title': 'Design YouTube/Netflix',
        'description': 'Design a video streaming platform. Functional: Upload, Transcode, Stream. Non-Functional: High throughput, low latency streaming.',
        'min_score': 80,
        'required_components': ['api-gateway', 'load-balancer', 'web-server', 'database', 'cdn', 'storage'],
        'optional_components': ['message-queue', 'cache', 'security'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'Global Buffet: Users in Australia watching video hosted in US.',
                'evaluation': 'Is a CDN used to serve video chunks from the edge?'
            },
            {
                'id': 'TC-02',
                'scenario': 'Processing 4K Uploads.',
                'evaluation': 'Is there a queue + transcoding workers pipeline (Async processing)?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Metadata Bottleneck.',
                'evaluation': 'Is video metadata separated from the large video blobs? (Blob store vs SQL/NoSQL)'
            }
        ]
    },
    'ride-sharing': {
        'title': 'Design Uber/Lyft',
        'description': 'Design a ride-sharing service. Functional: Match driver/rider, location tracking. Non-Functional: High consistency for matching, real-time updates.',
        'min_score': 85,
        'required_components': ['api-gateway', 'load-balancer', 'web-server', 'database', 'cache', 'message-queue'],
        'optional_components': ['security', 'geo-service'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'Geospatial Search: Find nearest 10 drivers.',
                'evaluation': 'Does the design imply a QuadTree/Geohash index (usually via specialized DB or Service)?'
            },
            {
                'id': 'TC-02',
                'scenario': 'Race Condition: Two riders book the same driver.',
                'evaluation': 'Is there a locking mechanism or transactional consistency for bookings?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Real-time Location Updates.',
                'evaluation': 'Does it use WebSockets/MQTT for driver location streams?'
            }
        ]
    },
    'search-engine': {
        'title': 'Design Google Search',
        'description': 'Design a web search engine. Functional: Crawl, Index, Search. Non-Functional: Huge scale, low latency search.',
        'min_score': 85,
        'required_components': ['api-gateway', 'web-server', 'database', 'cache', 'load-balancer'],
        'optional_components': ['message-queue', 'worker'],
        'test_cases': [
            {
                'id': 'TC-01',
                'scenario': 'The Internet is Big: 50 Billion pages.',
                'evaluation': 'Is the index sharded? (Document vs Term partitioning mentioned?)'
            },
            {
                'id': 'TC-02',
                'scenario': 'Freshness: News site changes content.',
                'evaluation': 'Is there a crawler/updater pipeline distinct from the serving layer?'
            },
            {
                'id': 'TC-03',
                'scenario': 'Typeahead/Autocomplete latency.',
                'evaluation': 'Is there a Trie or specialized prefix cache structure?'
            }
        ]
    }
}

class DesignValidator:
    """Main validation engine for system designs"""
    
    def __init__(self):
        self.max_score = 100
        self.model = genai.GenerativeModel('gemini-pro') if GOOGLE_API_KEY else None

    async def _validate_with_llm(self, design: DesignModel, problem: Dict = None) -> Optional[ValidationResult]:
        """Validate design using Gemini LLM with Senior Staff Persona"""
        if not self.model:
            return None
            
        try:
            # 1. Context Assembly
            problem_title = problem['title'] if problem else f"System Design Problem ({design.problem_id})"
            problem_desc = problem['description'] if problem else "Design a scalable system for this use case."
            
            # Format Test Cases
            test_cases_text = ""
            if problem and 'test_cases' in problem:
                for tc in problem['test_cases']:
                    test_cases_text += f"- **{tc['id']}**: {tc['scenario']} (Check: {tc['evaluation']})\n"
            else:
                # Fallback Generic Test Cases if problem ID not found in backend
                test_cases_text = """
                - **TC-01**: High Scalability. (Check: Is there a load balancer and caching?)
                - **TC-02**: Single Point of Failure. (Check: Are critical components redundant?)
                - **TC-03**: Data Consistency vs Availability. (Check: Did they choose the right DB strategy?)
                """

            # Format Design
            components_list = ", ".join([f"{c.type}" for c in design.components])
            component_properties = json.dumps([{"type": c.type, "id": c.id} for c in design.components])
            connections_list = ", ".join([f"{c.from_component}->{c.to_component}" for c in design.connections])
            
            # 2. Construct Prompt
            prompt = f"""
            Role: You are a Senior Staff System Design Interviewer. Your task is to evaluate a user's proposed architecture for a specific system design problem.

            Problem: {problem_title}
            Description: {problem_desc}

            User's Design:
            - Components Used: {components_list}
            - Full Component List: {component_properties}
            - Connections: {connections_list}

            Evaluation Framework:
            1. Requirement Coverage: Did the user address the core functional requirements?
            2. Component Appropriateness: Are the chosen technologies (Databases, Load Balancers, Caching) correct for the scale?
            3. Scalability & Bottlenecks: Can the system handle high traffic? Where will it fail first?
            4. Reliability: Is there a single point of failure?

            The "Stress Scenarios" (Test Cases):
            Please run the design through the following scenarios. For each, state PASS/FAIL and why.
            {test_cases_text}

            Output Format (Strict JSON):
            {{
                "analysis": "Brief breakdown of strengths and weaknesses (max 2-3 sentences).",
                "test_case_results": [
                    {{
                        "name": "TC-01: [Scenario Name]",
                        "passed": true/false,
                        "description": "Explanation of why it passed or failed."
                    }}
                ],
                "detailed_results": {{
                    "scalability": <score 0-100>,
                    "reliability": <score 0-100>,
                    "completeness": <score 0-100>,
                    "correctness": <score 0-100>
                }},
                "score": <overall_percentage 0-100>
            }}
            """
            
            # 3. Inference
            response = await self.model.generate_content_async(prompt)
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(clean_text)
            
            # 4. Parsing
            return ValidationResult(
                score=result_json.get('score', 0),
                passed=result_json.get('score', 0) >= (problem.get('min_score', 70) if problem else 70),
                feedback=result_json.get('analysis', "Evaluation complete."),
                detailed_results=result_json.get('detailed_results', {}),
                test_results=result_json.get('test_case_results', [])
            )
            
        except Exception as e:
            logger.error(f"LLM validation failed: {str(e)}")
            return None
        
    async def validate_design(self, design: DesignModel, problem_id: str = None) -> ValidationResult:
        """Main validation method"""
        try:
            logger.info(f"Validating design with {len(design.components)} components")
            
            # Get problem requirements
            problem = PROBLEMS.get(problem_id) if problem_id else None

            # Try AI Validation first
            if self.model:
                try:
                    ai_result = await self._validate_with_llm(design, problem)
                    if ai_result:
                        logger.info("AI Validation successful")
                        return ai_result
                except Exception as e:
                    logger.warning(f"AI Validation failed, falling back to rules: {e}")
            
            # Initialize results for rule-based fallback
            total_score = 0
            test_results = []
            detailed_results = {}

            # Test 1: Required Components (25 points)
            component_score, component_tests = self._validate_required_components(
                design, problem
            )
            total_score += component_score
            test_results.extend(component_tests)
            detailed_results['required_components'] = component_score
            
            # Test 2: Component Connections (25 points)
            connection_score, connection_tests = self._validate_connections(design)
            total_score += connection_score
            test_results.extend(connection_tests)
            detailed_results['connections'] = connection_score
            
            # Test 3: Architecture Patterns (25 points)
            pattern_score, pattern_tests = self._validate_architecture_patterns(design)
            total_score += pattern_score
            test_results.extend(pattern_tests)
            detailed_results['architecture_patterns'] = pattern_score
            
            # Test 4: Best Practices (25 points)
            practices_score, practices_tests = self._validate_best_practices(design)
            total_score += practices_score
            test_results.extend(practices_tests)
            detailed_results['best_practices'] = practices_score
            
            # Determine if passed
            min_score = problem.get('min_score', 70) if problem else 70
            passed = total_score >= min_score
            
            # Generate feedback
            feedback = self._generate_feedback(total_score, passed, detailed_results)
            
            return ValidationResult(
                score=total_score,
                passed=passed,
                feedback=feedback,
                detailed_results=detailed_results,
                test_results=test_results
            )
            
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")
    
    def _validate_required_components(self, design: DesignModel, problem: Dict = None) -> tuple:
        """Validate required components are present"""
        score = 0
        tests = []
        
        component_types = [comp.type for comp in design.components]
        
        if problem:
            required = problem['required_components']
            for req_comp in required:
                if req_comp in component_types:
                    score += 5
                    tests.append({
                        'name': f'Required component: {COMPONENT_TYPES[req_comp]["name"]}',
                        'passed': True,
                        'points': 5,
                        'description': f'{COMPONENT_TYPES[req_comp]["name"]} is present'
                    })
                else:
                    tests.append({
                        'name': f'Required component: {COMPONENT_TYPES[req_comp]["name"]}',
                        'passed': False,
                        'points': 0,
                        'description': f'Missing required {COMPONENT_TYPES[req_comp]["name"]}'
                    })
        else:
            # General validation - basic components
            basic_components = ['web-server', 'database']
            for comp in basic_components:
                if comp in component_types:
                    score += 10
                    tests.append({
                        'name': f'Basic component: {COMPONENT_TYPES[comp]["name"]}',
                        'passed': True,
                        'points': 10,
                        'description': f'{COMPONENT_TYPES[comp]["name"]} is present'
                    })
            
            # Bonus for additional components
            if len(component_types) >= 4:
                score += 5
                tests.append({
                    'name': 'Component diversity',
                    'passed': True,
                    'points': 5,
                    'description': f'Good component diversity ({len(component_types)} components)'
                })
        
        return min(score, 25), tests
    
    def _validate_connections(self, design: DesignModel) -> tuple:
        """Validate component connections"""
        score = 0
        tests = []
        
        # Check if components are connected
        if len(design.connections) > 0:
            score += 10
            tests.append({
                'name': 'Component connections',
                'passed': True,
                'points': 10,
                'description': f'{len(design.connections)} connections found'
            })
        else:
            tests.append({
                'name': 'Component connections',
                'passed': False,
                'points': 0,
                'description': 'No connections between components'
            })
        
        # Validate connection logic
        component_types = {comp.id: comp.type for comp in design.components}
        
        for connection in design.connections:
            from_type = component_types.get(connection.from_component)
            to_type = component_types.get(connection.to_component)
            
            if from_type and to_type:
                # Check if connection makes sense
                from_rules = COMPONENT_TYPES.get(from_type, {})
                valid_connections = from_rules.get('required_connections', []) + from_rules.get('optional_connections', [])
                
                if to_type in valid_connections:
                    score += 3
                    tests.append({
                        'name': f'Valid connection: {from_rules.get("name", from_type)} → {COMPONENT_TYPES.get(to_type, {}).get("name", to_type)}',
                        'passed': True,
                        'points': 3,
                        'description': 'Connection follows best practices'
                    })
        
        return min(score, 25), tests
    
    def _validate_architecture_patterns(self, design: DesignModel) -> tuple:
        """Validate architecture patterns"""
        score = 0
        tests = []
        
        component_types = [comp.type for comp in design.components]
        
        # Layered architecture pattern
        has_presentation = 'api-gateway' in component_types
        has_application = 'web-server' in component_types
        has_data = 'database' in component_types
        
        if has_presentation and has_application and has_data:
            score += 15
            tests.append({
                'name': 'Layered architecture',
                'passed': True,
                'points': 15,
                'description': 'Proper separation of presentation, application, and data layers'
            })
        
        # Scalability pattern
        if 'load-balancer' in component_types:
            score += 5
            tests.append({
                'name': 'Scalability pattern',
                'passed': True,
                'points': 5,
                'description': 'Load balancer present for horizontal scaling'
            })
        
        # Performance pattern
        if 'cache' in component_types:
            score += 5
            tests.append({
                'name': 'Performance pattern',
                'passed': True,
                'points': 5,
                'description': 'Caching layer present for performance optimization'
            })
        
        return min(score, 25), tests
    
    def _validate_best_practices(self, design: DesignModel) -> tuple:
        """Validate best practices"""
        score = 0
        tests = []
        
        component_types = [comp.type for comp in design.components]
        
        # Security best practice
        if 'security' in component_types:
            score += 8
            tests.append({
                'name': 'Security layer',
                'passed': True,
                'points': 8,
                'description': 'Security layer present'
            })
        
        # CDN for static content
        if 'cdn' in component_types:
            score += 7
            tests.append({
                'name': 'Content delivery',
                'passed': True,
                'points': 7,
                'description': 'CDN present for content delivery'
            })
        
        # Async processing
        if 'message-queue' in component_types:
            score += 10
            tests.append({
                'name': 'Asynchronous processing',
                'passed': True,
                'points': 10,
                'description': 'Message queue present for async processing'
            })
        
        return min(score, 25), tests
    
    def _generate_feedback(self, score: int, passed: bool, detailed_results: Dict) -> str:
        """Generate motivational feedback based on score"""
        if score >= 95:
            return "🎉 PERFECT! You absolute legend! This is a masterpiece of system design!"
        elif score >= 90:
            return "🌟 Excellent work! Your architecture is solid and well-thought-out!"
        elif score >= 80:
            return "👏 Great job! You've got a strong design with good practices!"
        elif score >= 70:
            return "✅ You passed! Your design works, but there's room for improvement!"
        elif score >= 60:
            return "🤔 So close! Review the failed tests and try again!"
        elif score >= 40:
            return "😬 Not quite there yet! Focus on the basic components first!"
        else:
            return "🤦‍♂️ Ouch! Let's start with the fundamentals - every system needs a web server and database!"

# Initialize validator
validator = DesignValidator()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "AI System Design Validator",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "components": {
            "validator": "operational",
            "rules_engine": "operational",
            "pattern_matcher": "operational"
        },
        "problems_available": len(PROBLEMS),
        "component_types": len(COMPONENT_TYPES)
    }

@app.post("/validate", response_model=ValidationResult)
async def validate_design(design: DesignModel):
    """Validate a system design"""
    try:
        logger.info(f"Received validation request for design with {len(design.components)} components")
        result = await validator.validate_design(design, design.problem_id)
        logger.info(f"Validation completed with score: {result.score}")
        return result
    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/problems")
async def get_problems():
    """Get available problems"""
    return {
        "problems": PROBLEMS,
        "count": len(PROBLEMS)
    }

@app.get("/components")
async def get_components():
    """Get available component types"""
    return {
        "components": COMPONENT_TYPES,
        "count": len(COMPONENT_TYPES)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")