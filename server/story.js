/**
 * Let's go , let's create an interactive story .
 * I use to the first chapter of the fantasy novel Mundhir - Interregnum,
 * at courtesy of the author (all rights remain with the author).
 * For your support I leave this amazon ref-link here... ;)
 * http://www.amazon.de/gp/product/1499307675/ref=as_li_tl?ie=UTF8&camp=1638&creative=19454&creativeASIN=1499307675&linkCode=as2&tag=budickeu-21
 * http://www.amazon.com/gp/product/1499307675
 */

/**
 * To create a story for each user, we put it into a function called createStory().
 * @param userId: Every user has its own story, with its own scenes and gameObjects. Thus we need its userId.
 */
createStory = function (userId) {
    /**
     * We first create a story with the story object.
     */
    var story = new Spielebuch.Story(userId);

    /**
     * A story needs a hero , this hero will be controlled by the user.
     */
    var player = story.createPlayer();
    /**
     * The player has a melee damage (with his fists) and has a certain health.
     * All the rules in Rules were created in /lib/rules.js
     */
    player.addEffect(new Spielebuch.Effect('Mensch', [Rules.humanHealth, Rules.humanFistDamage, Rules.noMoney]));
    /**
     * If no name is set, a random name will be created. But these names suck, so we call our hero 'Hero'.
     */
    player.setName('Hero');


    /**
     * A story consists of many scenes. One could compare a scene with the scene in the theater.
     * It is a fixed location with a fixed situation. At change of location or situation, you should create a new scene.
     *
     * The scene is created from the story.
     */
    var sceneOne = story.addScene();
    /**
     * Each scene has an index that allows you to jump directly to this scene.
     * We will need the index of the first scene , when we start the story , so we save it into an extra variable.
     */
    var firstScene = sceneOne.index; //

    /**
     * A book needs text.
     * Let's write, I mean copy&pasten a short prolog ;)
     */
    sceneOne.addText(`
        When I hit the ground , I turned my head still instinctively aside. This
        Heroism of my brain , I owed ​​it to my nose before the enormous force
        was protected , which now hit the side of my head . I had once read that when
        the interaction between two bodies at the same time every action an equal
        Generates reaction which reacts on the cause of action
        Strangely, I did exactly that at this moment through your mind . and yet
        while the ground , put me in momentum ausdrehte , I imagined a
        Laughter heard.
        Propped both hands I wanted to push it upwards . But the fear of
        either side , or even fall away to heaven , held me back .
    `);
    /**
     * Yes this is translated by google... I will fix it... soon.
     */

    /**
     * Let's make it interactive:
     *
     * To make a story interactive we need GameObjects. We create those GameObjects from the text.
     *
     * In the next text, the word head will be made to a GameObject by using markdown. It will be the return-value of the addText()-method.
     */
    var head = sceneOne.addText(`
        I heard someone beside me lightly on the ground came up and tried to
        [Head](head) to lift and looking up. It muttered , it seemed to me as if my brain me at every
        Page wanted to escape from the skull. Probably to a place to look for, to
        which it was able to go about his business in peace .
    `);
    /**
     * We put the word, that will be a GameObject into brackets [] and define the key 'head' in round brackets.
     * This key is still useless at the moment.
     *
     * The story should start , which we do with the Story.Start() and pass to the method as a parameter the index of the first scene .
     **/
    story.start(firstScene);

    /**
     * Now we have a GameObject in the variable head.
     * First, we want that when an action on the head is carried out, the book changes to the next scene.
     */
    head.setEvent('Lift head', function(){
        story.next(secondScene);
    }, 'fa-long-arrow-up');
    /**
     * What did we just do?
     * The first parameter specifies the name that the action should have.
     * The second parameter is a function that is executed on the client when the user triggers the events (clicks on it).
     * Important here:
     * Functions are stored as a string in the database and executed on the client.
     *
     * They have some variables:
     * - story: The current story as StoryObject
     * - scene: The current scene as SceneObjekt
     * - player: The current player as PlayerObjekt
     * - self: The GameObject where the event was executed, in this case head.
     *
     * The third parameter is the class that defines the icon in the UI. Here we use fontawesome .
     */

    /**
     * The events let's the user jump to the next scene, but this scene does not exist... yet.
     * We create it now.
     */
    var sceneTwo = story.addScene();
    /**
     * In the event-function of 'Lift head' we used the variable secondScene.
     * This variable does not exist in the function scope. The client cannot access serverside variables.
     * WSo we have to publish this variable to the client
     **/
    story.publish('secondScene', sceneTwo.index);

    /**
     * All event function on the client can now access secondScene.
     *
     * In code it looks like this:
     *          story.publish('secondScene', sceneTwo.index);
     *      will be in a event function:
     *          var secondScene = sceneTwo.index;
     */

    /**
     * This scene required text:
     */
    var helpingHand = sceneTwo.addText(`
        It finally I managed to raise my head and I saw Aiden . black
        Hair , a somewhat broad nose and a cheeky grin .
        His first words to me were something about that he did not have me come
        . see He gave me the look of a sober drunkard who in the
        Sufficiency sunning , once not drunk to lie on the ground and it is tuned and
        this fact morally and dramatically cannibalize . He had his mouth already
        open , as he shook hands with me . The words had laid his brain and to the
        Sent tongue , she wanted these forms when he aufhalf me .
        But his mocking look more honest concern , when he had approached me and
        could smell no flag. Aiden is keeping me his [hand](helping_hand) out .
    `);
    /**
     * Aiden offers a helping hand to help the player stand up.
     * But standing up takes time. A countdown is started when the player takes the hand.
     * If the countdown finishes, the next scene starts.
     *
     * The standing up part will be in a short cut scene.
     *
     * Important: we use an icon from ionicons for this event.
     */
    helpingHand.setEvent('Take',
    function(){
        story.next(cutSceneHelpingHand);
    }, 'ion-android-hand');


    /**
     * Now to the cut scene
     */
    var cutSceneOne = story.addScene();
    story.publish('cutSceneHelpingHand', cutSceneOne.index);
    /**
     * Wir benutzen dafür die das onVisit Event der Szene.
     * Dieses Event wird immer ausgeführt, wenn die Szene startet
     * Wir schreiben eine kurze Meldung in das Log (Spielebuch.printd())
     * und starten anschließend einen Countdown
     * - der erste Parameter ist die Dauer in Millisekunden
     * - die zweite ist der Intervall in dem heruntergezählt wird in Millisekunden
     * - die anonyme Funktion am Ende wird ausgeführt wenn der Countdown zuende ist.
     * Da die anonyme Funktion im selben Scope liegt, wie das Callback von onVisit,
     * hat sie Zugriff auf die Variablen die mit publish veröffentlich wurden und
     * auf story, scene, player und self, wobei self hier undefined ist, da es sich nicht um ein Event eines GameObject handelt.
     */
    cutSceneOne.onVisit(function(){
        Spielebuch.printd('Aiden hilft dir auf die Beine...');
        Spielebuch.startUiCountdown(3000, 1000, function () {
            story.next(thirdScene);
        });
    });
    /**
     * Wir schreiben noch ein wenig Text...
     */
    cutSceneOne.addText(`
        Während der säuerliche Gestank, der von mir verursachten Pfütze langsam auf und mir in
        die Nase stieg, fasste ich schließlich den Entschluss, Aidens Hand zu nehmen und mich
        an ihr auf die Beine zu ziehen.
    `);

    /**
     * Danach wird zur dritten Szene gewechselt, diese erstelle wir jetzt... wobei...
     * ist schon ein wenig viel Code für eine Datei... lagern wir aus.
     *
     * Wir sehen uns in /server/scene_four.js
     * Dort definieren wir die globale Funktion createScneFour und rufen sie hier mit den parametern story und player auf (denn die brauchen wir noch).
     *
     * Somit können auch mehrere Autoren an einem Projekt arbeiten... cool, oder.
     */
    createSceneThree(story, player);
    /**
     * alle weiteren Szenen werden wir auf diese Art erstellen,
     * denn damit wird aus unser wahnsinnig komplexen Story übersichtlicher Code.
     */
    createSceneFour(story, player);



};
