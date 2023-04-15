// styled.d.ts >> declaration(선언)파일(d.ts)
import 'styled-components';


declare module 'styled-components' {
  export interface DefaultTheme {
    red: string;

    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    
    white: {
      darker: string;
      lighter: string;
    };
  }
}
