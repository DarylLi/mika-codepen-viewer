import React, { useState, useEffect, useRef, useMemo } from "react";
import mainStore from "../../store";
import MonacoEditor from "react-monaco-editor";
import { getDebounce, renderShadowDom } from "@/utils";
function MainEditor(props: any) {
  const [code, setCode] = useState(props.value);
  // const [cursocket, setCurSocket] = useState(null as any);
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus();
  };
  const onChange = (newValue: any, e: any) => {
    // editStore.updateCode(newValue || "");
    // setCode(newValue);
    mainStore.setCode(props.type, newValue);
    setTimeout(() => {
      renderShadowDom(props.resource, mainStore.code, props.fileId);
    });
  };
  const options = {
    selectOnLineNumbers: true,
    // lineNumbers: lineNumbersFunc,
  };
  const debounceHandle: any = useMemo(() => getDebounce(onChange, 1500), []);
  useEffect(() => {
    mainStore.setCode(props.type, props.value);
    setCode(props.value);
  }, [props.value]);
  return (
    <div className="mika-mona-center-editor">
      <MonacoEditor
        height="400"
        width="400"
        language={props.type || "javascript"}
        theme={props.theme || "vs-dark"}
        value={code}
        options={options}
        onChange={(e) => {
          debounceHandle(e);
        }}
        editorDidMount={editorDidMount}
      ></MonacoEditor>
    </div>
  );
}
export default MainEditor;
