import copyToClipboard from 'clipboard-copy'

import React, { Component } from 'react'

import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Table
} from 'reactstrap'

import Icon from './Icon'

import {
  CO2,
  YEARS,

  createLinear,
  createExponential,
  formatCurrency,
  threeDecimals,
  times,

  td
} from '../util'

export default class TaxTable extends Component {
  constructor (props) {
    super(props)

    const params = new URLSearchParams(window.location.search)

    this.state = {
      dropdownTaxDeductions: false,
      dropdownShare: false,

      taxDeductions: params.has('taxDeductions') ? params.get('taxDeductions').split(',') : []
    }
  }

  dropdownToggle = name => () => {
    this.setState({
      [name]: !this.state[name]
    })
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

  onCopyUrl = () => {
    const {
      taxStart,
      taxEnd,
      emissionReduction
    } = this.props
    const { taxDeductions } = this.state

    const params = new URLSearchParams(Object.entries({
      taxStart,
      taxEnd,
      emissionReduction,
      taxDeductions
    }).filter(([key, value]) => value && (Array.isArray(value) ? value.length : true))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}))

    window.history.pushState(null, null, `${window.location.pathname}?${params.toString()}`)
    copyToClipboard(window.location.href)
  }

  render () {
    const {
      country,
      emissions,
      taxStart,
      taxEnd,
      emissionReduction,
      t
    } = this.props

    const { taxDeductions } = this.state

    const hasTaxDeductions = taxDeductions.length > 0

    // If there is a taxStart, 2019 should start with it.
    // Otherwise, the first value is also interpolated.
    const years = taxStart ? YEARS.slice(1) : YEARS
    const taxPerTon = taxStart ? [taxStart, ...years.map(createLinear(taxEnd, taxStart))]
      : years.map(createLinear(taxEnd, taxStart))

    const taxPerKg = taxPerTon.map((tax) => tax * 1e-3)
    const expectedEmissions = YEARS.map(createExponential(emissionReduction, country.emissions))
    // in billions, expectedEmissions are in millions, thus taxPerKg
    const expectedTaxes = taxPerKg.map((tax, index) => tax * expectedEmissions[index])

    return (
      <Table responsive>
        <thead>
          <tr>
            <th>
              <Dropdown size='sm' isOpen={this.state.dropdownShare} toggle={this.dropdownToggle('dropdownShare')}>
                <DropdownToggle color='light'>
                  <Icon icon='share-square' />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.onCopyUrl}>
                    <Icon icon='link' /> URL kopieren
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </th>
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
              <Dropdown isOpen={this.state.dropdownTaxDeductions} toggle={this.dropdownToggle('dropdownTaxDeductions')}>
                <DropdownToggle caret>
                Auswählen
                </DropdownToggle>
                <DropdownMenu>
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
            hasTaxDeductions ? (
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
    )
  }
}
