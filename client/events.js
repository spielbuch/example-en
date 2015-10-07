/**
 * The user should be able to restart the story at anytime.
 */
Template.header.events({
    'click .restart-story': function(event) {
        event.preventDefault();
        Session.set('spielebuchReady',false);
        Meteor.call('restartStory', initBook);
    }
});
