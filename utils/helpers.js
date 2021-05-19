import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const DECKS_KEY = "flashcards:decks";
const NOTIFICATION_KEY = "flashcards:remember";

export const getAllDecks = async () =>
  await AsyncStorage.getItem(DECKS_KEY).then((result) =>
    result ? JSON.parse(result) : {}
  );

export const getDeck = async (title) =>
  await getAllDecks().then((decks) => decks[title]);

export const setNewDeck = async ({ title, deck }) =>
  await AsyncStorage.mergeItem(DECKS_KEY, JSON.stringify({ [title]: deck }));

export const setNewQuestion = async ({ title, question }) => {
  await getDeck(title).then((deck) => {
    deck.questions.push(question);
    return setNewDeck({ title, deck });
  });
};

export const removeDeck = async (title) => {
  return await getAllDecks().then((decks) => {
    delete decks[title];
    AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  });
};
export const saveAnswers = async ({ title, correct }) => {
  await getDeck(title).then((deck) => {
    deck.correct = correct;
    return setNewDeck({ title, deck });
  });
};

export const clearLocalNotification = () =>
  AsyncStorage.removeItem(NOTIFICATION_KEY).then((data) => {
    Notifications.cancelAllScheduledNotificationsAsync();
  });

export const createNotification = () => ({
  content: {
    title: "Complete any quiz.",
    body: "👋 don't forget to complete quiz for today!",
    priority: "high",
    sound: true,
    vibrate: true,
  },
  iso: {
    sound: true,
  },
  android: {
    sound: true,
    sticky: false,
    vibrate: true,
  },
});

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Notifications.getPermissionsAsync().then(({ status }) => {
          if (status === "granted") {
            Notifications.cancelAllScheduledNotificationsAsync();

            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            Notifications.scheduleNotificationAsync({
              ...createNotification(),
              trigger: tomorrow,
              // {
              //   // A trigger related to a daily notification. ( Not Work ;( ))
              //   // type: 'daily',
              //   hour: tomorrow.getHours(),
              //   minute: tomorrow.getMinutes()
              // },
            });
            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
}
