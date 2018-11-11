import { SubmissionError } from 'redux-form'

const CREATE = 'regist/CREATE'

const initialState = {
  user: null,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE:
      return {
        user: action.user || state.user,
      }
    default:
      return state
  }
}

export function create(data) {
  return (dispatch, getState, client) => {
    return client
      .post('/api/user', data)
      .then(res => res.data)
      .then(user => {
        dispatch({type: CREATE, user})
        return user
      })
      .catch(err => {
        throw new SubmissionError({
          _error: err && err.data ? err.data.message : 'エラーが発生しました',
          status: err && err.data ? err.data.status : null,
        })
      })
  }
}
