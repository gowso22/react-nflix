import { motion } from "framer-motion";
import { IGetMoviesResult} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";



interface IResult{
   path : string | null;
   menu : string
   data ?: IGetMoviesResult | undefined;
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
    font-size: 13px;
  }
`;

const posterVars = {
  normal : {
    scale : 1,
  },
  hover : {
    scale : 1.2,
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

function SearchResult({data, path, menu}:IResult){
  const navigate = useNavigate();
  

  const onPosterClicked = (searchId : number) =>{
    navigate(`${process.env.PUBLIC_URL}/${path}/${searchId}`)
  }

  return(
        <Wrapper>
        {data?.total_pages === 0 ? null : (
          <Box>
            <Title>{menu}</Title>
            <ResultBox>
              {data?.results.map((d) => (
                <Poster
                  variants={posterVars}
                  initial = "normal"
                  whileHover="hover"
                  onClick={() => onPosterClicked(d.id)}
                  key={d.id}
                  style={{
                    backgroundImage: `url(${makeImagePath(
                      d.backdrop_path || d.poster_path
                    )})`,
                  }}
                >
                <Info variants={infoVars}>
                  <h4>{d.title || d.name}</h4>
                </Info>
                </Poster>
              ))}
            </ResultBox>
          </Box>
        )}
        
      </Wrapper>
    )
}

export default SearchResult;