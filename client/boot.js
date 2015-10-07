/**
 * Spielebuch and Reader must be initialized.
 */
initBook = function(){
    Spielebuch.init(function(err){
        if(!err){
            Reader.init();
        }
    });
};

/**
 * On every user login, the user doc is checked if it has a story. If not, a new one is creaated
 *
 * After that initBook is executed
 */
Accounts.onLogin(function () {
    if(Meteor.user().storyId==='') {
        Meteor.call('restartStory', initBook);
    }else{
        initBook();
    }
});

/**
 * On load without login, initBook hat to be executed too.
 */
Meteor.startup(function(){
    if(Meteor.user()){
        initBook();
    }
});