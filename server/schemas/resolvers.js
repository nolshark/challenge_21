const { User } = require ("../models");

const resolvers = {
    Query: {
        user: async (parent, { user = null, params }, res) => {
            //Finds user using the users id that is attached to their username, if not it says it does not exist
            const foundUser = await User.findOne({
              $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        
            if (!foundUser) {
              return res.status(400).json({ message: 'Cannot find a user with this id!' });
            }
            res.json(foundUser);
        }
    },
    Mutation: {
        //Creates a user
        createUser: async (parent, { body }, res) => {
            const user = await User.create(body);
        
            if (!user) {
              return res.status(400).json({ message: 'Something is wrong!' });
            }
            const token = signToken(user);
            res.json({ token, user });
        },
        //Logs in using the users username, password, and email, if not says that it cannot find the username, it returns that to the user, if it is the wrong password it tells the user
        login: async (parent, { body }, res) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
              return res.status(400).json({ message: "Can't find this user" });
            }
        
            const correctPw = await user.isCorrectPassword(body.password);
        
            if (!correctPw) {
              return res.status(400).json({ message: 'Wrong password!' });
            }
            const token = signToken(user);
            res.json({ token, user });
        },
        //Saves a book the users id and stores it
        saveBook: async (parent, { user, body }, res) => {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return res.json(updatedUser);
            } catch (err) {
              console.log(err);
              return res.status(400).json(err);
            }
        },
        //Allows a user to delete a saved book that was stored to the users id
        deleteBook: async (parent, { user, params }, res) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: user._id },
              { $pull: { savedBooks: { bookId: params.bookId } } },
              { new: true }
            );
            if (!updatedUser) {
              return res.status(404).json({ message: "Couldn't find a user with this id!" });
            }
            return res.json(updatedUser);
          },
    },
};

module.exports = resolvers;