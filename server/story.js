/**
 * Let's go , let's create an interactive story .
 * I use to the first chapter of the fantasy novel Mundhir - Interregnum,
 * at courtesy of the author (all rights remain with the author).
 *
 * It is a german novel and I did my best to translate... still a better love story than twilight ;)
 *
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
        When I hit the ground, I turned my head instinctively aside. This
        heroism of my brain, saved my nose from the enormous force
        that now hit the side of my head. I had once read that while
        the interaction between two bodies every action creates an equal
        reaction.
        Strangely this was exactly what went through my my mind while I waited for the world to stop spinning.
        I imagined hearing a laughter. I prepared both hands to push upwards and stand up. But the fear of falling from the earth, held me back.
    `);
    /**
     * Yes, my english sucks... still better than google translate tho...
     */

    /**
     * Let's make it interactive:
     *
     * To make a story interactive we need GameObjects. We create those GameObjects from the text.
     *
     * In the next text, the word head will be made to a GameObject by using markdown. It will be the return-value of the addText()-method.
     */
    var head = sceneOne.addText(`
        Someone landed lightly on the ground next to me. I tried to lift my
        [Head](head) to look up. It seemed like my brain wanted to escape from my skull.
        Probably to find a quiet place where it was able to go about its business in peace.
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
     * The player did it... he/she looked up. Now we describe the next scene.
     */
    var helpingHand = sceneTwo.addText(`
        Finally I managed to raise my head and I saw Aiden. Black
        hair, a somewhat broad nose and a cheeky grin.
        His first words to me were something about that he did not had seen me coming...
        He gave me the contempt look of a sober drunkard that felt the superiority
        that comes with not laying wasted on the ground. He was about to say something,
        but his mocking look on his face changed to concern, when he realized the missing smell of booz.
        Aiden offers you his [hand](helping_hand) to help you up.
    `);
    /**
     * Aiden offers a helping hand to help the player stand up.
     * But standing up takes time. A countdown is started when the player takes the hand.
     * If the countdown finishes, the next scene starts.
     *
     * The standing up part will be in a short cut scene.
     *
     * Important: we use an icon from ionicons for this event. Yeah, we can do this.
     *
     */
    helpingHand.setEvent('Take', function(){
        story.next(cutSceneHelpingHand);
    }, 'ion-android-hand');


    /**
     * Now to the cut scene
     */
    var cutSceneOne = story.addScene();
    story.publish('cutSceneHelpingHand', cutSceneOne.index);
    /**
     * The countdown should start with the cutscene.
     * For this we set an onVisit-event. There is a onFirstVisit-event too, but this would only fire on the first visit.     *
     *
     * In the event-function we write a short message to the log (Spielebuch.printd()) and start an UI-Countdown.
     *
     * There are two different kinds of countdown:
     * - startSilentCountdown: Is executed in the background. There can be multiple countdowns at the same time.
     * - startUiCountdown: A timer is shown in the ui. At the moment we can have only one timer at the same time, so a new ui-countdown destroyes the old one and takes its place.
     * Both functions have the same parameter
     * - first parameter is the duration in milliseconds
     * - second parameter is the interval in which it counts down in milliseconds
     * - third parameter is a function. This function will be executed when the countdown is finished.
     *   Because we use startUiCountdown in an event-function it shares all the variables of an event function (story, scene, player...)
     *
     *  But be careful: onVisit has an event-function of a scene. Not of a GameObject, we do not have self as variable.
     */
    cutSceneOne.onVisit(function(){
        Spielebuch.printd('Aiden helps you up...');
        Spielebuch.startUiCountdown(3000, 1000, function () {
            story.next(thirdScene);
        });
    });
    /**
     * Let's write a little more text to fill the cutscene...
     */
    cutSceneOne.addText(`
        I finally made ​​the decision to take Aiden's hand and he pulles me up.
    `);

    /**
     * When the countdown finishes, the story changes to the third scene.
     * We create it now... but not here.
     * There is a lot of code for one file...
     *
     * See you in /server/scene_three.js
     * There we will create the global function createSceneFour that we call with the parameter story und player.
     *
     * Thus multiple authors can work on one story!
     */
    createSceneThree(story, player);
    /**
     * The last scene is created exactly the same
     * no we have a complex story, but easy to read code...
     */
    createSceneFour(story, player);



};
