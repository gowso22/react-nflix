const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";
const BASE_LANG = 'ko-KR';
const BASE_REGION = 'KR';

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IDetialMovie{
  id: number;
  backdrop_path: string;
  genres: [{ id: number; name: string }];
  production_companies : [{id: number; logo_path: string}];
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  title: string;
  vote_average: number;
}



export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${BASE_LANG}`)
  .then((res) => res.json());
}

export function getMovieDetail(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=${BASE_LANG}`)
  .then((res) => res.json());
}