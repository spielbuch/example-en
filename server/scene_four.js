createSceneFour = function(story,player){
    var scene = story.addScene();
    story.publish('fourthScene', scene.index);
    var back = scene.addText(`
        Nothing to see here... yet. Go [back](back).
    `);


    /**
     * Nothing to see here... the player should go back.
     * If he/she does not, he will be transportet back after the countdown.
     */
    scene.onVisit(function(){
        var countdownId = Spielebuch.startUiCountdown(10000, 1000, function () {
            story.next(thirdScene);
        });
        Session.set('countdownIdSceneFour',countdownId);
    });

    /**
     * We can make every word/letter/sentence into a gameobject. We give the object back the event walk, that let's the player walk back to the thirdScene
     */
     back.setEvent('Walk',function(){
         Spielebuch.stopCountdown(Session.get('countdownIdSceneFour'));
        story.next(thirdScene);
    },'fa-long-arrow-right');
};