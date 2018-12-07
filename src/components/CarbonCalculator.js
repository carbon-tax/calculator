import React, { Component } from 'react'
import { withI18n } from 'react-i18next'

import {
  Col,
  FormGroup,
  Input,
  Label,
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
    </tbody>
  </Table>
)

const TaxConfiguration = ({ taxStart, taxEnd, setTaxStart, setTaxEnd }) => (
  <>
    <FormGroup row className='mt-2'>
      <Label sm={12}>
        <b>{CO2} Steuer Parameter</b>
      </Label>
    </FormGroup>
    <FormGroup row>
      <Label sm={3}>2019</Label>
      <Col sm={9}>
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
      <Label sm={3}>2030</Label>
      <Col sm={9}>
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
      <Label sm={3}>Erhöhung</Label>
      <Col sm={9}>
        <Input type='select'>
          <option>linear</option>
        </Input>
      </Col>
    </FormGroup>
  </>
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
      <>
        <Row>
          <Col md={12} lg={6}>
            <Country {...country} />
          </Col>
          <Col md={12} lg={6}>
            <TaxConfiguration
              taxStart={taxStart}
              taxEnd={taxEnd}
              setTaxStart={this.onTaxChange('taxStart')}
              setTaxEnd={this.onTaxChange('taxEnd')}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TaxTable {...{ taxStart, taxEnd }} {...this.props} />
          </Col>
        </Row>
      </>
    )
  }
}

export default withI18n()(CarbonCalculator)
