# Stage Rename + Task Reorder + Source Display

**Date**: 2026-05-26
**Status**: approved

## Changes

### 1. Stage Rename

| Old | New |
|-----|-----|
| Stage 0 系统载入 | 引气入体 |
| Stage 1 张宇主线·基础功法 | 炼气 |
| Stage 2 方法选择训练 | 筑基 |
| Stage 3 综合建模训练 | 金丹 |
| Stage 4 拔高压轴训练 | 元婴 |
| Stage 5 C9终极试炼 | 化神 |

Update `STAGE_NAMES` in `types.ts` and all `stageName` fields in chapter data.

### 2. Task Reorder

Within each stage, sort tasks by difficulty ascending, then by topic progression (formula → method → modeling → comprehensive). Renumber IDs 0→31 sequentially.

### 3. Source Display

Add a visible source line after question text in TaskPage:
```
📖 张宇30讲·例10.5
```
Style: small muted text, positioned between question body and hint button.

### 4. Constraints

- Do not delete/modify questions, answers, hints, traps, afterMastery
- Do not change difficulty, knowledgePoints, skillTags, moduleId
- Preserve all 32 tasks
