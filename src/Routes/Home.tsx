import {useQuery} from 'react-query'
import { IGetMoviesResult, getComingMovies, getNowMovies, getPopularMovies, getTopRatedMovies } from '../api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import MovieSlider from '../Sliders/MovieSlider';


const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;




function Home(){
    const {data:nowData, isLoading:nowIsLoading} = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getNowMovies)
    const {data:popularData, isLoading:popularIsLoading} = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies)
    const {data:topData, isLoading:topIsLoading} = useQuery<IGetMoviesResult>(["movies", "top"], getTopRatedMovies)
    const {data:comingData, isLoading:comingIsLoading} = useQuery<IGetMoviesResult>(["movies", "coming"], getComingMovies)
  
    const isLoading = nowIsLoading && popularIsLoading && topIsLoading && comingIsLoading
    return (
        <Wrapper>
            {isLoading ? <Loader>불어오는 중입니다...</Loader> :
            (
              <>
                <Banner
                  bgPhoto={makeImagePath(comingData?.results[0].backdrop_path || "")}>
                    <Title>{comingData?.results[0].title}</Title>
                    <Overview>
                        {Number(comingData?.results[0].overview.length) > 200
                            ? `${comingData?.results[0].overview.slice(0,200)}...` 
                            : comingData?.results[0].overview}
                    </Overview>
                </Banner>
                <MovieSlider  title={'현재 상영 중!'} data={nowData}/>
                <MovieSlider  title={'인기 영화'} data={popularData}/>
                <MovieSlider  title={'높은 평점'} data={topData}/>
                <MovieSlider  title={'UPCOMING!!!'} data={comingData}/>    
              </>
            )
          }
        </Wrapper>

    )
}
export default Home;