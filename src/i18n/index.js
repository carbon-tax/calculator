import i18next from 'i18next'
import { reactI18nextModule } from 'react-i18next'

i18next
  .use(reactI18nextModule)
  .init({
    lng: 'de',
    resources: {
      de: {
        translation: {
          fuels: {
            title: 'Kraftstoffe',
            samples: {
              gasoline: 'Benzin',
              diesel: 'Diesel'
            }
          },

          heating: {
            title: 'Heizung',
            samples: {
              oil: 'Heizöl',
              gas: 'Erdgas',
              pellets: 'Holz-Pellets'
            }
          },

          electricity: {
            title: 'Strom',
            samples: {
              brownCoal: 'Braunkohle',
              blackCoal: 'Steinkohle',
              gas: 'Erdgas'
            }
          },

          travel: {
            title: 'Reise',
            samples: {
              flight: 'Flug',
              train: 'ICE'
            }
          },

          food: {
            title: 'Lebensmittel',
            samples: {
              beef: 'Rindfleisch',
              pork: 'Schweinefleisch',
              milk: 'Milch',
              brownBread: 'Mischbrot',
              apple: 'Apfel'
            }
          }
        }
      }
    },
    debug: true
  })

export default i18next
