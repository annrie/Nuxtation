const numberFormat = new Intl.NumberFormat('ja-JP', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatNumber = (num: number) => numberFormat.format(num)
