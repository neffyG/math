// Your NES 304 Quizlet set (208 cards), split into topic decks in the original order.
// |x| was written abs(x) in the export and is shown as |x| here.
export const QUIZLET = [
 {
  "id": "qa",
  "title": "Unit circle",
  "short": "Unit circle",
  "icon": "π",
  "color": "#4E8FD8",
  "group": "quizlet",
  "cards": [
   {
    "t": "Degrees to radians",
    "d": "Multiply by π/180 (180° = π)"
   },
   {
    "t": "Radians to degrees",
    "d": "Multiply by 180/π"
   },
   {
    "t": "Unit circle point for angle θ",
    "d": "(cos θ, sin θ): cos = x, sin = y"
   },
   {
    "t": "sin π/6, cos π/6, tan π/6",
    "d": "1/2, √3/2, √3/3"
   },
   {
    "t": "sin π/4, cos π/4, tan π/4",
    "d": "√2/2, √2/2, 1"
   },
   {
    "t": "sin π/3, cos π/3, tan π/3",
    "d": "√3/2, 1/2, √3"
   },
   {
    "t": "ASTC",
    "d": "QI all positive; QII sin positive; QIII tan positive; QIV cos positive"
   },
   {
    "t": "Reference-angle families",
    "d": "/6: π/6, 5π/6, 7π/6, 11π/6 | /4: π/4, 3π/4, 5π/4, 7π/4 | /3: π/3, 2π/3, 4π/3, 5π/3"
   },
   {
    "t": "csc, sec, cot",
    "d": "1/sin, 1/cos, 1/tan"
   },
   {
    "t": "sin, cos, tan for a point (x, y) not on the unit circle",
    "d": "r = √(x² + y²); sin = y/r, cos = x/r, tan = y/x"
   },
   {
    "t": "Arc length",
    "d": "s = rθ (θ in radians)"
   },
   {
    "t": "Sector area",
    "d": "½r²θ (θ in radians)"
   }
  ],
  "questions": []
 },
 {
  "id": "qb",
  "title": "Logic, proof & sets",
  "short": "Logic, proof & sets",
  "icon": "⇒",
  "color": "#8E6BD8",
  "group": "quizlet",
  "cards": [
   {
    "t": "Converse of P → Q",
    "d": "Q → P (not equivalent)"
   },
   {
    "t": "Inverse of P → Q",
    "d": "¬P → ¬Q (not equivalent)"
   },
   {
    "t": "Contrapositive of P → Q",
    "d": "¬Q → ¬P (ALWAYS equivalent)"
   },
   {
    "t": "When is P → Q false?",
    "d": "Only when P is true and Q is false"
   },
   {
    "t": "P → Q in code",
    "d": "!P || Q"
   },
   {
    "t": "Negation of (P and Q)",
    "d": "¬P or ¬Q (De Morgan)"
   },
   {
    "t": "Negation of (P or Q)",
    "d": "¬P and ¬Q (De Morgan)"
   },
   {
    "t": "Negation of 'All A are B'",
    "d": "Some A is not B"
   },
   {
    "t": "Negation of 'Some A are B'",
    "d": "No A is B"
   },
   {
    "t": "Negation of P → Q",
    "d": "P and ¬Q"
   },
   {
    "t": "Biconditional P ↔ Q is true when",
    "d": "P and Q have the same truth value"
   },
   {
    "t": "First step of an indirect proof",
    "d": "Assume the opposite (negation) of the conclusion"
   },
   {
    "t": "Modus ponens",
    "d": "P → Q, P, therefore Q (valid)"
   },
   {
    "t": "Modus tollens",
    "d": "P → Q, ¬Q, therefore ¬P (valid)"
   },
   {
    "t": "Affirming the consequent",
    "d": "P → Q, Q, therefore P (INVALID)"
   },
   {
    "t": "Denying the antecedent",
    "d": "P → Q, ¬P, therefore ¬Q (INVALID)"
   },
   {
    "t": "Counterexample",
    "d": "Makes the hypothesis true and the conclusion false"
   },
   {
    "t": "(A ∪ B)ᶜ",
    "d": "Aᶜ ∩ Bᶜ"
   },
   {
    "t": "(A ∩ B)ᶜ",
    "d": "Aᶜ ∪ Bᶜ"
   },
   {
    "t": "A − B",
    "d": "A ∩ Bᶜ"
   },
   {
    "t": "Inclusion-exclusion",
    "d": "|A ∪ B| = |A| + |B| − |A ∩ B|"
   }
  ],
  "questions": []
 },
 {
  "id": "qc",
  "title": "Triangles & polygons",
  "short": "Triangles & polygons",
  "icon": "△",
  "color": "#2F9E7E",
  "group": "quizlet",
  "cards": [
   {
    "t": "Interior angle sum of an n-gon",
    "d": "(n − 2)·180°"
   },
   {
    "t": "Each interior angle of a regular n-gon",
    "d": "(n − 2)·180°/n"
   },
   {
    "t": "Sum of exterior angles of any polygon",
    "d": "360°"
   },
   {
    "t": "Exterior angle of a triangle",
    "d": "Equals the sum of the two remote interior angles"
   },
   {
    "t": "Same-side interior angles (parallel lines)",
    "d": "Supplementary (sum to 180°)"
   },
   {
    "t": "Triangle inequality",
    "d": "Each side is less than the sum of the other two"
   },
   {
    "t": "Congruence shortcuts",
    "d": "SSS, SAS, ASA, AAS, HL (NOT SSA or AAA)"
   },
   {
    "t": "Similarity shortcuts",
    "d": "AA, SSS~, SAS~"
   },
   {
    "t": "Scale factor k: area and volume",
    "d": "Area × k², volume × k³"
   },
   {
    "t": "45-45-90 sides",
    "d": "x, x, x√2"
   },
   {
    "t": "30-60-90 sides",
    "d": "x (opposite 30°), x√3 (opposite 60°), 2x (hypotenuse)"
   },
   {
    "t": "Common Pythagorean triples",
    "d": "3-4-5, 5-12-13, 8-15-17, 7-24-25"
   },
   {
    "t": "Centroid",
    "d": "Intersection of medians; divides each median 2:1"
   },
   {
    "t": "Circumcenter",
    "d": "Intersection of perpendicular bisectors; center of circumscribed circle"
   },
   {
    "t": "Incenter",
    "d": "Intersection of angle bisectors; center of inscribed circle"
   },
   {
    "t": "Orthocenter",
    "d": "Intersection of altitudes"
   },
   {
    "t": "Heron's formula",
    "d": "s = (a+b+c)/2; Area = √(s(s−a)(s−b)(s−c))"
   }
  ],
  "questions": []
 },
 {
  "id": "qd",
  "title": "Probability & counting",
  "short": "Probability & counting",
  "icon": "P",
  "color": "#D9822B",
  "group": "quizlet",
  "cards": [
   {
    "t": "P(A or B)",
    "d": "P(A) + P(B) − P(A and B)"
   },
   {
    "t": "Mutually exclusive",
    "d": "Can't both happen: P(A and B) = 0"
   },
   {
    "t": "Independent events",
    "d": "P(A and B) = P(A)·P(B)"
   },
   {
    "t": "Conditional probability P(A | B)",
    "d": "P(A and B)/P(B)"
   },
   {
    "t": "P(at least one)",
    "d": "1 − P(none)"
   },
   {
    "t": "Geometric probability",
    "d": "Favorable area (or length) ÷ total area (or length)"
   },
   {
    "t": "Expected value",
    "d": "Σ (value × probability)"
   },
   {
    "t": "Binomial probability (k successes in n trials)",
    "d": "C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ"
   },
   {
    "t": "Permutation nPr",
    "d": "n!/(n − r)!: order matters"
   },
   {
    "t": "Combination nCr",
    "d": "n!/(r!(n − r)!): order doesn't matter"
   },
   {
    "t": "Arrangements with repeated letters",
    "d": "n!/(a!·b!·…)"
   },
   {
    "t": "Circular arrangements of n",
    "d": "(n − 1)!"
   }
  ],
  "questions": []
 },
 {
  "id": "qe",
  "title": "Trig graphs & identities",
  "short": "Trig graphs & identities",
  "icon": "∿",
  "color": "#3A8DA8",
  "group": "quizlet",
  "cards": [
   {
    "t": "y = A sin(B(x − C)) + D: amplitude",
    "d": "|A|"
   },
   {
    "t": "y = A sin(B(x − C)) + D: period",
    "d": "2π/|B| (tan: π/|B|)"
   },
   {
    "t": "y = A sin(B(x − C)) + D: phase shift",
    "d": "C (factor B out first)"
   },
   {
    "t": "y = A sin(B(x − C)) + D: midline",
    "d": "y = D"
   },
   {
    "t": "Range of A cos x + D",
    "d": "[D − |A|, D + |A|]"
   },
   {
    "t": "cos(x − π/2) equals",
    "d": "sin x"
   },
   {
    "t": "Range of arcsin",
    "d": "[−π/2, π/2]"
   },
   {
    "t": "Range of arccos",
    "d": "[0, π]"
   },
   {
    "t": "Range of arctan",
    "d": "(−π/2, π/2)"
   },
   {
    "t": "Solving cos²x = k",
    "d": "Take ± square root: cos x = ±√k (more solutions)"
   },
   {
    "t": "Solving sin 2x = k on [0, 2π)",
    "d": "Solve for 2x on [0, 4π): double the solutions"
   },
   {
    "t": "Periodic model starting at the bottom",
    "d": "h = −A cos(Bt) + D"
   },
   {
    "t": "Pythagorean identities",
    "d": "sin² + cos² = 1; 1 + tan² = sec²; 1 + cot² = csc²"
   },
   {
    "t": "sin 2x",
    "d": "2 sin x cos x"
   },
   {
    "t": "cos 2x (three forms)",
    "d": "cos² − sin² = 1 − 2sin² = 2cos² − 1"
   },
   {
    "t": "sin(a ± b)",
    "d": "sin a cos b ± cos a sin b"
   },
   {
    "t": "cos(a ± b)",
    "d": "cos a cos b ∓ sin a sin b"
   },
   {
    "t": "Law of sines",
    "d": "a/sin A = b/sin B = c/sin C (use for AAS, ASA, SSA)"
   },
   {
    "t": "Law of cosines",
    "d": "c² = a² + b² − 2ab cos C (use for SAS, SSS)"
   },
   {
    "t": "Triangle area from two sides and the included angle",
    "d": "½ab sin C"
   },
   {
    "t": "SSA ambiguous case (A acute)",
    "d": "h = b sin A: a < h → 0; a = h → 1; h < a < b → 2; a ≥ b → 1"
   },
   {
    "t": "Circumradius of an equilateral triangle with side s",
    "d": "s/√3"
   }
  ],
  "questions": []
 },
 {
  "id": "qf",
  "title": "Number theory",
  "short": "Number theory",
  "icon": "÷",
  "color": "#9A6B4F",
  "group": "quizlet",
  "cards": [
   {
    "t": "Euclidean algorithm",
    "d": "Divide; replace (a, b) with (b, remainder); last nonzero remainder = GCD"
   },
   {
    "t": "GCD × LCM",
    "d": "= a × b"
   },
   {
    "t": "Number of divisors of pᵃqᵇ",
    "d": "(a + 1)(b + 1)"
   },
   {
    "t": "Divisibility by 3 or 9",
    "d": "Digit sum divisible by 3 or 9"
   },
   {
    "t": "Tiling with the largest equal squares",
    "d": "Use the GCD"
   },
   {
    "t": "Events lining up again",
    "d": "Use the LCM"
   }
  ],
  "questions": []
 },
 {
  "id": "qg",
  "title": "Calculus",
  "short": "Calculus",
  "icon": "∫",
  "color": "#C2577A",
  "group": "quizlet",
  "cards": [
   {
    "t": "Limit gives 0/0",
    "d": "Factor and cancel (or rationalize), then plug in"
   },
   {
    "t": "lim x→0 sin(kx)/x",
    "d": "k"
   },
   {
    "t": "Limit at ∞ of a rational function, equal degrees",
    "d": "Ratio of leading coefficients"
   },
   {
    "t": "Continuity at a",
    "d": "f(a) defined, limit exists, limit = f(a)"
   },
   {
    "t": "Removable discontinuity",
    "d": "Hole: factor cancels"
   },
   {
    "t": "Arithmetic nth term and sum",
    "d": "aₙ = a₁ + (n−1)d; Sₙ = n(a₁ + aₙ)/2"
   },
   {
    "t": "Geometric nth term and sum",
    "d": "aₙ = a₁rⁿ⁻¹; Sₙ = a₁(1 − rⁿ)/(1 − r)"
   },
   {
    "t": "Infinite geometric series",
    "d": "a/(1 − r) if |r| < 1, a = FIRST term"
   },
   {
    "t": "Average rate of change",
    "d": "[f(b) − f(a)]/(b − a) = slope of the secant line"
   },
   {
    "t": "Chain rule",
    "d": "f′(g(x))·g′(x)"
   },
   {
    "t": "Product rule",
    "d": "f′g + fg′"
   },
   {
    "t": "Quotient rule",
    "d": "(f′g − fg′)/g²"
   },
   {
    "t": "Tangent line at x = a",
    "d": "y − f(a) = f′(a)(x − a)"
   },
   {
    "t": "f′ changes + to −",
    "d": "Local max"
   },
   {
    "t": "f′ changes − to +",
    "d": "Local min"
   },
   {
    "t": "Inflection point",
    "d": "Where f″ changes sign"
   },
   {
    "t": "Related rates steps",
    "d": "Equation → differentiate with respect to t → plug in numbers last"
   },
   {
    "t": "Absolute extrema on [a, b]",
    "d": "Check critical points AND endpoints"
   },
   {
    "t": "Speeding up",
    "d": "Velocity and acceleration have the same sign"
   },
   {
    "t": "Fundamental Theorem (part 2)",
    "d": "∫ₐᵇ f(x) dx = F(b) − F(a)"
   },
   {
    "t": "d/dx ∫ₐˣ f(t) dt",
    "d": "f(x)"
   },
   {
    "t": "Definite integral as a Riemann sum",
    "d": "lim n→∞ Σ f(xᵢ)Δx, Δx = (b − a)/n"
   },
   {
    "t": "Area between curves",
    "d": "∫ (top − bottom) dx between intersections"
   },
   {
    "t": "Integral of a rate",
    "d": "Net change"
   },
   {
    "t": "Average value of f on [a, b]",
    "d": "(1/(b − a))∫ₐᵇ f(x) dx"
   },
   {
    "t": "Trapezoid rule",
    "d": "(Δx/2)[f₀ + 2f₁ + … + 2fₙ₋₁ + fₙ]"
   },
   {
    "t": "∫ 1/x dx",
    "d": "ln |x| + C"
   }
  ],
  "questions": []
 },
 {
  "id": "qh",
  "title": "Matrices & vectors",
  "short": "Matrices & vectors",
  "icon": "▦",
  "color": "#5767C2",
  "group": "quizlet",
  "cards": [
   {
    "t": "2×2 determinant",
    "d": "ad − bc"
   },
   {
    "t": "2×2 inverse",
    "d": "(1/(ad − bc))·[[d, −b], [−c, a]]"
   },
   {
    "t": "Swap two rows: determinant",
    "d": "Changes sign"
   },
   {
    "t": "Multiply a row by k: determinant",
    "d": "Multiplied by k"
   },
   {
    "t": "Add a multiple of one row to another: determinant",
    "d": "Unchanged"
   },
   {
    "t": "det(kA) for n×n",
    "d": "kⁿ det A"
   },
   {
    "t": "Perpendicular vectors",
    "d": "Dot product = 0"
   },
   {
    "t": "Angle between vectors",
    "d": "cos θ = u·v/(|u|·|v|)"
   },
   {
    "t": "Rotate 90° CCW matrix",
    "d": "[[0, −1], [1, 0]]"
   },
   {
    "t": "|det| of a transformation matrix",
    "d": "Area scale factor"
   }
  ],
  "questions": []
 },
 {
  "id": "qi",
  "title": "Complex numbers",
  "short": "Complex numbers",
  "icon": "i",
  "color": "#7A5AC8",
  "group": "quizlet",
  "cards": [
   {
    "t": "Powers of i",
    "d": "i, −1, −i, 1 repeating: use n mod 4"
   },
   {
    "t": "Dividing complex numbers",
    "d": "Multiply top and bottom by the conjugate of the bottom"
   },
   {
    "t": "Modulus of a + bi",
    "d": "√(a² + b²)"
   },
   {
    "t": "Multiplying in polar form",
    "d": "Multiply moduli, add angles"
   },
   {
    "t": "De Moivre's theorem",
    "d": "(r cis θ)ⁿ = rⁿ cis(nθ)"
   },
   {
    "t": "Complex roots of real polynomials",
    "d": "Come in conjugate pairs"
   }
  ],
  "questions": []
 },
 {
  "id": "qj",
  "title": "Algebra & functions",
  "short": "Algebra & functions",
  "icon": "ƒ",
  "color": "#3E8E5A",
  "group": "quizlet",
  "cards": [
   {
    "t": "Distributive property",
    "d": "a(b + c) = ab + ac"
   },
   {
    "t": "log_b x = y means",
    "d": "bʸ = x"
   },
   {
    "t": "Log product/quotient/power rules",
    "d": "log MN = log M + log N; log M/N = log M − log N; log Mᵖ = p log M"
   },
   {
    "t": "Change of base",
    "d": "log_b x = ln x/ln b"
   },
   {
    "t": "Continuous growth",
    "d": "A = Pe^(rt)"
   },
   {
    "t": "Compound interest",
    "d": "A = P(1 + r/n)^(nt)"
   },
   {
    "t": "Half-life model",
    "d": "A = A₀(1/2)^(t/h)"
   },
   {
    "t": "Decrease of r% per period",
    "d": "Multiply by (1 − r) each period"
   },
   {
    "t": "Inverse of bˣ",
    "d": "log_b x (reflection over y = x)"
   },
   {
    "t": "Vertex x-coordinate of ax² + bx + c",
    "d": "−b/(2a)"
   },
   {
    "t": "Discriminant b² − 4ac",
    "d": ">0: 2 real; =0: 1 real; <0: no real"
   },
   {
    "t": "Sum and product of roots of ax² + bx + c",
    "d": "Sum −b/a; product c/a"
   },
   {
    "t": "Remainder theorem",
    "d": "f(x) ÷ (x − c) has remainder f(c)"
   },
   {
    "t": "Rational root theorem",
    "d": "±(factors of constant)/(factors of leading coefficient)"
   },
   {
    "t": "Hole vs vertical asymptote",
    "d": "Canceling factor → hole; leftover zero of denominator → vertical asymptote"
   },
   {
    "t": "Horizontal asymptote rules",
    "d": "top deg < bottom: y = 0; equal: ratio of leading coefs; top > bottom: none"
   },
   {
    "t": "|x − a| < b",
    "d": "−b < x − a < b"
   },
   {
    "t": "Finding an inverse",
    "d": "Swap x and y, solve for y"
   },
   {
    "t": "Inverse is a function when",
    "d": "Original is one-to-one (horizontal line test)"
   },
   {
    "t": "(f∘g)(x)",
    "d": "f(g(x)): inside first"
   },
   {
    "t": "f(x − h)",
    "d": "Shift right h"
   },
   {
    "t": "f(−x)",
    "d": "Reflect over the y-axis"
   },
   {
    "t": "−f(x)",
    "d": "Reflect over the x-axis"
   },
   {
    "t": "Even function",
    "d": "f(−x) = f(x); symmetric about the y-axis"
   },
   {
    "t": "Odd function",
    "d": "f(−x) = −f(x); symmetric about the origin"
   }
  ],
  "questions": []
 },
 {
  "id": "qk",
  "title": "Statistics",
  "short": "Statistics",
  "icon": "σ",
  "color": "#B5603A",
  "group": "quizlet",
  "cards": [
   {
    "t": "Add k to every data value",
    "d": "Mean/median + k; SD/IQR unchanged"
   },
   {
    "t": "Multiply every data value by k",
    "d": "Mean × k; SD × |k|"
   },
   {
    "t": "Add a value equal to the mean",
    "d": "Mean unchanged; SD decreases"
   },
   {
    "t": "Outlier rule",
    "d": "Below Q1 − 1.5·IQR or above Q3 + 1.5·IQR"
   },
   {
    "t": "Right-skewed distribution",
    "d": "Mean > median"
   },
   {
    "t": "68-95-99.7 rule",
    "d": "Percent of normal data within 1, 2, 3 SDs"
   },
   {
    "t": "z-score",
    "d": "(x − μ)/σ"
   },
   {
    "t": "Display for correlation between two variables",
    "d": "Scatter plot"
   },
   {
    "t": "Stratified sampling",
    "d": "Split into groups, randomly sample from each"
   },
   {
    "t": "Voluntary-response poll problem",
    "d": "Not a representative sample (biased)"
   },
   {
    "t": "Correlation vs causation",
    "d": "Correlation does not prove causation; only experiments can"
   }
  ],
  "questions": []
 },
 {
  "id": "ql",
  "title": "Circles, solids & coordinates",
  "short": "Circles, solids & coordinates",
  "icon": "◎",
  "color": "#2E7D9A",
  "group": "quizlet",
  "cards": [
   {
    "t": "Inscribed angle",
    "d": "Half its intercepted arc"
   },
   {
    "t": "Tangent and radius",
    "d": "Perpendicular at the point of tangency"
   },
   {
    "t": "Intersecting chords",
    "d": "(part)(part) = (part)(part)"
   },
   {
    "t": "Volume of pyramid/cone",
    "d": "⅓Bh"
   },
   {
    "t": "Volume of sphere",
    "d": "(4/3)πr³"
   },
   {
    "t": "Surface area of sphere",
    "d": "4πr²"
   },
   {
    "t": "Lateral area of a cone",
    "d": "πrl, l = √(r² + h²)"
   },
   {
    "t": "Oblique cylinder volume",
    "d": "πr²h with h = VERTICAL height"
   },
   {
    "t": "Euler's formula",
    "d": "V − E + F = 2"
   },
   {
    "t": "Inches in a mile",
    "d": "63,360"
   },
   {
    "t": "Perpendicular slopes",
    "d": "m₁·m₂ = −1"
   },
   {
    "t": "Reflect over y = x",
    "d": "(x, y) → (y, x)"
   },
   {
    "t": "Rotate 90° CCW about origin",
    "d": "(x, y) → (−y, x)"
   },
   {
    "t": "Rotate 180° about origin",
    "d": "(x, y) → (−x, −y)"
   },
   {
    "t": "Dilation about center C by k",
    "d": "P′ = C + k(P − C)"
   },
   {
    "t": "Ellipse foci",
    "d": "c² = a² − b²"
   },
   {
    "t": "Hyperbola foci",
    "d": "c² = a² + b²"
   },
   {
    "t": "Identify Ax² + Cy² = …",
    "d": "Same signs → ellipse; opposite → hyperbola; one squared → parabola"
   },
   {
    "t": "Polar to rectangular",
    "d": "x = r cos θ, y = r sin θ"
   }
  ],
  "questions": []
 },
 {
  "id": "qm",
  "title": "Measurement & conversions",
  "short": "Measurement & conversions",
  "icon": "ft",
  "color": "#7A9A3A",
  "group": "quizlet",
  "cards": [
   {
    "t": "Successive percent changes",
    "d": "Multiply the multipliers"
   },
   {
    "t": "Reverse percent",
    "d": "Original = new ÷ multiplier"
   },
   {
    "t": "60 mph in ft/s",
    "d": "88 ft/s"
   },
   {
    "t": "Area unit conversions",
    "d": "Square the linear factor (1 yd² = 9 ft²)"
   },
   {
    "t": "Volume unit conversions",
    "d": "Cube the linear factor (1 m³ = 1,000,000 cm³)"
   },
   {
    "t": "Gallon conversions",
    "d": "1 gal = 4 qt = 128 fl oz"
   }
  ],
  "questions": []
 },
 {
  "id": "qn",
  "title": "Reasoning & teaching",
  "short": "Reasoning & teaching",
  "icon": "✎",
  "color": "#8A6D3B",
  "group": "quizlet",
  "cards": [
   {
    "t": "Axiom/postulate",
    "d": "Accepted without proof"
   },
   {
    "t": "Corollary",
    "d": "Follows readily from a theorem"
   },
   {
    "t": "Lemma",
    "d": "Helper theorem used to prove another"
   },
   {
    "t": "Undefined terms in Euclidean geometry",
    "d": "Point, line, plane"
   },
   {
    "t": "Spherical geometry",
    "d": "No parallels; triangle angle sum > 180°; lines are great circles"
   },
   {
    "t": "Hyperbolic geometry",
    "d": "Infinitely many parallels; triangle angle sum < 180°"
   },
   {
    "t": "Playfair's axiom",
    "d": "Exactly one parallel through a point not on a line"
   },
   {
    "t": "Inductive vs deductive reasoning",
    "d": "Inductive: pattern → conjecture; deductive: logic from axioms → certain conclusion"
   },
   {
    "t": "Mathematical induction",
    "d": "Base case P(1); assume P(k), prove P(k + 1)"
   },
   {
    "t": "Transitive property",
    "d": "a = b and b = c → a = c"
   },
   {
    "t": "Polya's 4 steps",
    "d": "Understand, plan, solve, look back"
   },
   {
    "t": "Algebra tiles model",
    "d": "Polynomial multiplication"
   },
   {
    "t": "Calculator mode rule",
    "d": "Match DEG/RAD to the problem; check the screen indicator"
   },
   {
    "t": "Guessing on the NES",
    "d": "No penalty: never leave a blank"
   }
  ],
  "questions": []
 }
];
