'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SystemDesignQuestion } from '@/lib/data/system-design-questions';
import { ArrowLeft, Clock, Users, Code, ArrowRight, BrainCircuit, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useUserProgress } from '@/lib/hooks/useUserProgress';

interface QuestionsResponse {
  questions: SystemDesignQuestion[];
  total: number;
  filters: {
    category?: string;
    difficulty?: string;
    tag?: string;
    search?: string;
  };
}

interface MetaResponse {
  categories: string[];
  tags: string[];
  difficulties: string[];
  totalQuestions: number;
}

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isQuestionSolved } = useUserProgress();
  const [questions, setQuestions] = useState<SystemDesignQuestion[]>([]);
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    tag: '',
    search: ''
  });

  useEffect(() => {
    // Get category from URL params
    const categoryFromUrl = searchParams.get('category') || '';
    setSelectedCategory(categoryFromUrl);
    setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    
    fetchMeta();
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchMeta = async () => {
    try {
      const response = await fetch('/api/questions?meta=true');
      const data = await response.json();
      setMeta(data);
    } catch (error) {
      console.error('Error fetching meta:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/questions?${params}`);
      const data: QuestionsResponse = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') {
      setSelectedCategory(value);
      // Update URL without page reload
      const newUrl = value ? `/questions?category=${encodeURIComponent(value)}` : '/questions';
      window.history.pushState({}, '', newUrl);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', difficulty: '', tag: '', search: '' });
    setSelectedCategory('');
    window.history.pushState({}, '', '/questions');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Storage & Databases': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Real-time Systems': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Infrastructure & Networking': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Content & Media': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Search & Discovery': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Social & Communication': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'E-commerce & Business': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Location & Proximity': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      'File & Sync Systems': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Specialized Applications': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    };
    return colorMap[category] || 'bg-muted text-muted-foreground border-border';
  };

  if (!meta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>System Design Mastery</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            >
              {selectedCategory ? `${selectedCategory}` : 'System Design Questions'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-6 font-medium"
            >
              {selectedCategory 
                ? `Explore ${questions.length} questions in ${selectedCategory}`
                : `Master system design with ${meta.totalQuestions} carefully curated questions`
              }
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center space-x-8 text-sm text-muted-foreground"
            >
              <span className="font-medium">{meta.categories.length} Categories</span>
              <span className="font-medium">{meta.tags.length} Topics</span>
              <span className="font-medium">{meta.difficulties.length} Difficulty Levels</span>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Categories</option>
                {meta.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Levels</option>
                {meta.difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Topic
              </label>
              <select
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">All Topics</option>
                {meta.tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-medium">
              Showing {questions.length} questions
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>

        {/* Questions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground font-medium">Loading questions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/canvas/system-design/${question.id}`}
                  className="block bg-card border border-border rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 group cursor-pointer hover:border-primary/30 overflow-hidden relative"
                >
                  {/* Solved Indicator */}
                  {isQuestionSolved(question.id) && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Background */}
                  <div className={clsx(
                    "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isQuestionSolved(question.id) && "from-green-500/5"
                  )} />
                  
                  {/* Header */}
                  <div className="mb-4 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={clsx(
                        "text-lg font-black text-foreground line-clamp-2 group-hover:text-primary transition-colors",
                        isQuestionSolved(question.id) && "text-green-600"
                      )}>
                        {question.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(question.category)}`}>
                      {question.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 font-medium leading-relaxed relative z-10">
                    {question.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4 relative z-10">
                    {question.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
                        +{question.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Requirements Preview */}
                  <div className="mb-4 relative z-10">
                    <h4 className="text-xs font-black text-foreground mb-2 flex items-center gap-1 uppercase tracking-widest">
                      <Users className="w-3 h-3" />
                      Key Requirements
                    </h4>
                    <ul className="space-y-1">
                      {question.coreRequirements.slice(0, 2).map((req, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 font-medium">
                          <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                      {question.coreRequirements.length > 2 && (
                        <li className="text-xs text-muted-foreground/70 font-medium">
                          +{question.coreRequirements.length - 2} more requirements
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4 relative z-10">
                    <h4 className="text-xs font-black text-foreground mb-2 flex items-center gap-1 uppercase tracking-widest">
                      <Code className="w-3 h-3" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {question.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {question.techStack.length > 3 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-lg border border-border font-medium">
                          +{question.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-border relative z-10">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{question.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary group-hover:text-primary/80 font-black text-xs uppercase tracking-widest">
                      <span>{isQuestionSolved(question.id) ? 'Solved' : 'Start Solving'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-black text-foreground mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4 font-medium">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}