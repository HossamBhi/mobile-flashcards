import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { red, gray, white, PRIMARY_COLOR } from "../utils/colors";
import { getAllDecks, removeDeck } from "../utils/helpers";

const DeleteIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons
        style={{ alignSelf: "flex-end" }}
        name="delete-forever"
        size={24}
        color={red}
      />
    </TouchableOpacity>
  );
};

export default class Decks extends Component {
  state = {
    decks: null,
  };

  componentDidMount() {
    getAllDecks().then((decks) => {
      this.setState({ decks });
    });
    const unsubscribe = this.props.navigation.addListener("focus", () => {
      // Screen was focused
      getAllDecks().then((decks) => {
        this.setState({ decks });
      });
    });

    return unsubscribe;
  }

  pressOnItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate("Deck Details", { deckTitle: item.title });
  };

  pressOnDeleteIcon = (item) => {
    // TODO: Delete from DB
    removeDeck(item.title).then(() => {
      getAllDecks().then((decks) => {
        this.setState({ decks });
      });
    });
  };

  render() {
    const { decks } = this.state;

    if (decks === null) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={PRIMARY_COLOR} size={50} />
        </View>
      );
    }
    if (Object.keys(decks).length < 1) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 50,
          }}
        >
          <MaterialCommunityIcons
            name="cards-outline"
            size={70}
            color={PRIMARY_COLOR}
            style={{ paddingBottom: 50 }}
          />
          <Text style={{ paddingBottom: 20, fontWeight: "bold" }}>
            You Don't have any deck!
          </Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.list}>
          {Object.keys(decks).map((key) => {
            const item = decks[key];
            return (
              <TouchableOpacity
                onPress={() => this.pressOnItem(item)}
                style={styles.item}
                key={item.title}
              >
                <DeleteIcon onPress={() => this.pressOnDeleteIcon(item)} />
                <Text style={{ fontSize: 22, paddingBottom: 12 }}>
                  {item.title}
                </Text>
                <Text>{item.questions.length} Cards </Text>
                {item.correct && (
                  <Text>Last corrected answer: {item.correct}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: white,
    flex: 1,
  },
  list: {
    paddingTop: 20,
    flex: 1,
    width: "100%",
    paddingRight: 20,
    paddingLeft: 20,
  },
  item: {
    borderColor: "#ddd",
    borderRadius: 5,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    backgroundColor: gray,
    width: "100%",
  },
  itemTitle: {
    fontSize: 22,
  },
  icon: {
    justifyContent: "flex-end",
  },
});
