/*
  Individual nodes within the trie data structure
  
  Each is built to hold 
    - a value, in this case a single character
    - a child object, which holds nested nodes. The end of the word is empty
    - end, a truthy value to assign the end of a word

  Methods are getters and setters
*/
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

  setChild(field: string) {
    this.children[field] = new TrieNode(field)
  }

  getEnd(): boolean {
    return this.end
  }

  setEnd(setField: boolean) {
    this.end = setField
  }
}

/*
  The Trie data structure, which is built using individual nodes
*/
export class Trie extends TrieNode {
  private words: string[]
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
    return await new Promise(async (resolve, reject) => {
      try {
        words.forEach(async word => await this.insertWord(word))
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  async insertWord(word: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      try {
        this.insertWordHelper(this, word)
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  async searchWord(word: string): Promise<string[]> {
    this.words = []
    return await new Promise((resolve, reject) => {
      try {
        const remainingTree = this.getRemainingTree(word)
        if(remainingTree) {
          this.allWordsHelper(word, remainingTree)
        }

        resolve(this.words)
      } catch (err) {
        reject(err)
      }
    })
  }

  insertWordHelper(node: TrieNode, str: string) {
    if(!node.getChild(str[0])) {
      node.setChild(str[0])
      if(str.length == 1) {
        node.getChild(str[0]).setEnd(true)
      }
    } else {
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