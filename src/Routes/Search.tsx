import { useLocation } from "react-router-dom";
import { IGetMoviesResult, searchMovieResult, searchTvResult } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import SearchResult from "../ResultSearch/SearchResult";

const Wrapper = styled.div`
  margin-top: 100px;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Search(){
    const location = useLocation();
    // 가져온 location 값에서 keyword로 검색한 값만을 추출
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    // 검색한 keyword로 usequery를 사용하여 api데이터를 가져옴
    const { data: moviesData, isLoading: moviesLodaing } = useQuery<IGetMoviesResult>(["moviesearch", keyword], () =>searchMovieResult(keyword || ""));
    const { data: tvsData, isLoading: tvsLodaing } = useQuery<IGetMoviesResult>(["tvsearch", keyword], () => searchTvResult(keyword || ""));
    const isLoading = moviesLodaing || tvsLodaing;
    return (
        <Wrapper>
          <div>"{keyword}"(으)로 검색한 결과입니다. </div>
        {isLoading ? <Loader>불어오는 중입니다...</Loader> :
        (   <>
                <SearchResult path = {"movies"} menu = {"영화"} data = {moviesData}/>
                <SearchResult path = {"tv/tvs"} menu = {"TV 프로그램"} data = {tvsData}/>
            </>
            )}
        </Wrapper>
    )
}
export default Search;