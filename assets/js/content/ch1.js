/* Chapter 1 — Mathematical Preliminaries */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch1", num: 1, title: "Mathematical Preliminaries", short: "Sets, Relations & Functions", pages: "1–9", quiz: "ch1",
    blurb: "The language of the whole course: sets, set operations, Cartesian products, relations, equivalence relations, functions (injective, surjective, bijective) and binary operations.",
    goals: [
      "Prove set identities by double inclusion or by a chain of logical equivalences.",
      "Check reflexive / symmetric / transitive, and describe equivalence classes.",
      "Prove a function is injective, surjective or bijective (or give a counterexample).",
      "Decide whether an operation is a binary operation (closure!).",
    ],
    intro: H`<div class="kicker">Why this chapter matters</div><p>Every later proof is built from these pieces: "Let $x\in A$…", "to show $A = B$ show $A\subseteq B$ and $B\subseteq A$", "$T$ is injective iff…". Master the <b>proof formats</b> here and Chapters 2–4 become much easier.</p>`,
    sections: [
      { id: "1.1", title: "Sets", html: H`
<div class="box def" data-t="1.1.1 · Set">
<p>A <b>set</b> is a collection of well-defined objects called <b>elements</b>, listed in braces with no repeats. $\{1,2,4,6\}$ is a set; the notes regard $\{1,2,2,4,6\}$ as not a (properly written) set (Example 1.1.2).</p>
<p>$x\in X$ means "$x$ is an element of $X$"; $x\notin X$ means it is not (Remark 1.1.3).</p>
</div>
<div class="box def" data-t="1.1.4 · Equal sets">
<p>$A = B$ if they have exactly the same elements. Order does not matter: $\{1,3,5\} = \{5,1,3\}$ (Example 1.1.5).</p>
</div>
<div class="box def" data-t="1.1.6–1.1.7 · Subset and proper subset">
<p>$A\subseteq B$ if every element of $A$ is in $B$: $\forall x\,(x\in A\Rightarrow x\in B)$. If $A\subseteq B$ and $A\neq B$, $A$ is a <b>proper subset</b>, $A\subset B$.</p>
</div>
<div class="box rem" data-t="1.1.8 · How to prove A = B">
<p>Prove $A\subseteq B$ <b>and</b> $B\subseteq A$. Equivalently $A = B \equiv \forall x\,(x\in A\iff x\in B)$.</p>
</div>
<div class="box def" data-t="1.1.9 · Empty set">
<p>$\emptyset$ is the set with no elements.</p>
</div>
<div class="box thm" data-t="1.1.10 · ∅ is a subset of every set">
<p><b>Proof (contradiction).</b> Suppose $\emptyset\not\subseteq A$. Then some $x\in\emptyset$ has $x\notin A$ — impossible, since $\emptyset$ has no elements. Hence $\emptyset\subseteq A$. $\square$</p>
</div>
<div class="box def" data-t="1.1.11–1.1.12 · Union, intersection, difference, complement">
<p>$A\cup B = \{x: x\in A\lor x\in B\}$, $\;A\cap B = \{x : x\in A\land x\in B\}$; $A,B$ are <b>disjoint</b> if $A\cap B = \emptyset$.<br>
$A\setminus B = \{x: x\in A\land x\notin B\}$. If $A\subseteq X$, the <b>complement</b> is $A^c = X\setminus A$ (also written $A'$ or $X - A$).</p>
</div>
<div class="box prop" data-t="1.1.13 · De Morgan’s Laws">
<p>For $A,B\subseteq X$: (i) $(A\cup B)^c = A^c\cap B^c$ &nbsp; (ii) $(A\cap B)^c = A^c\cup B^c$.</p>
</div>
<div class="box proof" data-t="of De Morgan (i) — chain of equivalences">
$$x\in(A\cup B)^c\iff x\notin A\cup B\iff \lnot(x\in A\lor x\in B)\iff x\notin A\land x\notin B\iff x\in A^c\cap B^c.$$
<p>(ii) is identical with $\land$ and $\lor$ swapped.</p>
</div>
<div class="box thm" data-t="1.1.14 · Set algebra laws">
<p>For $A,B,C\subseteq X$: (i) $A\cup(X\setminus A) = X$ (ii) $A\cap(X\setminus A) = \emptyset$ (iii) $X\setminus(X\setminus A) = A$ (iv) $A\cup(B\cap C) = (A\cup B)\cap(A\cup C)$ (v) $A\cap(B\cup C) = (A\cap B)\cup(A\cap C)$ (vi) $A\setminus(B\cup C) = (A\setminus B)\cap(A\setminus C)$ (vii) $A\setminus(B\cap C) = (A\setminus B)\cup(A\setminus C)$ (viii) $A\cap B = \emptyset\iff A\subseteq B^c$.</p>
</div>
<div class="box proof" data-t="of 1.1.14(iv) (from the notes) and (viii)">
$$\begin{aligned}x\in A\cup(B\cap C)&\iff x\in A\lor(x\in B\land x\in C)\\&\iff(x\in A\lor x\in B)\land(x\in A\lor x\in C)\\&\iff x\in(A\cup B)\cap(A\cup C).\end{aligned}$$
<p><b>(viii)</b> (⇒) If $A\cap B = \emptyset$ and $x\in A$, then $x\notin B$, i.e. $x\in B^c$; so $A\subseteq B^c$. (⇐) If $A\subseteq B^c$ and $x\in A\cap B$, then $x\in B^c$ and $x\in B$ — contradiction; so $A\cap B = \emptyset$.</p>
</div>
<div class="box template" data-t="Proving a set identity (two acceptable formats)">
<p><b>Format 1 — chain of ⇔</b> (when every step is reversible): start from "$x\in$ LHS", translate with definitions into logic ($\land,\lor,\lnot$), use a logic law (distributive, De Morgan), translate back to "$x\in$ RHS".</p>
<p><b>Format 2 — double inclusion:</b> "Let $x\in$ LHS. … Hence $x\in$ RHS, so LHS $\subseteq$ RHS. Conversely let $x\in$ RHS … so RHS $\subseteq$ LHS. Therefore LHS = RHS."</p>
</div>
<div class="box def" data-t="1.1.15 · Standard sets and intervals">
<p>$\N$ (non-negative integers in these notes), $\Z$, $\Q$, $\R$, $\C$. Intervals: $[a,b]$ closed, $(a,b)$ open, $[a,b)$, $(a,b]$ half-open, and $[a,\infty)$, $(a,\infty)$, $(-\infty,b]$, $(-\infty,b)$.</p>
</div>
<div class="box def" data-t="1.1.16 · Cartesian product">
<p>$A\times B = \{(x,y): x\in A,\,y\in B\}$ (ordered pairs); $A\times A = A^2$. More generally $A_1\times\dots\times A_n = \{(x_1,\dots,x_n): x_i\in A_i\}$, and $A^n$ when all $A_i = A$ (Remark 1.1.19). Elements are <b>n-tuples</b>; $x_i$ is the $i$-th <b>component</b>.</p>
</div>
<div class="box ex" data-t="1.1.17 & 1.1.19 · Products in action">
<p>$\{1,2\}\times\{1,3,5\} = \{(1,1),(1,3),(1,5),(2,1),(2,3),(2,5)\}$. $\;(0,1)\times(0,2)$ is the open rectangle of width 1 and height 2 in $\R^2$ (Note 1.1.18: "(0,1)" can mean an interval or an ordered pair — read in context).<br>
$\R^n$ is $n$-dimensional Euclidean space; $(1,-1,0)\in\R^3$ but $(1+2i,-1,0)\notin\R^3$; $(-1,1)\in\Z^2$ but $(-1,\tfrac12)\notin\Z^2$.</p>
</div>` },
      { id: "1.2", title: "Relations, functions and binary operations", html: H`
<div class="box def" data-t="1.2.1 · Relation">
<p>A <b>relation</b> between $A$ and $B$ is a subset $R\subseteq A\times B$; we write $xRy$ when $(x,y)\in R$. $A$ is the domain, $B$ the codomain; if $B = A$ it is a relation <b>on</b> $A$.</p>
</div>
<div class="box def" data-t="1.2.2 · Equivalence relation">
<p>A relation $R$ on $A$ is an <b>equivalence relation</b> if for all $x,y,z\in A$: (i) $xRx$ (<b>reflexive</b>); (ii) $xRy\Rightarrow yRx$ (<b>symmetric</b>); (iii) $xRy\land yRz\Rightarrow xRz$ (<b>transitive</b>).</p>
</div>
<div class="box ex" data-t="1.2.3 · Which are equivalence relations?">
<p>"$\ge$" on $\Q$: reflexive and transitive, not symmetric ($2\ge1$ but $1\not\ge2$) ✘. Equality of sets ✔. On $\{1,2\}$: $R_1 = \{(1,1),(1,2),(2,1),(2,2)\}$ ✔; $R_2 = \{(1,1),(2,1),(2,2)\}$ ✘ (not symmetric).</p>
</div>
<div class="box def" data-t="1.2.4 · Equivalence class">
<p>$[x] = \{y\in A : yRx\}$. Every $x$ lies in its own class, and two different classes are disjoint (Remark 1.2.5) — the classes <b>partition</b> $A$.</p>
</div>
<div class="box proof" data-t="of Remark 1.2.5 (equivalence classes partition A)">
<p>(i) $xRx$ by reflexivity, so $x\in[x]$. (ii) Suppose $[x]\cap[y]\neq\emptyset$, say $z$ is in both, so $zRx$ and $zRy$. By symmetry $xRz$, and by transitivity ($xRz$, $zRy$) we get $xRy$. Now if $w\in[x]$ then $wRx$ and $xRy$ give $wRy$, so $w\in[y]$; the same argument with $x,y$ swapped gives $[y]\subseteq[x]$. Hence two classes are either <b>equal</b> or <b>disjoint</b> — never partly overlapping.</p></div>
<div class="box ex" data-t="1.2.6 · x R y iff x − y is even (full proof)">
<ul><li><b>Reflexive:</b> $x-x = 0 = 2(0)$, even.</li>
<li><b>Symmetric:</b> $x-y = 2k\Rightarrow y-x = 2(-k)$, even.</li>
<li><b>Transitive:</b> $x-y = 2k_1$, $y-z = 2k_2\Rightarrow x-z = 2(k_1+k_2)$, even.</li></ul>
<p>So $R$ is an equivalence relation, and $[x] = \{x+2k: k\in\Z\}$ — there are just two classes: the evens and the odds.</p>
</div>
<div class="box template" data-t="Proving an equivalence relation">
<p>Three labelled paragraphs. <b>Reflexive:</b> "Let $x\in A$. Then … so $xRx$." <b>Symmetric:</b> "Let $xRy$. Then … so $yRx$." <b>Transitive:</b> "Let $xRy$ and $yRz$. Then … so $xRz$." To <b>disprove</b>, give one concrete failing triple/pair.</p>
</div>
<div class="box def" data-t="1.2.7 · Function">
<p>A <b>function</b> $f$ from $A$ to $B$ is a non-empty relation $f\subseteq A\times B$ with (i) <b>existence</b>: every $x\in A$ has some $(x,y)\in f$; (ii) <b>uniqueness</b>: $(x,y),(x,z)\in f\Rightarrow y = z$. We write $f:A\to B$ and $f(x) = y$ (Remark 1.2.8).</p>
</div>
<div class="box def" data-t="1.2.9–1.2.12 · Range, surjective, injective, bijective">
<p><b>Range:</b> $f(A) = \{y\in B: y = f(x)\text{ for some }x\in A\}$.<br>
<b>Surjective (onto):</b> $f(A) = B$ — every $y\in B$ is hit (Remark 1.2.14: it suffices to show $\forall y\in B\;\exists x\in A: f(x) = y$).<br>
<b>Injective (one-to-one):</b> $x_1\neq x_2\Rightarrow f(x_1)\neq f(x_2)$.<br>
<b>Bijective:</b> injective and surjective.</p>
</div>
<div class="box tip" data-t="Prove injectivity with the contrapositive">
<p>The definition says $x_1\ne x_2\Rightarrow f(x_1)\ne f(x_2)$; its contrapositive $f(x_1) = f(x_2)\Rightarrow x_1 = x_2$ is equivalent and much easier to use: "Suppose $f(x_1) = f(x_2)$. Then … hence $x_1 = x_2$." For linear maps this becomes the kernel test (Theorem 3.2.6).</p>
</div>
<div class="box ex" data-t="1.2.13 · Domain and codomain change everything">
<p>$f(x) = x^2$: on $\R\to\R$ it is not onto (negatives missed) and not one-to-one ($f(1) = f(-1)$). With codomain $[0,\infty)$ it becomes onto; with domain $[0,\infty)$ it becomes one-to-one.</p>
</div>
<div class="box def" data-t="1.2.15–1.2.16 · Images of subsets">
<p>For $C\subseteq A$, $f(C) = \{f(x): x\in C\}$. Then (i) $f(\emptyset) = \emptyset$; (ii) $C_1\subseteq C_2\Rightarrow f(C_1)\subseteq f(C_2)$; (v) $f(C_1\cap C_2)\subseteq f(C_1)\cap f(C_2)$; (vi) $f(C_1\cup C_2) = f(C_1)\cup f(C_2)$; (vii) if $f$ is injective, $f(C_1\cap C_2) = f(C_1)\cap f(C_2)$.</p>
<p class="small"><b>Proof of (v):</b> if $y\in f(C_1\cap C_2)$ then $y = f(x)$ with $x\in C_1$ and $x\in C_2$, so $y\in f(C_1)$ and $y\in f(C_2)$. Equality can fail without injectivity (Exercise 1 Q5).</p>
</div>
<div class="box proof" data-t="of Theorem 1.2.16 (vi) and (vii)">
<p><b>(vi)</b> $y\in f(C_1\cup C_2)\iff y = f(x)$ for some $x\in C_1$ or $x\in C_2\iff y\in f(C_1)$ or $y\in f(C_2)\iff y\in f(C_1)\cup f(C_2)$.</p>
<p><b>(vii)</b> "$\subseteq$" is (v). For "$\supseteq$": let $y\in f(C_1)\cap f(C_2)$, so $y = f(x_1) = f(x_2)$ with $x_1\in C_1$, $x_2\in C_2$. Injectivity gives $x_1 = x_2\in C_1\cap C_2$, hence $y\in f(C_1\cap C_2)$.</p></div>
<div class="box def" data-t="1.2.17–1.2.18 · Equal functions and composition">
<p>$f = g$ if $f(x) = g(x)$ for all $x$. For $f:A\to B$, $g:B\to C$: $(g\circ f)(x) = g(f(x))$. Composition is <b>not commutative</b> in general.</p>
</div>
<div class="box thm" data-t="1.2.19 · Compositions preserve onto / one-to-one / bijective">
<p>If $f:A\to B$ and $g:B\to C$ are both surjective (injective, bijective), so is $g\circ f$.</p>
</div>
<div class="box proof" data-t="of Theorem 1.2.19 (exercise in the notes)">
<p><b>Surjective:</b> let $z\in C$. As $g$ is onto, $z = g(y)$ for some $y\in B$; as $f$ is onto, $y = f(x)$ for some $x\in A$. Then $(g\circ f)(x) = z$.<br>
<b>Injective:</b> if $g(f(x_1)) = g(f(x_2))$ then $f(x_1) = f(x_2)$ ($g$ injective), so $x_1 = x_2$ ($f$ injective).<br>
<b>Bijective:</b> combine the two.</p>
</div>
<div class="box def" data-t="1.2.20–1.2.23 · Identity and inverse functions">
<p>$I_A(x) = x$. <b>Theorem 1.2.21:</b> $f:A\to B$ is bijective iff there is a unique $g:B\to A$ with $f\circ g = I_B$ and $g\circ f = I_A$; this $g$ is the <b>inverse</b> $f^{-1}$. <b>Theorem 1.2.23:</b> if $f,g$ are bijective then $(g\circ f)^{-1} = f^{-1}\circ g^{-1}$ ("socks and shoes": undo in reverse order).</p>
</div>
<div class="box proof" data-t="of Theorems 1.2.21 and 1.2.23 (exercises in the notes)">
<p><b>1.2.21 (⇒)</b> Let $f$ be bijective. For $y\in B$ there is an $x$ with $f(x) = y$ (onto), and only one (one-to-one); define $g(y) = x$. Then $f(g(y)) = y$ and $g(f(x)) = x$, i.e. $f\circ g = I_B$, $g\circ f = I_A$. <b>Uniqueness:</b> if $h$ also satisfies both, $h = h\circ I_B = h\circ(f\circ g) = (h\circ f)\circ g = I_A\circ g = g$.</p>
<p><b>1.2.21 (⇐)</b> If $f\circ g = I_B$ and $g\circ f = I_A$: <i>injective</i> — $f(x_1) = f(x_2)\Rightarrow x_1 = g(f(x_1)) = g(f(x_2)) = x_2$; <i>surjective</i> — any $y = f(g(y))$.</p>
<p><b>1.2.23</b> $(g\circ f)\circ(f^{-1}\circ g^{-1}) = g\circ(f\circ f^{-1})\circ g^{-1} = g\circ g^{-1} = I_C$ and $(f^{-1}\circ g^{-1})\circ(g\circ f) = f^{-1}\circ f = I_A$ (associativity). By the uniqueness in 1.2.21, $(g\circ f)^{-1} = f^{-1}\circ g^{-1}$.</p></div>
<div class="box def" data-t="1.2.24 · Binary operation">
<p>A <b>binary operation</b> on $A$ is a function $A\times A\to A$ — the key word is <b>closure</b>: the result must land back in $A$. We write $a\oplus b$ for $\oplus(a,b)$ (Remark 1.2.25).</p>
</div>
<div class="box ex" data-t="1.2.26 · Binary operation or not?">
<p>$+,-,\cdot$ on $\Z,\Q,\R$ ✔. Subtraction on $\N$ ✘ ($2-4\notin\N$). Division on $\R$ ✘ (÷0), on $\R\setminus\{0\}$ ✔. Addition on $[0,2]$ ✘ ($1+2 = 3$). Componentwise addition on $\R^n$ ✔.</p>
</div>` },
    ],
    exercises: H`
<h2>Exercise 1 — full solutions</h2>
<div class="box exam" data-t="Q1 · Set proofs">
<p>(i) $A\subseteq B$ iff $A\cup B = B$. (ii) If $A\cap B$ and $A\setminus B$ are disjoint, then $A = (A\cap B)\cup(A\setminus B)$. (iii) $(A\cap B)\times C = (A\times C)\cap(B\times C)$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> (⇒) Suppose $A\subseteq B$. Clearly $B\subseteq A\cup B$. If $x\in A\cup B$ then $x\in A$ (so $x\in B$) or $x\in B$; either way $x\in B$. So $A\cup B = B$. (⇐) Suppose $A\cup B = B$. If $x\in A$ then $x\in A\cup B = B$. So $A\subseteq B$.</p>
<p><b>(ii)</b> (They are always disjoint.) If $x\in A$ then either $x\in B$ (so $x\in A\cap B$) or $x\notin B$ (so $x\in A\setminus B$); hence $A\subseteq(A\cap B)\cup(A\setminus B)$. Both $A\cap B$ and $A\setminus B$ are subsets of $A$, so the union is too. Hence equality.</p>
<p><b>(iii)</b> $(x,y)\in(A\cap B)\times C\iff x\in A\land x\in B\land y\in C\iff(x\in A\land y\in C)\land(x\in B\land y\in C)\iff(x,y)\in(A\times C)\cap(B\times C)$.</p>
</details></div>
<div class="box exam" data-t="Q2 · Prove or give a counterexample">
<p>(i) $A\times B = B\times A$. (ii) $(A\cup B)\times C = (A\times C)\cup(B\times C)$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i) False.</b> $A = \{1\}$, $B = \{2\}$: $A\times B = \{(1,2)\}\ne\{(2,1)\} = B\times A$ (ordered pairs!).</p>
<p><b>(ii) True.</b> $(x,y)\in(A\cup B)\times C\iff(x\in A\lor x\in B)\land y\in C\iff(x\in A\land y\in C)\lor(x\in B\land y\in C)\iff(x,y)\in(A\times C)\cup(B\times C)$.</p>
</details></div>
<div class="box exam" data-t="Q3 · Reflexive, symmetric, transitive?">
<p>(i) $x\mid y$ on $\Z$. (ii) $R = \{(1,1),(2,1),(2,2),(1,2)\}$ on $\{1,2,3\}$. (iii) $xRy$ iff $|x-y| = 0$ on $\R$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> Reflexive ✔ ($x = 1\cdot x$). Symmetric ✘ ($1\mid2$ but $2\nmid1$). Transitive ✔ ($y = kx$, $z = ly\Rightarrow z = (lk)x$).</p>
<p><b>(ii)</b> Reflexive ✘ ($(3,3)\notin R$). Symmetric ✔ (both $(1,2),(2,1)\in R$). Transitive ✔ (check all chains: e.g. $(1,2),(2,1)\Rightarrow(1,1)\in R$; $(2,1),(1,2)\Rightarrow(2,2)\in R$).</p>
<p><b>(iii)</b> $|x-y| = 0\iff x = y$, i.e. equality: reflexive, symmetric and transitive — an equivalence relation.</p>
</details></div>
<div class="box exam" data-t="Q4 · (a,b) R (c,d) iff ad = bc">
<details class="reveal sol"><summary>Full solution (with an important subtlety)</summary>
<p><b>Reflexive:</b> $ab = ba$ ✔. <b>Symmetric:</b> $ad = bc\Rightarrow cb = da$ ✔.</p>
<p><b>Transitive — careful!</b> On all of $\R^2$ it <b>fails</b> because of $(0,0)$: $(1,0)R(0,0)$ and $(0,0)R(0,1)$, but $(1,0)R(0,1)$ would need $1\cdot1 = 0\cdot0$ ✘. So the relation is an equivalence relation on $\R^2\setminus\{(0,0)\}$ (the intended setting):</p>
<p>Suppose $ad = bc$ and $cf = de$ with $(c,d)\ne(0,0)$. If $c\neq0$: $b = \frac{ad}{c}$, $f = \frac{de}{c}$, so $af = \frac{ade}{c} = be$ ✔. If $c = 0$ then $d\ne0$, so $ad = 0\Rightarrow a = 0$ and $de = 0\Rightarrow e = 0$, giving $af = 0 = be$ ✔.</p>
<p>$[(3,6)] = \{(a,b): 6a = 3b\} = \{(a,2a): a\ne0\}$ — the line $b = 2a$ through the origin (minus the origin). Interpretation: two vectors are related iff they are parallel.</p>
</details></div>
<div class="box exam" data-t="Q5 · f(A₁ ∩ A₂) ≠ f(A₁) ∩ f(A₂) in general">
<details class="reveal sol"><summary>Full solution</summary>
<p>Take $f:\R\to\R$, $f(x) = x^2$, $A_1 = \{-1\}$, $A_2 = \{1\}$. Then $f(A_1\cap A_2) = f(\emptyset) = \emptyset$, but $f(A_1)\cap f(A_2) = \{1\}\cap\{1\} = \{1\}$. (Equality needs injectivity — Theorem 1.2.16(vii).)</p>
</details></div>
<div class="box exam" data-t="Q6 · Largest set A making f injective">
<p>(i) $f(x) = (x-5)^2+2$ (ii) $f(x) = |4x+3|$ (iii) $f(x) = \cos x$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Restrict to one side of the turning point (a maximal choice is not unique):</p>
<p>(i) $A = [5,\infty)$ (or $(-\infty,5]$): there $f$ is strictly increasing. (ii) $A = [-\tfrac34,\infty)$ (or $(-\infty,-\tfrac34]$): $4x+3\ge0$ so $f(x) = 4x+3$ is strictly increasing. (iii) $A = [0,\pi]$ (or any $[k\pi,(k+1)\pi]$): $\cos$ is strictly decreasing there.</p>
<p class="muted">Proof style for (i): if $(x_1-5)^2+2 = (x_2-5)^2+2$ with $x_1,x_2\ge5$, then $x_1-5 = x_2-5$ (non-negative square roots), so $x_1 = x_2$.</p>
</details></div>
<div class="box exam" data-t="Q7 · Is ⊙ a binary operation on diagonal rational matrices?">
<details class="reveal sol"><summary>Full solution</summary>
<p><b>No.</b> The (2,2) entry of the result is $\sqrt{x_1y_1}$, which need not be rational (or even real). E.g. $x_1 = 2$, $y_1 = 1$: $\sqrt2\notin\Q$; or $x_1y_1\lt0$ gives a non-real number. So the result can fall outside $A$ — closure fails.</p>
</details></div>
<div class="box exam" data-t="Q8 · (f ⊕ g)(x) = f(x)² + g(x)² − f(x)g(x) on functions ℝ → [0, ∞)">
<details class="reveal sol"><summary>Full solution</summary>
<p>We must show $f\oplus g\in S$, i.e. $(f\oplus g)(x)\ge0$ for all $x$. With $a = f(x)$, $b = g(x)$:
$$a^2+b^2-ab = \Big(a-\frac b2\Big)^2+\frac34b^2\ge0.$$
So $f\oplus g:\R\to[0,\infty)$ is a well-defined function in $S$, and $\oplus$ is a binary operation on $S$.</p>
</details></div>`,
    summary: H`<div class="card glow"><div class="kicker">Chapter 1 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Idea</th><th>Key fact</th></tr>
<tr><td>Set equality</td><td>$A = B\iff A\subseteq B\land B\subseteq A$</td></tr>
<tr><td>De Morgan</td><td>$(A\cup B)^c = A^c\cap B^c$, $(A\cap B)^c = A^c\cup B^c$</td></tr>
<tr><td>Distributive</td><td>$A\cup(B\cap C) = (A\cup B)\cap(A\cup C)$, and dually</td></tr>
<tr><td>Cartesian product</td><td>ordered pairs; $A\times B\ne B\times A$ in general</td></tr>
<tr><td>Equivalence relation</td><td>reflexive + symmetric + transitive; classes partition the set</td></tr>
<tr><td>Injective</td><td>$f(x_1) = f(x_2)\Rightarrow x_1 = x_2$</td></tr>
<tr><td>Surjective</td><td>$\forall y\;\exists x: f(x) = y$</td></tr>
<tr><td>Inverse</td><td>exists iff bijective; $(g\circ f)^{-1} = f^{-1}\circ g^{-1}$</td></tr>
<tr><td>Binary operation</td><td>closure: $a\oplus b\in A$ for all $a,b\in A$</td></tr></table></div></div>`,
  });
})();
