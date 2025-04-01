// utils/trie.js
class TrieNode {
  constructor() {
    this.children = {};
    this.ids = new Set(); // Store matched user IDs
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, id) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.ids.add(id);
  }

  search(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return new Set();
      node = node.children[char];
    }
    return node.ids; // Return matched IDs
  }
}
