class TrieNode {
  protected value: string
  protected children: Record<string, TrieNode>
  protected end: boolean
  constructor(value: string) {
    this.value = value
    this.children = {}
    this.end = false
  }

  getValue(): string {
    return this.value
  }

  getChildren(): Record<string, TrieNode> {
    return this.children
  }

  getChild(field: string) {
    return this.children[field]
  }

  setChildren(field: string) {
    this.children[field] = new TrieNode(field)
  }

  getEnd(): boolean {
    return this.end
  }

  setEnd(setField: boolean) {
    this.end = setField
  }
}

export class Trie extends TrieNode {
  words: string[]
  constructor() {
    super(null)
  }

  get attributes(): Record<string, string | Record<string, TrieNode>> {
    return {
      value: this.value,
      children: this.children
    }
  }

  async insertWord(word: string | string[]): Promise<boolean> {
    return await new Promise(resolve => {
      this.insertWordHelper(this, word)
      resolve(true)
    })
  }

  async searchWord(word: string): Promise<string[]> {
    this.words = []
    return await new Promise(resolve => {
      const remainingTree = this.getRemainingTree(word)
      //console.log(JSON.stringify({ remainingTree: remainingTree }, null, 2))
      if(remainingTree) {
        this.allWordsHelper('', remainingTree)
      }

      resolve(this.words)
    })
  }

  insertWordHelper(node: TrieNode, str: string | string[]) {
    if(!node.getChild(str[0])) {
      node.setChildren(str[0])
      if(str.length == 1) {
        node.getChild(str[0]).setEnd(true)
      }
    }

    if(str.length > 1) {
      this.insertWordHelper(node.getChild(str[0]), str.slice(1))
    }
  }

  getRemainingTree(word: string): TrieNode {
    let node: TrieNode = this
    while(word) {
      node = node.getChild(word[0])
      word = word.substring(1)
    }

    console.log('node:', JSON.stringify(node, null, 2))
    return node
  }

  allWordsHelper(wordSoFar: string, tree: TrieNode) {
    for(const field in tree.getChildren()) {
      const child = tree.getChildren()[field]
      //console.log("Child:", JSON.stringify(child, null, 2))
      const newStr = wordSoFar + child.getValue()
      //console.log('new String:', newStr)
      if(child.getEnd()) {
        this.words.push(newStr)
      }

      this.allWordsHelper(newStr, child)
    }
  }
}