import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import {
  Col,
  Container,
  Row
} from 'reactstrap'

import '../i18n'

import CarbonCalculator from './CarbonCalculator'
import MainNav from './MainNav'

import countries from '../../data'

class App extends Component {
  render () {
    return (
      <>
        <MainNav />
        <Container tag='main' className='mt-4'>
          <Row>
            <Col>
              <CarbonCalculator {...countries.de} {...this.props} />
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default hot(module)(App)
