import type { ChapterData } from '../../types';

export const chapter10Data: ChapterData = {
  chapterId: 10, chapterTitle: '一元函数积分学的应用（一）——几何应用', book: '张宇30讲',
  mainSource: '张宇30讲第10讲 · 一元函数积分学的应用（一）——几何应用',
  description: '平面面积、旋转体体积、函数平均值——圆盘法、柱壳法、反常积分、综合应用',
  stageId: 'foundation', subjectId: 'math',
  stages: [{id:0,name:'引气入体'},{id:1,name:'炼气'},{id:2,name:'筑基'},{id:3,name:'金丹'},{id:4,name:'元婴'},{id:5,name:'化神'}],
  knowledgePoints: ['平面图形面积','圆盘法(垫片法)','柱壳法','绕x轴','绕y轴','非坐标轴旋转','参数方程旋转体','反常积分型体积','两曲线区域','分段函数区域','定义域判断','函数的平均值','方法选择','微元法','综合应用'],
  modules: [{id:'area',name:'平面面积',order:0},{id:'disk',name:'圆盘法·绕x轴',order:1},{id:'shell',name:'柱壳法·绕y轴',order:2},{id:'two-curves',name:'两曲线区域',order:3},{id:'non-axis',name:'非坐标轴旋转',order:4},{id:'comprehensive',name:'综合应用',order:5}],
  tasks: [
    // ═══════════════ STAGE 0 · 引气入体 ═══════════════
    {
      id: 0, stage: 0, stageName: '引气入体',
      title: '柱壳法微元推导',
      source: '李正元复习全书 · 第三章 §七(四)2 · 例3.27 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 1,
      skillTags: ["微元法","柱壳法推导"],
      reward: {mastery:3,method:2,calc:0,geometry:3,c9:0},
      knowledgePoints: ["微元法","柱壳法"],
      mistakeTypes: ["geometry"],
      moduleId: 'formula',
      question: `设函数 $y=f(x)$ 在 $[a,b]$（$a>0$）上连续，由曲线 $y=f(x)$、直线 $x=a$、$x=b$ 及 $x$ 轴围成的平面图形绕 $y$ 轴旋转一周得旋转体，试导出该旋转体的体积公式。`,
      hint: `取 $[x,x+dx]$ 上的小竖条，绕 $y$ 轴旋转后成为圆柱壳。沿竖线切开、展平即为长方体。`,
      answer: `取 $[x,x+dx]$ 上的小区间，相应得到小曲边梯形。

它绕 $y$ 轴旋转所成立体的体积微元为：

$$dV = |f(x)| \\cdot 2\\pi x \\cdot dx$$

（周长 $2\\pi x$ × 高度 $|f(x)|$ × 厚度 $dx$）

积分得柱壳法公式：

$$V = 2\\pi\\int_a^b x|f(x)|\\,dx$$`,
      method: `微元法三步：取微元 → 求微元体几何量 → 积分。柱壳法的几何直观：竖条绕 $y$ 轴形成圆柱壳，展开为长方体。`,
      trap: `公式中保留 $|f(x)|$ 更安全，即使本题 $f(x)\\ge0$。公式要求 $a\\ge0$，即区域在 $y$ 轴右侧。`,
      afterMastery: `理解柱壳法的微元本质，而非死记公式。`,
    },
    {
      id: 1, stage: 0, stageName: '引气入体',
      title: '绕x轴·圆盘法+定义域判断',
      source: '张宇30讲 · 第10讲 §2 · 例10.5 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 2,
      skillTags: ["绕x轴","圆盘法","定义域判断"],
      reward: {mastery:4,method:1,calc:3,geometry:1,c9:0},
      knowledgePoints: ["圆盘法(垫片法)","绕x轴","定义域判断"],
      mistakeTypes: ["region"],
      moduleId: 'disk',
      question: `求曲线 $y = e^{-x/2}\\sqrt{\\sin x}$ 在 $[0, 2\\pi]$ 部分与 $x$ 轴围成的平面图形绕 $x$ 轴旋转一周所成的旋转体的体积。`,
      hint: `先确认 $\\sin x$ 在哪些区间 $\\ge 0$。函数在 $(\\pi,2\\pi]$ 无定义，有效积分区间仅为 $[0,\\pi]$。`,
      answer: `第1步：判断定义域

$y = e^{-x/2}\\sqrt{\\sin x}$ 仅在 $\\sin x \\ge 0$ 时有定义，即 $x\\in[0,\\pi]$。在 $(\\pi,2\\pi]$ 上函数不存在。

第2步：圆盘法公式

$$V = \\pi\\int_0^\\pi y^2(x)\\,dx = \\pi\\int_0^\\pi e^{-x}\\sin x\\,dx$$

第3步：计算积分

利用分部积分或公式：
$$\\int_0^\\pi e^{-x}\\sin x\\,dx = \\frac{1}{2}(1+e^{-\\pi})$$

第4步：得出结果

$$V = \\pi \\cdot \\frac{1}{2}(1+e^{-\\pi}) = \\frac{\\pi}{2}(1+e^{-\\pi})$$`,
      method: `圆盘法绕 $x$ 轴：$V=\\pi\\int y^2 dx$。流程：确定定义域 → 写出 $y^2$ → 积分。`,
      trap: `不能直接在 $[0,2\\pi]$ 上积分——函数在 $(\\pi,2\\pi]$ 无定义。先判断定义域！`,
      afterMastery: `掌握绕 $x$ 轴圆盘法的完整流程：定义域 → 平方 → 积分。`,
    },
    {
      id: 2, stage: 0, stageName: '引气入体',
      title: '两曲线围成面积',
      source: '李永乐复习全书 · 基础篇 · 第三章 例2 | 已核验 | 数三',
      sourceType: 'main',
      time: '8分钟', difficulty: 1,
      skillTags: ["面积","两曲线"],
      reward: {mastery:3,method:0,calc:2,geometry:2,c9:0},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["region"],
      moduleId: 'area',
      question: `平面区域 $D$ 由曲线 $y = x^{2}$ 及 $x = y^{2}$ 围成，求其面积 $S$。`,
      hint: `两曲线交点为 $(0,0)$ 和 $(1,1)$。用 $x$ 积分：上曲线 $y=\\sqrt{x}$，下曲线 $y=x^2$。`,
      answer: `交点为 $(0,0)$ 和 $(1,1)$。

用 $x$ 为积分变量，上减下：

$$S = \\int_0^1(\\sqrt{x}-x^2)\\,dx$$

计算：

$$S = \\left[\\frac{2}{3}x^{3/2}-\\frac{1}{3}x^3\\right]_0^1 = \\frac{1}{3}$$

原书答案：$\\frac{1}{3}$。`,
      method: `直角坐标下两曲线围成面积：先求交点 → 判断上下 → $S=\\int(上-下)dx$。`,
      trap: `注意区分谁在上谁在下——$\\sqrt{x}\\ge x^2$ 在 $[0,1]$ 上成立。如果用 $y$ 积分，左右曲线不同。`,
      afterMastery: `掌握两曲线围成面积的基本方法。`,
    },
    {
      id: 3, stage: 0, stageName: '引气入体',
      title: '真题·对y积分求面积',
      source: '2014年数三真题 · 武忠祥基础篇 · 第六章 例1 | 已核验 | 数三',
      sourceType: 'skill',
      time: '8分钟', difficulty: 1,
      skillTags: ["面积","真题","对y积分"],
      reward: {mastery:3,method:1,calc:2,geometry:2,c9:0},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["region"],
      moduleId: 'area',
      question: `设 $D$ 是由曲线 $xy + 1 = 0$ 与直线 $y + x = 0$ 及 $y = 2$ 围成的有界区域，则 $D$ 的面积为 ____。`,
      hint: `画图，用 $y$ 积分更方便：$x$ 的范围由两条曲线给出。`,
      answer: `用 $y$ 为积分变量，先对 $x$ 积分：

$$S = \\iint_D 1\\,d\\sigma = \\int_1^2 dy\\int_{-y}^{-1/y} dx = \\int_1^2\\left(-\\frac{1}{y}+y\\right)dy$$

计算：

$$S = \\left[-\\ln y + \\frac{y^2}{2}\\right]_1^2 = \\frac{3}{2} - \\ln 2$$

原书答案：$\\frac{3}{2} - \\ln 2$。`,
      method: `对 $y$ 积分求面积：$S = \\int(右-左)\\,dy$。当对 $x$ 积分麻烦时，换对 $y$ 积分。`,
      trap: `不要习惯性只对 $x$ 积分——有时对 $y$ 积分更简单。画图判断左右边界是关键。`,
      afterMastery: `掌握对 $y$ 积分求面积的方法。`,
    },

    // ═══════════════ STAGE 1 · 炼气 ═══════════════
    {
      id: 4, stage: 1, stageName: '炼气',
      title: '反常积分型·绕x轴',
      source: '张宇30讲 · 第10讲 习题 · 习题10.2 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 2,
      skillTags: ["反常积分","无穷区间","绕x轴"],
      reward: {mastery:3,method:0,calc:3,geometry:1,c9:0},
      knowledgePoints: ["反常积分型体积","绕x轴"],
      mistakeTypes: ["integral"],
      moduleId: 'disk',
      question: `位于曲线 $y = \\frac{1}{\\sqrt{1 + x^2}}$（$0 \\leqslant x < +\\infty$）下方、$x$ 轴上方的无界区域绕 $x$ 轴旋转一周所得旋转体的体积为 ____。`,
      hint: `$V=\\pi\\int_0^{+\\infty}y^2 dx$。$y^2=\\frac{1}{1+x^2}$，积分恰好是 $\\arctan x$。`,
      answer: `第1步：写出体积积分

$$V = \\pi\\int_0^{+\\infty} \\frac{1}{1+x^2}\\,dx$$

第2步：计算反常积分

$$\\int_0^{+\\infty}\\frac{1}{1+x^2}\\,dx = \\arctan x\\Big|_0^{+\\infty} = \\frac{\\pi}{2}$$

第3步：得出结果

$$V = \\pi \\cdot \\frac{\\pi}{2} = \\frac{\\pi^2}{2}$$

原书答案：$\\frac{\\pi^2}{2}$。`,
      method: `先写体积积分式，再判断反常积分是否收敛。`,
      trap: `$\\int_0^{+\\infty}\\frac{dx}{1+x^2} = \\frac{\\pi}{2}$——必须记住的基础反常积分。`,
      afterMastery: `掌握无穷区间上旋转体体积的计算。`,
    },
    {
      id: 5, stage: 1, stageName: '炼气',
      title: '参数方程·绕y轴（柱壳法）',
      source: '张宇30讲 · 第10讲 习题 · 习题10.8 | 已核验 | 数三',
      sourceType: 'main',
      time: '12分钟', difficulty: 2,
      skillTags: ["绕y轴","柱壳法","参数方程"],
      reward: {mastery:4,method:2,calc:3,geometry:2,c9:1},
      knowledgePoints: ["柱壳法","参数方程旋转体","绕y轴"],
      mistakeTypes: ["parametric_dx"],
      moduleId: 'shell',
      question: `计算由摆线 $x = a(t - \\sin t),\\ y = a(1 - \\cos t)$（$a > 0,\\ 0 \\leqslant t \\leqslant 2\\pi$）与 $x$ 轴所围平面图形绕 $y$ 轴旋转一周所得旋转体的体积。`,
      hint: `绕 $y$ 轴用柱壳法：$V_y = 2\\pi\\int xy\\,dx$。换为参数 $t$：$dx = x'(t)dt = a(1-\\cos t)dt$。`,
      answer: `第1步：柱壳法公式

$$V_y = 2\\pi\\int_0^{2\\pi a} x \\cdot y\\,dx$$

第2步：换为参数 $t$

$x = a(t-\\sin t)$，$y = a(1-\\cos t)$，$dx = a(1-\\cos t)dt$

$$V_y = 2\\pi\\int_0^{2\\pi} a(t-\\sin t) \\cdot a(1-\\cos t) \\cdot a(1-\\cos t)\\,dt$$

第3步：化简

$$V_y = 2\\pi a^3\\int_0^{2\\pi}(t-\\sin t)(1-\\cos t)^2\\,dt$$

展开后用三角函数周期性质化简。

最终答案：$V = 6\\pi^3 a^3$。`,
      method: `参数方程 + 柱壳法：$V=2\\pi\\int xy\\,dx$，$x,y,dx$ 都用 $t$ 表达。关键：$dx = x'(t)dt$ 不能忘。`,
      trap: `忘记乘 $x'(t)$！这是参数方程旋转体体积的头号失分点。`,
      afterMastery: `掌握参数方程曲线绕 $y$ 轴的柱壳法计算。`,
    },
    {
      id: 6, stage: 1, stageName: '炼气',
      title: '参数方程·绕x轴',
      source: '李永乐复习全书 · 基础篇 · 第三章 例4 | 已核验 | 数三',
      sourceType: 'skill',
      time: '10分钟', difficulty: 2,
      skillTags: ["参数方程","绕x轴","旋轮线"],
      reward: {mastery:3,method:1,calc:3,geometry:1,c9:0},
      knowledgePoints: ["参数方程旋转体","绕x轴"],
      mistakeTypes: ["parametric_dx"],
      moduleId: 'disk',
      question: `求旋轮线 $x = a(t - \\sin t),\\ y = a(1 - \\cos t)$（$t \\in [0, 2\\pi]$）绕 $x$ 轴旋转所成旋转体体积。`,
      hint: `绕 $x$ 轴用圆盘法：$V_x = \\pi\\int y^2\\,dx$，其中 $dx = x'(t)dt = a(1-\\cos t)dt$。`,
      answer: `第1步：圆盘法公式

$$V = \\pi\\int_0^{2\\pi} y^2\\,dx$$

第2步：换为参数 $t$

$$V = \\pi\\int_0^{2\\pi} y^2(t)\\,x'(t)\\,dt = \\pi\\int_0^{2\\pi} a^3(1-\\cos t)^3\\,dt$$

第3步：展开计算

$(1-\\cos t)^3$ 展开后利用三角函数周期性质。

最终答案：$V = 5\\pi^2 a^3$。`,
      method: `参数方程绕 $x$ 轴：$V=\\pi\\int y^2 \\cdot x'(t)dt$。$(1-\\cos t)^n$ 展开用三角函数周期性质。`,
      trap: `与习题10.8对比：同一摆线，绕 $x$ 轴和绕 $y$ 轴体积不同，方法也不同。绕 $y$ 轴用柱壳法，绕 $x$ 轴用圆盘法。`,
      afterMastery: `掌握同一参数方程绕不同轴的方法选择。`,
    },
    {
      id: 7, stage: 1, stageName: '炼气',
      title: '绕x轴vs绕y轴对比',
      source: '2015年真题 · 数二、三 · 武忠祥基础篇 例3 | 已核验 | 数三',
      sourceType: 'skill',
      time: '12分钟', difficulty: 2,
      skillTags: ["绕x轴","绕y轴","柱壳法","真题"],
      reward: {mastery:4,method:3,calc:3,geometry:2,c9:1},
      knowledgePoints: ["绕x轴","绕y轴","柱壳法","方法选择"],
      mistakeTypes: ["method_selection","calculation"],
      moduleId: 'shell',
      question: `设 $A > 0$，$D$ 是由曲线段 $y = A\\sin x$（$0 \\leqslant x \\leqslant \\frac{\\pi}{2}$）及直线 $y = 0$、$x = \\frac{\\pi}{2}$ 所围成的平面区域，$V_1,V_2$ 分别表示 $D$ 绕 $x$ 轴与 $y$ 轴旋转所成旋转体的体积。若 $V_1 = V_2$，求 $A$ 的值。`,
      hint: `绕 $x$ 轴用圆盘法，绕 $y$ 轴用柱壳法。$\\int_0^{\\pi/2}\\sin^2 x\\,dx = \\frac{\\pi}{4}$。`,
      answer: `第1步：绕 $x$ 轴（圆盘法）

$$V_1 = \\pi\\int_0^{\\pi/2} A^2\\sin^2 x\\,dx = \\frac{\\pi^2 A^2}{4}$$

第2步：绕 $y$ 轴（柱壳法）

$$V_2 = 2\\pi\\int_0^{\\pi/2} x \\cdot A\\sin x\\,dx = 2\\pi A$$

（$\\int_0^{\\pi/2} x\\sin x\\,dx = 1$）

第3步：令 $V_1 = V_2$ 求解

$$\\frac{\\pi^2 A^2}{4} = 2\\pi A \\quad\\Rightarrow\\quad A = \\frac{8}{\\pi}$$

原书答案：$A = \\frac{8}{\\pi}$。`,
      method: `同一区域绕不同轴，体积通常不同。绕 $y$ 轴不要用圆盘法——反解 $x=\\arcsin(y/A)$ 积分极其麻烦。`,
      trap: `绕 $y$ 轴优先用柱壳法，不要习惯性反解。`,
      afterMastery: `掌握同一区域绕不同轴的体积对比计算。`,
    },
    {
      id: 8, stage: 1, stageName: '炼气',
      title: '面积+数列极限综合',
      source: '张宇30讲 · 第10讲 §1 · 例10.1 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 2,
      skillTags: ["面积","数列极限","裂项相消"],
      reward: {mastery:3,method:1,calc:3,geometry:1,c9:0},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["calculation"],
      moduleId: 'area',
      question: `设 $A_n$ 是曲线 $y = x^n$ 与 $y = x^{n+1}$（$n = 1, 2, \\cdots$）所围区域的面积，则 $\\lim_{n \\to \\infty}\\left(2\\sum_{k=1}^{n} A_k\\right)^{n} =$ ____。`,
      hint: `交点 $(0,0)$ 和 $(1,1)$。$A_n = \\int_0^1(x^n - x^{n+1})\\,dx$。求和后用裂项相消。`,
      answer: `第1步：求 $A_n$

交点为 $(0,0),(1,1)$。

$$A_n = \\int_0^1(x^n - x^{n+1})\\,dx = \\frac{1}{n+1} - \\frac{1}{n+2}$$

第2步：求和（裂项相消）

$$2\\sum_{k=1}^{n}A_k = 2\\sum_{k=1}^{n}\\left(\\frac{1}{k+1}-\\frac{1}{k+2}\\right) = 2\\left(\\frac{1}{2}-\\frac{1}{n+2}\\right) = 1-\\frac{2}{n+2}$$

第3步：取极限

$$\\lim_{n\\to\\infty}\\left(1-\\frac{2}{n+2}\\right)^n = e^{-2}$$

原书答案：$e^{-2}$。`,
      method: `定积分面积与数列极限的综合。面积 → 裂项相消求和 → 重要极限 $(1+\\frac{a}{n})^n\\to e^a$。`,
      trap: `注意 $2\\sum A_k$ 中的系数 2 和裂项后的首项。裂项相消时首尾项不要写错。`,
      afterMastery: `掌握面积与极限的综合题型。`,
    },
    {
      id: 9, stage: 1, stageName: '炼气',
      title: '参数方程·摆线一拱面积',
      source: '张宇30讲 · 第10讲 §1 · 例10.2 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 2,
      skillTags: ["面积","参数方程","摆线"],
      reward: {mastery:3,method:1,calc:3,geometry:1,c9:0},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["parametric_dx"],
      moduleId: 'area',
      question: `求由摆线 $x = a(t - \\sin t),\\ y = a(1 - \\cos t)$（$a > 0$）的一拱与 $x$ 轴所围平面图形的面积。`,
      hint: `$t$ 从 $0$ 到 $2\\pi$ 正好是一拱。$S = \\int_0^{2\\pi a} y(x)\\,dx = \\int_0^{2\\pi} y(t)\\,x'(t)\\,dt$。`,
      answer: `当 $t=0$ 或 $t=2\\pi$ 时 $y=0$，$t$ 由 $0$ 到 $2\\pi$ 正好成一拱。

第1步：参数方程面积公式

$$S = \\int_0^{2\\pi a} y(x)\\,dx = \\int_0^{2\\pi} y(t) \\cdot x'(t)\\,dt$$

第2步：代入

$y(t) = a(1-\\cos t)$，$x'(t) = a(1-\\cos t)$

$$S = \\int_0^{2\\pi} a(1-\\cos t) \\cdot a(1-\\cos t)\\,dt = a^2\\int_0^{2\\pi}(1-\\cos t)^2\\,dt$$

第3步：展开并利用周期性质

$(1-\\cos t)^2 = 1 - 2\\cos t + \\cos^2 t$

$\\int_0^{2\\pi}\\cos t\\,dt = 0$，$\\int_0^{2\\pi}\\cos^2 t\\,dt = \\pi$

$$S = a^2(2\\pi + \\pi) = 3\\pi a^2$$

原书答案：$3\\pi a^2$。`,
      method: `参数方程面积公式：$S = \\int_{\\alpha}^{\\beta} y(t)\\,x'(t)\\,dt$。与体积题对比：同一摆线，面积和体积用的是同一个 $dx=x'(t)dt$ 转换。`,
      trap: `$x'(t)=a(1-\\cos t)$，不要与 $y(t)$ 的导数搞混。$\\cos t$ 在 $[0,2\\pi]$ 上积分为 0（周期性质）。`,
      afterMastery: `掌握参数方程曲线面积的计算，与体积题形成知识呼应。`,
    },

    // ═══════════════ STAGE 2 · 筑基 ═══════════════
    {
      id: 10, stage: 2, stageName: '筑基',
      title: '绕斜直线 y=x',
      source: '张宇30讲 · 第10讲 §2(3) · 例10.8 | 已核验 | 数三',
      sourceType: 'main',
      time: '12分钟', difficulty: 3,
      skillTags: ["两曲线","绕斜直线"],
      reward: {mastery:4,method:2,calc:3,geometry:2,c9:0},
      knowledgePoints: ["两曲线区域","非坐标轴旋转"],
      mistakeTypes: ["non_coordinate_translation"],
      moduleId: 'non-axis',
      question: `曲线 $y = \\sqrt{x}$ 与 $y = x$ 所围平面有界区域绕直线 $y = x$ 旋转一周所得旋转体的体积为 ____。`,
      hint: `用张宇公式(10-1)或平行截面法。直线 $L_0: x-y=0$，取 $A=1,B=-1,C=0$。`,
      answer: `曲线 $L: y=\\sqrt{x},\\ 0\\le x\\le1$。直线 $L_0: y=x$ 即 $x-y=0$。

第1步：使用张宇公式(10-1)

$$V = \\frac{\\pi}{(A^2+B^2)^{3/2}}\\int_0^1(Ax+By+C)^2\\cdot|Ay'-B|\\,dx$$

代入 $A=1,B=-1,C=0$：

$$V = \\frac{\\pi}{(1+1)^{3/2}}\\int_0^1(x-\\sqrt{x})^2\\cdot\\left|\\frac{1}{2\\sqrt{x}}+1\\right|dx$$

第2步：计算

$$V = \\frac{\\pi}{2\\sqrt{2}}\\int_0^1(x-\\sqrt{x})^2\\cdot\\left(\\frac{1}{2\\sqrt{x}}+1\\right)dx = \\frac{\\sqrt{2}}{60}\\pi$$

原书答案：$\\frac{\\sqrt{2}}{60}\\pi$。`,
      method: `绕非坐标轴：使用张宇公式(10-1)，或平移化归后用圆盘法/柱壳法。`,
      trap: `绕 $y=x$ 时截面不是普通圆盘。若用平行截面法，$A(x)$ 需额外乘 $\\sqrt{2}$。`,
      afterMastery: `掌握绕非坐标轴直线的两种解法。`,
    },
    {
      id: 11, stage: 2, stageName: '筑基',
      title: '分段函数·绝对值区域绕y=3',
      source: '张宇30讲 · 第10讲 习题 · 习题10.9 | 已核验 | 数三',
      sourceType: 'main',
      time: '12分钟', difficulty: 3,
      skillTags: ["分段区域","绝对值","绕水平线"],
      reward: {mastery:3,method:2,calc:3,geometry:3,c9:1},
      knowledgePoints: ["两曲线区域","非坐标轴旋转","分段函数区域"],
      mistakeTypes: ["region","non_coordinate_translation"],
      moduleId: 'two-curves',
      question: `求曲线 $y=3-|x^{2}-1|$ 与 $x$ 轴围成的封闭图形绕直线 $y=3$ 旋转一周所得旋转体的体积。`,
      hint: `去绝对值：$|x|\\le1$ 时 $y=2+x^2$；$|x|>1$ 时 $y=4-x^2$。绕 $y=3$ 平移 $u=y-3$。`,
      answer: `第1步：去绝对值

当 $|x|\\le1$：$y = 3-(1-x^2) = 2+x^2$

当 $|x|>1$：$y = 3-(x^2-1) = 4-x^2$

第2步：平移变换

令 $u = y-3$，则旋转轴 $y=3$ 变为 $u=0$。

当 $|x|\\le1$：$u = x^2-1$（上边界）

当 $|x|>1$：$u = 1-x^2$（上边界）

第3步：对 $u$ 用垫片法分段积分

方法流程：去绝对值 → 平移变换 → 垫片法分段积分。`,
      method: `三步：去绝对值 → 平移变换 → 垫片法。绕 $y=3$ 时内半径是 $3-y$，不是 $y$。`,
      trap: `绕 $y=3$ 时注意平移后的内外半径。区域边界在不同区间不同，需分段处理。`,
      afterMastery: `掌握绝对值分段 + 绕非坐标轴平移的完整技法。`,
    },
    {
      id: 12, stage: 2, stageName: '筑基',
      title: '环面体积·圆域绕外轴',
      source: '张宇30讲 · 第10讲 习题 · 习题10.3 | 已核验 | 数三',
      sourceType: 'main',
      time: '15分钟', difficulty: 3,
      skillTags: ["环面体积","柱壳法","对称性"],
      reward: {mastery:5,method:3,calc:5,geometry:4,c9:2},
      knowledgePoints: ["柱壳法","非坐标轴旋转"],
      mistakeTypes: ["calculation","geometry"],
      moduleId: 'shell',
      question: `圆域 $x^{2}+(y-b)^{2}\\leqslant k^{2}$（$0<k<b$，圆在 $x$ 轴上方）绕 $x$ 轴旋转一周所得旋转体的体积 $V=$ ____。`,
      hint: `水平条长度 $= 2\\sqrt{k^2-(y-b)^2}$。换元 $u=y-b$，奇函数部分积分为 0。`,
      answer: `第1步：柱壳法（绕水平轴）

水平条长度 $= 2\\sqrt{k^2-(y-b)^2}$

$$V = 4\\pi\\int_{b-k}^{b+k} y\\sqrt{k^2-(y-b)^2}\\,dy$$

第2步：换元 $u = y-b$

$$V = 4\\pi\\int_{-k}^{k}(u+b)\\sqrt{k^2-u^2}\\,du$$

第3步：奇偶性拆分

$u\\sqrt{k^2-u^2}$ 是奇函数，积分为 0。

$$V = 4\\pi b\\int_{-k}^{k}\\sqrt{k^2-u^2}\\,du = 4\\pi b \\cdot \\frac{\\pi k^2}{2} = 2\\pi^2 b k^2$$

原书答案：$2\\pi^2 b k^2$。`,
      method: `柱壳法绕水平轴 + 换元 + 奇偶性拆分。`,
      trap: `水平条长度是 $2\\sqrt{k^2-(y-b)^2}$，不是 $\\sqrt{...}$。圆有左右两半！`,
      afterMastery: `掌握柱壳法处理圆域绕外轴的标准技法。`,
    },
    {
      id: 13, stage: 2, stageName: '筑基',
      title: '绕竖直线 x=2 · 双法对比',
      source: '李正元复习全书 · 第三章 · 例3.55 | 已核验 | 数三（同题亦见武忠祥辅导讲义例2）',
      sourceType: 'skill',
      time: '18分钟', difficulty: 3,
      skillTags: ["绕非坐标轴","柱壳法","垫片法","方法对比"],
      reward: {mastery:5,method:5,calc:4,geometry:4,c9:2},
      knowledgePoints: ["非坐标轴旋转","柱壳法","圆盘法(垫片法)","方法选择"],
      mistakeTypes: ["radius","method_selection"],
      moduleId: 'non-axis',
      question: `求由曲线 $x^{2}+y^{2}\\leqslant 2x$ 与 $y\\geqslant x$ 确定的平面图形绕直线 $x=2$ 旋转而成的旋转体的体积 $V$。`,
      hint: `区域是圆 $(x-1)^2+y^2\\le 1$ 在 $y=x$ 上方部分。柱壳法对 $x$ 积分，旋转半径 $=2-x$。`,
      answer: `区域：圆 $(x-1)^2+y^2\\le 1$ 在直线 $y=x$ 上方的部分。

方法一（柱壳法，对 $x$ 积分）：

旋转半径 $= 2-x$，高度 $= \\sqrt{2x-x^2}-x$

$$V = 2\\pi\\int_0^1(2-x)(\\sqrt{2x-x^2}-x)\\,dx$$

方法二（垫片法，对 $y$ 积分）：

$$dV = \\pi[R_{\\text{外}}^2(y) - R_{\\text{内}}^2(y)]\\,dy$$

最终结果：

$$V = \\frac{\\pi^2}{2} - \\frac{2\\pi}{3}$$

原书答案：$\\frac{\\pi^2}{2} - \\frac{2\\pi}{3}$。`,
      method: `绕竖直线：柱壳法用 $x$ 积分（旋转半径 × 高度），垫片法用 $y$ 积分（$R_{\\text{外}}^2-R_{\\text{内}}^2$）。`,
      trap: `柱壳法的旋转半径是 $(2-x)$，不是 $x$。绕非坐标轴时半径表达式容易搞混。`,
      afterMastery: `掌握绕竖直线旋转的两种微元法，根据区域形状选择更优方向。`,
    },
    {
      id: 14, stage: 2, stageName: '筑基',
      title: '切线+面积+四轴旋转对比',
      source: '武忠祥高等数学辅导讲义 · 第三章 · 例3 | 已核验 | 数三',
      sourceType: 'skill',
      time: '18分钟', difficulty: 3,
      skillTags: ["切线","面积","方法选择","绕x轴","绕y轴","绕水平线"],
      reward: {mastery:5,method:5,calc:4,geometry:3,c9:2},
      knowledgePoints: ["方法选择","绕x轴","绕y轴","非坐标轴旋转"],
      mistakeTypes: ["method_selection","radius","non_coordinate_translation"],
      moduleId: 'non-axis',
      question: `过点 $(1,0)$ 作曲线 $y=x^{2}$ 的切线，该切线与曲线 $y=x^{2}$ 及 $x$ 轴围成平面图形 $D$。求：

(1) $D$ 的面积 $A$；

(2) $D$ 绕 $x$ 轴旋转一周所得体积 $V_x$；

(3) $D$ 绕 $y$ 轴旋转一周所得体积 $V_y$；

(4) $D$ 绕直线 $y=4$ 旋转一周所得体积 $V_{y=4}$。`,
      hint: `切点 $(2,4)$，切线 $y=4(x-1)$。(4) 平移后用垫片法。`,
      answer: `切点 $(2,4)$，切线 $y=4(x-1)$。

原书答案：

(1) 面积 $A = \\frac{2}{3}$

(2) 绕 $x$ 轴：$V_x = \\frac{16}{15}\\pi$

(3) 绕 $y$ 轴：$V_y = \\frac{4}{3}\\pi$

(4) 绕 $y=4$：$V_{y=4} = \\frac{64}{15}\\pi$

思路：同一区域，绕四根不同轴——方法选择的核心训练。绕 $x$ 轴用圆盘法；绕 $y$ 轴用柱壳法；绕水平线用平移化归。`,
      method: `同一区域，绕四根不同轴——方法选择的核心训练。绕 $x$ 轴用圆盤法；绕 $y$ 轴用柱壳法；绕水平线用平移化归。`,
      trap: `区域 $D$ 的边界在不同轴上不一样。绕 $y$ 轴时注意 $D$ 的左右边界——区域判断错了全盘皆错。`,
      afterMastery: `形成"同一区域、换轴即换方法"的核心意识。`,
    },
    {
      id: 15, stage: 2, stageName: '筑基',
      title: '容器绕y轴·分段曲线容积',
      source: '武忠祥高等数学基础篇 · 第六章 · 例6 | 已核验 | 数三（仅收录容积部分。同题亦见李永乐例6）',
      sourceType: 'skill',
      time: '12分钟', difficulty: 3,
      skillTags: ["绕y轴","分段曲线","实际应用"],
      reward: {mastery:4,method:2,calc:3,geometry:3,c9:1},
      knowledgePoints: ["圆盘法(垫片法)","绕y轴"],
      mistakeTypes: ["region","calculation"],
      moduleId: 'shell',
      question: `一容器的内侧是由图中曲线绕 $y$ 轴旋转一周而成的曲面，该曲线由 $x^{2}+y^{2}=2y$（$y\\geqslant\\frac{1}{2}$）与 $x^{2}+y^{2}=1$（$y\\leqslant\\frac{1}{2}$）连接而成。求容器的容积。（长度单位：m）`,
      hint: `绕 $y$ 轴旋转用圆盘法对 $y$ 积分：$V=\\pi\\int x^{2}\\,dy$。曲线是两段圆弧拼接，需分两段积分。`,
      answer: `第1步：圆盘法对 $y$ 积分

$$V = \\pi\\int x^{2}\\,dy$$

第2步：反解 $x^2$

上半段（$y\\geqslant 1/2$）：$x^{2}=2y-y^{2}$

下半段（$y\\leqslant 1/2$）：$x^{2}=1-y^{2}$

第3步：分段积分

$$V = \\pi\\int_{-1}^{1/2}(1-y^{2})\\,dy + \\pi\\int_{1/2}^{2}(2y-y^{2})\\,dy$$

$$= \\pi\\left[y-\\frac{y^{3}}{3}\\right]_{-1}^{1/2} + \\pi\\left[y^{2}-\\frac{y^{3}}{3}\\right]_{1/2}^{2} = \\frac{9\\pi}{4}$$

原书答案：$V=\\frac{9\\pi}{4}$（m³）。`,
      method: `绕 $y$ 轴旋转对 $y$ 积分：$V=\\pi\\int x^{2}(y)\\,dy$。关键：反解 $x^{2}$ 而非 $x$，直接代入圆盤法公式。分段曲线需分段积分。`,
      trap: `不要试图对整个曲线用统一的 $x(y)$ 表达式——两段圆弧的方程不同，必须分段积分。绕 $y$ 轴时对 $y$ 积分用 $\\pi\\int x^{2}\\,dy$，不是 $2\\pi\\int xy\\,dx$。`,
      afterMastery: `掌握绕 $y$ 轴旋转容器类实际应用题的分段积分方法。`,
    },
    {
      id: 16, stage: 2, stageName: '筑基',
      title: '极坐标·双纽线面积',
      source: '张宇30讲 · 第10讲 §1 · 例10.3 | 已核验 | 数三',
      sourceType: 'main',
      time: '10分钟', difficulty: 3,
      skillTags: ["面积","极坐标","对称性"],
      reward: {mastery:3,method:1,calc:2,geometry:3,c9:1},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["geometry"],
      moduleId: 'two-curves',
      question: `求伯努利双纽线 $r^{2} = a^{2}\\cos 2\\theta$ 围成的图形面积。`,
      hint: `利用对称性，所求面积是 $\\theta=0$ 到 $\\theta=\\pi/4$ 部分面积的 4 倍。极坐标面积公式：$S = \\frac12\\int r^2\\,d\\theta$。`,
      answer: `第1步：极坐标面积公式

$$S = \\frac12\\int r^2(\\theta)\\,d\\theta$$

第2步：利用对称性

因 $\\cos 2\\theta \\ge 0$ 要求 $\\theta\\in[-\\pi/4,\\pi/4]$，图形关于 $x$ 轴对称。

所求面积为第一象限部分（$\\theta=0$ 到 $\\theta=\\pi/4$）的 4 倍：

$$S = 4 \\cdot \\frac12\\int_0^{\\pi/4} a^2\\cos 2\\theta\\,d\\theta = 2a^2\\int_0^{\\pi/4}\\cos 2\\theta\\,d\\theta$$

第3步：计算

$$S = 2a^2 \\cdot \\frac{\\sin 2\\theta}{2}\\Big|_0^{\\pi/4} = a^2$$

原书答案：$a^2$。`,
      method: `极坐标面积公式：$S = \\frac12\\int_{\\alpha}^{\\beta} r^2(\\theta)\\,d\\theta$。利用对称性简化计算。`,
      trap: `$\\cos 2\\theta\\ge 0$ 要求 $\\theta\\in[-\\pi/4,\\pi/4]$，所以积分限是 $0$ 到 $\\pi/4$ 再乘 4，不是 $0$ 到 $2\\pi$。`,
      afterMastery: `掌握极坐标曲线围成面积的计算和对称性利用。`,
    },
    {
      id: 17, stage: 2, stageName: '筑基',
      title: '反常积分型面积',
      source: '张宇30讲 · 第10讲 §1 · 例10.4 | 已核验 | 数三',
      sourceType: 'main',
      time: '12分钟', difficulty: 3,
      skillTags: ["面积","反常积分","无穷级数"],
      reward: {mastery:4,method:1,calc:4,geometry:1,c9:1},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["integral","calculation"],
      moduleId: 'disk',
      question: `求曲线 $y = e^{-x}\\sin x$（$x \\geqslant 0$）与 $x$ 轴所围平面图形的面积。`,
      hint: `$S = \\int_0^{+\\infty} e^{-x}|\\sin x|\\,dx$。将积分按 $\\sin x$ 的零点分段，化为等比级数求和。`,
      answer: `第1步：面积公式

$$S = \\int_0^{+\\infty} e^{-x}|\\sin x|\\,dx$$

第2步：按零点分段

将 $[0,+\\infty)$ 分为 $[n\\pi, (n+1)\\pi]$（$n=0,1,2,\\ldots$）：

$$S = \\sum_{n=0}^{\\infty}\\left|\\int_{n\\pi}^{(n+1)\\pi} e^{-x}\\sin x\\,dx\\right|$$

第3步：计算每段积分

$$\\int_{n\\pi}^{(n+1)\\pi} e^{-x}\\sin x\\,dx = \\frac{(-1)^n}{2}e^{-n\\pi}(e^{-\\pi}+1)$$

取绝对值后：$\\frac{1}{2}e^{-n\\pi}(e^{-\\pi}+1)$

第4步：等比级数求和

$$S = \\frac{e^{-\\pi}+1}{2}\\sum_{n=0}^{\\infty}(e^{-\\pi})^n = \\frac{e^{-\\pi}+1}{2}\\cdot\\frac{1}{1-e^{-\\pi}} = \\frac{e^{-\\pi}+1}{2(1-e^{-\\pi})}$$

原书答案：$\\frac{e^{-\\pi}+1}{2(1-e^{-\\pi})}$。`,
      method: `无穷区间 + 周期性被积函数 → 分段积分 + 级数求和。$|\\sin x|$ 按零点分段去掉绝对值。`,
      trap: `不要漏掉绝对值！$\\sin x$ 在 $(\\pi,2\\pi)$ 上为负，积分需取绝对值后分段。反常积分 + 级数是本题的核心难点。`,
      afterMastery: `掌握反常积分型面积的分段级数求和法。`,
    },
    {
      id: 18, stage: 2, stageName: '筑基',
      title: '极坐标·双纽线面积（变式）',
      source: '李永乐复习全书 · 基础篇 · 第三章 例3 | 已核验 | 数三',
      sourceType: 'skill',
      time: '8分钟', difficulty: 3,
      skillTags: ["面积","极坐标","对称性"],
      reward: {mastery:3,method:1,calc:2,geometry:3,c9:1},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["geometry"],
      moduleId: 'two-curves',
      question: `求由极坐标方程给出的曲线 $r^{2} = 2a^{2}\\cos 2\\theta$ 围成区域的面积。`,
      hint: `与张宇例10.3类似但系数不同。$r^2=2a^2\\cos 2\\theta$，利用对称性，4 倍第一象限部分。`,
      answer: `利用对称性，所求面积为第一象限部分的 4 倍：

$$S = 4 \\cdot \\frac12\\int_0^{\\pi/4} 2a^2\\cos 2\\theta\\,d\\theta = 4a^2\\int_0^{\\pi/4}\\cos 2\\theta\\,d\\theta$$

$$= 4a^2 \\cdot \\frac{\\sin 2\\theta}{2}\\Big|_0^{\\pi/4} = 2a^2$$

原书答案：$2a^2$。`,
      method: `同张宇例10.3，系数不同的变式练习。极坐标面积公式 $S=\\frac12\\int r^2 d\\theta$ 中系数平方后带出。`,
      trap: `与张宇例10.3的区别只在 $r^2$ 的系数——$a^2$ vs $2a^2$，结果差两倍。`,
      afterMastery: `巩固极坐标面积公式的使用。`,
    },
    {
      id: 19, stage: 2, stageName: '筑基',
      title: '双纽线面积·选择题',
      source: '李正元复习全书 · 第三章 · 例3.54(I) | 已核验 | 数三',
      sourceType: 'skill',
      time: '5分钟', difficulty: 2,
      skillTags: ["面积","极坐标","选择题"],
      reward: {mastery:2,method:0,calc:1,geometry:3,c9:0},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["geometry"],
      moduleId: 'two-curves',
      question: `下列可表示由双纽线 $(x^{2}+y^{2})^{2} = x^{2} - y^{2}$ 围成平面区域的面积的是（ ）。

(A) $2\\int_{0}^{\\frac{\\pi}{4}}\\cos 2\\theta\\,d\\theta$

(B) $4\\int_{0}^{\\frac{\\pi}{2}}\\cos 2\\theta\\,d\\theta$

(C) $2\\int_{0}^{\\frac{\\pi}{2}}\\sqrt{\\cos 2\\theta}\\,d\\theta$

(D) $\\frac12\\int_{0}^{\\frac{\\pi}{2}}(\\cos 2\\theta)^{2}\\,d\\theta$`,
      hint: `先转化为极坐标：$(r^2)^2 = r^2(\\cos^2\\theta-\\sin^2\\theta)$ → $r^2 = \\cos 2\\theta$。面积为 $4\\cdot\\frac12\\int_0^{\\pi/4} r^2 d\\theta$。`,
      answer: `第1步：转化为极坐标

$(x^2+y^2)^2 = x^2-y^2$ → $(r^2)^2 = r^2(\\cos^2\\theta - \\sin^2\\theta)$ → $r^2 = \\cos 2\\theta$

第2步：利用对称性

面积为第一象限部分的 4 倍：

$$S = 4 \\cdot \\frac12\\int_0^{\\pi/4}\\cos 2\\theta\\,d\\theta = 2\\int_0^{\\pi/4}\\cos 2\\theta\\,d\\theta$$

第3步：对比选项

原书答案：(A)。

常见错误：选(C)——用了 $r$ 而不是 $\\frac12 r^2$。面积公式是 $\\frac12\\int r^2 d\\theta$，不是 $\\frac12\\int r\\,d\\theta$。`,
      method: `直角坐标 → 极坐标转换 + 对称性 + 正确使用 $S=\\frac12\\int r^2 d\\theta$。选择题形式考察对面积公式的理解。`,
      trap: `面积公式是 $\\frac12\\int r^2 d\\theta$，不是 $\\frac12\\int r\\,d\\theta$——系数 1/2 和平方容易漏。`,
      afterMastery: `掌握极坐标面积公式并能在选择题中快速判断。`,
    },
    {
      id: 20, stage: 2, stageName: '筑基',
      title: '变上限积分定义的曲线面积',
      source: '武忠祥高等数学辅导讲义 · 第三章 · 例1 | 已核验 | 数三',
      sourceType: 'skill',
      time: '10分钟', difficulty: 3,
      skillTags: ["面积","变上限积分","分段函数"],
      reward: {mastery:3,method:2,calc:3,geometry:2,c9:1},
      knowledgePoints: ["平面图形面积"],
      mistakeTypes: ["region","calculation"],
      moduleId: 'disk',
      question: `设 $f(x) = \\int_{-1}^{x}(1 - |t|)\\,dt$（$x \\geqslant -1$），求曲线 $y = f(x)$ 与 $x$ 轴所围图形的面积。`,
      hint: `先分段计算 $f(x)$（$|t|$ 在 $t=0$ 处分段）。求出 $f(x)$ 后，找 $f(x)=0$ 的根作为积分限。`,
      answer: `第1步：分段计算 $f(x)$

当 $-1\\le x<0$：

$$f(x) = \\int_{-1}^x(1+t)\\,dt = \\frac12(x+1)^2$$

当 $x\\ge 0$：

$$f(x) = \\int_{-1}^0(1+t)\\,dt + \\int_0^x(1-t)\\,dt = 1 - \\frac12(x-1)^2$$

第2步：找 $f(x)=0$ 的根

$-1\\le x<0$：$\\frac12(x+1)^2=0$ → $x=-1$

$x\\ge 0$：$1-\\frac12(x-1)^2=0$ → $x=1+\\sqrt{2}$

第3步：分段积分求面积

$$S = \\int_{-1}^0\\frac12(x+1)^2\\,dx + \\int_0^{1+\\sqrt{2}}\\left[1-\\frac12(x-1)^2\\right]dx = 1+\\frac{2}{3}\\sqrt{2}$$

原书答案：$1+\\frac{2}{3}\\sqrt{2}$。`,
      method: `先算变上限积分得 $f(x)$ → 分段（因为被积函数含绝对值）→ 找零点 → 分段积分求面积。`,
      trap: `$f(x)$ 本身是分段函数，求零点时需在两段分别找。$y=f(x)$ 与 $x$ 轴的"围成区域"指 $f(x)$ 在 $x$ 轴上方的部分。`,
      afterMastery: `掌握由变上限积分定义的曲线与坐标轴围成面积。`,
    },

    // ═══════════════ STAGE 3 · 金丹 ═══════════════
    {
      id: 21, stage: 3, stageName: '金丹',
      title: '函数方程+绕x轴旋转',
      source: '张宇30讲 · 第10讲 §2 · 例10.6 | 已核验 | 数三',
      sourceType: 'main',
      time: '15分钟', difficulty: 4,
      skillTags: ["函数方程","换元","绕x轴"],
      reward: {mastery:5,method:3,calc:4,geometry:3,c9:3},
      knowledgePoints: ["绕x轴","柱壳法"],
      mistakeTypes: ["method_selection","calculation"],
      moduleId: 'comprehensive',
      question: `设函数 $f(x)$ 的定义域为 $(0, +\\infty)$，且满足 $2f(x) + x^{2}f\\left(\\frac{1}{x}\\right) = \\frac{x^{2} + 2x}{\\sqrt{1 + x^{2}}}$。求 $f(x)$，并求曲线 $y = f(x)$、$y = \\frac{1}{2}$、$y = \\frac{\\sqrt{3}}{2}$ 及 $y$ 轴所围图形绕 $x$ 轴旋转所成旋转体的体积。`,
      hint: `用 $\\frac{1}{x}$ 替换 $x$ 建方程组。得 $f(x)=\\frac{x}{\\sqrt{1+x^2}}$。对 $y$ 积分用柱壳法。`,
      answer: `第1步：求 $f(x)$

用 $\\frac{1}{x}$ 替换 $x$，解方程组得：

$$f(x) = \\frac{x}{\\sqrt{1+x^2}} \\quad (x>0)$$

第2步：反解 $x$

由 $y = \\frac{x}{\\sqrt{1+x^2}}$ 得 $x = \\frac{y}{\\sqrt{1-y^2}}$（$0<y<1$）

第3步：绕 $x$ 轴旋转（对 $y$ 用柱壳法）

$$V = 2\\pi\\int_{1/2}^{\\sqrt{3}/2} xy\\,dy = 2\\pi\\int_{1/2}^{\\sqrt{3}/2}\\frac{y^2}{\\sqrt{1-y^2}}\\,dy$$

令 $y = \\sin t$：

$$V = 2\\pi\\int_{\\pi/6}^{\\pi/3}\\sin^2 t\\,dt = 2\\pi\\int_{\\pi/6}^{\\pi/3}\\frac{1-\\cos 2t}{2}\\,dt = \\frac{\\pi^2}{6}$$

原书答案：$\\frac{\\pi^2}{6}$。`,
      method: `函数方程 → 求表达式 → 反解 → 旋转体体积。综合性强。`,
      trap: `绕 $x$ 轴本应用圆盘法，但此题对 $y$ 积分用柱壳法更直接。方法选择无绝对规则。`,
      afterMastery: `掌握函数方程 + 旋转体体积的综合题型。`,
    },
    {
      id: 22, stage: 3, stageName: '金丹',
      title: '切线+绕竖直线+反常积分',
      source: '张宇30讲 · 第10讲 §2 · 例10.7 | 已核验 | 数三',
      sourceType: 'main',
      time: '15分钟', difficulty: 4,
      skillTags: ["绕竖直线","反常积分","切线"],
      reward: {mastery:5,method:3,calc:4,geometry:3,c9:3},
      knowledgePoints: ["非坐标轴旋转","反常积分型体积"],
      mistakeTypes: ["radius","integral"],
      moduleId: 'comprehensive',
      question: `过坐标原点作曲线 $y = e^{x}$ 的切线，该切线与曲线 $y = e^{x}$ 以及 $x$ 轴围成的向 $x$ 轴负向无限伸展的平面图形记为 $D$。求：

(1) $D$ 的面积 $A$；

(2) $D$ 绕直线 $x = 1$ 旋转一周所成的旋转体的体积 $V$。`,
      hint: `切点 $(1,e)$，切线 $y=ex$。绕 $x=1$ → 对 $y$ 积分用垫片法。注意反常积分取极限。`,
      answer: `第1步：求切点和切线

设切点 $(x_0,y_0)$，$y'(x_0)=e^{x_0}$。

切线过原点：$-y_0 = -x_0 e^{x_0}$，又 $y_0=e^{x_0}$，代入得 $x_0=1$。

切点为 $(1,e)$，切线为 $y=ex$。

第2步：(1) 面积

$$A = \\int_0^e\\left(\\frac{y}{e} - \\ln y\\right)dy = \\frac{e}{2}$$

第3步：(2) 绕 $x=1$ 旋转

$$dV = \\pi[(1-\\ln y)^2 - (1-\\frac{y}{e})^2]\\,dy$$

$$V = \\pi\\int_0^e\\left(\\ln^2 y - 2\\ln y + \\frac{2y}{e} - \\frac{y^2}{e^2}\\right)dy = \\frac{5}{3}\\pi e$$

原书答案：(1) $A=\\frac{e}{2}$；(2) $V=\\frac{5}{3}\\pi e$。`,
      method: `绕竖直线：选 $y$ 积分 → 垫片法 $\\pi(R_{\\text{外}}^2-R_{\\text{内}}^2)$。反常积分需取极限。`,
      trap: `外半径是 $1-\\ln y$（$\\ln y$ 可为负），不是 $\\ln y-1$。注意绝对值！`,
      afterMastery: `掌握绕竖直线旋转 + 反常积分的完整解法。`,
    },
    {
      id: 23, stage: 3, stageName: '金丹',
      title: '参数控制·体积最值',
      source: '张宇30讲 · 第10讲 习题 · 习题10.7 | 已核验 | 数三',
      sourceType: 'main',
      time: '12分钟', difficulty: 3,
      skillTags: ["最值","参数","绕x轴","绕y轴"],
      reward: {mastery:4,method:2,calc:4,geometry:2,c9:1},
      knowledgePoints: ["绕x轴","绕y轴"],
      mistakeTypes: ["method_selection"],
      moduleId: 'comprehensive',
      question: `设 $D_{1}$ 是由抛物线 $y=2x^{2}$ 和直线 $x=a$、$x=2$ 及 $y=0$ 所围成的平面区域，$D_{2}$ 是由抛物线 $y=2x^{2}$ 和直线 $y=0$、$x=a$ 所围成的平面区域，其中 $0<a<2$。

(1) 求 $D_{1}$ 绕 $x$ 轴旋转一周而成的旋转体体积 $V_{1}$，$D_{2}$ 绕 $y$ 轴旋转一周而成的旋转体体积 $V_{2}$；

(2) 问当 $a$ 为何值时，$V_{1}+V_{2}$ 取得最大值？并求此最大值。`,
      hint: `$V_1$ 用圆盘法（绕 $x$ 轴），$V_2$ 用柱壳法（绕 $y$ 轴）。`,
      answer: `第1步：求 $V_1$ 和 $V_2$

绕 $x$ 轴（圆盘法）：$V_1 = \\pi\\int_a^2 (2x^2)^2\\,dx = \\frac{4\\pi}{5}(32-a^5)$

绕 $y$ 轴（柱壳法）：$V_2 = 2\\pi\\int_0^a x \\cdot 2x^2\\,dx = \\pi a^4$

第2步：求最值

$$f(a) = V_1 + V_2 = \\frac{4\\pi}{5}(32-a^5) + \\pi a^4$$

$$f'(a) = -4\\pi a^4 + 4\\pi a^3 = 4\\pi a^3(1-a)$$

令 $f'(a)=0$ 得 $a=1$（$a=0$ 舍去）。

$$V_{\\max} = \\frac{4\\pi}{5}(32-1) + \\pi = \\frac{124\\pi}{5} + \\pi = \\frac{129\\pi}{5}$$

原书答案：$a=1$ 时 $V_1+V_2$ 取得最大值 $\\frac{129\\pi}{5}$。`,
      method: `体积 + 最值：正确写体积表达式 → 求导找驻点 → 验证。`,
      trap: `$V_1$ 绕 $x$ 轴用圆盘法，$V_2$ 绕 $y$ 轴用柱壳法——公式不同！`,
      afterMastery: `掌握旋转体体积与函数最值的综合问题。`,
    },
    {
      id: 24, stage: 3, stageName: '金丹',
      title: '公切线+面积+绕x轴体积',
      source: '李正元复习全书 · 第三章 §七(四)2 · 例3.28 | 已核验 | 数三',
      sourceType: 'skill',
      time: '15分钟', difficulty: 4,
      skillTags: ["公切线","面积","绕x轴"],
      reward: {mastery:5,method:3,calc:4,geometry:3,c9:2},
      knowledgePoints: ["绕x轴","圆盘法(垫片法)"],
      mistakeTypes: ["calculation","region"],
      moduleId: 'comprehensive',
      question: `设两曲线 $y = a\\sqrt{x}$（$a > 0$）与 $y = \\ln\\sqrt{x}$ 在 $(x_0, y_0)$ 处有公切线，求这两曲线与 $x$ 轴围成的平面图形绕 $x$ 轴旋转而成的旋转体的体积 $V$。`,
      hint: `公切线条件：导数相等 + 函数值相等。先求 $a$ 和切点。`,
      answer: `第1步：公切线条件

$y_1' = \\frac{a}{2\\sqrt{x}}$，$y_2' = \\frac{1}{2x}$

导数相等：$\\frac{a}{2\\sqrt{x}} = \\frac{1}{2x}$ → $a\\sqrt{x} = 1$

函数值相等：$a\\sqrt{x} = \\ln\\sqrt{x}$ → $1 = \\ln\\sqrt{x}$ → $x = e^2$

代入得 $a = \\frac{1}{e}$，切点 $(e^2, 1)$。

第2步：求体积

$$V = \\pi\\int_0^{e^2}\\left(\\frac{1}{e}\\sqrt{x}\\right)^2 dx - \\pi\\int_1^{e^2}(\\ln\\sqrt{x})^2 dx = \\frac{\\pi}{2}$$

原书答案：$V = \\frac{\\pi}{2}$。`,
      method: `公切线条件（导数相等 + 函数值相等）→ 确定曲线参数 → 两体积之差（大旋转体减去小旋转体）。`,
      trap: `两个积分区间不同：$y_1$ 在 $[0,e^2]$，$y_2$ 仅在 $[1,e^2]$ 上非负。混淆积分上下限是常见失分点。`,
      afterMastery: `掌握公切线条件 + 旋转体体积的完整链路。`,
    },
    {
      id: 25, stage: 3, stageName: '金丹',
      title: '切线+面积+绕x轴体积',
      source: '2012年数二真题 · 数三可做 · 武忠祥基础篇 例4 | 已核验 | 收录原因：切线+面积+旋转体体积综合',
      sourceType: 'skill',
      time: '15分钟', difficulty: 3,
      skillTags: ["切线","面积","绕x轴","真题"],
      reward: {mastery:4,method:2,calc:4,geometry:3,c9:1},
      knowledgePoints: ["绕x轴","两曲线区域"],
      mistakeTypes: ["region","calculation"],
      moduleId: 'comprehensive',
      question: `过点 $(0,1)$ 作曲线 $L: y = \\ln x$ 的切线，切点为 $A$，又 $L$ 与 $x$ 轴交于 $B$ 点，区域 $D$ 由 $L$ 与直线 $AB$ 围成。求区域 $D$ 的面积及 $D$ 绕 $x$ 轴旋转一周所得旋转体的体积。`,
      hint: `先求切线确定 A，再确定 B。$AB$ 是线段，不是切线。区域在 $[1,e^2]$ 上。`,
      answer: `第1步：求切点和切线

$y=\\ln x$，$y'=\\frac{1}{x}$。

设切点 $A(x_0,\\ln x_0)$，切线过 $(0,1)$。

$$\\frac{\\ln x_0 - 1}{x_0 - 0} = \\frac{1}{x_0} \\Rightarrow x_0 = e^2$$

切点 $A(e^2,2)$。$B(1,0)$（$\\ln x=0$ 的解）。

$AB$ 直线方程：$y = \\frac{2}{e^2-1}(x-1)$

第2步：面积

$$S = \\int_1^{e^2}\\left[\\ln x - \\frac{2}{e^2-1}(x-1)\\right]dx = 2$$

第3步：体积

$$V = \\pi\\int_1^{e^2}\\left[(\\ln x)^2 - \\left(\\frac{2}{e^2-1}(x-1)\\right)^2\\right]dx = \\frac{2\\pi}{3}(e^2-1)$$

原书答案：$S=2$，$V = \\frac{2\\pi}{3}(e^2-1)$。`,
      method: `三步：求切线定边界 → 判断上下关系 → 面积用 $\\int(上-下)dx$，体积用 $\\pi\\int(上^2-下^2)dx$。`,
      trap: `区域 $D$ 由曲线 $L$ 和弦 $AB$ 围成——$AB$ 是线段不是切线。不要搞混边界。`,
      afterMastery: `掌握切线 + 面积 + 体积三连综合题的完整流程。`,
    },
    {
      id: 26, stage: 3, stageName: '金丹',
      title: '函数的平均值',
      source: '张宇30讲 · 第10讲 §3 · 例10.9 | 已核验 | 数三',
      sourceType: 'main',
      time: '8分钟', difficulty: 3,
      skillTags: ["函数平均值","函数方程"],
      reward: {mastery:3,method:2,calc:2,geometry:0,c9:0},
      knowledgePoints: ["函数的平均值"],
      mistakeTypes: ["calculation"],
      moduleId: 'comprehensive',
      question: `设 $f(x)$ 连续，且 $f(x+2) - f(x) = x$，$\\int_0^2 f(x)\\,dx = 0$，则 $f(x)$ 在 $[1,3]$ 上的平均值为 ____。`,
      hint: `记 $F(x)=\\int_x^{x+2}f(t)\\,dt$，则 $F'(x)=f(x+2)-f(x)=x$。由此解出 $F(x)$，利用 $F(0)=0$ 定常数。`,
      answer: `第1步：构造辅助函数

令 $F(x) = \\int_x^{x+2} f(t)\\,dt$。

则 $F'(x) = f(x+2) - f(x) = x$。

第2步：求 $F(x)$

$$F(x) = \\int x\\,dx = \\frac12 x^2 + C$$

由 $F(0) = \\int_0^2 f(x)\\,dx = 0$ 得 $C=0$。

所以 $F(x) = \\frac12 x^2$。

第3步：求平均值

$$\\bar{f} = \\frac{1}{3-1}\\int_1^3 f(x)\\,dx = \\frac12 F(1) = \\frac12 \\cdot \\frac12 = \\frac14$$

原书答案：$\\frac14$。`,
      method: `函数平均值公式 $\\bar{f}=\\frac{1}{b-a}\\int_a^b f(x)\\,dx$。关键：构造 $F(x)=\\int_x^{x+2}f(t)\\,dt$，利用函数方程求导。`,
      trap: `不要试图直接求 $f(x)$ 的表达式——题目条件不足以唯一确定 $f(x)$。通过构造变上限积分函数间接求解是本题核心技巧。`,
      afterMastery: `掌握函数平均值的概念和间接求解技巧。`,
    },

    // ═══════════════ STAGE 4 · 元婴 ═══════════════
    {
      id: 27, stage: 4, stageName: '元婴',
      title: '三角形绕边旋转·体积最大建模',
      source: '武忠祥高等数学辅导讲义 · 第五章 · 例5 | 已核验 | 数三（跨章节综合）',
      sourceType: 'boss',
      time: '15分钟', difficulty: 5,
      skillTags: ["几何建模","最值","跨章节"],
      reward: {mastery:3,method:2,calc:3,geometry:5,c9:4},
      knowledgePoints: ["柱壳法"],
      mistakeTypes: ["geometry","calculation"],
      moduleId: 'comprehensive',
      question: `已知三角形周长为 $2p$，求使它绕自己的一边旋转时所构成旋转体体积最大的三角形。`,
      hint: `绕边长为 $y$ 的边旋转，体积 = 两个圆锥体积之和：$V=\\frac{\\pi}{3}h^2 y$。用海伦公式消去 $h$。最值用拉格朗日乘数法。`,
      answer: `第1步：几何建模

设三边长 $x,y,z$，绕边长 $y$ 的边旋转，该边上的高为 $h$。

旋转体体积（两个共底圆锥）：$V = \\frac{\\pi}{3}h^2 y$

第2步：用海伦公式消去 $h$

$$S = \\sqrt{p(p-x)(p-y)(p-z)} = \\frac12 yh \\quad\\Rightarrow\\quad h = \\frac{2S}{y}$$

代入体积：

$$V = \\frac{4}{3}\\pi \\frac{(p-x)(p-y)(p-z)}{y}$$

约束条件：$x+y+z=2p$

第3步：用拉格朗日乘数法求最值

$$F = \\ln(p-x)+\\ln(p-y)+\\ln(p-z)-\\ln y+\\lambda(x+y+z-2p)$$

解得 $x=z=\\frac{3p}{4}$，$y=\\frac{p}{2}$。

$$V_{\\max} = \\frac{\\pi}{12}p^3$$

原书答案：$x=z=\\frac{3p}{4},\\ y=\\frac{p}{2}$ 时 $V_{\\max}=\\frac{\\pi}{12}p^3$。`,
      method: `旋转体体积建模（$V=\\frac{\\pi}{3}h^2 y$ + 海伦公式消元）属于第10讲范围。最值部分用到拉格朗日乘数法（多元函数章节），建议分两步完成。`,
      trap: `三角形绕一边旋转得到的是两个共底圆锥，不是圆柱。体积公式 $V=\\frac{\\pi}{3}h^2 y$ 的推导依赖于几何直觉。`,
      afterMastery: `掌握旋转体体积建模与跨章节综合问题的拆解思路。`,
    },
  ],
};
