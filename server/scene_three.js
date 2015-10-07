createSceneThree = function (story, player) {
    /**
     * Auch hier, wie gehabt:
     * Szene erstellen, index für den Client veröffentlichen.
     * Und wir können die Variable scene nutzen, das wir keinen mit Scenen verschmutzten Scope mehr haben.
     */
    var scene = story.addScene();
    story.publish('thirdScene', scene.index);

    scene.addText(`
        Meine Beine waren weich und zittrig und mein Schädel dröhnte.
        Kraftlos lehnte ich mich an die Wand neben mir und begann, wenn auch noch ein wenig verschleiert,
        meine Umgebung wahrzunehmen.
        Ich befand mich in einer Seitengasse im Schatten eines Überbaus.
    `);


    var bakery = scene.addText(`
        Dieser befand sich neben einem [Haus](house_bakery), von dem ich später erfuhr, dass es eine Bäckerei war.
    `);
    /**
     * Die Bäckerei kann eine zusätzliche Szene darstellen, im Moment wollen wir uns aber auf die Axt und den Holzstapel
     * konzentrieren.
     *
     * Ziel soll sein, durch Holzhacken Geld zu verdienen.
     * Dazu muss der Spieler zuerst die Axt aufnehmen. Mit jedem Schlag verdient er eine Goldmünze.
     *
     * Wenn der Stapel zerstört wurde, soll dort weiterhin Text stehen. Es können beliebig viele Sätze übereinander gestapelt werden.
     */
    var woodblock = scene.addText(`Rechts neben mir war [Holz](wood_block) gestapelt, davor stand ein Block.`, `Das Holz ist fertig gehackt.`);
    /**
     * Beim Holzhacken möchten wir testen, ob der Spieler die Axt aufgenommen hat.
     * Dazu haben wir die Regel Rules.woodMoney erstellt, die wir der Axt geben.
     * Für jeden Schlag wird dem Property 'Holz zu Geld' entsprechende Summe dem Spieler als Geld gutgeschrieben.
     *
     * Mit Spielebuch.printd() teilen wir dem Spieler noch den verdienten Betrag mit.
     * Außerdem wollen wir dem Holzstapel auch Schaden zufügen, da er irgendwann verschwinden soll.
     *
     * Wir verwenden deshalb die attack Methode des Spielers player.attack();
     * Es wird ein Schaden anhand der Angriffswerte des Spielers und der Defensiv werte des Opfers (in diesem Fall der Holzstapel)
     * ermittelt und von der Gesundheit des Opfers abgezogen. Da Actio=Reactio wird sofort ein Angriff vom Opfer auf den Spieler gestartet.
     * Da der Holzstapel keine Angriffswerte hat, ist der Gegenangriff wirkungslos.
     */
    woodblock.setEvent('Holz hacken', function () {
        var money = player.getValueByName('Geld');
        money += player.getEquippedValueByName('Holz zu Geld');
        Spielebuch.printd(`Du hast soeben ${player.getEquippedValueByName('Holz zu Geld')} Geld verdient.`);
        player.addEffect(new Spielebuch.Effect('Geld', new Spielebuch.Rule('Geld', money)));
        player.attack(self);
    }, 'fa-crosshairs');
    /**
     * Was macht diese Funktion:
     * - es wird die Summe des Geldes des Spielers mit player.getValueByName('Geld') ermittelt und in der Variable money gespeichert
     * - es wird die Ausrüstung des Spielers geprüft, wieviel 'Holz zu Geld'-Wert sie hat.
     * - Die Summe wird dem spieler als Absoluter Effekt gutgeschrieben.
     * Man könnte natürlich auch immer relativ hochzählen ('+x' Geld), aber das ist geschmackssache.
     */

    /**
     * Damit der Spieler Geld verdienen kann, kümmern wir uns als nächstes um die Axt:
     * Der Spieler muss die Axt nicht nur nehmen können (das erledigen wir indem wir in einerm Event self.take() aufrufen).
     * Er muss sie anschließend auch ausrüsten können.
     * Um ein Ausrüsten zu ermöglichen, müssen wir festlegen, an welchem Körperteil die Axt verwendet werden kann. Wir wählen die rechte Hand (handRight).
     *
     * Als nächses bekommt die Axt einen Effekt. Dieser hat zwei Regeln, einemal die in /lib/rules.js festgelegte um Geld zu verdienen, die Zweite wird direkt festgelegt,
     * damit die Axt Schaden wirkt und der Holzstapel irgendwann kaputt ist.
     */
    var axe = scene.addText(`Daran lehnte eine [Axt](axe).`);
    axe.setEquipRules('handRight');
    axe.addEffect(new Spielebuch.Effect('Axt', [Rules.woodMoney, new Spielebuch.Rule(Spielebuch.Gameplay.damage, '+5')]));

    /**
     * Damit der Holzstapel nicht sofort zerstört wird, bekommt er noch ein wenig Gesundheit:
     */
    woodblock.addEffect(new Spielebuch.Effect('Holzstapel', Rules.wooden));

    /**
     * Jetzt sollte man die Axt noch aufnehmen können, sonst bringt das ja alles nicht ;)
     */
    axe.setEvent('Nehmen', function () {
        self.take();
    }, 'ion-android-hand');

    var street = scene.addText(`Links von mir war eine [Straße](street),
    auf die die Mittagshitze herab brannte und das eine oder andere Fuhrwerk vorbei ratterte.`);





    /**
     * Zuletzt lassen wir noch die Straße und die Bächkerei zur vierten Szene weiterleiten, diese ist allerdings eine Sackgasse, von der der Spieler nur zu jetztigen Szene zurückkehren kann.
     */
    street.setEvent('Laufen',function(){
        story.next(fourthScene);
    },'fa-long-arrow-right');
    bakery.setEvent('Laufen',function(){
        story.next(fourthScene);
    },'fa-long-arrow-right');


};