import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath, makePosterPath } from "../utils";
import {  IDetialMovie, IGetMoviesResult, getTvDetail} from "../api";
import { useQuery } from "react-query";

// 스타일 컴포넌트 파트
const Slider = styled.div`
  position: relative;
  top : -50px;
  margin-bottom: 300px;
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
  font-size: 35px;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  cursor: pointer;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: 99;
`;

const DetailMovie = styled(motion.div)`
  position: fixed;
  width: 800px;
  height: 900px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${props => props.theme.black.lighter};
  border-radius: 15px;
  z-index: 99;
  overflow: hidden;
`;
// styled.img 태그를 쓰면 옆에 하얀 실선이 보임 >> div로 고침
const DetailCover = styled.div<{bgImg : string}>`
  width : 100%;
  height : 300px;
  background-position: center center;
  background-size: cover;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImg});
`;

const DetailTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  text-align: left;
  font-size: 35px;
  padding: 15px;
  position: relative;
  top: -20px;
  font-weight: bold;
`;


const DetailOverview = styled.p`
  position: relative;
  top: -70px;
  font-size : 15px;
  padding: 15px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 135%;
`;

const DetailPoster = styled.div<{bgPoster : string}>`
  width: 250px;
  height: 380px;
  background-color: white;
  position: relative;
  top : -50px;
  float: right;
  margin-right: 20px;
  border-radius: 5px;
  background-size: cover;
  background-image: url(${(props) => props.bgPoster});
`;
const DetailLogo = styled.img<{bgLogo : string}>`
  position: relative;
  top: -50px;
  width: 80px;
  height: 30px;
  margin: 0 10px;
  background-size : contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) => props.bgLogo});
`;
const GenreTag = styled.span`
  position: relative;
  top: -170px;
  left: 0;
  opacity: 0.7;
  margin-left: 10px;
  background-color: #273c75;
  padding: 5px 10px;
  border-radius: 10px;
`;
const ReleaseTag = styled.div`
  width: 13%;
  text-align: center;
  position: relative;
  top: -190px;
  left: 0;
  opacity: 0.7;
  margin-left: 10px;
  background-color: #273c75;
  padding: 5px 10px;
  border-radius: 10px;
`
const SpanTag = styled.span`
  opacity: 0.7;
  margin-left: 10px;
  background-color: #030a1b;
  padding: 5px 10px;
  border-radius: 10px;
`
const RateDiv =styled.div`
  position: relative;
  top: -20px;
  margin-left: 20px;
`
const SliderTitle = styled.span`
    font-size: 25px;
    font-weight: bold;
    margin-left: 40px;
`;

// 애니메이션 파트
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
  const detailVars = {
    start : {scale : 0},
    visible : { scale : 1},
    exit : {
      scale : 0,
      transition : {
        duration : 0,
      }
    }
  }
interface ISlider {
  title : string,
  data  ?: IGetMoviesResult 
}


function TvSlider({title, data} :ISlider){
     
      // Row 컴포넌트가 사라지고 다시 생겨날때 Box들이 겹쳐보이는 것을 방지하기위해 leaving state 설정
      const [leaving, setLeaving] = useState(false);
      const [page, setPage] = useState(0);
      const [back, setBack] = useState(false);
  
  
      const navigate = useNavigate();
      const bigMovieMatch: PathMatch<string> | null = useMatch(`${process.env.PUBLIC_URL}/tv/tvs/:id`)
      
      
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
      const onBoxClicked = (movieId : number) => {
        navigate(`${process.env.PUBLIC_URL}/tv/tvs/${movieId}`); // /movies/가져온 movie데이터 id로 이동
      }
      const onOverlayClick = () => {
        navigate(-1);
      }
      
      const detailTvId = bigMovieMatch?.params.id;
      const {data:detailShow} = useQuery<IDetialMovie>(["tv", detailTvId], ()=>getTvDetail(detailTvId as any))
     
      
  return(
        <>
          
            <Slider>
                <SliderTitle>{title}</SliderTitle>
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
                               onClick={() => onBoxClicked(movie.id)}
                               //makeImagePath id : movie.backdrop_path, format : "w500"
                               bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                               variants={boxVars}
                               whileHover="hover"
                               initial = "normal"
                               >
                            <Info variants={infoVars}>
                              <h4>{movie.name}</h4>
                            </Info>
                          </Box>
                        ))
                      }
                    
                    </Row>
                    <SliderBtn onClick={incresePage} isRight ={true}>▶</SliderBtn>
                    <SliderBtn onClick={decresePage} isRight ={false}>◀</SliderBtn>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                {bigMovieMatch ? (
                <>
                 <Overlay 
                  onClick={onOverlayClick} 
                  animate ={{ opacity : 1}}
                  exit={{opacity : 0}}
                  />
                 <DetailMovie
                    variants={detailVars}
                    initial = "start"
                    animate = "visible"
                    exit = "exit"
                >{
                    detailShow && <>
                    <DetailCover bgImg = {makeImagePath(detailShow.backdrop_path)}/>
                    <DetailPoster bgPoster = {makePosterPath(detailShow.poster_path)}></DetailPoster>
                    <DetailTitle>{detailShow.name}</DetailTitle>
                    <ReleaseTag>{detailShow.first_air_date}</ReleaseTag>
                    {detailShow.genres.map((g)=> <GenreTag>{g.name} </GenreTag>) }
                    <DetailOverview>{detailShow.overview}</DetailOverview>
                    {detailShow.production_companies
                    .map((p) => 
                   
                      <DetailLogo bgLogo = { makeImagePath(p.logo_path, "w200")}></DetailLogo>
                    
                   )}
                   <RateDiv>평점 : <SpanTag>{detailShow.vote_average.toFixed(1)}</SpanTag></RateDiv>
                  </>
                }</DetailMovie>
                </> ) : null}
                </AnimatePresence>
            </>

  )

}

export default TvSlider;