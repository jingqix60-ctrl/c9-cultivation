const fs = require('fs');
let c = fs.readFileSync('src/data/math/zhangyu30/chapter10.ts','utf8');

// All LaTeX commands organized by the letter that follows the backslash
// These are the commands to fix when the backslash was dropped or became a control char
const byLetter = {
  f: ['frac'],
  t: ['theta','times','textstyle','tan','to','tau','tilde','triangle','text'],
  r: ['rightarrow','Rightarrow','rbrace','rangle','rho','right'],
  b: ['begin','big','Big','bigg','Bigg','bar','beta','binom','bmod','bullet'],
  n: ['nu','nabla','neq','notin'],
  s: ['sin','sqrt','sum','sigma','subset','subseteq','supset','supseteq','sim','square','scriptstyle'],
  c: ['cos','cdot','cdots','circ','choose'],
  i: ['int','iint','iiint','infty','in','iota','item','Im'],
  p: ['pi','partial','pm','prod','propto','psi','varphi','phi','perp','parallel','pmod'],
  l: ['lambda','lim','log','ln','left','langle','lbrace','leftarrow','longmapsto','leqslant','leq'],
  d: ['delta','displaystyle','div','dot','ddot','diamond','deg','dim'],
  a: ['alpha','arctan','arcsin','arccos','approx','aleph'],
  e: ['epsilon','eta','equiv','exists','ell'],
  g: ['gamma','geq','geqslant'],
  h: ['hat','hbar','hom','hfill'],
  k: ['kappa'],
  m: ['mu','mp','mapsto','mathbb','mid','mathcal','mho','mathfrak'],
  o: ['omega','oint','oplus','ominus','otimes','omicron','overline','overbrace'],
  u: ['upsilon','uparrow','underline','underbrace'],
  v: ['vec','varepsilon','vfill','vdots'],
  w: ['wp','widehat','widetilde'],
  x: ['xi'],
  z: ['zeta'],
};

// Map control chars to their letter
const ctrlMap = {0x0c:'f', 0x09:'t', 0x0d:'r', 0x08:'b', 0x0a:'n'};

function fixMath(inner) {
  // Step 1: Handle control characters (broken backslash-commands)
  for (const [code, letter] of Object.entries(ctrlMap)) {
    const cmds = byLetter[letter] || [];
    for (const cmd of cmds) {
      const rest = cmd.slice(1); // part after the first letter
      if (rest.length > 0) {
        const ctrlChar = String.fromCharCode(parseInt(code));
        const pattern = ctrlChar + rest;
        if (inner.includes(pattern)) {
          inner = inner.split(pattern).join('\\\\' + cmd);
        }
      }
    }
  }

  // Step 2: Handle dropped backslash (bare words in math mode)
  for (const [letter, cmds] of Object.entries(byLetter)) {
    if (['f','t','r','b','n'].includes(letter)) continue; // handled in step 1
    for (const cmd of cmds) {
      const re = new RegExp('(?<![a-zA-Z\\])' + cmd + '(?![a-zA-Z])', 'g');
      inner = inner.replace(re, '\\\\' + cmd);
    }
  }

  // Step 3: Quadruple any remaining single backslash + letter
  inner = inner.replace(/(?<!\)\(?!\)([a-zA-Z])/g, '\\\\$1');

  return inner;
}

// Process inline and display math
c = c.replace(/\$\$([^$]+?)\$\$/g, (m, inner) => '$$' + fixMath(inner) + '$$');
c = c.replace(/\$([^$]+?)\$/g, (m, inner) => '$' + fixMath(inner) + '$');

fs.writeFileSync('src/data/math/zhangyu30/chapter10.ts', c);
console.log('Fixed');
