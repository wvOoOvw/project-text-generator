const r = [
  { label: '上汽大众车身技术', value: () => import('./上汽大众车身技术.json').then(res => res.default) },
  { label: '实习记录', value: () => import('./实习记录.json').then(res => res.default) },
  { label: '马克思主义', value: () => import('./马克思主义.json').then(res => res.default) }
]

export default r