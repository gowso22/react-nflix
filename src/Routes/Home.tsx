import {useQuery} from 'react-query'
import { IGetMoviesResult, getMovies } from '../api';
import styled from 'styled-components';
import { motion, AnimatePresence, delay } from 'framer-motion';
import { makeImagePath } from '../utils';
import { useState } from 'react';

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
  padding: 0 40px;
`;

const Box = styled(motion.div)<{bgPhoto : string}>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  height: 200px;
  color: red;
  font-size: 35px;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  &:first-child{
    transform-origin : center left;
  }
  &:last-child{
    transform-origin : center right;
  }
`;
const SliderBtn = styled(motion.button)<{isRight : boolean}>`
  position: absolute;
  color : ${(props) => props.theme.white.lighter};
  background-color: rgba(0,0,0,0.3);
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: none;
  z-index: 2;
`;
const Info = styled(motion.div)`
  position: absolute;
  padding: 10px;
  background-color: rgba(0,0,0,0.5);
  opacity: 0;
  width: 100%;
  bottom: 0;
  color: ${(props) => props.theme.white.darker};;
  h4{
    text-align: center;
    font-size: 15px;
  }
`;

const rowVars = {
  hidden : (back : boolean) =>({
    // Row 컴포넌트의 gap 혹은 padding에 맞춰줘야 애니메이션이 깔끔해짐
    x : back ? -window.outerWidth - 10 : window.outerWidth + 10  ,
    
  }),
  visible : {
    x : 0,
  },
  exit : (back : boolean) =>({
    x : back ?  window.outerWidth + 10 : -window.outerWidth - 10,
    
  })
}
const boxVars = {
  normal : {
    scale : 1,
  },
  hover : {
    scale : 1.3,
    transition : {
      delay : 0.5,
      type : "tween",
    }
  }
}
const infoVars = {
  hover : {
    opacity : 1,
    transition : {
      delay : 0.5,
      type : "tween",
    }
  }
}

function Home(){
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowplaying"], getMovies)
    // Row 컴포넌트가 사라지고 다시 생겨날때 Box들이 겹쳐보이는 것을 방지하기위해 leaving state 설정
    const [leaving, setLeaving] = useState(false);
    const [page, setPage] = useState(0);
    const [back, setBack] = useState(false);
    // 6개 Box 컴포넌트를 페이징 처리를 위해 offset 상수 선언
    const offset = 6;

    const incresePage = () => {
      if(data){
        if(leaving){
          return;
        }else{
          toggleLeaving();
        }
        setBack(false)
        // 영화의 총 개수
        const totalMovies = data?.results.length;
        // 맨 마지막 페이지>> 올림을 설정을 하므로 잔여 영화 표시까지 보여줌
        // - 1 >> 첫 페이지의 page 값은 0이므로 올림 값에서 -1을 해줌
        const maxPage = Math.ceil(totalMovies / offset) - 1;
        // page값이 maxPage값과 같다면 0으로 설정 아니면 +1을 해줌
        setPage((prev) => prev === maxPage ? 0 : prev+1)}
      }
    const decresePage = () => {
        if(data){
          if(leaving){
            return;
          }else{
            toggleLeaving();
          }
          setBack(true)
          const totalMovies = data?.results.length;
          const maxPage = Math.ceil(totalMovies / offset) - 1;
          setPage((prev) => prev === 0 ? maxPage : prev-1)}
        }

    const toggleLeaving = () =>{
      setLeaving((prev) => !prev)
    }
    
    return (
        <Wrapper>
            {isLoading ? <Loader>불어오는 중입니다...</Loader> :
            (
              <>
                <Banner
                  bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>
                        {Number(data?.results[0].overview.length) > 200
                            ? `${data?.results[0].overview.slice(0,200)}...` 
                            : data?.results[0].overview}
                    </Overview>
                </Banner>
                <Slider>
                  {/* onExitComplete >> exit애니메이션이 끝났을 때 실행할 함수*/}
                  <AnimatePresence custom={back} initial = {false} onExitComplete={toggleLeaving}>
                    
                    <Row 
                      key = {page}
                      custom={back}
                      variants={rowVars}  
                      initial= "hidden"
                      animate = "visible"
                      transition ={
                      {
                        type: "tween", 
                        duration : 1,
                      }
                    }
                      exit="exit">
                      {
                        // 화면에 보여질 Box 컴포넌트는 6개(offset), 클릭시 page는 +1 하므로
                        // slice(0,6) >> slice(6,12) >> slice(12, 18) ... 로 data.results 배열값이 변하도록 설정
                        data?.results.slice(offset*page, offset*page+offset).map((movie) => (
                          <Box key = {movie.id}
                               //makeImagePath id : movie.backdrop_path, format : "w500"
                               bgPhoto={makeImagePath(movie.backdrop_path, "w500" || "")}
                               variants={boxVars}
                               whileHover="hover"
                               initial = "normal"
                               >
                            <Info variants={infoVars}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))
                      }
                    
                    </Row>
                    <SliderBtn onClick={incresePage} isRight ={true}>▶</SliderBtn>
                    <SliderBtn onClick={decresePage} isRight ={false}>◀</SliderBtn>
                  </AnimatePresence>
                </Slider>
              </>
            )
          }
        </Wrapper>

    )
}
export default Home;