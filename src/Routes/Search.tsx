import { useLocation } from "react-router-dom";

function Search(){
    const location = useLocation();
    // 가져온 location 값에서 keyword로 검색한 값만을 추출
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    
    return null
}
export default Search;