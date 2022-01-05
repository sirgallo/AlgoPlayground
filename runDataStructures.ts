#!/usr/bin/env node

import { Trie } from './DataStructures/Trie'

export class RunDataStructures {
  constructor() {}

  async execute(): Promise<boolean> {
    const testTrie = new Trie()
    /*
    await testTrie.insertWord('computer')
    await testTrie.insertWord('car')
    await testTrie.insertWord('comet')
    */
    await testTrie.insertWord('riley')
    await testTrie.insertWord('bell')
    //console.log(JSON.stringify(testTrie.attributes, null, 2))

    const wordSearch = await testTrie.searchWord('riley')
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