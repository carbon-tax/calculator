import * as globals from '../../globals'

export default {
  country: {
    /**
     * Current emissions, in millions of tons, 2015
     *
     * @see https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions
     */
    emissions: 777.905,

    /**
     * Population, 31.12.2017
     *
     * @see https://de.wikipedia.org/wiki/Deutschland
     */
    population: 82792351
  },

  emissions: {
    ...globals,

    // http://iinas.org/gemis-download-121.html
    // http://iinas.org/tl_files/iinas/downloads/GEMIS/2017_GEMIS-Ergebnisse-Auszug.xlsx
    heating: {
      unit: 'kg/kWh',
      samples: {
        oil: 0.319,
        gas: 0.250,
        pellets: 0.027
      }
    },

    // http://iinas.org/gemis-download-121.html
    // http://iinas.org/tl_files/iinas/downloads/GEMIS/2017_GEMIS-Ergebnisse-Auszug.xlsx
    electricity: {
      unit: 'kg/kWh',
      samples: {
        brownCoal: 1.008,
        blackCoal: 0.894,
        gas: 0.409
      }
    },

    // https://www.umweltbundesamt.de/themen/verkehr-laerm/emissionsdaten#verkehrsmittelvergleich_personenverkehr
    // Flight in table with Emission Weighting Factor = 2
    travel: {
      unit: 'kg/100km',
      samples: {
        flight: 10.7,
        train: 3.8
      }
    },

    // http://www.klimabuendnis-koeln.de/ernaehrung
    food: {
      unit: 'kg/kg',
      samples: {
        beef: 13.3,
        pork: 3.25,
        milk: 0.95,
        brownBread: 0.75,
        apple: 0.55
      }
    }
  }
}
