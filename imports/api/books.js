import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// We create the books collection for MongoDB
export const Books = new Mongo.Collection('books');

// Publication for all books
if (Meteor.isServer) {
	Meteor.publish('books', function booksPublication(){
		return Books.find({
			$or: [
				{ private: { $ne: true } },
				{ owner: this.userId },
			]
		});
	});
}

// Secure methods
Meteor.methods({
	// Insert function
	'books.insert'(title, author) {
		check(title, String);
		check(author, String);

	// Make sure the user is logged in before inserting a book
	if (! this.userId) {
		throw new Meteor.Error('not-authorized');
	}

	// Inserts a book for the current user
	Books.insert({
		title,
		author,
		createdAt: new Date(),
		owner: this.userId,
		username: Meteor.users.findOne(this.userId).username,
	});
	},

	// Remove function
	'books.remove'(bookId) {
		check(bookId, String);
		const book = Books.findOne(bookId);
		if (book.private && book.owner !== this.userId){
			// If the book is private, only the owner can delete it
			throw new Meteor.Error('not-authorized');
		}
		Books.remove(bookId);
	},

	// Set book as checked function
	'books.setChecked'(bookId, setChecked) {
		check(bookId, String);
		check(setChecked, Boolean);
		const book = Books.findOne(bookId);
		if (book.private && book.owner !== this.userId){
			// If the book is private, only the owner can update it
			throw new Meteor.Error('not-authorized');
		}
		Books.update(bookId, { $set: { checked: setChecked } });
	},

	// Set book as private
	'books.setPrivate'(bookId, setToPrivate) {
		check(bookId, String);
		check(setToPrivate, Boolean);

		const book = Books.findOne(bookId);

		if(book.owner !== this.userId){
			throw new Meteor.Error('not-authorized');
		}

		Books.update(bookId, { $set: { private: setToPrivate } });
	},

});
