declare module 'react-native-syntax-highlighter' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';
  
  export interface SyntaxHighlighterProps extends TextProps {
    highlighter?: string;
    language?: string;
    style?: any;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;

  export default SyntaxHighlighter;
}
