import {useQuery} from 'react-query'
import { IGetMoviesResult, getMovies } from '../api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { makeImagePath } from '../utils';

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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
`;

function Home(){
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getMovies)
   
    return (
        <Wrapper>
            {isLoading ? <Loader>불어오는 중입니다...</Loader> :
            (
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>
                        {Number(data?.results[0].overview.length) > 200
                            ? `${data?.results[0].overview.slice(0,200)}...` 
                            : data?.results[0].overview}
                    </Overview>
                </Banner>
            )
            }
        </Wrapper>

    )
}
export default Home;