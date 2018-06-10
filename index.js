/*globals module: false */
import React  from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware, routerReducer, ConnectedRouter as Router } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { reducer as formReducer } from 'redux-form'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import client from 'axios'
import App from './App'

// redux-devtoolの設定
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// ブラウザ履歴保存用のストレージを作成
const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)

// reducerを１つにまとめる
const reducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
})

// redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
const store = createStore(reducer, composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWithClient)))

// Material-UIテーマを上書きする
const theme = createMuiTheme({
  // カラーパレット
  palette: {
    type: 'light',
    // メインカラー
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
    // アクセントカラー
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd0',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
      A100: '#ff80ab',
      A200: '#ff4081',
      A400: '#f50057',
      A700: '#c51162',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
  },
  // レスポンシブレイアウト用の指定
  'breakpoints': {
    'keys': [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    'values': {
      'xs': 360, // スマホ用
      'sm': 768, // タブレット用
      'md': 992, // PC用
      'lg': 1000000000,
      'xl': 1000000000,
    },
  },
  // Material-UIコンポーネントのclassのstyleを上書きする
  overrides: {
  },
})

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

const apclient = new ApolloClient({
  uri: 'http://localhost:5050/graphql',
})


const render = () => {
  ReactDOM.render(
    <ApolloProvider client={apclient}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path='/' component={App} />
              {/* それ以外のパス */}
              <Route component={() => <div>NotFound</div>} />
            </Switch>
          </Router>
        </Provider>
      </MuiThemeProvider>
    </ApolloProvider>
    ,
    document.getElementById('root'),
  )
}

// Webpack Hot Module Replacement API
hot(module)(render)

render()
