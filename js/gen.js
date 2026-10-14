// Endless drills. Each generator returns a fresh multiple-choice question: { q, c, a, why }.

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// Build a question from the right answer + a pool of wrong ones (deduped, 4 choices).
function mc(q, right, wrongPool, why) {
  const wrong = shuffle([...new Set(wrongPool.map(String))].filter((w) => w !== String(right))).slice(0, 3);
  const c = shuffle([String(right), ...wrong]);
  return { q, c, a: c.indexOf(String(right)), why };
}

/* ---------- unit circle ---------- */
const ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const RAD = { 0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π", 210: "7π/6", 225: "5π/4", 240: "4π/3", 270: "3π/2", 300: "5π/3", 315: "7π/4", 330: "11π/6" };
const REF = { 0: ["0", "1", "0"], 30: ["1/2", "√3/2", "√3/3"], 45: ["√2/2", "√2/2", "1"], 60: ["√3/2", "1/2", "√3"], 90: ["1", "0", "undefined"] };
const neg = (v) => (v === "0" || v === "undefined" ? v : v.startsWith("−") ? v.slice(1) : `−${v}`);
export function trig(deg, fn) {
  const quad = deg % 90 === 0 ? 0 : Math.floor(deg / 90) + 1;
  const ref = quad === 0 ? (deg % 180 === 0 ? 0 : 90) : [0, deg, 180 - deg, deg - 180, 360 - deg][quad];
  const i = { sin: 0, cos: 1, tan: 2 }[fn];
  let v = REF[ref][i];
  // signs: sin + in I, II; cos + in I, IV; tan + in I, III
  const x = Math.round(Math.cos((deg * Math.PI) / 180) * 1e9), y = Math.round(Math.sin((deg * Math.PI) / 180) * 1e9);
  const sign = fn === "sin" ? Math.sign(y) : fn === "cos" ? Math.sign(x) : Math.sign(y) * Math.sign(x);
  if (sign < 0) v = neg(v);
  return { v, quad, ref };
}
const VALUES = ["0", "1", "−1", "1/2", "−1/2", "√2/2", "−√2/2", "√3/2", "−√3/2", "√3/3", "−√3/3", "√3", "−√3", "undefined"];

export const DRILLS = [
  {
    id: "uc-values", title: "Unit circle values", icon: "◐", deck: "l0", desc: "sin, cos and tan at every special angle",
    make() {
      const deg = pick(ANGLES), fn = pick(["sin", "cos", "sin", "cos", "tan"]);
      const useRad = Math.random() < 0.7;
      const { v, quad, ref } = trig(deg, fn);
      const where = quad ? `QIV QIII QII QI`.split(" ")[4 - quad] + `, reference angle ${ref}°` : "on an axis";
      const pool = fn === "tan" ? ["0", "1", "−1", "√3", "−√3", "√3/3", "−√3/3", "undefined"] : VALUES.filter((x) => x !== "√3" && x !== "−√3" && x !== "undefined");
      return mc(`${fn}(${useRad ? RAD[deg] : `${deg}°`}) = ?`, v, pool, `${useRad ? `${RAD[deg]} = ${deg}°, ` : ""}${where} → ${fn} = ${v}`);
    },
  },
  {
    id: "uc-convert", title: "Degrees ⇄ radians", icon: "π", deck: "l0", desc: "Convert the special angles both ways",
    make() {
      const deg = pick(ANGLES.filter((d) => d)), toRad = Math.random() < 0.5;
      if (toRad) return mc(`${deg}° in radians is:`, RAD[deg], ANGLES.filter((d) => d && d !== deg).map((d) => RAD[d]), `${deg} × π/180 = ${RAD[deg]}`);
      return mc(`${RAD[deg]} in degrees is:`, `${deg}°`, ANGLES.filter((d) => d && d !== deg).map((d) => `${d}°`), `${RAD[deg]} × 180/π = ${deg}°`);
    },
  },
  {
    id: "uc-quadrant", title: "Quadrants & reference angles", icon: "✚", deck: "l0", desc: "ASTC signs and reference angles",
    make() {
      if (Math.random() < 0.5) {
        const deg = pick([120, 135, 150, 210, 225, 240, 300, 315, 330, 100, 200, 290, 160, 250]);
        const q = Math.floor(deg / 90) + 1, ref = [0, deg, 180 - deg, deg - 180, 360 - deg][q];
        return mc(`The reference angle for ${deg}° is:`, `${ref}°`, [`${180 - (ref)}°`, `${90 - ref}°`, `${deg - 90}°`, `${ref + 30}°`, `${360 - deg + 90}°`].filter((x) => !x.startsWith("-")), `Q${["", "I", "II", "III", "IV"][q]}: ${["", "θ", "180° − θ", "θ − 180°", "360° − θ"][q]} = ${ref}°`);
      }
      const cases = [["sin > 0 and cos < 0", "II"], ["sin < 0 and cos < 0", "III"], ["sin < 0 and cos > 0", "IV"], ["tan > 0 and sin < 0", "III"], ["tan < 0 and cos > 0", "IV"], ["tan < 0 and sin > 0", "II"], ["all three are positive", "I"]];
      const [cond, ans] = pick(cases);
      return mc(`If ${cond}, θ is in quadrant:`, ans, ["I", "II", "III", "IV"], "ASTC: QI all · QII sin · QIII tan · QIV cos");
    },
  },
  {
    id: "polygons", title: "Polygon angles", icon: "⬡", deck: "l2", desc: "Interior and exterior angle formulas",
    make() {
      const names = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon", 15: "15-gon", 20: "20-gon" };
      const n = pick(Object.keys(names).map(Number)), kind = pick(["each", "sum", "ext", "sides"]);
      const sum = (n - 2) * 180, each = sum / n, ext = 360 / n;
      const fmtA = (x) => `${Math.round(x * 100) / 100}°`;
      if (kind === "each") return mc(`Each interior angle of a regular ${names[n]} is:`, fmtA(each), [fmtA(ext), fmtA(sum / (n + 1)), fmtA(((n - 1) * 180) / n), fmtA(180 - ext / 2), fmtA(each + 10)], `(${n} − 2)·180/${n} = ${fmtA(each)}`);
      if (kind === "sum") return mc(`The interior angles of a ${names[n]} add up to:`, `${sum}°`, [`${sum + 180}°`, `${sum - 180}°`, `${n * 180}°`, "360°"], `(${n} − 2)·180 = ${sum}°`);
      if (kind === "ext") return mc(`Each exterior angle of a regular ${names[n]} is:`, fmtA(ext), [fmtA(each), fmtA(360 / (n - 1)), fmtA(180 / n), fmtA(ext * 2)], `360/${n} = ${fmtA(ext)}`);
      return mc(`A polygon's interior angles add up to ${sum}°. How many sides?`, `${n}`, [`${n - 2}`, `${n + 2}`, `${n - 1}`, `${n + 1}`], `(n − 2)·180 = ${sum} → n − 2 = ${n - 2} → n = ${n}`);
    },
  },
  {
    id: "special", title: "Special right triangles", icon: "◺", deck: "l2", desc: "45-45-90 and 30-60-90 sides",
    make() {
      const k = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
      const t = pick(["45leg", "45hyp", "30hyp", "30short", "30long"]);
      if (t === "45leg") return mc(`A 45-45-90 triangle has legs of ${k}. The hypotenuse is:`, `${k}√2`, [`${k}√3`, `${2 * k}`, `${k}/√2`, `${k}`], "Hypotenuse = leg × √2");
      if (t === "45hyp") return mc(`A 45-45-90 triangle has hypotenuse ${2 * k}√2. Each leg is:`, `${2 * k}`, [`${k}`, `${2 * k}√2`, `${k}√2`, `${4 * k}`], "Leg = hypotenuse ÷ √2");
      if (t === "30hyp") return mc(`A 30-60-90 triangle has hypotenuse ${2 * k}. The longer leg is:`, `${k}√3`, [`${k}`, `${2 * k}√3`, `${k}√2`, `${2 * k}`], `Short leg = ${2 * k}/2 = ${k}; long leg = ${k}√3`);
      if (t === "30short") return mc(`In a 30-60-90 triangle the side opposite 30° is ${k}. The hypotenuse is:`, `${2 * k}`, [`${k}√3`, `${k}√2`, `${3 * k}`, `${k}`], "Hypotenuse = 2 × short leg");
      return mc(`In a 30-60-90 triangle the longer leg is ${k}√3. The short leg is:`, `${k}`, [`${k}√3`, `${2 * k}`, `${3 * k}`, `${k}/2`], "Long leg = short leg × √3, so short leg = " + k);
    },
  },
  {
    id: "pythag", title: "Pythagorean theorem", icon: "²", deck: "l2", desc: "Missing sides and triples",
    make() {
      const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29]]);
      const m = pick([1, 1, 2, 3]), A = a * m, B = b * m, C = c * m;
      if (Math.random() < 0.5) return mc(`A right triangle has legs ${A} and ${B}. The hypotenuse is:`, `${C}`, [`${A + B}`, `${C + m}`, `${C - m}`, `${B + 1}`], `${A}² + ${B}² = ${A * A + B * B} = ${C}²`);
      return mc(`A right triangle has hypotenuse ${C} and one leg ${A}. The other leg is:`, `${B}`, [`${C - A}`, `${B + m}`, `${B - m}`, `${A + 1}`], `${C}² − ${A}² = ${C * C - A * A} = ${B}²`);
    },
  },
  {
    id: "scale", title: "Similarity & scale factor", icon: "⤢", deck: "l2", desc: "Perimeter ×k, area ×k², volume ×k³",
    make() {
      const [p, q] = pick([[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [3, 5]]);
      const kind = pick(["area", "vol", "perim"]);
      const base = pick([4, 8, 12, 16, 18, 24, 27]) * (kind === "vol" ? p ** 3 : kind === "area" ? p * p : p);
      const pow = kind === "vol" ? 3 : kind === "area" ? 2 : 1;
      const ans = (base * q ** pow) / p ** pow;
      const word = { area: "area", vol: "volume", perim: "perimeter" }[kind];
      const solid = kind === "vol" ? "solids" : "figures";
      const r = (x) => `${Math.round(x * 100) / 100}`;
      return mc(`Two similar ${solid} have side ratio ${p}:${q}. The small one has ${word} ${base}. The large one's ${word} is:`, r(ans),
        [r((base * q) / p), r((base * q * q) / (p * p)), r((base * q ** 3) / p ** 3), r(ans * 2), r(ans / 2), r(ans + base)].filter((x) => x !== r(ans)),
        `Ratio^${pow}: ${base} × (${q}/${p})${pow > 1 ? (pow === 2 ? "²" : "³") : ""} = ${r(ans)}`);
    },
  },
  {
    id: "sets", title: "Counting with sets", icon: "∪", deck: "l1", desc: "Inclusion–exclusion and subsets",
    make() {
      if (Math.random() < 0.4) {
        const n = pick([3, 4, 5, 6, 7]);
        return Math.random() < 0.5
          ? mc(`How many subsets does a set with ${n} elements have?`, `${2 ** n}`, [`${2 ** n - 1}`, `${n * n}`, `${2 * n}`, `${2 ** (n - 1)}`], `2^${n} = ${2 ** n}`)
          : mc(`How many rows does a truth table with ${n} variables need?`, `${2 ** n}`, [`${2 * n}`, `${n * n}`, `${2 ** n - 1}`, `${n + 1}`], `2^${n} = ${2 ** n}`);
      }
      const both = pick([3, 4, 5, 6, 8, 10]), a = both + pick([5, 7, 9, 12, 14]), b = both + pick([4, 6, 8, 11, 13]);
      const total = a + b - both + pick([4, 6, 8, 10, 12]);
      if (Math.random() < 0.5) return mc(`In a class, ${a} take algebra, ${b} take geometry and ${both} take both. How many take at least one?`, `${a + b - both}`, [`${a + b}`, `${a + b - 2 * both}`, `${a + b + both}`, `${a - both}`], `${a} + ${b} − ${both} = ${a + b - both}`);
      return mc(`${total} students: ${a} take algebra, ${b} take geometry, ${both} take both. How many take neither?`, `${total - (a + b - both)}`, [`${total - a - b}`, `${total - (a + b - both) + both}`, `${total - a}`, `${both}`].filter((x) => +x >= 0), `${total} − (${a} + ${b} − ${both}) = ${total - (a + b - both)}`);
    },
  },
];
