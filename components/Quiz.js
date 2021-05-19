import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { red, green, PRIMARY_COLOR, white, gray } from "../utils/colors";
import FlipCard from "react-native-flip-card";
import {
  clearLocalNotification,
  getDeck,
  saveAnswers,
  setLocalNotification,
} from "../utils/helpers";

const FrontCard = ({ question, btnText, handleAnswer }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{question}</Text>
      <Button title={btnText} onPress={handleAnswer} />
    </View>
  );
};
const BackCard = ({ answer, btnText, handleAnswer }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{answer}</Text>
      <Button title={btnText} onPress={handleAnswer} />
    </View>
  );
};

export default class Quiz extends Component {
  state = {
    correct: 0,
    uncorrect: 0,
    isFlipped: false,
    deck: null,
  };
  componentDidMount() {
    const { deckTitle } = this.props.route.params;
    getDeck(deckTitle).then((deck) => this.setState({ deck }));
  }

  submitCorrectAnswer = () => {
    this.setState((prevState) => ({
      correct: prevState.correct + 1,
      isFlipped: false,
    }));
  };

  submitUncorrectAnswer = () => {
    this.setState((prevState) => ({
      uncorrect: prevState.uncorrect + 1,
      isFlipped: false,
    }));
  };

  handleAnswer = () => {
    this.setState((prevState) => ({
      isFlipped: !prevState.isFlipped,
    }));
  };
  quizDone = () => {
    const { deck, correct } = this.state;
    clearLocalNotification().then(setLocalNotification);
    saveAnswers({ title: deck.title, correct });
  };
  restartQuiz = () => {
    this.setState(() => ({
      correct: 0,
      uncorrect: 0,
      isFlipped: false,
      deck: null,
    }));
    const { deckTitle } = this.props.route.params;
    getDeck(deckTitle).then((deck) => this.setState({ deck }));
  };

  render() {
    const { correct, uncorrect, isFlipped, deck } = this.state;
    const { navigation } = this.props;

    if (deck === null) {
      // no deck yet show loader
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={PRIMARY_COLOR} size={50} />
        </View>
      );
    }

    const questions = deck.questions;
    if (questions.length < 1) {
      // no questions yest
      return (
        <View style={styles.container}>
          <Text
            style={{ textAlign: "center", paddingBottom: 100, fontSize: 50 }}
          >
            {deck.title}
          </Text>

          <View style={styles.card}>
            <Text style={{ fontSize: 24 }}>No cards in Deck.</Text>
          </View>
        </View>
      );
    }
    if (correct + uncorrect === questions.length) {
      // last question (show answers)
      this.quizDone();
      return (
        <View style={styles.container}>
          <Text
            style={{ textAlign: "center", paddingBottom: 100, fontSize: 50 }}
          >
            {deck.title}
          </Text>
          <View style={styles.card}>
            <Text style={{ fontSize: 18 }}>Correct: {correct}</Text>
            <Text style={{ fontSize: 18 }}>Unorrect: {uncorrect}</Text>
          </View>
          <View style={styles.btns}>
            <Button
              style={styles.btn}
              title="Restart Quiz"
              onPress={this.restartQuiz}
              color={PRIMARY_COLOR}
            />
            <Button
              style={styles.btn}
              title="Back to Deck"
              onPress={() => navigation.goBack()}
              color={PRIMARY_COLOR}
            />
          </View>
        </View>
      );
    }

    const question = questions[correct + uncorrect];
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", fontSize: 30 }}>{deck.title}</Text>
        <Text style={{ textAlign: "center", paddingBottom: 100, fontSize: 22 }}>
          questions remaining: {questions.length - (correct + uncorrect + 1)}
        </Text>
        <View style={{ height: "40%" }}>
          <FlipCard
            flip={isFlipped}
            useNativeDriver={true}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            clickable={true}
          >
            <FrontCard
              btnText="Show Answer"
              question={question.question}
              handleAnswer={this.handleAnswer}
            />
            <BackCard
              btnText="Hide Answer"
              answer={question.answer}
              handleAnswer={this.handleAnswer}
            />
          </FlipCard>
        </View>

        <View style={styles.btns}>
          <Button
            style={styles.btn}
            title="Uncorrect"
            onPress={this.submitUncorrectAnswer}
            color={red}
          />
          <Button
            style={styles.btn}
            title="Correct"
            onPress={this.submitCorrectAnswer}
            color={green}
          />
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
  cardText: {
    fontSize: 28,
    textAlign: "center",
    paddingBottom: 40,
  },
  card: {
    padding: 40,
    paddingBottom: 20,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ddd",
    backgroundColor: gray
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingRight: 40,
    paddingLeft: 40,
  },
  btn: {
    fontSize: 18,
    padding: 8,
  },
});
