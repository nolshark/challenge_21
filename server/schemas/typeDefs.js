const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    user: User
}
input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
}
type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    deleteBook(bookId: ID!): User
}
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type Auth {
    token: ID!
    user: User
}
`

module.exports = typeDefs;