import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { gray, PRIMARY_COLOR, white } from "../utils/colors";
import { getDeck } from "../utils/helpers";

const deck = {
  title: "React",
  questions: [
    {
      question: "What is React?",
      answer: "A library for managing user interfaces",
    },
    {
      question: "Where do you make Ajax requests in React?",
      answer: "The componentDidMount lifecycle event",
    },
  ],
};

export default class DeckDetails extends Component {
  state = {
    deck: {},
  };

  componentDidMount() {
    const { deckTitle } = this.props.route.params;
    getDeck(deckTitle).then((deck) => this.setState({ deck }));

    const unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({ deck: {} });
      setTimeout(
        () => getDeck(deckTitle).then((deck) => this.setState({ deck })),
        100
      );
    });
    return unsubscribe;
  }

  addCard = () => {
    const { navigation, route } = this.props;
    navigation.navigate("New Card", { deckTitle: route.params.deckTitle });
  };

  startQuiz = () => {
    const { navigation, route } = this.props;
    navigation.navigate("Quiz", { deckTitle: route.params.deckTitle });
  };

  render() {
    const { deck } = this.state;
    if (deck.title === undefined) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={PRIMARY_COLOR} size={50} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.deck}>
          <Text style={{ textAlign: "center", fontSize: 30 }}>
            {deck.title}
          </Text>
          <Text
            style={{
              textAlign: "center",
              paddingBottom: 10,
              paddingTop: 10,
              fontSize: 20,
            }}
          >
            {deck.questions.length} Cards
          </Text>
          {deck.correct && (
            <Text
              style={{
                textAlign: "center",
                paddingBottom: 40,
                paddingTop: 10,
                fontSize: 12,
              }}
            >
              Last corrected answer: {deck.correct}
            </Text>
          )}

          <View style={styles.btns}>
            <Button
              style={styles.btn}
              title="Add Card"
              onPress={this.addCard}
            />
            <Button
              style={styles.btn}
              title="Start Quiz"
              onPress={this.startQuiz}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: white,
  },
  deck: {
    padding: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 7,
    backgroundColor: gray,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    fontSize: 18,
    padding: 8,
  },
});
