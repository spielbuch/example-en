/**
 * To reset the story of the user, Spielebuch:core gives us the method deleteStoryOfUser.
 * After everything that belonged to the old story of the user is deleted, a new Story is created with the function createStory.
 * In createStory we will write the story.
 * You can find createStory in /server/story.js
 *
 * See you there.
 */
Meteor.methods({
    restartStory: function () {
        if (this.userId === null) {
            throw new Meteor.Error('403', 'User is not logged in.');
        } else {
            Meteor.call('deleteStoryOfUser');
            createStory(this.userId);
        }
    }
});
