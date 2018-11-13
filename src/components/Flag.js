import React from 'react'

// https://stackoverflow.com/a/42235254/500999

export default ({ country }) => (
  <span title={country}>{
    String.fromCodePoint(
      ...[0, 1].map(i => country.codePointAt(i)).map(cp => cp - 0x41 + 0x1F1E6)
    )
  }</span>
)
