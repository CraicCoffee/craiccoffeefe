import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import CardToolBar from './CardToolbar';
import syntaxTheme from './HLTheme';

export class CodeBox extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  };

  static defaultProps = {
    language: null,
  };

  state = {
    codeExpand: false,
  };

  exapandCallBack = () => {
    this.setState({ codeExpand: !this.state.codeExpand });
  };

  render() {
    const { language, value } = this.props;
    return (
      <React.Fragment>
        <CardToolBar code={value} expand={this.exapandCallBack} isExpand={this.state.codeExpand} />
        <div className={`code-box-highlight ${this.state.codeExpand ? 'd-block' : 'd-none'}`}>
          <SyntaxHighlighter language={language} style={syntaxTheme}>
            {value}
          </SyntaxHighlighter>
        </div>
      </React.Fragment>
    );
  }
}

export default CodeBox;
