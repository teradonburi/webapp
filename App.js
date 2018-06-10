import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const query = gql`
query ($author: String!){
	books(author: $author) {
    	title,
      author,
  }
}
`

const graphQL = (param) => (WrappedComponent) => (props) => (
  <Query
    query={query}
    variables={param}>
    {({loading, error, data}) => <WrappedComponent {...props} loading={loading} error={error} data={data} />}
  </Query>
)


class App extends React.Component {

  render () {
    const { loading, error, data } = this.props
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error...</p>

    return (<div>
      {data.books.map(book =>
        <div key={book.title}>
          <h4>{book.title}</h4>
          <span>{book.author}</span>
        </div>
      )}
    </div>)
  }
}

export default graphQL({
  author: 'Michael Crichton',
})(App)
