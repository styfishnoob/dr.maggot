import { isRegExp } from "@/src/lib/is-regexp";

class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = new Map<string, TrieNode>();
        this.isEndOfWord = false;
    }
}

export class Trie {
    private root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    add(blocklist: Blocklist): Blocklist {
        let regexList: Blocklist = [];

        for (const item of blocklist) {
            let node: TrieNode = this.root;

            if (isRegExp(item[0])[0]) {
                regexList.push(item);
                continue;
            }

            for (const char of item[0]) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }

            node.isEndOfWord = true;
        }

        return regexList;
    }

    // 完全一致
    search(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            const nextNode = node.children.get(char);
            if (!nextNode) return false;
            else node = nextNode;
        }
        return node.isEndOfWord;
    }

    // 部分一致
    includes(text: string): boolean {
        for (let i = 0; i < text.length; i++) {
            let node = this.root;
            for (let j = i; j < text.length; j++) {
                const char = text[j];
                const nextNode = node.children.get(char);
                if (!nextNode) break;
                else node = nextNode;
                if (node.isEndOfWord) return true;
            }
        }
        return false;
    }
}
