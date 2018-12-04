import React from 'react'

export const CO2 = 'CO₂'

// 2019 - 2030
export const YEARS = Array.from(Array(12).keys()).map((year) => 2019 + year)

export const createLinear = (max, min = 0) => (_, index, years) => min + (max - min) * ((index + 1) / years.length)
export const createExponential = (factor, initial = 1, offset = 1) => (_, index) => initial * Math.pow(factor, index + offset)

export const twoDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const threeDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })

export const formatCurrency = (amount) => amount <= 0.2 ? threeDecimals.format(amount) : twoDecimals.format(amount)

export const times = (factor) => (value) => factor * value

export const td = (value, index) => <td align='right' key={index}>{(value)}</td>
