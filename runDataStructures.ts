#!/usr/bin/env node

import { Trie } from './DataStructures/Trie'
import { testTrie } from './Tests/testTrie'

export class RunDataStructures {
  constructor() {}

  async execute(): Promise<boolean> {
    const args = process.argv
    if(args.length < 3)
      throw new Error('Missing search word')
    
    const searchword = args[2]

    const trie = new Trie()
    for (const word of testTrie) {
      trie.insertWord(word)
    }

    console.log(JSON.stringify(trie.attributes, null, 2))

    const wordSearch = await trie.searchWord(searchword)
    console.log('wordSearch:', wordSearch)
    return true
  }
}

new RunDataStructures()
  .execute()
  .then(resp => {
    console.log(resp)
  })
  .catch(err => {
    console.log(err)
  })