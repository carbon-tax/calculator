// https://de.wikipedia.org/wiki/Kraftstoffverbrauch#Berechnung_der_CO2-Emission_auf_Basis_des_Kraftstoffverbrauchs
export const fuels = {
  unit: 'kg/l',
  samples: {
    gasoline: 2.32,
    diesel: 2.62
  }
}

/**
 * High confidence pathways from the IPCC Special Report 15
 *
 * In USD 2010 per ton
 *
 * @see https://report.ipcc.ch/sr15/
 * @see https://wattsupwiththat.com/2018/10/11/ipcc-sr1-5-carbon-tax-math/
 * @see http://report.ipcc.ch/sr15/pdf/sr15_chapter2.pdf
 */
export const taxPresets = [
  ['IPCC SR15 2°C Pathway High', 200],
  ['IPCC SR15 1.5°C Pathway High', 5500]
]
