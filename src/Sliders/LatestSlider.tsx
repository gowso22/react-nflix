import { motion } from "framer-motion";
import styled from "styled-components";

const Slider = styled.div`
  position: relative;
  top : 300px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 40px;
`;

const Box = styled(motion.div)`
  background-color: rgba(255,255,255,0.8);
  background-size: cover;
  height: 200px;
  color: red;
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
const SliderTitle = styled.span`
    font-size: 25px;
    margin-left : 40px;
`;


function LastestSlider(){
 return(
    <>
        <Slider>
            <SliderTitle> 최신 영화 </SliderTitle>
                <Row>
                    <Box></Box>
                    <Box></Box>
                    <Box></Box>
                    <Box></Box>
                    <Box></Box>
                    <Box></Box>
                </Row>
                    <SliderBtn isRight ={true}>▶</SliderBtn>
                    <SliderBtn isRight ={false}>◀</SliderBtn>
        </Slider>
    </>
 )
}

export default LastestSlider;
