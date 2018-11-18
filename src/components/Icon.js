import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faLink,
  faShareSquare
} from '@fortawesome/free-solid-svg-icons'

import {
  faMarkdown
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faLink,
  faMarkdown,
  faShareSquare
)

export default FontAwesomeIcon
