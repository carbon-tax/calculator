import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

import {
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Table
} from 'reactstrap'

import { CO2, twoDecimals } from '../util'
import TaxTable from './TaxTable'
import Flag from './Flag'

const Country = ({ emissions, population }) => (
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
          {largeNumbers.format(population)}
        </td>
        <td align='right'>
          {twoDecimals.format(emissions)}
        </td>
        <td align='right'>
          {twoDecimals.format((emissions * 1e6) / population)}
        </td>
      </tr>
    </tbody>
  </Table>
)

const TaxConfiguration = ({ taxStart, taxEnd, setTaxStart, setTaxEnd }) => (
  <InputGroup>
    <InputGroupAddon addonType='prepend'>2019</InputGroupAddon>
    <Input
      type='number'
      placeholder='automatisch'
      value={taxStart || ''}
      onChange={setTaxStart}
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
      onChange={setTaxEnd}
      min='0'
      className='text-right'
    />
    <InputGroupAddon addonType='append'>2030</InputGroupAddon>
    <InputGroupAddon addonType='append'>€/t</InputGroupAddon>
  </InputGroup>
)

const largeNumbers = new Intl.NumberFormat('de-DE', {})

class CarbonCalculator extends Component {
  state = {
    taxStart: undefined,
    taxEnd: 200
  }

  onTaxChange = (prop) => (e) => {
    this.setState({
      [prop]: parseInt(e.target.value) || undefined
    })
  }

  render () {
    const { country } = this.props
    const {
      taxStart,
      taxEnd
    } = this.state

    return (
      <Row>
        <Col>
          <Country {...country} />
          <TaxConfiguration
            taxStart={taxStart}
            taxEnd={taxEnd}
            setTaxStart={this.onTaxChange('taxStart')}
            setTaxEnd={this.onTaxChange('taxEnd')}
          />
          <TaxTable {...{ taxStart, taxEnd }} {...this.props} />
        </Col>
      </Row>
    )
  }
}

export default withI18n()(CarbonCalculator)
