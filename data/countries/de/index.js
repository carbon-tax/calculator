import * as globals from '../../globals'

const population = 82792351

const population18Plus = Math.round((100 - (0.79 + 3.79 + 6.59 + 2.37)) / 100 * population)

export default {
  country: {
    /**
     * Current emissions, in millions of tons, 2015
     *
     * @see https://de.wikipedia.org/wiki/Liste_der_gr%C3%B6%C3%9Ften_Kohlenstoffdioxidemittenten#Nach_L%C3%A4ndern
     */
    emissions: 798,

    /**
     * Population, 31.12.2017 (82'792'351)
     *
     * @see https://de.wikipedia.org/wiki/Deutschland
     */
    population,

    /**
     * Population 18 or older (71'582'267, 86.46%)
     *
     * @see https://de.statista.com/statistik/daten/studie/1365/umfrage/bevoelkerung-deutschlands-nach-altersgruppen/
     */
    population18Plus,

    /**
     * Tax revenue, in billion Euros
     */
    taxRevenue: 734.500,

    /**
     * In billion Euros, 2017
     *
     * @see https://de.wikipedia.org/wiki/Steueraufkommen_(Deutschland)
     */
    taxes: {
      payroll: 195.524,
      sales: 170.499,
      // TODO is there an international equivalent? Is it just tolls?
      salesImport: 55.857,
      energy: 41.022,
      electricity: 6.944,
      // Universal Basic Income of EUR 1000 / month for persons 18 or older
      universalBasicIncome: (population18Plus * 1000 * 12) / 1e9
    }
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
