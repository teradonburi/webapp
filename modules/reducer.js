import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import user from './user'

// reducerを１つにまとめる
const reducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  user,
})

export default reducer