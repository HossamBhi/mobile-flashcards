import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { setNewDeck } from "../utils/helpers";

export default class AddNewDeck extends Component {
  state = {
    title: "",
  };

  onTitleChange = (value) => {
    this.setState(() => ({
      title: value,
    }));
  };

  saveDeck = () => {
    const { title } = this.state;
    // save to DB
    setNewDeck({ title, deck: { title, questions: [] } })
    this.setState({ title: "" });

    // back to home page
    this.props.navigation.navigate("Decks");
  };
  render() {
    const { title } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Create New Deck
        </Text>
        <TextInput
          value={title}
          style={styles.input}
          onChangeText={this.onTitleChange}
          placeholder="Enter Deck Title..."
        />
        <Button title="Create Deck" onPress={this.saveDeck} />
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
    marginTop: 30,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ddd",
    padding: 10,
  },
});
