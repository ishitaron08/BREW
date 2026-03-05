import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { MovieData, CastMember, Review } from '@/app/types/movie';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchWithHeaders(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  
  return response.text();
}

async function scrapeMovieDetails(imdbId: string): Promise<Partial<MovieData>> {
  const url = `https://www.imdb.com/title/${imdbId}/`;
  const html = await fetchWithHeaders(url);
  const $ = cheerio.load(html);
  
  // Extract JSON-LD data which contains structured movie info
  const jsonLdScript = $('script[type="application/ld+json"]').first().html();
  let jsonData: Record<string, unknown> = {};
  
  if (jsonLdScript) {
    try {
      jsonData = JSON.parse(jsonLdScript);
    } catch {
      console.error('Failed to parse JSON-LD');
    }
  }
  
  // Extract title
  const title = (jsonData.name as string) || $('h1[data-testid="hero__pageTitle"] span').first().text().trim() || 
                $('h1').first().text().trim();
  
  // Extract year
  const yearMatch = $('a[href*="/releaseinfo"]').text().match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : 
               ((jsonData.datePublished as string) || '').split('-')[0] || 'N/A';
  
  // Extract rating
  const rating = $('span[class*="sc-"] div[class*="sc-"]').first().text().trim() ||
                 ((jsonData.aggregateRating as Record<string, unknown>)?.ratingValue as string)?.toString() || 'N/A';
  
  // Extract runtime
  const runtimeText = $('ul[class*="ipc-inline-list"] li').filter((_, el) => {
    return !!$(el).text().match(/\d+h|\d+m/);
  }).first().text().trim();
  const runtime = runtimeText || (jsonData.duration as string)?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || 'N/A';
  
  // Extract genres
  const genres: string[] = [];
  if (jsonData.genre) {
    if (Array.isArray(jsonData.genre)) {
      genres.push(...(jsonData.genre as string[]));
    } else {
      genres.push(jsonData.genre as string);
    }
  }
  if (genres.length === 0) {
    $('a[href*="/search/title?genres"]').each((_, el) => {
      const genre = $(el).text().trim();
      if (genre && !genres.includes(genre)) {
        genres.push(genre);
      }
    });
  }
  
  // Extract plot
  const plot = $('span[data-testid="plot-xl"]').text().trim() ||
               $('span[data-testid="plot-l"]').text().trim() ||
               $('span[data-testid="plot-xs_to_m"]').text().trim() ||
               (jsonData.description as string) || 'No plot available.';
  
  // Extract poster
  const poster = $('img[class*="ipc-image"]').first().attr('src') ||
                 (jsonData.image as string) || '/placeholder-poster.png';
  
  // Extract director
  let director = 'N/A';
  if (jsonData.director) {
    const directors = jsonData.director as Record<string, unknown>[] | Record<string, unknown>;
    if (Array.isArray(directors)) {
      director = directors.map(d => d.name as string).join(', ');
    } else {
      director = (directors as Record<string, unknown>).name as string || 'N/A';
    }
  }
  
  return {
    id: imdbId,
    title,
    year,
    rating,
    runtime,
    genres,
    plot,
    poster,
    director,
  };
}

async function scrapeCast(imdbId: string): Promise<CastMember[]> {
  const url = `https://www.imdb.com/title/${imdbId}/fullcredits`;
  const cast: CastMember[] = [];
  
  try {
    const html = await fetchWithHeaders(url);
    const $ = cheerio.load(html);
    
    $('table.cast_list tr').slice(1, 11).each((_, el) => {
      const nameEl = $(el).find('td:nth-child(2) a');
      const characterEl = $(el).find('td.character');
      const imgEl = $(el).find('td.primary_photo img');
      
      const name = nameEl.text().trim();
      const character = characterEl.text().trim().replace(/\s+/g, ' ');
      const image = imgEl.attr('loadlate') || imgEl.attr('src');
      
      if (name) {
        cast.push({ name, character, image });
      }
    });
  } catch (error) {
    console.error('Failed to scrape cast:', error);
  }
  
  return cast;
}

async function scrapeReviews(imdbId: string): Promise<Review[]> {
  const url = `https://www.imdb.com/title/${imdbId}/reviews`;
  const reviews: Review[] = [];
  
  try {
    const html = await fetchWithHeaders(url);
    const $ = cheerio.load(html);
    
    $('.review-container').slice(0, 10).each((_, el) => {
      const author = $(el).find('.display-name-link a').text().trim() || 'Anonymous';
      const ratingEl = $(el).find('.rating-other-user-rating span').first();
      const rating = ratingEl.length ? ratingEl.text().trim() + '/10' : undefined;
      const title = $(el).find('.title').text().trim();
      const content = $(el).find('.text.show-more__control').text().trim() ||
                     $(el).find('.content .text').text().trim();
      const date = $(el).find('.review-date').text().trim();
      const helpful = $(el).find('.actions').text().trim().match(/(\d+ found this helpful)/)?.[1];
      
      if (content) {
        reviews.push({ author, rating, title, content, date, helpful });
      }
    });
  } catch (error) {
    console.error('Failed to scrape reviews:', error);
  }
  
  return reviews;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imdbId = searchParams.get('id');
  
  // Validate IMDb ID format (tt followed by digits)
  if (!imdbId || !/^tt\d+$/.test(imdbId)) {
    return NextResponse.json(
      { error: 'Invalid IMDb ID', message: 'Please provide a valid IMDb ID (e.g., tt0133093)' },
      { status: 400 }
    );
  }
  
  try {
    // Fetch movie details, cast, and reviews in parallel
    const [movieDetails, cast, reviews] = await Promise.all([
      scrapeMovieDetails(imdbId),
      scrapeCast(imdbId),
      scrapeReviews(imdbId),
    ]);
    
    const movieData: MovieData = {
      id: imdbId,
      title: movieDetails.title || 'Unknown',
      year: movieDetails.year || 'N/A',
      rating: movieDetails.rating || 'N/A',
      runtime: movieDetails.runtime || 'N/A',
      genres: movieDetails.genres || [],
      plot: movieDetails.plot || 'No plot available.',
      poster: movieDetails.poster || '/placeholder-poster.png',
      cast,
      director: movieDetails.director || 'N/A',
      reviews,
    };
    
    return NextResponse.json(movieData);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie', message: 'Could not retrieve movie data. Please check the IMDb ID and try again.' },
      { status: 500 }
    );
  }
}
