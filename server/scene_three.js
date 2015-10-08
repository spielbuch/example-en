createSceneThree = function (story, player) {
    /**
     * Same procedure: Create a scene, publish its index to the client.
     */
    var scene = story.addScene();
    story.publish('thirdScene', scene.index);

    /**
     * Add some google translated text (yeah I will fix this... soonish...)...
     */
    scene.addText(`
        My legs were soft and shaky and my skull boomed.
        Powerless I leaned against the wall next to me and began to scan the area.
        I was in a side street in the shadow of a canopy.
    `);


    /**
     * No we need a bunch of GameObjects.
     */
    var bakery = scene.addText(`
        This was next to a [house](house_bakery), I later learned that it was a bakery.
    `);
    /**
     * the bakery can be the way to an additional scene, but let's focus on the wood and the axe first.
     *
     * Requirement: The player should be able to make money by chopping wood.
     * To accomplish that the player should take the axe and equip it.
     * If he/she does not use the axe and chops wood with its hand, the woodstack would be destroyed, the player would have earned nothing and would be embarrassed.
     *
     * If the woodstack is destroyed the text should change.
     * Scene.addText() can take multiple sentences as parameter. If the Gameobject inside a sentence is destroyed or taken, the surounding text is deleted:
     * 'This is an [object](objectKey).'
     * object.destroy();
     * -nothing-
     *
     * If we stack it on a second sentence
     * 'This is an [object](objectKey).','The object has been destroyed'
     * object.destroy();
     * 'The object has been destroyed'
     *
     *
     */
    var woodstack = scene.addText(`Right beside me [Wood](wood_block) was stacked.`, `Right beside me the chopped wood.`);
    /**
     * Beim Holzhacken möchten wir testen, ob der Spieler die Axt aufgenommen hat.
     * Dazu haben wir die Regel Rules.woodMoney erstellt, die wir der Axt geben.
     * Für jeden Schlag wird dem Property 'Holz zu Geld' entsprechende Summe dem Spieler als Geld gutgeschrieben.
     *
     * With Spielebuch.printd() we show the player the money he/she made with every hit.
     * And we want to add damage to the woodstack. For this we use player.attack() on self (self is woodstack, because it is in an event-function of woodstack).
     *
     * The damage is calculated with the damage value of the attacker and the defense value of the defender. The result is multiplicated with a random number between 0.5 and 2.0 (2.0 is critical damage).
     * Actio = reactio, so the defender strikes back and attacks the attacker automaticly. But the woodstack has an damage value of 0 so nothing happens, good for the player.
     */
    woodstack.setEvent('Chop wood', function () {
        var money = player.getValueByName('Money');
        money += player.getEquippedValueByName('Money for wood');
        Spielebuch.printd(`You just earned ${player.getEquippedValueByName('Money for wood')} Money.`);
        player.addEffect(new Spielebuch.Effect('Money', new Spielebuch.Rule('Money', money)));
        player.attack(self);
    }, 'fa-crosshairs');
    /**
     * What did this function do, to get the money value?
     * - it took the money of the player with player.getValueByName('Money') and stored it into the variable money
     * - the equipment of the player is checked for its 'Money for wood'-value. If he/she has not equipped the axe yet, he/she damages the woodstack but earns no money.
     * - The sum of the money is stored on the player as absolute value.
     *
     * It would be possible to use manipulator in this case ('+x' Money for every hit).
     */

    /**
     * We create the ax.
     */
    var axe = scene.addText(`There is an [Axe](axe).`);
    /**
     * Now we have to prepare the axe.
     * The player should be able to take the ax.
     *
     * Piece of cake...
     */
    axe.setEvent('Take', function () {
        self.take();
    }, 'ion-android-hand');

    /**
     * The player should be able to equip the ax, but not on every body part.
     * So we define an eqipRule
     */
    axe.setEquipRules('handRight');

    /**
     * And the axe needs the 'Money for wood'-property.
     * So we add an effect with a 'Money for wood'-rule, that was defined in /lib/rules.js and a new created rule to increase the damage of the player.
     */
    axe.addEffect(new Spielebuch.Effect('Axe', [Rules.woodMoney, new Spielebuch.Rule(Spielebuch.Gameplay.damage, '+5')]));

    /**
     * The woodstack should not be destroyed with the first hit, so he gets a little more hitpoints.
     */
    woodstack.addEffect(new Spielebuch.Effect('Woodstack', Rules.wooden));


    /**
     * For good measure we add a street to give the player two directions to go.
     * It's all about freedom in this game.
     */
    var street = scene.addText(`To my left was a [road](street)
    where the one or the other wagon rattled past.`);


    /**
     * At last we add some events to the house and the street to open up the whole world to the player
     */
    street.setEvent('Walk',function(){
        story.next(fourthScene);
    },'fa-long-arrow-right');
    bakery.setEvent('Walk',function(){
        story.next(fourthScene);
    },'fa-long-arrow-right');
};