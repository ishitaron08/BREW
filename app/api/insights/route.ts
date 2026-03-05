import { NextRequest, NextResponse } from 'next/server';
import { Review, AIInsights } from '@/app/types/movie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieTitle, reviews, plot } = body as {
      movieTitle: string;
      reviews: Review[];
      plot: string;
    };

    if (!movieTitle) {
      return NextResponse.json(
        { error: 'Missing data', message: 'Movie title is required' },
        { status: 400 }
      );
    }

    // Check if OpenRouter API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Return a fallback response if no API key is configured
      return NextResponse.json(generateFallbackInsights(reviews));
    }

    // Prepare reviews text for analysis
    const reviewsText = reviews
      .slice(0, 10)
      .map((r, i) => `Review ${i + 1}${r.rating ? ` (${r.rating})` : ''}: "${r.title}" - ${r.content.slice(0, 500)}...`)
      .join('\n\n');

    const prompt = `Analyze the following movie reviews for "${movieTitle}" and provide insights.

Movie Plot: ${plot}

Reviews:
${reviewsText || 'No reviews available.'}

Please provide a JSON response with the following structure:
{
  "summary": "A 2-3 sentence summary of overall audience sentiment and reception",
  "sentimentClassification": "positive" | "mixed" | "negative",
  "sentimentScore": number between 0-100 representing positivity,
  "keyThemes": ["array", "of", "common", "themes", "mentioned"],
  "audienceReaction": "A brief description of how audiences reacted to the movie",
  "recommendation": "A one-sentence recommendation based on the analysis"
}

Only respond with valid JSON, no additional text.`;

    // Use OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Movie Insight Builder',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a movie analyst expert who analyzes audience reviews and provides sentiment insights. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', await response.text());
      return NextResponse.json(generateFallbackInsights(reviews));
    }

    const completion = await response.json();
    const responseText = completion.choices?.[0]?.message?.content || '';
    
    try {
      // Parse the JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const insights: AIInsights = JSON.parse(jsonMatch[0]);
      return NextResponse.json(insights);
    } catch {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json(generateFallbackInsights(reviews));
    }
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights', message: 'Could not analyze reviews. Please try again.' },
      { status: 500 }
    );
  }
}

function generateFallbackInsights(reviews: Review[]): AIInsights {
  // Generate basic insights without AI if API is unavailable
  let positiveCount = 0;
  let negativeCount = 0;
  let totalRating = 0;
  let ratingCount = 0;

  reviews.forEach((review) => {
    const content = review.content.toLowerCase();
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'loved', 'fantastic', 'brilliant', 'masterpiece', 'perfect', 'wonderful', 'best', 'outstanding'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'hated', 'boring', 'worst', 'disappointing', 'waste', 'poor', 'horrible'];
    
    const positiveMatches = positiveWords.filter(word => content.includes(word)).length;
    const negativeMatches = negativeWords.filter(word => content.includes(word)).length;
    
    if (positiveMatches > negativeMatches) positiveCount++;
    else if (negativeMatches > positiveMatches) negativeCount++;
    
    // Extract rating if available
    if (review.rating) {
      const ratingMatch = review.rating.match(/(\d+)/);
      if (ratingMatch) {
        totalRating += parseInt(ratingMatch[1]);
        ratingCount++;
      }
    }
  });

  const totalReviews = reviews.length;
  const avgRating = ratingCount > 0 ? totalRating / ratingCount : 5;
  const sentimentScore = Math.round(
    ((positiveCount / (totalReviews || 1)) * 50 + (avgRating / 10) * 50) || 50
  );

  let sentimentClassification: 'positive' | 'mixed' | 'negative';
  if (sentimentScore >= 65) {
    sentimentClassification = 'positive';
  } else if (sentimentScore >= 40) {
    sentimentClassification = 'mixed';
  } else {
    sentimentClassification = 'negative';
  }

  return {
    summary: totalReviews > 0 
      ? `Based on ${totalReviews} reviews analyzed, the audience reception appears to be ${sentimentClassification}. ${positiveCount} reviews express positive sentiments while ${negativeCount} lean negative.`
      : 'No reviews available for analysis. Unable to determine audience sentiment.',
    sentimentClassification,
    sentimentScore,
    keyThemes: totalReviews > 0 
      ? ['Acting', 'Story', 'Direction', 'Cinematography', 'Entertainment']
      : [],
    audienceReaction: totalReviews > 0
      ? `Audiences have shown ${sentimentClassification} reactions to this film based on the available reviews.`
      : 'No audience reactions available.',
    recommendation: sentimentScore >= 65
      ? 'This movie is recommended based on generally positive audience reception.'
      : sentimentScore >= 40
      ? 'This movie has mixed reviews - consider your personal preferences before watching.'
      : 'This movie may not appeal to everyone based on audience feedback.',
  };
}
