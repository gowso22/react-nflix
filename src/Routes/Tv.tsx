import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IGetMoviesResult, getOnTheAirTvs, getRateTvs, getTodayTvs, getpopularTvs } from "../api";
import TvSlider from "../Sliders/TvSlider";




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


function Tv(){
    const {data:onairDate, isLoading : onAirLoading} = useQuery<IGetMoviesResult>(["tvs", "ontheair"], getOnTheAirTvs)
    const {data:todayData, isLoading : todayLoading} = useQuery<IGetMoviesResult>(["tvs", "today"], getTodayTvs)
    const {data:popularTvData, isLoading : popularLoading} = useQuery<IGetMoviesResult>(["tvs", "popularTv"], getpopularTvs)
    const {data:TopRateData, isLoading : topRateLoading} = useQuery<IGetMoviesResult>(["tvs", "topRateTv"], getRateTvs)

    const isLoading = onAirLoading && todayLoading && popularLoading && topRateLoading
    return (
        <Wrapper>
            {isLoading ? <Loader>불어오는 중입니다...</Loader> :
            (
              <>
                <Banner
                  bgPhoto={makeImagePath(onairDate?.results[0].backdrop_path || "")}>
                    <Title>{onairDate?.results[0].name}</Title>
                    <Overview>
                        {Number(onairDate?.results[0].overview.length) > 200
                            ? `${onairDate?.results[0].overview.slice(0,200)}...` 
                            : onairDate?.results[0].overview}
                    </Overview>
                </Banner>
                <TvSlider  title={'ON TH AIR!'} data={onairDate}/>
                <TvSlider  title={'TODAY~'} data={todayData}/>
                <TvSlider  title={'TOP_RATE'} data={TopRateData}/>    
                <TvSlider  title={'POPULAR'} data={popularTvData}/>
              </>
            )
          }
        </Wrapper>
    )
}
export default Tv;