import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  Table
} from 'reactstrap'

import Flag from './Flag'

const CO2 = 'CO₂'

// 2019 - 2030
const YEARS = Array.from(Array(12).keys()).map((year) => 2019 + year)

const largeNumbers = new Intl.NumberFormat('de-DE', {})

const twoDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const threeDecimals = new Intl.NumberFormat('de-DE', { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })

const formatCurrency = (amount) => amount <= 0.2 ? threeDecimals.format(amount) : twoDecimals.format(amount)

const createLinear = (max, min = 0) => (_, index, years) => min + (max - min) * ((index + 1) / years.length)
const createExponential = (factor, initial = 1, offset = 1) => (_, index) => initial * Math.pow(factor, index + offset)

const times = (factor) => (value) => factor * value

const td = (value, index) => <td align='right' key={index}>{(value)}</td>

class CarbonCalculator extends Component {
  state = {
    taxStart: undefined,
    taxEnd: 200,
    addingTaxDecuctions: false,
    taxDeductions: []
  }

  onTaxChange = (prop) => (e) => {
    this.setState({
      [prop]: parseInt(e.target.value) || undefined
    })
  }

  toggleTaxDeductions = () => {
    this.setState({ addingTaxDeductions: !this.state.addingTaxDeductions })
  }

  addTaxDeduction = tax => {
    const { taxDeductions } = this.state
    this.setState({
      taxDeductions: [tax, ...taxDeductions]
    })
  }
  removeTaxDeduction = tax => {
    const { taxDeductions } = this.state
    const index = taxDeductions.indexOf(tax)
    this.setState({
      taxDeductions: [
        ...taxDeductions.slice(0, index),
        ...taxDeductions.slice(index + 1)
      ]
    })
  }

  render () {
    const { country, emissions, t } = this.props
    const {
      taxStart,
      taxEnd,
      taxDeductions
    } = this.state

    // If there is a taxStart, 2019 should start with it.
    // Otherwise, the first value is also interpolated.
    const years = taxStart ? YEARS.slice(1) : YEARS
    const taxPerTon = taxStart ? [taxStart, ...years.map(createLinear(taxEnd, taxStart))]
      : years.map(createLinear(taxEnd, taxStart))

    const taxPerKg = taxPerTon.map((tax) => tax * 1e-3)
    const expectedEmissions = YEARS.map(createExponential(0.98, country.emissions))
    // in billions, expectedEmissions are in millions, thus taxPerKg
    const expectedTaxes = taxPerKg.map((tax, index) => tax * expectedEmissions[index])

    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <th />
              <th>
                Einwohnerzahl
              </th>
              <th>
                {CO2} Emissionen [Mio t]
              </th>
              <th>
                Emissionen pro Einwohner [t]
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>
                <Flag country='DE' /> Deutschland
              </th>
              <td align='right'>
                {largeNumbers.format(country.population)}
              </td>
              <td align='right'>
                {twoDecimals.format(country.emissions)}
              </td>
              <td align='right'>
                {twoDecimals.format((country.emissions * 1e6) / country.population)}
              </td>
            </tr>
          </tbody>
        </Table>
        <InputGroup>
          <InputGroupAddon addonType='prepend'>2019</InputGroupAddon>
          <Input
            type='number'
            placeholder='automatisch'
            value={taxStart || ''}
            onChange={this.onTaxChange('taxStart')}
            min='0'
            className='text-right'
          />
          <Input type='select'>
            <option>linear</option>
          </Input>
          <Input
            type='number'
            placeholder='Pro Tonne'
            value={taxEnd || ''}
            onChange={this.onTaxChange('taxEnd')}
            min='0'
            className='text-right'
          />
          <InputGroupAddon addonType='append'>2030</InputGroupAddon>
          <InputGroupAddon addonType='append'>€/t</InputGroupAddon>
        </InputGroup>
        <Table responsive>
          <thead>
            <tr>
              <th />
              <th>Einheit</th>
              { YEARS.map((year, index) => <th key={index}>{year}</th>) }
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>{CO2} Steuer</th>
              <th scope='row'>€ / kg</th>
              { taxPerKg.map(formatCurrency).map(td) }
            </tr>
            <tr>
              <th scope='row'>{CO2} Emissionen</th>
              <th scope='row'>Mio t</th>
              { expectedEmissions.map(Math.round).map(td) }
            </tr>
            <tr>
              <th scope='row'>Erwartete Steuereinnahmen</th>
              <th scope='row'>Mrd €</th>
              { expectedTaxes.map(Math.round).map(td) }
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th scope='row'>Aktuelle Steuereinnahmen</th>
              <th scope='row'>Mrd €</th>
              <td colSpan='12'>
                <Dropdown isOpen={this.state.addingTaxDeductions} toggle={this.toggleTaxDeductions}>
                  <DropdownToggle caret>
                    Auswählen
                  </DropdownToggle>
                  <DropdownMenu onChange={(...args) => console.log('change', args)}>
                    { Object.keys(country.taxes).map(tax =>
                      <DropdownItem
                        key={tax}
                        disabled={taxDeductions.indexOf(tax) > -1}
                        onClick={() => this.addTaxDeduction(tax)}
                      >
                        {`${t(`country.taxes.${tax}`)} (${Math.round(country.taxes[tax])} Mrd)`}
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
            {
              taxDeductions.map(tax => (
                <tr key={tax}>
                  <th scope='row'>{t(`country.taxes.${tax}`)}</th>
                  <td><Button size='xs' onClick={() => this.removeTaxDeduction(tax)}>-</Button></td>
                  { expectedTaxes.map(() => -country.taxes[tax]).map(Math.round).map(td) }
                </tr>
              ))
            }
            {
              taxDeductions.length > 0 ? (
                <tr>
                  <th scope='row' colSpan='2'>Verbleibende {CO2} Steuer</th>
                  { expectedTaxes.map(taxes => taxes - taxDeductions.map(tax => country.taxes[tax]).reduce((sum, current) => sum + current, 0)).map(Math.round).map(td) }
                </tr>
              ) : undefined
            }
          </tbody>
          {
            Object.keys(emissions).map((emission) => (
              <tbody key={emission}>
                <tr>
                  <th>{t(`${emission}.title`)}</th>
                  <td>[{emissions[emission].unit}]</td>
                  <td colSpan={YEARS.length} />
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