import Editor from "./Editor";
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import "./assets/main.scss";
import { initIndexDB, getData } from "./utils/indexDb";

// ignore monaco error rel:https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

export default function RootApp(props: any) {
  const [curEditorData, setCurEditorData] = useState<any>(null);
  const [codeStore, setCodeStore] = useState(null);
  const initEditorSourceData = async () => {
    const curData = {
      db: null,
      storeName: "mika-editor-store", //当前的数据库名
      version: 1, //版本号
    };
    // 获取当前代码信息
    const res: any = await axios(props.getlink || "/samplecode.json");
    const editorData = res.data?.[1] || {};
    // 根据代码id查询indexDB
    const curRequest = await initIndexDB(curData);
    let getResult = await getData(
      curRequest.db,
      "mika-editor-store",
      editorData.id
    );
    setCodeStore(getResult);
    (window as any)._curIndexDBInstance = curRequest;
    setCurEditorData(editorData);
  };
  useEffect(() => {
    initEditorSourceData();
  }, []);
  return (
    (curEditorData && <Editor {...curEditorData} codeInfo={codeStore} />) || (
      <div className="editor-loading"></div>
    )
  );
}
