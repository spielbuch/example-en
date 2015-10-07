createSceneFour = function(story,player){
    var scene = story.addScene();
    story.publish('fourthScene', scene.index);
    var back = scene.addText(`
        Hier gibt es nichts zu sehen. Gehe [zurück](back).
    `);


    /**
     * Hier gibt es noch nichts interressantes, deswegen geht es direkt wieder zurück...
     * Nach einem Countdown natürlich.
     */
    scene.onVisit(function(){
        var countdownId = Spielebuch.startUiCountdown(10000, 1000, function () {
            story.next(thirdScene);
        });
        Session.set('countdownIdSceneFour',countdownId);
    });
    /**
     * Der Spieler soll die Möglichkeit haben, durch das Objekt 'zurück' zurückgehen zu können. Dazu muss aber der Countdown beendet werden,
     * da dieser sonst in der falschen Szene weiterlaufen und feuern würde.
     * Um einen Countdown zu beenden müssen wir aber dessen Id wissen.
     *
     * Wir verwenden dazu eine Session variable und beenden den Countdown mit Spielebuch.stopCountdown().
     */
     back.setEvent('Laufen',function(){
         Spielebuch.stopCountdown(Session.get('countdownIdSceneFour'));
        story.next(thirdScene);
    },'fa-long-arrow-right');
};