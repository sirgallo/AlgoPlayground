#!/usr/bin/env node

import { Trie } from './DataStructures/Trie'
import { testTrie } from './Tests/testTrie'
import { FindTownJudge } from './Algorithms/FindTownJudge'

import { WebScrapeProvider } from './Misc/WebScrapeProvider'
import { configs } from './Tests/testWebScrape'

export class RunDataStructures {
  constructor() {}

  async execute(): Promise<boolean> {
    const args = process.argv
    if(args.length < 3) throw new Error('Missing search word')
    
    const searchword = args[2]

    const trie = new Trie()
    await trie.bulkInsert(testTrie)

    trie.print()
    const wordSearch = await trie.searchWord(searchword)
    console.log('wordSearch:', wordSearch)
    /*
    //const personIndex = new FindTownJudge().run(3, [[1, 3], [3, 4], [2, 4]])
    const personIndex = new FindTownJudge().run(2, [[1, 2]])
    console.log(personIndex)
    */
    return true
  }
}

/*
runTest()
  .then()
  .catch(err => {
    console.log(err)
  })
*/

/*
new RunDataStructures()
  .execute()
  .then()
  .catch(err => {
    console.log(err)
  })
*/

new WebScrapeProvider(configs)
  .runMultiUrl()
  .then(res => {
    console.log(JSON.stringify(res, null, 2))
    process.exit(0)
  })
  .catch(err => console.log(err))


/*
import { TOTPProvider } from './Misc/TOTPProvider'

const testOpts = {
  digits: 8,
  algorithm: "SHA-256",
  period: 10
}

new TOTPProvider('HELLOWORLD', testOpts)
  .generateOnInterval(5000)

*/

/*
import { OTPAuthProvider } from './Misc/OTPAuthProvider'

const testOptsOTPAuth = {
  issuer: 'ACME',
  label: 'AzureDiamond',
  algorithm: 'SHA1',
  digits: 8,
  period: 10,
  secret: 'HELLOWORLD'
}

new OTPAuthProvider(testOptsOTPAuth)
  .generateOnInterval(5000)
*/