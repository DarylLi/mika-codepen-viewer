import { toJS } from "mobx";
import { addData, updateData, getData } from "./indexDb";
export var fromArray2Object = function (arr) {
  var result = {};
  try {
    arr.forEach(function (e) {
      if (e.filename) {
        result[e.filename] =
          (e.children && e.children.length) > 0
            ? { directory: fromArray2Object(e.children) }
            : { file: { contents: e.value } };
      }
    });
  } catch (error) {
    console.log(error);
  }
  return result;
};

// 解决shadow root 使用@import 'font-face'失效问题,转为根html head加载
export const relinkHeadCss = (url) => {
  return url.split(";").filter((str) => /@import url\(.*\)/.test(str));
};

/**
 * ## throttle
 * **/

export function getThrottle(fn, timer) {
  let canRun = true;
  function result(...args) {
    if (canRun) {
      fn.call(this, ...args);
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, timer);
    }
  }
  return result;
}

/**
 * ## debouce
 * **/

export function getDebounce(fn, timer) {
  let debounceOut = null;
  function result(...args) {
    window.clearTimeout(debounceOut);
    debounceOut = setTimeout(() => {
      fn.call(this, ...args);
    }, timer);
  }
  return result;
}

const rootHeaderAddLink = (resource, link) => {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  //replcace codepen src to local
  style.innerHTML = link.replaceAll(
    /https:\/\/assets.codepen.io\/\d{1,12}\//g,
    `${resource}/`
  );
  document.head.appendChild(style);
};
// render shadow dom
export const renderShadowDom = (resourceLink, codeObj, fileId) => {
  window._curIndexDBInstance &&
    (async () => {
      let getResult = await getData(
        window._curIndexDBInstance.db,
        "mika-editor-store",
        fileId
      );
      let curDBData = {
        id: fileId,
        name: fileId,
        codeSource: toJS(codeObj),
      };
      if (getResult) {
        updateData(
          window._curIndexDBInstance.db,
          "mika-editor-store",
          curDBData
        );
      } else {
        addData(window._curIndexDBInstance.db, "mika-editor-store", curDBData);
      }
    })();
  if (
    window?._window?.["__editorTimeoutList__"] ||
    window?._window?.["__editorIntervalList__"]
  ) {
    (_window["__editorTimeoutList__"] || []).forEach((id) => {
      _window.clearTimeout(id);
    });
    (_window["__editorIntervalList__"] || []).forEach((id) => {
      _window.clearInterval(id);
    });
    _window["__editorIntervalList__"] = [];
    _window["__editorTimeoutList__"] = [];
  }
  // window Interval Timeout注册id登记事件，重新渲染时清空
  // 创建临时window对象防止codepen内容影响全局
  const _setInterval = window.setInterval;
  const _setTimeout = window.setTimeout;
  const _clearInterval = window.clearInterval;
  const _clearTimeout = window.clearTimeout;
  if (!window._window) {
    let _window = {};
    _window["__editorTimeoutList__"] = [];
    _window["__editorIntervalList__"] = [];
    // _window["wawawa"] = 666;
    _window.setInterval = function (fn, timer) {
      let curInterval = _setInterval(fn, timer);
      _window[`__editorIntervalList__`].push(curInterval);
    };
    _window.clearInterval = function (id) {
      try {
        _clearInterval(id);
      } catch (error) {
        console.log(error);
      }
    };
    _window.setTimeout = function (fn, timer) {
      let curTimeout = _setTimeout(fn, timer);
      _window[`__editorTimeoutList__`].push(curTimeout);
    };
    _window.clearTimeout = function (id) {
      try {
        _clearTimeout(id);
      } catch (error) {
        console.log(error);
      }
    };
    _window = new Proxy(_window, {
      get(obj, props) {
        if (obj[props]) return obj[props];
        else {
          return typeof window[props] === "function"
            ? function (...args) {
                window[props](...args);
              }.bind(window)
            : window[props];
        }
      },
    });

    window._window = _window;
  }

  // const { resource } = props;
  // shadow root节点
  let shadowRoot = document.getElementById("shadowResult");

  !window["innerShadowRoot"]
    ? (() => {
        shadowRoot = shadowRoot.attachShadow({ mode: "open" });
      })()
    : (() => {
        shadowRoot.shadowRoot.innerHTML = "";
        shadowRoot = shadowRoot.shadowRoot;
      })();
  window["innerShadowRoot"] = true;
  // render css style
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  //replcace codepen src to local
  style.innerHTML = codeObj.css.replaceAll(
    /https:\/\/assets.codepen.io\/\d{1,12}\//g,
    `${resourceLink}/`
  );
  rootHeaderAddLink(resourceLink, relinkHeadCss(codeObj.css).join(";"));
  // shadowRoot.appendChild(style);
  // // render html
  const htmlDom = document.createElement("html");
  const headDom = document.createElement("head");
  headDom.appendChild(style);
  const bodyDom = document.createElement("body");
  // htmlDom.appendChild(headDom);
  htmlDom.appendChild(style);
  shadowRoot.appendChild(htmlDom);
  bodyDom.innerHTML = codeObj.html;
  // // render js content
  const jscontent = document.createElement("script");
  let js = codeObj.javascript.replaceAll(
    /https:\/\/assets.codepen.io\/\d{1,12}\//g,
    `${resourceLink}/`
  );
  js = js
    .replaceAll(/setInterval|setTimeout/g, (match) => `_window.${match}`)
    .replaceAll(/document.body|document.html/g, (match) => `_${match}`);
  let IIFEJS = `((window)=>{
    var _editorBody = document.getElementById("shadowResult").shadowRoot.querySelectorAll('body')[0];
    var _editorHTML = document.getElementById("shadowResult").shadowRoot.querySelectorAll('html')[0];
    let _document = {body:_editorBody,html:_editorHTML};
    ${js}
  })(_window)`;
  jscontent.innerHTML = IIFEJS; //js;
  bodyDom.appendChild(jscontent);
  htmlDom.appendChild(bodyDom);
  // if (!shadowRoot.shadowRoot) shadowRoot = shadowRoot.shadowRoot;
};
