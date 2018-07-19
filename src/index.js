import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import React from "react";
import ReactDOM from "react-dom";
import styled, { injectGlobal } from "styled-components";

injectGlobal`
  html, body, .root {
    padding: 0;
    margin: 0;
    width: 100vh;
    height: 100vw;
  }
`;

class App extends React.Component {
  state = { editorState: EditorState.createEmpty(), html: "" };

  render() {
    return (
      <Root>
        <Left>
          <WysiwygEditor
            editorState={this.state.editorState}
            onChange={newEditorState => {
              const contentState = newEditorState.getCurrentContent();
              const html = stateToHTML(contentState);
              this.setState({ editorState: newEditorState, html });
            }}
          />
        </Left>
        <Middle>
          <div>
            <button>→ text</button>
            <button>← wys</button>
          </div>
        </Middle>
        <Right>
          <Textarea
            value={this.state.html}
            onChange={event => {
              const value = event.target.value;
              this.setState({ html: value });
              try {
                const contentState = stateFromHTML(value);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
              } catch (e) {
                // ignore
                console.error("convert error", e);
              }
            }}
          />
        </Right>
      </Root>
    );
  }
}

class WysiwygEditor extends React.Component {
  editorRef = React.createRef("editor");

  componentDidMount() {
    this.editorRef.current.focus();
  }

  render() {
    return (
      <EditorContainer
        onClick={() => {
          this.editorRef.current.focus();
        }}
      >
        <Editor
          editorState={this.props.editorState}
          onChange={newEditorState => {
            // this.setState({ editorState: newEditorState });
            // console.log(this.props.editorState.toJS());
            this.props.onChange(newEditorState);
          }}
          ref={this.editorRef}
        />
      </EditorContainer>
    );
  }
}

const Root = styled.div`
  font-family: "Helvetica", sans-serif;
  height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex: 1;
  height: 100%;
`;

const Middle = styled.div`
  width: 40px;
  height: 100%;
  display: flex;
  background: #eee;
  justify-content: center;
  align-items: center;
`;

const Right = styled.div`
  flex: 1;
  height: 100%;
`;

const Textarea = styled.textarea.attrs({ spellCheck: false })`
  width: 100%;
  height: 80vh;
  font-size: 1.2em;
`;

const EditorContainer = styled.div`
  cursor: text;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const Button = styled.input`
  margin-top: 10px;
  text-align: center;
`;

// render
const root = document.createElement("div");
root.className = "root";
document.body.appendChild(root);
ReactDOM.render(<App />, root);
