import { useEffect, useState } from "react";
import "./App.css";
import { WebContainer } from "@webcontainer/api";
import { fromArray2Object } from "./utils/index";
import outputJson from "./mock/outputVueJson";
// import outputJson from "./mock/outputVanillaJson";
// import outputJson from "./mock/outputReactJson";
console.log(outputJson);
function App() {
  const initWebContainer = async () => {
    // Call only once
    const webcontainerInstance = await WebContainer.boot();
    // window._webcontainerInstance = webcontainerInstance;
    const nodeV = await webcontainerInstance.spawn("node", ["-v"]);
    nodeV.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("node -v ==>", data);
        },
      })
    );

    await webcontainerInstance.mount(
      fromArray2Object((outputJson as any)["exportFile"])
    );
    // ls file path
    let ls = await webcontainerInstance.spawn("ls", ["-l"]);
    ls.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("ls -l:", data);
        },
      })
    );
    // let cd = await webcontainerInstance.spawn("cd", ["react"]);

    // install file
    const install = await webcontainerInstance.spawn("npm", ["install"]);
    install.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    // error catxh
    let code = await install.exit;
    if (code !== 0) return console.error("install fail");
    // run dev
    console.log("npm run dev", code);
    const process = await webcontainerInstance.spawn("npm", ["run", "dev"]);
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    // 5. 监听服务启动
    webcontainerInstance.on("server-ready", (port, url) => {
      console.log("server-ready", url);
      const iframe: HTMLIFrameElement | null =
        document.querySelector("#webcontainer-view");
      iframe &&
        (() => {
          iframe.src = url;
        })();
    });
  };
  useEffect(() => {
    initWebContainer();
  }, []);
  return (
    <>
      <h1>render by webcontainer！</h1>
      <iframe id="webcontainer-view"></iframe>
    </>
  );
}

export default App;
