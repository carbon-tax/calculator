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
          <TaxTable {...{ taxStart, taxEnd }} {...this.props} />
        </Col>
      </Row>
    )
  }
}

export default withI18n()(CarbonCalculator)
