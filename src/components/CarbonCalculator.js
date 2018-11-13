import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table
} from 'reactstrap'

// 2019 - 2030
const years = Array.from(Array(12).keys()).map((year) => 2019 + year)

const twoDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const threeDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })

const formatCurrency = (amount) => amount <= 0.2 ? threeDecimals.format(amount) : twoDecimals.format(amount)

const createLinear = (max) => (_, index, years) => max * ((index + 1) / years.length)
const createExponential = (factor, initial = 1, offset = 1) => (_, index) => initial * Math.pow(factor, index + offset)

const times = (factor) => (value) => factor * value

const td = (value, index) => <td key={index}>{(value)}</td>

class CarbonCalculator extends Component {
  state = {
    tax: 200
  }

  onTaxChange = (e) => {
    this.setState({
      tax: parseInt(e.target.value)
    })
  }

  render () {
    const { country, emissions, t } = this.props
    const { tax } = this.state

    const taxPerTon = years.map(createLinear(tax))
    const taxPerKg = taxPerTon.map((tax) => tax * 1e-3)
    const expectedEmissions = years.map(createExponential(0.98, country.currentEmissions))
    // in billions, expectedEmissions are in millions, thus taxPerKg
    const expectedTaxes = taxPerKg.map((tax, index) => tax * expectedEmissions[index])

    return (
      <>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>2015</InputGroupAddon>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <strong>
                {Math.round(country.currentEmissions)} Millionen Tonnen
              </strong>
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type='number'
            placeholder='Pro Tonne'
            value={tax}
            onChange={this.onTaxChange}
            min='0'
            className='text-right'
          />
          <InputGroupAddon addonType='append'>€</InputGroupAddon>
        </InputGroup>
        <Table responsive>
          <thead>
            <tr>
              <th />
              <th>Einheit</th>
              { years.map((year, index) => <th key={index}>{year}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>CO₂ Steuer</th>
              <th scope='row'>€ / kg</th>
              { taxPerKg.map(formatCurrency).map(td) }
            </tr>
            <tr>
              <th scope='row'>CO₂-Emissionen</th>
              <th scope='row'>Mio t</th>
              { expectedEmissions.map(Math.round).map(td) }
            </tr>
            <tr>
              <th scope='row'>Erwartete Steuereinnahmen</th>
              <th scope='row'>Mrd €</th>
              { expectedTaxes.map(Math.round).map(td) }
            </tr>
          </tbody>
          {
            Object.keys(emissions).map((emission) => (
              <tbody key={emission}>
                <tr>
                  <th>{t(`${emission}.title`)}</th>
                  <td>[{emissions[emission].unit}]</td>
                  <td colSpan={years.length} />
                </tr>
                {
                  Object.keys(emissions[emission].samples).map((entry) => (
                    <tr key={entry}>
                      <th scope='row'>{t(`${emission}.samples.${entry}`)}</th>
                      <th scope='row'>{threeDecimals.format(emissions[emission].samples[entry])}</th>
                      { taxPerKg.map(times(emissions[emission].samples[entry])).map(formatCurrency).map(td) }
                    </tr>
                  ))
                }
              </tbody>
            ))
          }
        </Table>
      </>
    )
  }
}

export default withI18n()(CarbonCalculator)
