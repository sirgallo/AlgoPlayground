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

  print() {
    console.log('##############################\n')
    console.log('Current Trie State\n')
    console.log(JSON.stringify(this.attributes, null, 2))
    console.log('\n##############################\n')
  }

  async bulkInsert(words: string[]): Promise<boolean> {
    return await new Promise(async resolve => {
      words.forEach(async word => await this.insertWord(word))
      resolve(true)
    })
  }

  async insertWord(word: string): Promise<boolean> {
    return await new Promise(resolve => {
      this.insertWordHelper(this, word)
      resolve(true)
    })
  }

  async searchWord(word: string): Promise<string[]> {
    this.words = []
    return await new Promise(resolve => {
      const remainingTree = this.getRemainingTree(word)
      if(remainingTree) {
        this.allWordsHelper(word, remainingTree)
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

    return node
  }

  allWordsHelper(wordSoFar: string, tree: TrieNode) {
    for(const field in tree.getChildren()) {
      const child = tree.getChildren()[field]
      const newStr = wordSoFar + child.getValue()
      if(child.getEnd()) {
        this.words.push(newStr)
      }

      this.allWordsHelper(newStr, child)
    }
  }
}