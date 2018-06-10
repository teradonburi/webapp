const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const app = express()

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('.'))


// GraphQLスキーマ定義
const typeDefs = `
  """
  定義必須
  type Query {
    フィールド名(引数): 返却するデータ型
  }
  """
  type Query { 
    books(author: String): [Book],
  }

  """
  返却するデータ構造
  """
  type Book { title: String, author: String }
`

// ダミーデータ
const books = [
  {
    title: 'Harry Potter and the Sorcerer\'s stone',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
]

// resolvers
const resolvers = {
  Query: {
    books: (obj, args, context, info) => {
      const author = args.author
      return books.filter(book => book.author === author)
    },
  },
}

// スキーマ生成
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// GraphQLエンドポイント
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

// GraphiQL：GraphQLクエリのvisual editor
// TODO: 本番デプロイ時はアクセス出来ないようにする
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(5000, () => {
  console.log('Access to http://localhost:5000')
})