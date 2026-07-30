# Visualization and Data Contract

本文件约束交互模型、自制图和真实 DFT 派生数据进入网站时必须携带的信息。JSON Schema 位于：

- `schemas/visualization-spec.schema.json`
- `schemas/derived-dft-data.schema.json`

## 1. 三类可视化

### Interactive model

由网站代码实时计算的简化教学模型。必须说明：

- 被保留和被丢弃的自由度；
- 可调参数、范围、默认值和单位；
- 输出 observable 与参考；
- 至少一个确定性验收情形；
- 为什么它不能替代真实 DFT 结果。

### Derived data

由外部 DFT 计算或公开数据转换得到的轻量数据。必须保留：

- 计算代码和版本；
- 原始数据权威位置或稳定来源；
- 生成时间、转换步骤和可用 checksum；
- 解释数据所需的参数、单位、归一化和参考能；
- 适用边界与尚未验证的更强结论。

### Static diagram

原创静态示意图。必须区分几何示意、定性关系和定量数据，不把示意位置或比例描述为来源记录。

## 2. SCF 教学模型实例

当前 `SCFIterationVisualizer.astro` 使用单个标量固定点模型：

```text
F(x) = x* + s(x - x*)
x_(k+1) = x_k + alpha [F(x_k) - x_k]
q = 1 - alpha(1 - s)
```

共享数学内核位于 `src/lib/scfToyModel.mjs`，确定性检查位于 `scripts/validate-scf-model.mjs`。验收覆盖：

1. 一步到达；
2. 单调收敛；
3. 振荡收敛；
4. 发散；
5. `s = 1` 退化映射。

这些检查验证的是代码与声明的仿射模型一致，不验证真实 Kohn–Sham response、任何具体 mixing 实现或材料计算结果。

## 3. 真实数据的最小元数据

提交 `bands`、`dos`、`phonon`、`convergence` 或结构数据时，至少需要：

```json
{
  "schemaVersion": 1,
  "datasetId": "example-dataset",
  "observable": "bands",
  "provenance": {
    "code": "Quantum ESPRESSO",
    "codeVersion": "明确版本",
    "sourceLocation": "项目权威路径或稳定来源",
    "sourceCommit": null,
    "generatedAt": "ISO-8601 时间",
    "transformation": "解析、筛选和降采样步骤",
    "license": null,
    "checksums": {}
  },
  "parameters": {},
  "units": {
    "energy": "eV"
  },
  "references": {
    "energyZero": "明确参考",
    "normalization": null,
    "path": "明确 k/q 路径或 null"
  },
  "data": {},
  "boundaries": [
    "说明该数据不能支持的更强结论"
  ]
}
```

目录存在、文件可解析或图形看起来合理，不自动证明数据身份、数值收敛或科学接受标准已经满足。
