import { NextResponse } from 'next/server';
import { 
  systemDesignQuestions, 
  getQuestionsByCategory, 
  getQuestionsByDifficulty,
  getQuestionsByTag,
  searchQuestions,
  getAllCategories,
  getAllTags
} from '@/lib/data/system-design-questions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const meta = searchParams.get('meta');

  try {
    // Return metadata (categories, tags, etc.)
    if (meta === 'true') {
      return NextResponse.json({
        categories: getAllCategories(),
        tags: getAllTags(),
        difficulties: ['Beginner', 'Intermediate', 'Advanced'],
        totalQuestions: systemDesignQuestions.length
      });
    }

    let questions = systemDesignQuestions;

    // Apply filters
    if (category) {
      questions = getQuestionsByCategory(category);
    }
    
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    if (tag) {
      questions = questions.filter(q => q.tags.includes(tag));
    }
    
    if (search) {
      questions = searchQuestions(search);
    }

    return NextResponse.json({
      questions,
      total: questions.length,
      filters: {
        category,
        difficulty,
        tag,
        search
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}