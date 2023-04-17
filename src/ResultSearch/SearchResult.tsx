import { motion } from "framer-motion";
import { IGetMoviesResult, IGetTvResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";


interface IResult{
   search : string | null;
   menu : string
   data? : IGetMoviesResult | IGetTvResult
}

const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ResultBox = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
`;

const Poster = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  width: 200px;
  height: 200px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  margin : 10px;
  border-radius: 5px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled(motion.span)`
  display: block;
  padding: 10px 10px;
  font-size: 35px;
  font-weight: bold;
  width: 100%;
  color: ${props => props.theme.white.lighter};
  opacity: 1;
`;


function SearchResult({data, search, menu}:IResult){
    return(
        <Wrapper>
        {data?.total_pages === 0 ? null : (
          <Box>
            <Title>{menu}</Title>
            <ResultBox>
              {data?.results.map((d) => (
                <Poster
                  key={d.id}
                  style={{
                    backgroundImage: `url(${makeImagePath(
                      d.backdrop_path || d.poster_path
                    )})`,
                  }}
                >
                </Poster>
              ))}
            </ResultBox>
          </Box>
        )}
      </Wrapper>
    )
}

export default SearchResult;