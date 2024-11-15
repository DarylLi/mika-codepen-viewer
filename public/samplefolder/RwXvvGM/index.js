const pre = document.createElement("pre");
document.body.appendChild(pre);
pre.setAttribute("role", "img");
pre.setAttribute(
  "aria-label",
  "animated noise; an ascii art with block chars displaying an animated mix of sines and cosines, using block chars"
);

const colors = ["#000", "#007", "#00f", "#07f", "#0ff", "#fff"];
const minusColors = ["#000", "#700", "#f00", "#f07", "#f0f", "#fff"];
const values = " ▝▞▟▟█";
// const values = " ░▒▓██"
// const values = ' .:oOH'

let w,
  h,
  t = 0;

function tixy(t, i, x, y) {
  t = t * 2e-3;
  x *= 0.5 * (0.5 + 0.25 * Math.sin(t * 0.01));
  y *= 0.5 * (0.5 + 0.25 * Math.sin(t * 0.01));

  const n1 = 0.6 + 0.4 * Math.sin(x * 0.2) * Math.cos(y * 0.2);

  return (
    n1 *
    Math.sin(x * 0.7 + t - Math.sin(y + t * 0.1 + Math.cos(x + t * 1e-3))) *
    Math.cos(y * 0.5 + t + Math.sin(x + t * 0.1 - Math.cos(y + t)))
  );
}

function paint() {
  h = Math.round(innerHeight / 20);
  w = Math.round(innerWidth / 10);
  let result = "";
  t = Math.floor(performance.now());
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let r = tixy(t, i, x, y);
      let v = (Math.min(1, Math.max(-1, Math.abs(r))) * values.length) | 0;
      let cv = r < 0 ? minusColors[v] : colors[v];

      result +=
        '<span style="color:' +
        (cv ?? "#000") +
        '">' +
        (values[v] ?? " ") +
        "</span>";
    }
    result += "\n";
  }
  pre.innerHTML = result;
}

window.addEventListener("resize", paint, false);

const loop = () => {
  requestAnimationFrame(loop);
  paint();
};

loop();
