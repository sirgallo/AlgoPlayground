export class FindTownJudge {
  run(numPeople: number, voteGraph: number[][]): number {
    if(numPeople === 1) return numPeople
    
    let voteTallies = new Array(numPeople + 1).fill(0)
    for (const [personA, personB] of voteGraph) {
      --voteTallies[personA]
      ++voteTallies[personB]
    }

    /*
    for (const [person, votes] of voteTallies.splice(0).entries())
      if (votes === numPeople - 1) return person
    */
    const judge: number = voteTallies.splice(0).find( (vote: number) => vote === numPeople - 1)[0]
    return judge ? judge : -1
  }
}