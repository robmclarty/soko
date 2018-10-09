'use strict'

console.log('Hello, world!')

const thing = () => new Promise((resolve, reject) => {
  resolve('made it')
})

const thing2 = async () => {
  const result = await thing()
  console.log(result)
}

thing2()
