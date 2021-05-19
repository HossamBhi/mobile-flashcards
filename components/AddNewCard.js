import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { red } from "../utils/colors";
import { setNewQuestion } from "../utils/helpers";

export default class AddNewCard extends Component {
  state = {
    question: "",
    answer: "",
    checkValideQuestion: false,
    checkValideAnswer: false,
  };

  saveCard = () => {
    const { question, answer } = this.state;
    const { deckTitle } = this.props.route.params;
    if (question === "") {
      return this.setState({ checkValideQuestion: true });
    }
    if (answer === "") {
      return this.setState({
        checkValideAnswer: true,
        checkValideQuestion: false,
      });
    }
    // save to DB
    setNewQuestion({ title: deckTitle, question: { question, answer } })
    // back to card detail
    this.props.navigation.goBack();
  };

  render() {
    const { question, answer, checkValideQuestion, checkValideAnswer } =
      this.state;

    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 26, textAlign: "center", paddingBottom: 30 }}>
          {this.props.route.params.deckTitle}
        </Text>
        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 16 }}>
          Create New Card
        </Text>
        <TextInput
          value={question}
          style={[styles.input, checkValideQuestion ? styles.notValide : ""]}
          onChangeText={(question) => this.setState({ question })}
          placeholder="Enter Question..."
        />
        <TextInput
          value={answer}
          style={[
            styles.input,
            { marginBottom: 20 },
            checkValideAnswer ? styles.notValide : "",
          ]}
          onChangeText={(answer) => this.setState({ answer })}
          placeholder="Enter Answer..."
        />
        <Button title="Create card" onPress={this.saveCard} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  input: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ddd",
    padding: 10,
  },
  notValide: {
    borderColor: red,
  },
});
