import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Row,
  Table
} from 'reactstrap'

import { CO2, twoDecimals } from '../util'
import TaxTable from './TaxTable'
import Flag from './Flag'

const Country = ({ emissions, population, population18Plus, taxRevenue }) => (
  <Table responsive>
    <thead>
      <tr>
        <th scope='row' colSpan={2}>
          <Flag country='DE' /> Deutschland
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope='row'>
          Einwohnerzahl
        </th>
        <td align='right'>
          {largeNumbers.format(population)}
        </td>
      </tr>
      <tr>
        <th scope='row'>
          Erwachsene (18+)
        </th>
        <td align='right'>
          {largeNumbers.format(population18Plus)}
        </td>
      </tr>
      <tr>
        <th>
          {CO2} Emissionen [Mio t]
        </th>
        <td align='right'>
          {twoDecimals.format(emissions)}
        </td>
      </tr>
      <tr>
        <th>
          Emissionen pro Einwohner [t]
        </th>
        <td align='right'>
          {twoDecimals.format((emissions * 1e6) / population)}
        </td>
      </tr>
      <tr>
        <th>
          Steueraufkommen [Mrd €]
        </th>
        <td align='right'>
          {twoDecimals.format(taxRevenue)}
        </td>
      </tr>
    </tbody>
  </Table>
)

class TaxConfiguration extends Component {
  state = {
    dopdownPreset: false
  }

  dropdownToggle = name => () => {
    this.setState({
      [name]: !this.state[name]
    })
  }

  render () {
    const {
      taxStart,
      taxEnd,
      emissionReduction,
      setTaxStart,
      setTaxEnd,
      setEmissionReduction,
      taxPresets
    } = this.props

    return (
      <>
        <FormGroup row className='mt-2'>
          <Label sm={6}>
            <b>{CO2} Steuer Parameter</b>
          </Label>
          <Col sm={6}>
            <Dropdown isOpen={this.state.dropdownPreset} toggle={this.dropdownToggle('dropdownPreset')}>
              <DropdownToggle caret>
              Voreinstellung
              </DropdownToggle>
              <DropdownMenu>
                { taxPresets.map(([name, tax], index) =>
                  <DropdownItem
                    key={index}
                    value={tax}
                    onClick={setTaxEnd}
                  >
                    {name}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>2019</Label>
          <Col sm={6}>
            <Input
              type='number'
              placeholder='automatisch'
              value={taxStart || ''}
              onChange={setTaxStart}
              min='0'
              className='text-right'
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>2030</Label>
          <Col sm={6}>
            <Input
              type='number'
              placeholder='Pro Tonne'
              value={taxEnd || ''}
              onChange={setTaxEnd}
              min='0'
              className='text-right'
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>Erhöhung</Label>
          <Col sm={6}>
            <Input type='select'>
              <option>linear</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>Reduzierung {CO2} Ausstoss</Label>
          <Col sm={6}>
            <Input
              type='number'
              placeholder='0%'
              value={emissionReduction || ''}
              onChange={setEmissionReduction}
              min='0'
              step={1}
              className='text-right'
            />
          </Col>
        </FormGroup>
      </>
    )
  }
}

const largeNumbers = new Intl.NumberFormat('de-DE', {})

class CarbonCalculator extends Component {
  state = {
    taxStart: undefined,
    taxEnd: 200,

    emissionReduction: 0
  }

  onTaxChange = (prop) => (e) => {
    this.setState({
      [prop]: parseInt(e.target.value) || undefined
    })
  }

  setEmissionReduction = (e) => {
    this.setState({
      emissionReduction: e.target.value
    })
  }

  render () {
    const { country, taxPresets } = this.props
    const {
      taxStart,
      taxEnd,
      emissionReduction
    } = this.state

    return (
      <>
        <Row>
          <Col md={12} lg={6}>
            <Country {...country} />
          </Col>
          <Col md={12} lg={6}>
            <TaxConfiguration
              taxPresets={taxPresets}
              taxStart={taxStart}
              taxEnd={taxEnd}
              emissionReduction={emissionReduction}
              setTaxStart={this.onTaxChange('taxStart')}
              setTaxEnd={this.onTaxChange('taxEnd')}
              setEmissionReduction={this.setEmissionReduction}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TaxTable {...{ taxStart, taxEnd, emissionReduction: (100 - emissionReduction) / 100 }} {...this.props} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withI18n()(CarbonCalculator)
