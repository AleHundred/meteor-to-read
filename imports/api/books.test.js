/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { Books } from './books.js';

// Testing functions

if (Meteor.isServer) {
	describe('Books', () => {
		// Test to check if it's possible to add a book
		describe('methods', () => {
			const userId = Random.id();
			let bookId;
			beforeEach(() => {
				Books.remove({});
				bookId = Books.insert({
					title: 'test book',
					author: 'test author',
					createdAt: new Date(),
					owner: userId,
					username: 'tmeasday',
				});
			});

			// Test to check if it's possible to delete the book
			it('can delete owned book', () => {
		        // Find the internal implementation of the book method to test it
		        const deleteBook = Meteor.server.method_handlers['books.remove'];
		 
		        // Fake method invocation
		        const invocation = { userId };
		 
		        // Run the method with `this` set to that fake invocation
		        deleteBook.apply(invocation, [bookId]);
		 
		        // Verify that the method does what we expected
		        assert.equal(Books.find().count(), 0);
      		});
		});
	});
}