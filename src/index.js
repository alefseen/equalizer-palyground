import 'babel-polyfill'

import container from './js/main'
import './styles/index.scss'

const app = document.querySelector('#root')
app.append(container())
