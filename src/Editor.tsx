import { useEffect, useRef, useState } from "react";
import outputJson from "./mock/outputVueJson";
// import "./assets/main.scss";
import ChildEditor from "./components/childEditor";
import axios from "axios";
import "./userWorker";
import { relinkHeadCss, renderShadowDom } from "./utils";
import { initIndexDB, getData } from "./utils/indexDb";
import { observer } from "mobx-react-lite";
import mainStore from "../store";

function Editor(props: any) {
  console.log(props.codeInfo);
  const [curHtml, setCurHtml] = useState(null);
  const [curCss, setCurCss] = useState(null);
  const [curJs, setCurJs] = useState(null);
  const [curZoom, setCurZoom] = useState(null);
  const [curInfo, setCurInfo] = useState(null);
  const getChecked: any = useRef([]);
  const currentJs: any = useRef("");
  const currentCss: any = useRef("");
  const currentHtml: any = useRef("");
  const getRender = async () => {};
  const checkRender = () => {
    if (getChecked.current.length === 3) {
      // 利用shadowroot渲染编译结果
      //   renderShadowRoot();
      renderShadowDom(
        props.resource,
        {
          html: currentHtml.current,
          javascript: currentJs.current,
          css: currentCss.current,
        },
        props.id
      );
    }
  };
  const rootHeaderAddLink = (link: any) => {
    const { resource } = props;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    //replcace codepen src to local
    style.innerHTML = link.replaceAll(
      /https:\/\/assets.codepen.io\/\d{1,12}\//g,
      `${resource}/`
    );
    (document.head as any).appendChild(style);
  };
  const zoomThis = (type: any) => {
    setCurZoom(curZoom ? "" : type);
  };
  const initData = async () => {
    const { id, name, author, resource, codeInfo } = props;
    if (codeInfo) {
      currentHtml.current = codeInfo.codeSource.html;
      currentJs.current = codeInfo.codeSource.javascript;
      currentCss.current = codeInfo.codeSource.css;
      setCurHtml(codeInfo.codeSource.html);
      setCurJs(codeInfo.codeSource.javascript);
      setCurCss(codeInfo.codeSource.css);
      getChecked.current = Array.from(new Array(3)).map((e) => "done");
      checkRender();
      return;
    }
    axios(`/${resource}/index.html`).then((res) => {
      setCurHtml(res.data);
      getChecked.current.push("done");
      currentHtml.current = res.data;
      checkRender();
      //   setCurData(JSON.parse(res.data));
    });
    axios(`/${resource}/index.js`).then((res) => {
      setCurJs(res.data);
      getChecked.current.push("done");
      currentJs.current = res.data;
      checkRender();
      //   setCurData(JSON.parse(res.data));
    });
    axios(`/${resource}/index.css`).then((res) => {
      setCurCss(res.data);
      getChecked.current.push("done");
      currentCss.current = res.data;
      checkRender();
      //   setCurData(JSON.parse(res.data));
    });
  };
  useEffect(() => {
    initData();
  }, []);
  return (
    <div className="editor-mika-sample">
      <div
        className={`editor-mika-sample-html ${
          curZoom === "html" ? " zoomOn" : ""
        }`}
      >
        <span
          className="mika-mona-center-editor-header"
          onClick={(e) => {
            zoomThis("html");
          }}
        >
          html
        </span>
        <ChildEditor
          type="html"
          resource={props.resource}
          value={curHtml}
          fileId={props.id}
        />
      </div>
      <div
        className={`editor-mika-sample-css  ${
          curZoom === "css" ? " zoomOn" : ""
        }`}
      >
        <span
          className="mika-mona-center-editor-header"
          onClick={(e) => {
            zoomThis("css");
          }}
        >
          css
        </span>
        <ChildEditor
          type="css"
          resource={props.resource}
          value={curCss}
          fileId={props.id}
        />
      </div>
      <div
        className={`editor-mika-sample-js  ${
          curZoom === "js" ? " zoomOn" : ""
        }`}
      >
        <span
          className="mika-mona-center-editor-header"
          onClick={(e) => {
            zoomThis("js");
          }}
        >
          javascript
        </span>
        <ChildEditor
          type="javascript"
          resource={props.resource}
          value={curJs}
          fileId={props.id}
        />
      </div>
      <div
        className={`mika-mona-preview${curZoom === "preview" ? " zoomOn" : ""}`}
      >
        <span
          className="mika-mona-preview-header"
          onClick={(e) => {
            zoomThis("preview");
          }}
        >
          preview
        </span>
        <div className="shadow-result" id="shadowResult"></div>
      </div>
    </div>
  );
}

export default observer(Editor);
